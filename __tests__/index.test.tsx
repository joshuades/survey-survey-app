/**
 * @jest-environment jsdom
 */
// import { render, screen } from "@testing-library/react";
// import React from "react";
// import Contact from "../src/app/contact/page";

// describe("Contact", () => {
//   it("renders a heading", () => {
//     render(<Contact />);

//     const heading = screen.getByRole("heading", {
//       name: /Contact Page/i,
//     });

//     expect(heading).toBeInTheDocument();
//   });
// });

// import { describe, expect, test } from "@jest/globals";
// import { getSurveyById } from "../src/db/index";

// describe("getSurveyById", () => {
//   test("should return not found if no survey", async () => {
//     const result = await getSurveyById(111);
//     expect(result.message).toBe("not found");
//   });
// });

// import Google from "@auth/core/providers/google";

// test("should pass", () => {
//   Google({
//     clientId: process.env.GOOGLE_CLIENT_ID as string,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
//   });
//   expect(1).toBe(1);
// });
