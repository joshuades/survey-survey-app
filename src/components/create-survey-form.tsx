"use client";

import { useState } from "react";
import { Button } from "./ui/button";

const CreateSurveyForm = () => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("/api/surveys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    const data = await response.json();
    if (response.ok) {
      setMessage("Survey created successfully!");
      setName("");
      console.log("data", data);
    } else {
      setMessage(`Error: ${data.message}`);
    }
  };

  return (
    <div className="grid gap-1">
      <form onSubmit={handleSubmit}>
        <div className="mb-2 grid gap-1">
          <label htmlFor="name">Survey Name:</label>
          <input
            className="rounded-md border border-gray-300"
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <Button type="submit">Create Survey</Button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CreateSurveyForm;
