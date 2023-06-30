"use client";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useEffect } from "react";

export default function RootTemplate({ children }: any) {
  const { toast } = useToast();

  useEffect(() => {
    const connect = async () => {
      const sse = new EventSource(`http://localhost:3001/notifications/1`);
      sse.onmessage = (e) => {
        const [title, description] = e.data.split(",");
        toast({
          title,
          description,
          variant: "default",
          duration: 3_000,
          className: "bg-green-50",
        });
      };
      sse.onerror = (e) => {
        console.log(e);
        sse.close();
      };
    };
    connect();
  }, []);

  return (
    <>
      {children}
      <Toaster />
    </>
  );
}
