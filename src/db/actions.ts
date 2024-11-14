"use server";

import { z } from "zod";
import { updateUser } from ".";

type FormState = {
  errors?: {
    username?: string[];
    message?: string[];
    server?: string[];
  };
  message?: string;
  result?: { name: string };
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function submitUserForm(prevState: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = ProfileFormSchema.safeParse({
    username: formData.get("username"),
    message: formData.get("message"),
  });
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Please fix the errors and try again.",
    };
  }
  const result = await updateUser(validatedFields.data.username, validatedFields.data.message);

  if (result.message != "success") {
    return {
      errors: { server: [result.message] },
      message: "Something went wrong on the server",
    };
  }
  return {
    result: result.user as { name: string },
    message: "Profile updated successfully!",
  };
}

const ProfileFormSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(100, "Message must be at most 100 characters"),
});
