import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mountain, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-6 max-w-md px-4">
        <div className="flex justify-center">
          <div className="p-4 bg-primary/10 rounded-full">
            <Mountain className="h-12 w-12 text-primary" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-7xl font-black text-primary tracking-tighter">404</h1>
          <h2 className="text-2xl font-bold text-foreground">ไม่พบหน้าที่คุณต้องการ</h2>
          <p className="text-muted-foreground">
            ขออภัย หน้าที่คุณกำลังตามหาอาจถูกลบไปแล้ว หรือกรอก URL ผิดพลาด
          </p>
        </div>
        <div className="pt-4">
          <Button asChild size="lg" className="rounded-full px-8">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              กลับสู่หน้าหลัก
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
