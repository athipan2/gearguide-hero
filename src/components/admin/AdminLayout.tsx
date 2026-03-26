import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Mountain, LayoutDashboard, FileText, Image, LogOut, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { label: "รีวิว", icon: FileText, href: "/admin/reviews" },
  { label: "Media", icon: Image, href: "/admin/media" },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  const { user, signOut, isAdmin, isEditor } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user || (!isAdmin && !isEditor)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">ไม่มีสิทธิ์เข้าถึง</p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button variant="outline" onClick={() => navigate("/")}>
              <Mountain className="mr-2 h-4 w-4" />
              กลับหน้าหลัก
            </Button>
            <Button onClick={() => navigate("/admin/login")}>
              เข้าสู่ระบบ
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r flex flex-col shrink-0 hidden md:flex">
        <div className="p-4 border-b">
          <Link to="/" className="flex items-center gap-2 text-primary font-heading font-bold text-lg">
            <Mountain className="h-5 w-5" />
            GearTrail Admin
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === item.href
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t space-y-2">
          <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground px-3 py-2">
            <ChevronLeft className="h-4 w-4" /> กลับหน้าเว็บ
          </Link>
          <button
            onClick={signOut}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-destructive px-3 py-2 w-full"
          >
            <LogOut className="h-4 w-4" /> ออกจากระบบ
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {/* Mobile header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b bg-card">
          <Link to="/" className="flex items-center gap-2 text-primary font-heading font-bold">
            <Mountain className="h-5 w-5" /> Admin
          </Link>
          <div className="flex gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`p-2 rounded-lg ${location.pathname === item.href ? "bg-primary/10 text-primary" : "text-muted-foreground"}`}
              >
                <item.icon className="h-5 w-5" />
              </Link>
            ))}
            <button onClick={signOut} className="p-2 text-muted-foreground"><LogOut className="h-5 w-5" /></button>
          </div>
        </div>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
