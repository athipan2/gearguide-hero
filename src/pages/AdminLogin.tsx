import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mountain, LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check for missing Supabase configuration
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

    if (!supabaseUrl || !supabaseKey || supabaseUrl.includes("placeholder")) {
      toast({
        title: "การตั้งค่าไม่สมบูรณ์",
        description: "ไม่พบการตั้งค่า Supabase กรุณาตรวจสอบ Environment Variables (VITE_SUPABASE_URL และ VITE_SUPABASE_PUBLISHABLE_KEY)",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await signIn(email, password);
      if (error) {
        console.error("Login error:", error);
        toast({
          title: "เข้าสู่ระบบไม่สำเร็จ",
          description: error.message === "Load failed"
            ? "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ (Load failed) กรุณาตรวจสอบอินเทอร์เน็ตหรือการตั้งค่า Supabase"
            : error.message,
          variant: "destructive"
        });
      } else {
        navigate("/admin");
      }
    } catch (err) {
      console.error("Unexpected login error:", err);
      toast({
        title: "เกิดข้อผิดพลาดไม่คาดคิด",
        description: "กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 text-primary">
            <Mountain className="h-8 w-8" />
            <span className="font-heading text-2xl font-bold">GearTrail</span>
          </div>
          <p className="text-muted-foreground">เข้าสู่ระบบจัดการ</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 bg-card border rounded-xl p-6">
          <div className="space-y-2">
            <Label htmlFor="email">อีเมล</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">รหัสผ่าน</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            <LogIn className="mr-2 h-4 w-4" />
            {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </Button>
        </form>
      </div>
    </div>
  );
}
