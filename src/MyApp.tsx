import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function MyApp() {
  const [url, setUrl] = useState("https://jsonplaceholder.typicode.com/posts");
  const [method, setMethod] = useState("GET");
  const [body, setBody] = useState("");

  const theQuery = useQuery({
    queryKey: ["theQuery", url, method, body],
    queryFn: () => {
      if (method === "GET") {
        return fetch(url).then((res) => res.text());
      }
      return fetch(url, { method, body }).then((res) => res.text());
    },
    enabled: false,
  });

  return (
    <div className="w-full bg-slate-200 p-4">
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

      <div className="mt-4">
        <p>Request Body</p>
        <textarea
          className="w-full p-2 rounded-md min-h-[100px]"
          value={body}
          placeholder="Enter your request body here (only for POST, PUT, PATCH)"
          onChange={(e) => setBody(e.target.value)}
        />
      </div>

      <div className="mt-4">
        <label>Response</label>
        <div>
          Status: <span className="font-bold">{theQuery.status}</span>
        </div>
      </div>

      <div className="mt-2">
        <label>Data</label>
        <div>
          {isValidJson(theQuery.data ?? "")
            ? JSON.stringify(JSON.parse(theQuery.data ?? "{}"), null, 2)
            : theQuery.data}
        </div>
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
