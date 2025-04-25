import React, { useState, useEffect } from 'react';
import './DashboardPage.css';
import { useKeycloak } from '@react-keycloak/web';
import { Link } from 'react-router-dom';
import { FiCopy, FiLogOut } from 'react-icons/fi';
import { Bar } from 'react-chartjs-2';  // 👈 เปลี่ยนเป็น Bar Chart
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import Footer from './components/Footer';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function DashboardPage() {
  const { keycloak } = useKeycloak();
  const [clickLogs, setClickLogs] = useState([]);  // ใช้ค่าเริ่มต้นเป็นอาร์เรย์
  const [copySuccess, setCopySuccess] = useState(false);
  const [graphData, setGraphData] = useState({});

  useEffect(() => {
    const registerAffiliator = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/register", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${keycloak.token}`,
          },
        });
  
        if (!res.ok) {
          console.error("การสมัคร Affiliator ไม่สำเร็จ");
        }
      } catch (err) {
        console.error("❌ Register failed:", err);
      }
    };
  
    const fetchClickSummary = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/v1/dashboard/sum-click", {
          headers: {
            Authorization: `Bearer ${keycloak.token}`,
          },
        });
  
        if (!res.ok) throw new Error("Failed to fetch summary");
        const data = await res.json();
        setClickLogs(data);
  
        if (data && Array.isArray(data)) {
          const labels = data.map(item => item.name);
          const clickCounts = data.map(item => item.click_count);
  
          setGraphData({
            labels: labels,
            datasets: [{
              label: 'จำนวนคลิก',
              data: clickCounts,
              backgroundColor: '#F0AF3E',
              borderColor: '#388E3C',
              borderWidth: 1,
            }]
          });
        }
      } catch (err) {
        console.error("❌ Summary API error:", err);
      }
    };
  
    // ✅ เรียกเมื่อ token พร้อม
    if (keycloak?.authenticated && keycloak.token) {
      registerAffiliator();
      fetchClickSummary();
    }
  }, [keycloak?.authenticated, keycloak.token]);  // 👈 เพิ่ม keycloak.token เป็น dependency
  

  const handleCopy = () => {
    // คัดลอกโทเคนในรูปแบบ 'Bearer <token>'
    navigator.clipboard.writeText(`Bearer ${keycloak.token}`);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div className="dashboard-layout">
      <main className="main-content">
        <h1>👋 ยินดีต้อนรับ {keycloak?.tokenParsed?.name || 'ผู้ใช้'}</h1>
        <div className="token-box">
          <h4>🔐 Access Token:</h4>
          <div className="token-content">
            {/* แสดงโทเคนในรูปแบบ 'Bearer <token>' */}
            <textarea value={`Bearer ${keycloak.token}`} readOnly rows={6} />
            <button className="copy-btn" onClick={handleCopy}>
              <FiCopy /> {copySuccess ? 'คัดลอกแล้ว' : 'คัดลอก'}
            </button>
          </div>
        </div>

        <div className="action-buttons-container">
  <Link to="/websites" className="action-card-link">
    <div className="action-card">
      <h3>➕ เพิ่มเว็บไซต์</h3>
      <p>จัดการเว็บไซต์ที่คุณใช้สำหรับแสดงแบนเนอร์</p>
    </div>
  </Link>
  <Link to="/concerts" className="action-card-link">
    <div className="action-card">
    <h3>🎵 คอนเสิร์ต</h3>
    <p>เปิดหน้า Concert สำหรับดูคอนเสิร์ตทั้งหมด API</p>
    </div>
  </Link>
  <Link to="/swagger" className="action-card-link">
    <div className="action-card">
    <h3>⚙️ ทดสอบ API</h3>
    <p>เปิดหน้า Swagger สำหรับดูเอกสารและทดสอบ API</p>
    </div>
  </Link>
</div>


        <h2 style={{ marginTop: '40px' }}>📈 รายงาน Click Logs</h2>
        <div className="table-wrapper">
          <table className="click-table">
            <thead>
              <tr>
                <th>🎤 ชื่อคอนเสิร์ต</th>
                <th>จำนวนคลิก</th>
                <th>คลิกล่าสุด</th>
              </tr>
            </thead>
            <tbody>
              {/* ตรวจสอบ clickLogs เป็นอาร์เรย์ก่อนการใช้ map */}
              {Array.isArray(clickLogs) && clickLogs.length > 0 ? (
                clickLogs.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.click_count}</td>
                    <td>{new Date(item.last_click).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">ไม่มีข้อมูล</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 👇 การ์ดกราฟ */}
        <h2>📊 จำนวนคลิกตามคอนเสิร์ต</h2>
        <div className="card-container">
          <div className="card">
            {/* ตรวจสอบว่า graphData มีข้อมูลก่อน render กราฟ */}
            {graphData.labels && graphData.labels.length > 0 ? (
              <Bar 
                data={graphData} 
                options={{
                  responsive: true,
                  plugins: {
                    title: {
                      display: true,
                      text: 'จำนวนคลิกตามคอนเสิร์ต',
                      font: {
                        size: 18,
                      }
                    },
                    legend: {
                      position: 'top',
                    },
                  },
                  scales: {
                    x: {
                      title: {
                        display: true,
                        text: 'คอนเสิร์ต',
                      },
                    },
                    y: {
                      title: {
                        display: true,
                        text: 'จำนวนคลิก',
                      },
                      beginAtZero: true,
                    },
                  },
                }} 
              />
            ) : (
              <p>ยังไม่มีข้อมูลกราฟ</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default DashboardPage;
