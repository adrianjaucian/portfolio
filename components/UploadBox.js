import axios from "axios";
import { useState } from "react";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const uploadFile = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(
        "http://127.0.0.1:8000/upload-boxscore",
        formData,
        {
          // IMPORTANT: do NOT manually set Content-Type
          // Axios will set correct multipart boundary automatically
          timeout: 30000,
        }
      );

      if (res.data && res.data.error) {
        setError(res.data.error);
      } else if (Array.isArray(res.data)) {
        setData(res.data);
      } else {
        setError("Unexpected server response format.");
      }
      console.log("Upload success:", res.data);

    } catch (err) {
      console.error("Upload error:", err);

      // Better error message (helps debugging)
      if (err.response) {
        const serverMessage = err.response.data?.error || err.response.data?.details;
        setError(serverMessage || `Server error: ${err.response.status}`);
      } else if (err.request) {
        setError("No response from server (backend not reachable)");
      } else {
        setError("Request setup error");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ 
          color: '#2c3e50', 
          margin: '0 0 20px 0',
          fontSize: '1.8em'
        }}>
          Upload Box Score CSV
        </h2>
        
        <div style={{ 
          backgroundColor: '#e8f4fd', 
          padding: '15px', 
          borderRadius: '5px', 
          marginBottom: '20px',
          border: '1px solid #bee5eb'
        }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#000' }}>Supported Format:</h4>
          <p style={{ margin: 0, color: '#000', fontSize: '14px' }}>
            Upload a CSV file with standard basketball box score columns: Player, PTS, FGA, FG, 3PA, 3P, FTA, etc.
            The system will automatically calculate advanced statistics including True Shooting %, Effective FG %, Usage Rate, and more.
          </p>
        </div>
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '15px',
          marginBottom: '20px'
        }}>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            style={{
              padding: '10px',
              border: '2px dashed #3498db',
              borderRadius: '5px',
              backgroundColor: '#f8f9fa',
              color: '#000',
              cursor: 'pointer'
            }}
          />
          
          <button
            onClick={uploadFile}
            disabled={!file || loading}
            style={{
              padding: '12px 24px',
              backgroundColor: !file || loading ? '#bdc3c7' : '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: !file || loading ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              transition: 'background-color 0.3s'
            }}
          >
            {loading ? "Processing..." : "Upload & Calculate"}
          </button>
        </div>
      </div>

      {error && (
        <div style={{ 
          backgroundColor: '#ffeaea', 
          color: '#e74c3c', 
          padding: '15px', 
          borderRadius: '5px',
          border: '1px solid #f5c6cb',
          marginBottom: '20px'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {data && (
        <div>
          <h3 style={{ 
            color: '#2c3e50', 
            margin: '30px 0 20px 0',
            fontSize: '1.5em',
            borderBottom: '2px solid #3498db',
            paddingBottom: '10px'
          }}>
            Advanced Box Score Results
          </h3>
          <div style={{ overflowX: 'auto', maxWidth: '100%' }}>
            <table style={{ 
              borderCollapse: 'collapse', 
              width: '100%', 
              fontSize: '12px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              minWidth: '1400px'
            }}>
              <thead>
                <tr style={{ backgroundColor: '#3498db', color: 'white' }}>
                  <th title="Player name" style={{ padding: '8px 4px', textAlign: 'left', fontWeight: 'bold' }}>Player</th>
                  <th title="Minutes Played" style={{ padding: '8px 4px', textAlign: 'center', fontWeight: 'bold' }}>MP</th>
                  <th title="Field Goals Made" style={{ padding: '8px 4px', textAlign: 'center', fontWeight: 'bold' }}>FG</th>
                  <th title="Field Goal Attempts" style={{ padding: '8px 4px', textAlign: 'center', fontWeight: 'bold' }}>FGA</th>
                  <th title="Field Goal Percentage" style={{ padding: '8px 4px', textAlign: 'center', fontWeight: 'bold' }}>FG%</th>
                  <th title="3-Point Field Goals Made" style={{ padding: '8px 4px', textAlign: 'center', fontWeight: 'bold' }}>3P</th>
                  <th title="3-Point Field Goal Attempts" style={{ padding: '8px 4px', textAlign: 'center', fontWeight: 'bold' }}>3PA</th>
                  <th title="3-Point Field Goal Percentage" style={{ padding: '8px 4px', textAlign: 'center', fontWeight: 'bold' }}>3P%</th>
                  <th title="Free Throws Made" style={{ padding: '8px 4px', textAlign: 'center', fontWeight: 'bold' }}>FT</th>
                  <th title="Free Throw Attempts" style={{ padding: '8px 4px', textAlign: 'center', fontWeight: 'bold' }}>FTA</th>
                  <th title="Free Throw Percentage" style={{ padding: '8px 4px', textAlign: 'center', fontWeight: 'bold' }}>FT%</th>
                  <th title="Offensive Rebounds" style={{ padding: '8px 4px', textAlign: 'center', fontWeight: 'bold' }}>ORB</th>
                  <th title="Defensive Rebounds" style={{ padding: '8px 4px', textAlign: 'center', fontWeight: 'bold' }}>DRB</th>
                  <th title="Total Rebounds" style={{ padding: '8px 4px', textAlign: 'center', fontWeight: 'bold' }}>TRB</th>
                  <th title="Assists" style={{ padding: '8px 4px', textAlign: 'center', fontWeight: 'bold' }}>AST</th>
                  <th title="Steals" style={{ padding: '8px 4px', textAlign: 'center', fontWeight: 'bold' }}>STL</th>
                  <th title="Blocks" style={{ padding: '8px 4px', textAlign: 'center', fontWeight: 'bold' }}>BLK</th>
                  <th title="Turnovers" style={{ padding: '8px 4px', textAlign: 'center', fontWeight: 'bold' }}>TOV</th>
                  <th title="Points" style={{ padding: '8px 4px', textAlign: 'center', fontWeight: 'bold' }}>PTS</th>
                  <th title="True Shooting Percentage" style={{ padding: '8px 4px', textAlign: 'center', fontWeight: 'bold', backgroundColor: '#27ae60' }}>TS%</th>
                  <th title="Effective Field Goal Percentage" style={{ padding: '8px 4px', textAlign: 'center', fontWeight: 'bold', backgroundColor: '#27ae60' }}>eFG%</th>
                  <th title="3-Point Attempt Rate" style={{ padding: '8px 4px', textAlign: 'center', fontWeight: 'bold', backgroundColor: '#27ae60' }}>3PAr</th>
                  <th title="Free Throw Attempt Rate" style={{ padding: '8px 4px', textAlign: 'center', fontWeight: 'bold', backgroundColor: '#27ae60' }}>FTr</th>
                  <th title="Offensive Rebound Percentage" style={{ padding: '8px 4px', textAlign: 'center', fontWeight: 'bold', backgroundColor: '#27ae60' }}>ORB%</th>
                  <th title="Defensive Rebound Percentage" style={{ padding: '8px 4px', textAlign: 'center', fontWeight: 'bold', backgroundColor: '#27ae60' }}>DRB%</th>
                  <th title="Total Rebound Percentage" style={{ padding: '8px 4px', textAlign: 'center', fontWeight: 'bold', backgroundColor: '#27ae60' }}>TRB%</th>
                  <th title="Assist Percentage" style={{ padding: '8px 4px', textAlign: 'center', fontWeight: 'bold', backgroundColor: '#27ae60' }}>AST%</th>
                  <th title="Steal Percentage" style={{ padding: '8px 4px', textAlign: 'center', fontWeight: 'bold', backgroundColor: '#27ae60' }}>STL%</th>
                  <th title="Block Percentage" style={{ padding: '8px 4px', textAlign: 'center', fontWeight: 'bold', backgroundColor: '#27ae60' }}>BLK%</th>
                  <th title="Turnover Percentage" style={{ padding: '8px 4px', textAlign: 'center', fontWeight: 'bold', backgroundColor: '#27ae60' }}>TOV%</th>
                  <th title="Usage Percentage" style={{ padding: '8px 4px', textAlign: 'center', fontWeight: 'bold', backgroundColor: '#27ae60' }}>USG%</th>
                  <th title="Offensive Rating" style={{ padding: '8px 4px', textAlign: 'center', fontWeight: 'bold', backgroundColor: '#27ae60' }}>ORtg</th>
                  <th title="Defensive Rating" style={{ padding: '8px 4px', textAlign: 'center', fontWeight: 'bold', backgroundColor: '#27ae60' }}>DRtg</th>
                  <th title="Box Plus/Minus" style={{ padding: '8px 4px', textAlign: 'center', fontWeight: 'bold', backgroundColor: '#27ae60' }}>BPM</th>
                </tr>
              </thead>
              <tbody>
                {data.map((player, i) => (
                  <tr key={i} style={{ 
                    backgroundColor: i % 2 === 0 ? '#fff' : '#f8f9fa',
                    borderBottom: '1px solid #eee'
                  }}>
                    <td style={{ padding: '8px 4px', fontWeight: '500', color: '#000' }}>
                      {player.Player || player.Name || player.PLAYER || player.player || 
                       Object.values(player)[0] || `Player ${i+1}`}
                    </td>
                    <td style={{ padding: '8px 4px', textAlign: 'center', color: '#000' }}>{player.MP || '0:00'}</td>
                    <td style={{ padding: '8px 4px', textAlign: 'center', color: '#000' }}>{player.FG || 0}</td>
                    <td style={{ padding: '8px 4px', textAlign: 'center', color: '#000' }}>{player.FGA || 0}</td>
                    <td style={{ padding: '8px 4px', textAlign: 'center', color: '#000' }}>{((player['FG%'] || 0) * 100).toFixed(1)}%</td>
                    <td style={{ padding: '8px 4px', textAlign: 'center', color: '#000' }}>{player['3P'] || 0}</td>
                    <td style={{ padding: '8px 4px', textAlign: 'center', color: '#000' }}>{player['3PA'] || 0}</td>
                    <td style={{ padding: '8px 4px', textAlign: 'center', color: '#000' }}>{((player['3P%'] || 0) * 100).toFixed(1)}%</td>
                    <td style={{ padding: '8px 4px', textAlign: 'center', color: '#000' }}>{player.FT || 0}</td>
                    <td style={{ padding: '8px 4px', textAlign: 'center', color: '#000' }}>{player.FTA || 0}</td>
                    <td style={{ padding: '8px 4px', textAlign: 'center', color: '#000' }}>{((player['FT%'] || 0) * 100).toFixed(1)}%</td>
                    <td style={{ padding: '8px 4px', textAlign: 'center', color: '#000' }}>{player.ORB || 0}</td>
                    <td style={{ padding: '8px 4px', textAlign: 'center', color: '#000' }}>{player.DRB || 0}</td>
                    <td style={{ padding: '8px 4px', textAlign: 'center', color: '#000' }}>{player.TRB || 0}</td>
                    <td style={{ padding: '8px 4px', textAlign: 'center', color: '#000' }}>{player.AST || 0}</td>
                    <td style={{ padding: '8px 4px', textAlign: 'center', color: '#000' }}>{player.STL || 0}</td>
                    <td style={{ padding: '8px 4px', textAlign: 'center', color: '#000' }}>{player.BLK || 0}</td>
                    <td style={{ padding: '8px 4px', textAlign: 'center', color: '#000' }}>{player.TOV || 0}</td>
                    <td style={{ padding: '8px 4px', textAlign: 'center', fontWeight: '600', color: '#000' }}>{player.PTS || 0}</td>
                    <td style={{ padding: '8px 4px', textAlign: 'center', fontWeight: '500', color: '#000', backgroundColor: '#d5f4e6' }}>
                      {((player['TS%'] || 0) * 100).toFixed(1)}%
                    </td>
                    <td style={{ padding: '8px 4px', textAlign: 'center', fontWeight: '500', color: '#000', backgroundColor: '#d5f4e6' }}>
                      {((player['eFG%'] || 0) * 100).toFixed(1)}%
                    </td>
                    <td style={{ padding: '8px 4px', textAlign: 'center', fontWeight: '500', color: '#000', backgroundColor: '#d5f4e6' }}>
                      {((player['3PAr'] || 0) * 100).toFixed(1)}%
                    </td>
                    <td style={{ padding: '8px 4px', textAlign: 'center', fontWeight: '500', color: '#000', backgroundColor: '#d5f4e6' }}>
                      {((player['FTr'] || 0) * 100).toFixed(1)}%
                    </td>
                    <td style={{ padding: '8px 4px', textAlign: 'center', fontWeight: '500', color: '#000', backgroundColor: '#d5f4e6' }}>
                      {((player['ORB%'] || 0) * 100).toFixed(1)}%
                    </td>
                    <td style={{ padding: '8px 4px', textAlign: 'center', fontWeight: '500', color: '#000', backgroundColor: '#d5f4e6' }}>
                      {((player['DRB%'] || 0) * 100).toFixed(1)}%
                    </td>
                    <td style={{ padding: '8px 4px', textAlign: 'center', fontWeight: '500', color: '#000', backgroundColor: '#d5f4e6' }}>
                      {((player['TRB%'] || 0) * 100).toFixed(1)}%
                    </td>
                    <td style={{ padding: '8px 4px', textAlign: 'center', fontWeight: '500', color: '#000', backgroundColor: '#d5f4e6' }}>
                      {((player['AST%'] || 0) * 100).toFixed(1)}%
                    </td>
                    <td style={{ padding: '8px 4px', textAlign: 'center', fontWeight: '500', color: '#000', backgroundColor: '#d5f4e6' }}>
                      {((player['STL%'] || 0) * 100).toFixed(1)}%
                    </td>
                    <td style={{ padding: '8px 4px', textAlign: 'center', fontWeight: '500', color: '#000', backgroundColor: '#d5f4e6' }}>
                      {((player['BLK%'] || 0) * 100).toFixed(1)}%
                    </td>
                    <td style={{ padding: '8px 4px', textAlign: 'center', fontWeight: '500', color: '#000', backgroundColor: '#d5f4e6' }}>
                      {((player['TOV%'] || 0) * 100).toFixed(1)}%
                    </td>
                    <td style={{ padding: '8px 4px', textAlign: 'center', fontWeight: '500', color: '#000', backgroundColor: '#d5f4e6' }}>
                      {((player['USG%'] || 0) * 1).toFixed(1)}%
                    </td>
                    <td style={{ padding: '8px 4px', textAlign: 'center', fontWeight: '500', color: '#000', backgroundColor: '#d5f4e6' }}>
                      {Number(player['ORtg'] || 0).toFixed(1)}
                    </td>
                    <td style={{ padding: '8px 4px', textAlign: 'center', fontWeight: '500', color: '#000', backgroundColor: '#d5f4e6' }}>
                      {Number(player['DRtg'] || 0).toFixed(1)}
                    </td>
                    <td style={{ padding: '8px 4px', textAlign: 'center', fontWeight: '500', color: '#000', backgroundColor: '#d5f4e6' }}>
                      {Number(player['BPM'] || 0).toFixed(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div style={{ 
            marginTop: '20px', 
            padding: '15px',
            backgroundColor: '#e8f4f8',
            border: '1px solid #bee5eb',
            borderRadius: '5px',
            fontSize: '14px',
            color: '#000'
          }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>About These Statistics:</h4>
            <p style={{ margin: '0 0 8px 0' }}>
              <strong style={{ color: '#27ae60' }}>✓ Verified Calculations (Highlighted in Green):</strong>
            </p>
            <ul style={{ margin: '0 0 10px 0', paddingLeft: '20px' }}>
              <li><strong>TS%</strong> - True Shooting %: PTS / (2 × (FGA + 0.44 × FTA))</li>
              <li><strong>eFG%</strong> - Effective FG %: (FG + 0.5 × 3P) / FGA</li>
              <li><strong>3PAr</strong> - 3P Attempt Rate: 3PA / FGA</li>
              <li><strong>FTr</strong> - Free Throw Rate: FTA / FGA</li>
            </ul>
            <p style={{ margin: 0, fontSize: '12px', color: '#555' }}>
              <strong>Note:</strong> All requested advanced metrics are now calculated from the uploaded box score. Hover over the table headers to see definitions for each stat.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}