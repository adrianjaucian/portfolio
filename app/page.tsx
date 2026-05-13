"use client";

import Upload from "../components/UploadBox";

export default function Page() {
  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '40px 20px'
      }}>
        <header style={{ 
          textAlign: 'center', 
          marginBottom: '40px',
          backgroundColor: '#fff',
          padding: '30px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{ 
            color: '#2c3e50', 
            margin: '0 0 10px 0',
            fontSize: '2.5em'
          }}>
            🏀 Advanced Stats Calculator
          </h1>
          <p style={{ 
            color: '#7f8c8d', 
            margin: 0,
            fontSize: '1.1em'
          }}>
            Upload a standard basketball box score CSV to calculate advanced statistics
          </p>
        </header>
        
        <main style={{ 
          backgroundColor: '#fff',
          padding: '30px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <Upload />
        </main>
      </div>
    </div>
  );
}