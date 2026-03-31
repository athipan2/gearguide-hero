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
import { DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "@/hooks/useTranslation";
import { translateData } from "@/lib/translation-utils";

interface SearchResult {
  name: string;
  name_en?: string;
  slug: string;
  category: string;
  category_en?: string;
}

export function SearchDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const navigate = useNavigate();
  const { t, language } = useTranslation();

  useEffect(() => {
    const fetchResults = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }

      const { data } = await supabase
        .from("reviews")
        .select("name, name_en, slug, category, category_en")
        .or(`name.ilike.%${query}%,name_en.ilike.%${query}%`)
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
      <VisuallyHidden>
        <DialogTitle>{t('nav.search')}</DialogTitle>
      </VisuallyHidden>
      <CommandInput
        placeholder={t('common.search_placeholder')}
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>{t('common.no_results')}</CommandEmpty>
        {results.length > 0 && (
          <CommandGroup heading={t('nav.search')}>
            {results.map((res) => (
              <CommandItem
                key={res.slug}
                onSelect={() => handleSelect(res.slug)}
                className="cursor-pointer"
              >
                <div className="flex flex-col">
                  <span className="font-medium">{translateData(res, 'name', language)}</span>
                  <span className="text-xs text-muted-foreground">{translateData(res, 'category', language)}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
        {query.length > 0 && (
          <CommandGroup heading={t('admin.actions')}>
            <CommandItem onSelect={handleSearchAll} className="cursor-pointer text-primary">
              <Search className="mr-2 h-4 w-4" />
              {t('nav.search')} "{query}" {t('category.all_products')}
            </CommandItem>
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
