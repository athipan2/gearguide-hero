# GearTrail Project Overview (คู่มือการพัฒนาต่อ)

โปรเจกต์นี้เป็นเว็บไซต์รีวิวอุปกรณ์วิ่ง (Affiliate Review) ที่เน้นความน่าเชื่อถือและประสบการณ์ใช้งานบนมือถือ (Mobile-First) โดยใช้เทคโนโลยีที่ทันสมัยและมีประสิทธิภาพสูง

## 🛠 เทคโนโลยีที่ใช้ (Tech Stack)
- **Frontend:** React + TypeScript + Vite
- **Styling:** Tailwind CSS + shadcn/ui
- **State Management:** Zustand (สำหรับระบบเปรียบเทียบ) & React Query (สำหรับข้อมูลจาก DB)
- **Backend:** Supabase (Auth, Database, Storage)
- **Icons:** Lucide-React

## 📂 โครงสร้างโฟลเดอร์ที่สำคัญ
- `src/pages/`: รวมหน้าหลักของเว็บไซต์ (Index, ReviewDetail, Admin, etc.)
- `src/components/`: คอมโพเนนต์ที่ใช้ซ้ำ (Navbar, Footer, ImageGallery, ShoeWizard)
- `src/integrations/supabase/`: การตั้งค่าและการเชื่อมต่อกับ Supabase
- `src/lib/`: ฟังก์ชัน Utility และ Store (เช่น `comparison-store.ts`)
- `src/hooks/`: Custom Hooks เช่น `useAuth`

## 📊 โครงสร้างข้อมูล (Data Schema)
ข้อมูลหลักจัดเก็บใน Supabase Tables:
1. **reviews:** ข้อมูลรีวิวสินค้า (แบรนด์, ราคา, คะแนน, ข้อดี-ข้อเสีย, เนื้อหาแบบ JSON)
2. **articles:** บทความและคู่มือการเลือกซื้อ
3. **comments:** ระบบคอมเมนต์และคะแนนจากผู้ใช้
4. **media_library:** จัดการไฟล์รูปภาพ
5. **user_roles:** กำหนดสิทธิ์ Admin/Editor

## 🚀 ฟีเจอร์หลัก (Core Features)
- **Shoe Wizard:** ระบบโต้ตอบช่วยผู้ใช้เลือกรองเท้าที่เหมาะกับสไตล์การวิ่ง
- **Comparison Engine:** ระบบเปรียบเทียบสเปคและคะแนน 2 รุ่นแบบ Side-by-Side
- **Review Detail:** หน้าแสดงผลรีวิวเจาะลึก พร้อม Score Gauge และระบบ Affiliate Link อัตโนมัติ
- **Admin Dashboard:** ระบบจัดการหลังบ้านสำหรับเพิ่ม/แก้ไขรีวิวและบทความ

## 🎨 แนวทางการดีไซน์ (Design Guidelines)
- **Theme:** "Premium Sporty" เน้นความสะอาดตาแต่มีพลัง
- **Color Palette:**
  - Primary: Deep Green (`#0a1a0a`)
  - Accent: Vibrant Orange/Green สำหรับ CTA
  - Background: Beige (`#f2f1ec`)
- **Typography:** ใช้ `antialiased`, ขนาดฟอนต์ขั้นต่ำ `text-xs` (12px) เพื่อให้อ่านง่ายบนมือถือ และไม่ใช้ตัวเอียง (Italic-prohibited) ในส่วนข้อมูลสำคัญ

## 🛠 การพัฒนาต่อ (Development Workflow)
1. **รันโปรเจกต์:** `bun install` ตามด้วย `bun dev`
2. **การแก้ไขข้อมูล:** แก้ไขผ่านระบบ Admin หรือโดยตรงที่ Supabase Dashboard
3. **การเพิ่มคอมโพเนนต์:** ใช้ shadcn/ui เป็นฐานและปรับแต่ง CSS ผ่าน Tailwind
4. **การ Deploy:** รองรับการ Deploy ผ่าน Lovable หรือ Vercel/Netlify ทั่วไป

---
*โปรเจกต์นี้ถูกออกแบบมาเพื่อรองรับการขยายตัว (Scalability) ในอนาคต ทั้งในส่วนของหมวดหมู่สินค้าใหม่ๆ และระบบ Community ของนักวิ่ง*
