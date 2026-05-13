import { useEffect, useState } from "react";

export default function Results() {
  const [data, setData] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem("stats");
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

  return (
    <div style={{ padding: 40 }}>
      <h1>Advanced Box Score</h1>

      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>Player</th>
            <th>TS%</th>
            <th>eFG%</th>
            <th>USG%</th>
          </tr>
        </thead>
        <tbody>
          {data.map((p, i) => (
            <tr key={i}>
              <td>{p.Player}</td>
              <td>{Number(p["TS%"]).toFixed(3)}</td>
              <td>{Number(p["eFG%"]).toFixed(3)}</td>
              <td>{Number(p["USG%"]).toFixed(1)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}