# Sentry tracking

Project: `sentry-blue-door` in `jxlx-sentry-org` (region `de`).

Sentry is initialized for the browser, the Node server, and the edge runtime. Tracing, logs, and session replay are already on. This note covers the failures the app reports on purpose, in addition to crashes Sentry catches by itself.

Reporting lives in `src/lib/sentry-report.ts`. Server reports wait for the event to be sent before the response returns. Client reports are tagged `runtime:client`.

Production events use environment `vercel-production`. Local events use `development`.

## What gets reported

| Problem | Issue title | Tags | Where |
|---|---|---|---|
| Generate questions / OpenAI | `OpenAI call failed` | `area:generate-questions`, `failure:openai`, `operation:openai.chat.completions` | `src/app/api/generate-questions/route.ts`, `src/components/survey-build/builder-control-row.tsx` |
| Answer submission | `Answer submission failed` | `area:answer-submission`, `failure:database`, `operation:createAnswers` | `src/app/api/surveys/[id]/answers/route.ts`, `src/components/survey-form/survey-form.tsx` |
| Survey create / save / edit | `Survey persistence failed during <operation>` | `area:survey-persistence`, `failure:database` | Survey API routes, `src/db/index.ts` (`updateQuestions`), save button, survey delete, share-link drawer |
| Auth.js | The Auth.js error | `area:auth`, `failure:authjs`, `operation:authjs` | `src/lib/auth.ts` logger |
| 401 on an authenticated API | `Authenticated API returned 401` | `area:auth`, `failure:unauthorized`, `operation:unauthorized` | Survey API routes and `GET`/`DELETE /api/users` when there is no session |
| Account deletion database failure | `Account deletion failed`, or the thrown error | `area:auth`, `operation:deleteUser`, `failure:database` | `src/app/api/users/route.ts` |

Thrown errors inside a wrapped API handler are reported with that handler's `area`, `operation`, and `failure` tag, then the handler returns 500.

### Generate questions

Reported when the OpenAI key is missing, the OpenAI request throws, or the model returns no questions. An empty completion is a 500, and the builder shows “Please try again another time.” A missing or blank prompt is a 400 and is not sent to Sentry. Server and client events share the fingerprint `openai-call-failed`, so they group into one issue. The survey prompt is not attached to the event.

### Answer submission

Reported when saving a respondent's answers returns `"internal error"`, when the database throws, or when the survey form's request fails. Fingerprint: `answer-submission` / `createAnswers`.

### Survey create, save, and edit

Reported for `"internal error"` and `"partial error"` results, and for thrown database errors, on:

- `GET` and `POST /api/surveys` (`getSurveys`, `createSurvey`)
- `GET`, `DELETE`, and `PATCH /api/surveys/[id]` (`getSurveyById`, `deleteSurvey`, `updateSurvey`)
- `GET`, `POST`, `DELETE`, and `PATCH /api/surveys/[id]/questions`
- `GET`, `PUT`, and `DELETE /api/surveys/[id]/questions/[idq]`

`updateQuestions` reports the caught database exception from `src/db/index.ts` before it returns `"partial error"`. A survey update that fails internally returns 500.

The same fingerprint (`survey-persistence` / operation name) is used from the save button (`createSurvey`, `createQuestions`, `deleteQuestions`, `updateQuestions`), the nav delete (`deleteSurvey`), and the share drawer (`updateSurvey`).

Expected 400, 403, and 404 responses are not reported as persistence failures.

### Auth.js and 401s

Auth.js `logger.error` is reported immediately. Fingerprint: `authjs-error`.

A 401 from a route that requires a session is reported as a warning and grouped into one issue. Fingerprint: `authenticated-api-401`. Tags include the route template and method, not the caller's email. A logged-in non-admin calling `GET /api/users` still returns 401 and is not reported.

## Alerts

Created in the Sentry UI as two email alerts. Limit them to environment `vercel-production`.

**Critical failures.** WHEN is a new issue, or a resolved issue that regresses. IF matches **any** of these tags:

- `failure` equals `openai`
- `area` equals `answer-submission`
- `area` equals `survey-persistence`
- `failure` equals `authjs`

**401 spike.** WHEN is “an event or issue activity is captured.” IF matches **all** of these:

- `failure` equals `unauthorized`
- the issue is seen more than 10 times in 15 minutes

The action limit is at most once every 30 minutes. The first 401 does not email, because that issue starts with one event.

Account-deletion database errors are captured, and they do not match either alert.
