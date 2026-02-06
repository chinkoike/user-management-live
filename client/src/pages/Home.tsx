import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-linear-to- from-blue-50 to-indigo-100 flex flex-col">
      {/* HERO */}
      <header className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-5xl w-full grid md:grid-cols-2 gap-12 items-center">
          {/* LEFT */}
          <div>
            <h1 className="text-5xl font-extrabold text-gray-800 leading-tight">
              จัดการงานของคุณ <br />
              <span className="text-blue-600">ให้เป็นระบบ</span>
            </h1>

            <p className="mt-6 text-lg text-gray-600">
              TaskMaster ช่วยให้คุณจัดการงาน ติดตามความคืบหน้า
              และทำงานได้อย่างมีประสิทธิภาพมากขึ้น
            </p>

            <div className="mt-8 flex gap-4">
              <button
                onClick={() => navigate("/register")}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl text-lg font-semibold hover:bg-blue-700 transition shadow"
              >
                เริ่มใช้งานฟรี
              </button>

              <button
                onClick={() => navigate("/login")}
                className="bg-white text-blue-600 px-6 py-3 rounded-xl text-lg font-semibold border border-blue-200 hover:bg-gray-50 transition"
              >
                เข้าสู่ระบบ
              </button>
            </div>
          </div>

          {/* RIGHT */}
          <div className="hidden md:flex justify-center">
            <div className="bg-white rounded-3xl shadow-xl p-8 w-80">
              <div className="text-5xl mb-4">📝</div>
              <p className="font-semibold text-gray-800 mb-2">ตัวอย่าง Task</p>
              <ul className="text-gray-600 text-sm space-y-2">
                <li>✔️ ออกแบบ Dashboard</li>
                <li>✔️ ทำ API Auth</li>
                <li>✔️ Deploy โปรเจกต์</li>
              </ul>
            </div>
          </div>
        </div>
      </header>

      {/* FEATURES */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            ทำไมต้องใช้ TaskMaster?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <Feature
              icon="⚡"
              title="รวดเร็ว"
              desc="สร้าง แก้ไข และติดตามงานได้ในไม่กี่คลิก"
            />
            <Feature
              icon="🔒"
              title="ปลอดภัย"
              desc="ระบบ Login, JWT และ Role แยกชัดเจน"
            />
            <Feature
              icon="📊"
              title="มองภาพรวมง่าย"
              desc="Dashboard ชัดเจน เห็นข้อมูลสำคัญทันที"
            />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} TaskMaster. All rights reserved.
      </footer>
    </div>
  );
};

function Feature({
  icon,
  title,
  desc,
}: {
  icon: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="bg-gray-50 rounded-2xl p-6 text-center shadow-sm">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="font-semibold text-lg text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{desc}</p>
    </div>
  );
}

export default LandingPage;
