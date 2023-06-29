"use client";
import { FormEvent, useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | undefined>(undefined);

  const loadFile = ({ target }: any) => {
    const [currentFile] = target.files;
    setFile(currentFile);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!file) return;

    const formData = new FormData();
    formData.append("file", file, file.name);

    try {
      await fetch("http://localhost:3001/upload", {
        method: "POST",
        body: formData,
      });
    } catch {}
  };

  return (
    <main className="w-screen h-screen flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="w-[20%] bg-slate-50 rounded-md border-gray-500 border-solid border p-4 m-auto"
      >
        <input
          type="file"
          placeholder="archivo"
          className="my-2"
          onChange={loadFile}
        />
        <button
          type="submit"
          className="bg-slate-200 hover:bg-slate-300 rounded-md p-2"
        >
          Enviar
        </button>
      </form>
    </main>
  );
}
