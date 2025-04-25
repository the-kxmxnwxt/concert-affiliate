import React from "react";
import { useKeycloak } from "@react-keycloak/web";
import "./HomePage.css";
import { FaHandshake, FaRocket, FaGift } from "react-icons/fa";

export default function HomePage() {
  const { keycloak } = useKeycloak();

  const handleLogin = () => {
    keycloak.login({
      redirectUri: window.location.origin + "/dashboard", // หรือหน้า dashboard หลัง login เสร็จ
    });
  };

  const handleRegister = () => {
    keycloak.login({
      redirectUri: window.location.origin + "/dashboard", // เหมือน login
      action: "register", // สำคัญ! บอก Keycloak ให้เปิดหน้า register
    });
  };

  return (
    <div className="homepage">
      <header className="header">
        <h1 className="logo">ConcertPartner</h1>
        <div className="header-buttons">
          <button className="btn btn-outline" onClick={handleLogin}>
            เข้าสู่ระบบ
          </button>
          <button className="btn btn-primary" onClick={handleRegister}>
            สมัครเลย
          </button>
        </div>
      </header>

      <main className="main">
        <h2 className="headline">
          เป็นพันธมิตรกับเรา <br />สร้างรายได้จากเว็บไซต์ของคุณ
        </h2>
        <p className="subtext">
          ได้รับค่าคอมมิชชั่นสูงสุดถึง 7% หรือรับค่าตอบแทนทันที 150 บาทจากการจองตั๋ว!
        </p>

        <div className="features">
          <div className="feature-card">
            <FaHandshake className="icon" />
            <h3>ร่วมเป็นพันธมิตร</h3>
            <p>ยิ่งมีการจองมาก ค่าคอมมิชชั่นของคุณก็จะเพิ่มขึ้น เช่น 2%, 5%, 7%</p>
          </div>

          <div className="feature-card">
            <FaRocket className="icon" />
            <h3>เครื่องมือพร้อมใช้</h3>
            <p>ใช้ API, แบนเนอร์, และเทมเพลตคอนเทนต์ฟรีเพื่อโปรโมตผ่านเว็บไซต์ของคุณ</p>
          </div>

          <div className="feature-card">
            <FaGift className="icon" />
            <h3>รางวัลตอบแทน</h3>
            <p>รับโบนัสเมื่อครบยอดจอง!</p>
          </div>
        </div>

        <div className="cta">
          <button className="btn btn-primary big" onClick={handleRegister}>
            สมัครเป็นพาร์ทเนอร์เลยวันนี้
          </button>
        </div>
      </main>

      <footer className="footer">© 2025 ConcertPartner. All rights reserved.</footer>
    </div>
  );
}
