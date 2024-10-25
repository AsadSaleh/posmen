import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

type HeaderOrParam = {
  id: string;
  key: string;
  value: string;
};

export default function MyApp() {
  const [url, setUrl] = useState(
    "https://jsonplaceholder.typicode.com/todos/1"
  );
  const [method, setMethod] = useState("GET");
  const [body, setBody] = useState("");
  const [headers, setHeaders] = useState<HeaderOrParam[]>(() => [
    { id: uuidv4(), key: "", value: "" },
    { id: uuidv4(), key: "", value: "" },
  ]);
  const [params, setParams] = useState<HeaderOrParam[]>(() => [
    { id: uuidv4(), key: "", value: "" },
    { id: uuidv4(), key: "", value: "" },
  ]);

  let newHeaders = headers;
  if (body !== "") {
    newHeaders = headers.concat([
      { id: uuidv4(), key: "Content-Type", value: "application/json" },
      { id: uuidv4(), key: "Accept", value: "application/json" },
    ]);
  }

  const headersObj = newHeaders.reduce((acc, h) => {
    if (h.key && h.value) {
      acc[h.key] = h.value;
    }
    return acc;
  }, {} as Record<string, string>);

  const paramsObj = params.reduce((acc, p) => {
    if (p.key && p.value) {
      acc[p.key] = p.value;
    }
    return acc;
  }, {} as Record<string, string>);

  const theQuery = useQuery({
    queryKey: ["theQuery", url, method, body, headersObj, paramsObj],
    queryFn: async () => {
      const res = await fetch(
        `${url}?${new URLSearchParams(paramsObj).toString()}`,
        {
          method,
          headers: headersObj,
          body: method === "GET" ? undefined : body,
        }
      );
      return res.text();
    },
    enabled: false,
  });

  function addHeaderRow() {
    setHeaders([...headers, { id: uuidv4(), key: "", value: "" }]);
  }

  function removeHeaderRow(id: string) {
    setHeaders(headers.filter((h) => h.id !== id));
  }

  function addParamRow() {
    setParams([...params, { id: uuidv4(), key: "", value: "" }]);
  }

  function removeParamRow(id: string) {
    setParams(params.filter((p) => p.id !== id));
  }

  function renderStatus() {
    if (!theQuery.isFetching && theQuery.isSuccess) {
      return <StatusBadge status={"Success"} variant={"success"} />;
    }
    if (!theQuery.isFetching && !theQuery.isSuccess && !theQuery.isPending) {
      return <StatusBadge status={"Error"} variant={"error"} />;
    }
    if (theQuery.isFetching) {
      return <StatusBadge status={"Fetching..."} variant={"fetching"} />;
    }

    return null;
  }

  return (
    <div className="w-full p-4">
      <div className="w-full flex gap-4">
        <select
          className="border border-gray-300 rounded-md p-2"
          value={method}
          onChange={(e) => setMethod(e.target.value)}
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>
        <input
          className="w-full p-2 rounded-md"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button
          className="bg-green-700 text-white p-2 px-4 rounded-md"
          onClick={() => theQuery.refetch()}
        >
          Fetch
        </button>
      </div>
      {/* eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi1hZG1pbkBlbWFpbC5jb20iLCJpYXQiOjE3Mjk2NzY4NTcsImV4cCI6MTczMjI2ODg1N30.rXhjcGjHUtoXMn5SZO5OVzn3AwRnjuha5R4OQ76CUrg */}
      <div className="mt-4 grid grid-col-1 lg:grid-cols-2 gap-4">
        <div>
          <p className="font-semibold">Headers</p>
          <div className="space-y-1">
            {headers.map((header) => (
              <div key={header.id} className="space-x-1">
                <input
                  value={header.key}
                  className="rounded-md p-1"
                  placeholder="Key"
                  onChange={(e) => {
                    setHeaders(
                      headers.map((h) =>
                        h.id === header.id ? { ...h, key: e.target.value } : h
                      )
                    );
                  }}
                />
                <input
                  value={header.value}
                  className="rounded-md p-1"
                  placeholder="Value"
                  onChange={(e) => {
                    setHeaders(
                      headers.map((h) =>
                        h.id === header.id ? { ...h, value: e.target.value } : h
                      )
                    );
                  }}
                />
                <button
                  onClick={() => removeHeaderRow(header.id)}
                  className="text-xs text-red-500"
                >
                  DELETE
                </button>
              </div>
            ))}
            <button onClick={addHeaderRow}>Add Header</button>
          </div>
          <p className="font-semibold mt-4">Params</p>
          <div className="space-y-1">
            {params.map((param) => (
              <div key={param.id} className="space-x-1">
                <input
                  value={param.key}
                  className="rounded-md p-1"
                  placeholder="Key"
                  onChange={(e) => {
                    setParams(
                      params.map((p) =>
                        p.id === param.id ? { ...p, key: e.target.value } : p
                      )
                    );
                  }}
                />
                <input
                  value={param.value}
                  className="rounded-md p-1"
                  placeholder="Value"
                  onChange={(e) => {
                    setParams(
                      params.map((p) =>
                        p.id === param.id ? { ...p, value: e.target.value } : p
                      )
                    );
                  }}
                />
                <button
                  onClick={() => removeParamRow(param.id)}
                  className="text-xs text-red-500"
                >
                  DELETE
                </button>
              </div>
            ))}
            <button onClick={addParamRow}>Add Param</button>
          </div>
        </div>

        <div>
          <p className="font-semibold">Request Body</p>
          <textarea
            disabled={method === "GET"}
            className="w-full p-2 rounded-md min-h-[100px] disabled:bg-gray-100"
            value={body}
            placeholder="Enter your request body here"
            onChange={(e) => setBody(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-4">
        <p className="font-semibold">Response</p>
        <div>Status: {renderStatus()}</div>
      </div>

      <div className="mt-2">
        {theQuery.data ? (
          <>
            <label>Data</label>
            <div>
              {isValidJson(theQuery.data ?? "")
                ? JSON.stringify(JSON.parse(theQuery.data ?? "{}"), null, 2)
                : theQuery.data}
            </div>
          </>
        ) : (
          <div>
            <p className="font-semibold">Error</p>
            <div>{JSON.stringify(theQuery.error, null, 2)}</div>
          </div>
        )}
      </div>
    </div>
  );
}

function isValidJson(str: string) {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}

type StatusBadgeProps = {
  status: string;
  variant: "success" | "error" | "fetching";
};

function StatusBadge({ status, variant }: StatusBadgeProps) {
  return (
    <span
      className={`${
        variant === "success"
          ? "bg-green-500"
          : variant === "error"
          ? "bg-red-500"
          : "bg-blue-500"
      } text-white px-2 py-1 rounded-md`}
    >
      {status}
    </span>
  );
}
