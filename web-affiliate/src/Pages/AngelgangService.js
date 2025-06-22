import React, { useState } from 'react';

function AngelgangService() {  // เปลี่ยนชื่อฟังก์ชันให้ตรงกับ export
  const [token, setToken] = useState('');
  const [data1, setData1] = useState(null);
  const [data2, setData2] = useState(null);
  const [error, setError] = useState('');

  const handleFetch = async () => {
    try {
      setError('');
      setData1(null);
      setData2(null);

      const web1_api1 = await fetch('https://romantic-winner-memories-boots.trycloudflare.com/api/v1/external/banners', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!web1_api1.ok) {
        throw new Error('Token ไม่ถูกต้องหรือมีปัญหากับ API แรก');
      }

      const result1 = await web1_api1.json();
      setData1(result1);

      // สมมุติว่า api2 เป็นอีกอันที่ต่างกันนะ (เปลี่ยน URL ถ้ามีจริง)
      const web1_api2 = await fetch('https://romantic-winner-memories-boots.trycloudflare.com/api/v1/external/affiliate', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!web1_api2.ok) {
        throw new Error('Token ไม่ถูกต้องหรือมีปัญหากับ API ตัวที่สอง');
      }

      const result2 = await web1_api2.json();
      setData2(result2);

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Affiliate Token Checker</h1>
      <input
        type="text"
        placeholder="ใส่ Token ที่นี่"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        style={{ padding: '0.5rem', width: '300px' }}
      />
      <button onClick={handleFetch} style={{ marginLeft: '1rem', padding: '0.5rem 1rem' }}>
        ดึงข้อมูล
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {data1 && (
        <div style={{ marginTop: '1rem' }}>
          <h2>ข้อมูลจากเว็บไซต์ (API 1):</h2>
          <pre>{JSON.stringify(data1, null, 2)}</pre>
        </div>
      )}

      {data2 && (
        <div style={{ marginTop: '1rem' }}>
          <h2>ข้อมูลจากเว็บไซต์ (API 2):</h2>
          <pre>{JSON.stringify(data2, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default AngelgangService; // export ถูกต้อง
