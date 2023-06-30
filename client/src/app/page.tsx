"use client";
import DataTable, { DataTableColumn } from "@/components/dataTable";
import FileForm from "@/components/fileForm";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";

export default function Home() {
  const [clientId, _] = useState<string>(uuid());
  const [data, setData] = useState<string[]>([]);
  const [progress, setProgress] = useState<number>(0);
  const { toast } = useToast();

  useEffect(() => {
    // Establishes a Server-Sent Events (SSE) connection with the server and handles SSE events.
    const api = `http://localhost:3001/sse/${clientId}`;
    const es = new EventSource(api);

    // Handle 'notification' event
    es.addEventListener("notification", (e) => {
      const [title, description] = e.data.split(",");
      toast({
        title,
        description,
        variant: "default",
        duration: 3_000,
        className: "bg-green-50",
      });
    });

    // Handle 'data' event
    es.addEventListener("data", (e) => {
      setData((prev) => [...prev, e.data]);
    });

    // Handle 'progress' event
    es.addEventListener("progress", (e) => {
      setProgress(parseInt(e.data));
    });

    // Handle SSE connection errors
    es.onerror = (_) => {
      toast({
        title: "❌ Error",
        description: "Connection closed",
        variant: "default",
        duration: 3_000,
        className: "bg-red-50",
      });
      // Close the SSE connection
      es.close();
    };
  }, []);

  const [header, ...lines] = data ?? [];
  const columns: DataTableColumn =
    header?.split(",").map((col) => ({
      accessorKey: col,
      header: col,
    })) ?? [];
  const rows =
    lines?.map((line) => {
      const [name, email, phone] = line.split(",");
      return { name, email, phone };
    }) ?? [];

  return (
    <main className="w-screen h-screen flex flex-col justify-center items-center">
      <FileForm
        clientId={clientId}
        progress={progress}
        onClear={() => {
          setData([]);
          setProgress(0);
        }}
      />
      {rows.length ? (
        <DataTable columns={columns} data={rows} />
      ) : (
        <div className="w-1/2">
          <Alert className="bg-yellow-50 border border-yellow-200">
            <AlertTitle>Heads up!</AlertTitle>
            <AlertDescription>
              Add a file to see the magic happen! 🔮
            </AlertDescription>
          </Alert>
        </div>
      )}
    </main>
  );
}
