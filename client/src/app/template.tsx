"use client";

import { useEffect } from "react";

export default function RootTemplate({ children }: any) {
  useEffect(() => {
    const connect = async () => {
      const sse = new EventSource(`http://localhost:3001/notifications/1`);
      sse.onmessage = (e) => {
        alert(e.data);
      };
      sse.onerror = (e) => {
        console.log(e);
        sse.close();
      };
    };
    connect();
  }, []);

  return <>{children}</>;
}
