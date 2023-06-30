"use client";
import React, { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";

export default function FileForm({
  clientId,
  progress,
}: {
  clientId: string;
  progress: number;
}) {
  const [file, setFile] = useState<File | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  const loadFile = ({ target }: any) => {
    const [currentFile] = target.files;
    setFile(currentFile);
  };

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file, file.name);

    try {
      await fetch(`http://localhost:3001/upload/${clientId}`, {
        method: "POST",
        body: formData,
      });
    } catch {}
    setLoading(false);
  };

  return (
    <div
      className={cn(
        "w-1/2 p-4 mb-4 flex flex-wrap justify-between items-end",
        "bg-slate-50 rounded-md"
      )}
    >
      <div>
        <Label htmlFor="file">CSV</Label>
        <Input
          id="file"
          type="file"
          onChange={loadFile}
          className={cn(
            "file:bg-slate-50 file:text-slate-700",
            "hover:file:bg-slate-400 hover:file:text-white hover:cursor-pointer"
          )}
        />
      </div>
      <Button
        variant="outline"
        onClick={() => handleSubmit()}
        disabled={loading}
      >
        Enviar
      </Button>
      <Progress value={progress} className="h-2 mt-2" />
    </div>
  );
}
