# GearTrail UI/UX & Architecture Audit Report

## 1. สรุปปัญหาหลัก (Critical Issues)
- **Layout Overflow:** พบความเสี่ยงของ Horizontal Scroll ในหน้า HeroSection และ ImageGallery เนื่องจากการใช้ `scale-105` โดยไม่มีการควบคุม `overflow` ที่รัดกุมในระดับ Container
- **Data Fetching Inefficiency:** การใช้ `useEffect` กระจายอยู่ตาม Component ต่างๆ ทำให้ยากต่อการจัดการ Cache, Loading State และอาจเกิด Race Conditions ได้
- **SEO Gaps:** ขาด Structured Data ที่สำคัญ เช่น BreadcrumbList และ FAQPage ซึ่งส่งผลต่อการแสดงผลบน Search Engine (Rich Snippets)
- **Mobile UX Density:** Product Card บนมือถือแสดงข้อมูล Pros/Cons เยอะเกินไป ทำให้พื้นที่หน้าจอถูกใช้งานไม่คุ้มค่า และ Sticky CTA ขาดความโดดเด่น

## 2. Quick Wins (แก้แล้วดีขึ้นทันที)
- **Fix Overflow:** เพิ่ม `overflow-x-hidden` และควบคุม Container ของภาพที่ทำ Zoom effect
- **Hide Secondary Info on Mobile:** ซ่อน Pros/Cons ใน Product Card เมื่อดูบนหน้าจอมือถือขนาดเล็ก เพื่อให้เห็นสินค้าจำนวนมากขึ้นในหนึ่งหน้าจอ
- **Enhanced Mobile CTA:** ปรับปรุง Sticky Footer ให้มี Backdrop Blur ที่หนาขึ้นและเพิ่ม Shadow เพื่อแยกเลเยอร์ให้ชัดเจนจากเนื้อหาด้านหลัง

## 3. Refactor ระดับกลาง
- **React Query Integration:** เปลี่ยนจากการใช้ `useState` + `useEffect` มาเป็น `@tanstack/react-query` ผ่าน Custom Hooks (`useReviews`, `useReview`) เพื่อการจัดการข้อมูลที่เป็นระบบและรวดเร็วขึ้น
- **Centralized API:** รวม Supabase Queries ไว้ที่ `src/lib/api.ts` เพื่อให้ง่ายต่อการดูแลรักษาและทำ Unit Test ในอนาคต
- **Lazy Loading:** ใช้ `React.lazy` สำหรับ Component ที่อยู่ด้านล่าง (Below the fold) เช่น `CommentSection` และ `RelatedReviews` เพื่อลด Bundle size ที่ต้องโหลดในตอนแรก

## 4. Long-term Improvement
- **Global Affiliate Tracking:** ขยายระบบ `AffiliateCTA` ให้เชื่อมต่อกับ Google Analytics 4 หรือ Facebook Pixel เพื่อวัดผล Conversion อย่างแม่นยำ
- **Comprehensive Schema:** เพิ่ม Schema สำหรับ Article และ Review Rating ที่ละเอียดขึ้นในทุกหน้า
- **Custom Error Boundaries:** พัฒนา Error UI ที่เฉพาะเจาะจงตามประเภทของ Error (เช่น Network Error vs Data Not Found) ในภาษาไทย

## 5. Architecture Diagram
```
[Client Layer]
      |
      V
[Hook Layer (React Query)]  <-- useReviews, useReview, useAuth
      |
      V
[API Layer (Supabase)]      <-- src/lib/api.ts (getReviews, getReviewBySlug)
      |
      V
[Supabase Client]           <-- src/integrations/supabase/client.ts
      |
      V
[PostgreSQL / Storage]      <-- Supabase Backend
```
