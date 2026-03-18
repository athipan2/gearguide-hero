import { useState, useEffect } from "react";
import { Menu, Search, Mountain, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useComparisonStore } from "@/lib/comparison-store";
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

interface NavbarProps {
  className?: string;
  forceWhite?: boolean;
}

export function Navbar({ className, forceWhite }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const selectedCount = useComparisonStore((state) => state.selectedItems.length);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-200 border-b",
        isScrolled
          ? cn("bg-background/95 backdrop-blur-lg border-primary/10 shadow-lg h-16", forceWhite && "bg-white/95")
          : cn("bg-background/80 backdrop-blur-md border-transparent h-20", forceWhite && "bg-white/80"),
        className
      )}
    >
      <div className="container mx-auto flex items-center justify-between h-full px-4">
        <Link to="/" className="flex items-center gap-2 font-heading font-semibold text-2xl text-primary tracking-tight-compact">
          <div className="relative">
            <Mountain className="h-6 w-6 text-accent" />
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-primary rounded-full border-2 border-background" />
          </div>
          <span>GEARTRAIL</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((l) => (
            <Link
              key={l.label}
              to={l.href}
              className="group relative text-[11px] font-bold uppercase tracking-sporty text-foreground/60 hover:text-primary transition-colors py-2"
            >
              {l.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-1 lg:gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-primary hover:bg-primary/5 h-9 w-9"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="h-5 w-5" />
          </Button>

          <Link to="/compare">
            <Button
              variant="ghost"
              size="sm"
              className="relative text-primary hover:bg-primary/5 font-bold uppercase tracking-sporty text-[10px] h-9 px-3"
            >
              <Scale className="h-4 w-4 mr-2" />
              <span>เปรียบเทียบ</span>
              {selectedCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] text-accent-foreground font-bold">
                  {selectedCount}
                </span>
              )}
            </Button>
          </Link>

          <Button variant="cta" size="sm" className="hidden lg:flex h-9 text-[10px] font-bold tracking-sporty">
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
                      className="px-6 py-4 text-lg font-semibold uppercase tracking-widest text-foreground/70 hover:text-primary hover:bg-primary/5 transition-all"
                    >
                      {l.label}
                    </Link>
                  </SheetClose>
                ))}
                <div className="mt-4 px-6 pt-6 border-t space-y-4">
                  <SheetClose asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-lg font-semibold uppercase tracking-widest"
                      size="lg"
                      onClick={() => setSearchOpen(true)}
                    >
                      <Search className="h-5 w-5 mr-3" />
                      ค้นหา
                    </Button>
                  </SheetClose>

                  <SheetClose asChild>
                    <Link to="/compare" className="block w-full">
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-lg font-semibold uppercase tracking-widest relative"
                        size="lg"
                      >
                        <Scale className="h-5 w-5 mr-3" />
                        เปรียบเทียบ
                        {selectedCount > 0 && (
                          <span className="ml-2 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-xs text-accent-foreground font-semibold">
                            {selectedCount}
                          </span>
                        )}
                      </Button>
                    </Link>
                  </SheetClose>

                  <Button variant="cta" className="w-full text-lg font-semibold uppercase tracking-widest" size="lg">
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
