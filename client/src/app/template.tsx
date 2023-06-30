"use client";
import { Toaster } from "@/components/ui/toaster";

export default function RootTemplate({ children }: any) {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
}
