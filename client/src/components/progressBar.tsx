"use client";
import React, { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";

export default function ProgressBar() {
  const [progress, setProgress] = useState<number>(0);
  useEffect(() => {
    const connect = async () => {
      const sse = new EventSource(`http://localhost:3001/progress/${uuid()}}`);
      sse.onmessage = (e) => {
        setProgress(parseInt(e.data));
      };
      sse.onerror = (e) => {
        console.log(e);
        sse.close();
      };
    };
    connect();
  }, []);

  return <div>{`${progress}%`}</div>;
}
