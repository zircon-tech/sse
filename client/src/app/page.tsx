"use client";
import { FormEvent } from "react";

export default function Home() {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <main className="w-screen h-screen flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="w-[20%] bg-slate-50 rounded-md border-gray-500 border-solid border p-4 m-auto"
      >
        <input type="file" placeholder="archivo" className="my-2"/>
        <button type="submit" className="bg-slate-200 hover:bg-slate-300 rounded-md p-2">Enviar</button>
      </form>
    </main>
  );
}
