import { cookies } from "next/headers";

export const setAuthCookie = (isAuthenticated: boolean) => {
  cookies().set("isAuthenticated", isAuthenticated.toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
  });
};

export const getAuthCookie = () => {
  const authCookie = cookies().get("isAuthenticated");
  return authCookie?.value === "true";
};
