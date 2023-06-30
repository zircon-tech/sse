"use client";
import { FormEvent, useState, useEffect } from "react";

export default function Home() {
  const [clientId, setClientId] = useState<string>("1");
  const [data, setData] = useState<string[]>([]);
  const [file, setFile] = useState<File | undefined>(undefined);

  useEffect(() => {
    const connect = async () => {
      const sse = new EventSource(`http://localhost:3001/sse/${clientId}`);
      sse.onmessage = (e) => {
        setData((prev) => [...prev, e.data]);
      };
      sse.onerror = (e) => {
        console.log(e);
        sse.close();
      };
    };
    connect();
  }, []);

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
    <main className="w-screen h-screen flex flex-col justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="w-1/2 h-fit flex justify-between bg-slate-50 rounded-md border-gray-500 border-solid border p-4 mb-4"
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
      <div className="w-1/2 bg-slate-50 rounded-md border-gray-500 border-solid border p-4">
        <h1 className="border-b border-gray-500">Eventos</h1>
        {data.map((d) => {
          return <p className="my-2 text-sm text-gray-500">{d}</p>;
        })}
      </div>
    </main>
  );
}
