import React, { useState } from 'react';
import '../Style/MicrowaveService.css';

function MicrowaveService() {
  const [apiUrl, setApiUrl] = useState('');
  const [params, setParams] = useState('');
  const [token, setToken] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRequest = async () => {
    setError('');
    setResponse(null);
    setIsLoading(true);

    if (!apiUrl.trim()) {
      setError('กรุณาระบุ URL API ที่ต้องการทดสอบ');
      setIsLoading(false);
      return;
    }

    if (!token.trim()) {
      setError('กรุณาระบุ Token ที่ต้องการตรวจสอบ');
      setIsLoading(false);
      return;
    }

    let jsonPayload;
    if (params.trim()) {
      try {
        jsonPayload = JSON.parse(params);
      } catch (err) {
        setError('JSON Parameters ที่ใส่ไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง');
        setIsLoading(false);
        return;
      }
    } else {
      jsonPayload = {};
    }

    // ✅ เปลี่ยน logic ให้ยืดหยุ่น: ถ้ามี params ให้ใช้ POST, ไม่มีให้ใช้ GET
    const isGetMethod = !params.trim();

    try {
      console.log('กำลังเรียก API:', apiUrl);
      console.log('Method:', isGetMethod ? 'GET' : 'POST');
      console.log('Parameters:', jsonPayload);

      const fetchOptions = {
        method: isGetMethod ? 'GET' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`  
        },
      };

      if (!isGetMethod) {
        fetchOptions.body = JSON.stringify(jsonPayload);
      }

      const res = await fetch(apiUrl, fetchOptions);
      const rawText = await res.text();

      try {
        const data = JSON.parse(rawText);

        if (!res.ok) {
          setError(data?.error || `เกิดข้อผิดพลาด: ${res.status} ${res.statusText}`);
        } else {
          setResponse(data);
          console.log('ดึงข้อมูลสำเร็จ:', data);
        }
      } catch (jsonError) {
        setError(`ไม่สามารถแปลงคำตอบเป็น JSON ได้: ${rawText.substring(0, 100)}...`);
      }
    } catch (err) {
      console.error('ข้อผิดพลาดในการเรียก API:', err);
      setError('ไม่สามารถเชื่อมต่อกับ API ปลายทาง');
    } finally {
      setIsLoading(false);
    }
  };

  const renderResponseItem = (item, idx) => (
    <li className="response-item" key={idx}>
      {Object.entries(item).map(([key, value]) =>
        key.toLowerCase().includes('url') || key.toLowerCase().includes('link') ? (
          <div key={key} className="response-link">
            <strong>{key}:</strong>{' '}
            <a href={value} target="_blank" rel="noreferrer">เปิดลิงก์</a>
          </div>
        ) : (
          <div key={key} className="response-field">
            <strong>{key}:</strong> {typeof value === 'object' ? JSON.stringify(value) : String(value)}
          </div>
        )
      )}
    </li>
  );

  return (
    <div className="microwave-container">
      <h1 className="microwave-title">Affiliate Token Checker</h1>

      <div className="input-container">
        <input
          type="text"
          placeholder="ใส่ URL ของ API เช่น https://example.com/api/flights"
          value={apiUrl}
          onChange={(e) => setApiUrl(e.target.value)}
          className="api-input"
        />
      </div>

      <div className="input-container">
        <textarea
          rows="6"
          placeholder="ใส่ JSON Parameters (ไม่จำเป็นต้องระบุสำหรับ GET request)"
          value={params}
          onChange={(e) => setParams(e.target.value)}
          className="json-textarea"
        />
      </div>

      <div className="input-container">
        <input
          type="text"
          placeholder="ใส่ Token ที่นี่"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="token-input"
        />
      </div>

      <button onClick={handleRequest} className="fetch-button" disabled={isLoading}>
        {isLoading ? 'กำลังดึงข้อมูล...' : 'Request API'}
      </button>

      {error && <p className="error-message">{error}</p>}

      {response && (
        <div className="data-section">
          <h2 className="data-title">ผลลัพธ์จาก API:</h2>
          {Array.isArray(response) ? (
            <ul className="response-list">
              {response.map((item, idx) => renderResponseItem(item, idx))}
            </ul>
          ) : (
            <pre className="data-content">{JSON.stringify(response, null, 2)}</pre>
          )}
        </div>
      )}
    </div>
  );
}

export default MicrowaveService;