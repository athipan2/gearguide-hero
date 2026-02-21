import { useState, useEffect } from "react";
import { Menu, Search, Mountain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { SearchDialog } from "./SearchDialog";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navLinks = [
  { label: "รองเท้าวิ่ง", href: "/category/รองเท้าวิ่งถนน" },
  { label: "อุปกรณ์เทรล", href: "/category/อุปกรณ์วิ่งเทรล" },
  { label: "แคมป์ปิ้ง", href: "/category/camping-gear" },
  { label: "คู่มือ & เทคนิค", href: "/guides" },
  { label: "Best Of 2026", href: "#" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

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
          <Button
            variant="ghost"
            size="icon"
            className="text-primary hover:bg-primary/5"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="cta" size="sm" className="hidden lg:flex">
            ส่งรีวิว
          </Button>
        </div>

        {/* Mobile toggle with Sheet */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-primary" data-testid="mobile-menu-trigger">
                <Menu className="h-7 w-7" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0">
              <SheetHeader className="p-6 border-b text-left">
                <SheetTitle className="flex items-center gap-2 font-heading font-extrabold text-xl text-primary tracking-tight">
                  <Mountain className="h-6 w-6 text-accent" />
                  <span>GEARTRAIL</span>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col py-6">
                {navLinks.map((l) => (
                  <SheetClose asChild key={l.label}>
                    <Link
                      to={l.href}
                      className="px-6 py-4 text-lg font-bold uppercase tracking-widest text-foreground/70 hover:text-primary hover:bg-primary/5 transition-all"
                    >
                      {l.label}
                    </Link>
                  </SheetClose>
                ))}
                <div className="mt-4 px-6 pt-6 border-t space-y-4">
                  <SheetClose asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-lg font-bold uppercase tracking-widest"
                      size="lg"
                      onClick={() => setSearchOpen(true)}
                    >
                      <Search className="h-5 w-5 mr-3" />
                      ค้นหา
                    </Button>
                  </SheetClose>
                  <Button variant="cta" className="w-full text-lg font-bold uppercase tracking-widest" size="lg">
                    ส่งรีวิว
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </nav>
  );
}
