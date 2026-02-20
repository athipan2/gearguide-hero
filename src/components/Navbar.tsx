import { useState, useEffect } from "react";
import { Menu, X, Search, Mountain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "รองเท้าวิ่ง", href: "/category/รองเท้าวิ่งถนน" },
  { label: "อุปกรณ์เทรล", href: "/category/อุปกรณ์วิ่งเทรล" },
  { label: "แคมป์ปิ้ง", href: "/category/camping-gear" },
  { label: "คู่มือ & เทคนิค", href: "/guides" },
  { label: "Best Of 2026", href: "#" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300 border-b",
        isScrolled
          ? "bg-background/95 backdrop-blur-lg border-primary/10 shadow-sm h-16"
          : "bg-background/80 backdrop-blur-md border-transparent h-20"
      )}
    >
      <div className="container mx-auto flex items-center justify-between h-full px-4">
        <Link to="/" className="flex items-center gap-2 font-heading font-extrabold text-2xl text-primary tracking-tight">
          <Mountain className="h-8 w-8 text-accent" />
          <span>GEARTRAIL</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <Link
              key={l.label}
              to={l.href}
              className="text-sm font-bold uppercase tracking-widest text-foreground/70 hover:text-primary transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/5">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="cta" size="sm" className="hidden lg:flex">
            ส่งรีวิว
          </Button>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden p-2 text-primary" onClick={() => setOpen(!open)}>
          {open ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t bg-card px-4 pb-4 space-y-2">
          {navLinks.map((l) => (
            <Link key={l.label} to={l.href} className="block py-2 text-sm font-medium text-foreground/80 hover:text-primary" onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <div className="flex gap-2 pt-2">
            <Button variant="ghost" size="sm" className="w-full justify-start"><Search className="h-4 w-4 mr-2" />ค้นหา</Button>
          </div>
        </div>
      )}
    </nav>
  );
}
