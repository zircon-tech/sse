"use client";
import DataTable, { DataTableColumn } from "@/components/dataTable";
import FileForm from "@/components/fileForm";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useState, useEffect } from "react";
import { v4 as uuid } from "uuid";

export default function Home() {
  const [clientId, setClientId] = useState<string>(uuid());
  const [data, setData] = useState<string[]>([]);

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
      <FileForm clientId={clientId} />
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
