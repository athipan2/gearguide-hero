import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function SearchBar({ className }: { className?: string }) {
  return (
    <div className={`relative w-full max-w-2xl ${className}`}>
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      <Input
        type="text"
        placeholder="ค้นหารองเท้า / เป้ / ไฟฉาย..."
        className="w-full pl-12 pr-4 py-6 bg-card border-2 border-primary/10 focus:border-primary/30 rounded-full text-lg shadow-lg"
      />
    </div>
  );
}
