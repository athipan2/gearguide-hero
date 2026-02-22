import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { supabase } from "@/integrations/supabase/client";

interface SearchResult {
  name: string;
  slug: string;
  category: string;
}

export function SearchDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }

      const { data } = await supabase
        .from("reviews")
        .select("name, slug, category")
        .ilike("name", `%${query}%`)
        .eq("published", true)
        .limit(5);

      if (data) {
        setResults(data as SearchResult[]);
      }
    };

    const timer = setTimeout(fetchResults, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (slug: string) => {
    onOpenChange(false);
    navigate(`/review/${slug}`);
  };

  const handleSearchAll = () => {
    onOpenChange(false);
    navigate(`/category?q=${encodeURIComponent(query)}`);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="ค้นหารีวิวสินค้า..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>ไม่พบผลลัพธ์ที่ค้นหา</CommandEmpty>
        {results.length > 0 && (
          <CommandGroup heading="ผลการค้นหา">
            {results.map((res) => (
              <CommandItem
                key={res.slug}
                onSelect={() => handleSelect(res.slug)}
                className="cursor-pointer"
              >
                <div className="flex flex-col">
                  <span className="font-medium">{res.name}</span>
                  <span className="text-xs text-muted-foreground">{res.category}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
        {query.length > 0 && (
          <CommandGroup heading="การทำงาน">
            <CommandItem onSelect={handleSearchAll} className="cursor-pointer text-primary">
              <Search className="mr-2 h-4 w-4" />
              ค้นหา "{query}" ในสินค้าทั้งหมด
            </CommandItem>
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
