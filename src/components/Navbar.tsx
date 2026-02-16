import { useState } from "react";
import { Menu, X, Search, Mountain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const navLinks = [
  { label: "รองเท้าวิ่ง", href: "/category/รองเท้าวิ่งถนน" },
  { label: "อุปกรณ์เทรล", href: "/category/อุปกรณ์วิ่งเทรล" },
  { label: "แคมป์ปิ้ง", href: "/category/camping-gear" },
  { label: "คู่มือ & เทคนิค", href: "/guides" },
  { label: "Best Of 2026", href: "#" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2 font-heading font-bold text-xl text-primary">
          <Mountain className="h-6 w-6" />
          <span>GearTrail</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((l) => (
            <Link key={l.label} to={l.href} className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          <Button variant="ghost" size="icon"><Search className="h-5 w-5" /></Button>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
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
