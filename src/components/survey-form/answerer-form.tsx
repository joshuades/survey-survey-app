"use client";

import { useStore } from "@/store/surveysStore";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function AnswererForm() {
  const [username, setUsername] = useState("");
  const [hideForm, setHideForm] = useState(true);
  const { collectedAnswerer, setCollectedAnswerer } = useStore();

  return (
    <div>
      {!hideForm && (
        <div className="absolute bottom-[75px] left-1/2 mx-auto flex w-full max-w-[250px] -translate-x-1/2 items-center space-x-2 lg:bottom-[50px]">
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value != "" ? e.target.value : "anonymous");
            }}
          />
          <Button
            onClick={() => {
              setCollectedAnswerer({ username });
              setHideForm(true);
            }}
            type="submit"
          >
            Update
          </Button>
        </div>
      )}
      <div
        className="w-full cursor-pointer p-3 pb-[25px] text-center lg:pb-3"
        onClick={() => setHideForm(!hideForm)}
      >
        Answering as{" "}
        <span className="italic">&apos;{collectedAnswerer?.username ?? "_ _ _"}&apos;</span>
      </div>
    </div>
  );
}
