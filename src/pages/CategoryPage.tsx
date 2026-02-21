import { useState, useEffect, useMemo } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { ProductCard } from "@/components/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { SlidersHorizontal, X, Search, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

interface FilterContentProps {
  allBrands: string[];
  selectedBrands: string[];
  toggleBrand: (brand: string) => void;
  minRating: number;
  setMinRating: (rating: number) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  maxPrice: number;
  hasActiveFilters: string | number | boolean;
  clearFilters: () => void;
}

function FilterContent({
  allBrands,
  selectedBrands,
  toggleBrand,
  minRating,
  setMinRating,
  priceRange,
  setPriceRange,
  maxPrice,
  hasActiveFilters,
  clearFilters,
}: FilterContentProps) {
  return (
    <>
      {/* Brand filter */}
      <div>
        <h3 className="font-heading font-semibold text-sm text-foreground mb-3">แบรนด์</h3>
        <div className="flex flex-wrap gap-2">
          {allBrands.map((brand) => (
            <Badge
              key={brand}
              variant={selectedBrands.includes(brand) ? "default" : "outline"}
              className="cursor-pointer transition-colors"
              onClick={() => toggleBrand(brand)}
            >
              {brand}
            </Badge>
          ))}
          {allBrands.length === 0 && (
            <p className="text-xs text-muted-foreground">ไม่มีแบรนด์</p>
          )}
        </div>
      </div>

      {/* Rating Filter */}
      <div>
        <h3 className="font-heading font-semibold text-sm text-foreground mb-3">คะแนนรีวิว</h3>
        <div className="space-y-2">
          {[4.5, 4, 3.5, 3].map((rating) => (
            <label key={rating} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="rating"
                className="w-4 h-4 accent-primary"
                checked={minRating === rating}
                onChange={() => setMinRating(rating)}
              />
              <span className="text-sm text-muted-foreground group-hover:text-foreground">
                {rating}+ ดาว
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div>
        <h3 className="font-heading font-semibold text-sm text-foreground mb-3">ช่วงราคา</h3>
        <Slider
          min={0}
          max={maxPrice}
          step={100}
          value={priceRange}
          onValueChange={(v) => setPriceRange(v as [number, number])}
          className="mb-2"
        />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>฿{priceRange[0].toLocaleString()}</span>
          <span>฿{priceRange[1].toLocaleString()}</span>
        </div>
      </div>

      {/* Clear filters */}
      {hasActiveFilters && (
        <Button variant="ghost" size="sm" className="w-full" onClick={clearFilters}>
          <X className="h-3 w-3 mr-1" />
          ล้างตัวกรอง
        </Button>
      )}
    </>
  );
}

const CATEGORY_META: Record<string, { label: string; description: string }> = {
  "รองเท้าวิ่งถนน": { label: "รองเท้าวิ่งถนน", description: "รีวิวรองเท้าวิ่งถนนจากแบรนด์ชั้นนำ ทดสอบจริง" },
  "อุปกรณ์วิ่งเทรล": { label: "อุปกรณ์วิ่งเทรล", description: "รีวิวอุปกรณ์วิ่งเทรล เดินป่า ทดสอบจริง" },
  "camping-gear": { label: "Camping Gear", description: "รีวิวอุปกรณ์แคมป์ปิ้ง เต็นท์ ถุงนอน" },
  "นาฬิกา-gps": { label: "นาฬิกา GPS", description: "รีวิวนาฬิกา GPS สำหรับวิ่งและกิจกรรมกลางแจ้ง" },
};

type SortOption = "newest" | "rating-desc" | "price-asc" | "price-desc";

interface ReviewItem {
  name: string;
  brand: string;
  image_url: string | null;
  overall_rating: number;
  price: string;
  badge: string | null;
  pros: unknown;
  cons: unknown;
  slug: string;
  affiliate_url: string | null;
  category: string;
  created_at: string;
}

function parsePriceNum(price: string): number {
  const n = parseFloat(price.replace(/[^0-9.]/g, ""));
  return isNaN(n) ? 0 : n;
}

const fallbackReviews: ReviewItem[] = [
  {
    name: "Nike Vaporfly 3", brand: "Nike",
    image_url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=450&fit=crop",
    overall_rating: 4.8, price: "฿8,500", badge: "Top Pick",
    pros: ["เบามาก", "แรงคืนตัวดี"], cons: ["ราคาสูง", "ทนทานปานกลาง"],
    slug: "nike-vaporfly-3", category: "รองเท้าวิ่งถนน",
    created_at: new Date().toISOString(),
    affiliate_url: null,
  },
  {
    name: "Salomon Speedcross 6", brand: "Salomon",
    image_url: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=450&fit=crop",
    overall_rating: 4.6, price: "฿5,900", badge: "แนะนำ",
    pros: ["เกาะถนนดี", "กันน้ำ"], cons: ["แข็งนิดหน่อย", "หนักกว่ารุ่นอื่น"],
    slug: "salomon-speedcross-6", category: "อุปกรณ์วิ่งเทรล",
    created_at: new Date().toISOString(),
    affiliate_url: null,
  },
  {
    name: "Naturehike Cloud Up 2", brand: "Naturehike",
    image_url: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&h=450&fit=crop",
    overall_rating: 4.5, price: "฿3,200", badge: "คุ้มค่าที่สุด",
    pros: ["น้ำหนักเบา", "ราคาดี"], cons: ["ทนฝนปานกลาง", "พื้นที่จำกัด"],
    slug: "naturehike-cloud-up-2", category: "camping-gear",
    created_at: new Date().toISOString(),
    affiliate_url: null,
  },
  {
    name: "Garmin Forerunner 265", brand: "Garmin",
    image_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=450&fit=crop",
    overall_rating: 4.7, price: "฿14,900", badge: "แนะนำ",
    pros: ["AMOLED สวย", "แบตอึด"], cons: ["แพง", "ขนาดใหญ่"],
    slug: "garmin-forerunner-265", category: "นาฬิกา-gps",
    created_at: new Date().toISOString(),
    affiliate_url: null,
  },
];

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [allBrands, setAllBrands] = useState<string[]>([]);
  const [allCategories, setAllCategories] = useState<string[]>([]);

  // Filters
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number>(0);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [maxPrice, setMaxPrice] = useState(50000);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [showFilters, setShowFilters] = useState(false);

  // Fetch all published reviews (optionally filtered by category param)
  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      let query = supabase
        .from("reviews")
        .select("name, brand, image_url, overall_rating, price, badge, pros, cons, slug, affiliate_url, category, created_at")
        .eq("published", true);

      if (category) {
        // Decode category slug back to actual value
        const decoded = decodeURIComponent(category);
        query = query.eq("category", decoded);
      }

      const { data, error } = await query.order("created_at", { ascending: false });

      let items = (data as unknown as ReviewItem[]) || [];

      if ((error || items.length === 0) && !category) {
        items = fallbackReviews;
      } else if (category) {
        // If specific category requested and no data, filter fallback
        const decoded = decodeURIComponent(category);
        items = items.length > 0 ? items : fallbackReviews.filter(r => r.category === decoded);
      }

      setReviews(items);

      // Extract unique brands & categories
      const brands = [...new Set(items.map((r) => r.brand))].sort();
      setAllBrands(brands);

      const cats = [...new Set(items.map((r) => r.category))].sort();
      setAllCategories(cats);

      // Calculate max price
      const prices = items.map((r) => parsePriceNum(r.price));
      const mp = Math.max(...prices, 50000);
      setMaxPrice(mp);
      setPriceRange([0, mp]);

      setLoading(false);
    };
    fetch();
  }, [category]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedBrands([]);
    setMinRating(0);
    setPriceRange([0, maxPrice]);
    setSortBy("newest");
  };

  const hasActiveFilters = searchQuery || selectedBrands.length > 0 || minRating > 0 || priceRange[0] > 0 || priceRange[1] < maxPrice;

  // Filtered & sorted results
  const filtered = useMemo(() => {
    let result = [...reviews];

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.brand.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q)
      );
    }

    // Brand filter
    if (selectedBrands.length > 0) {
      result = result.filter((r) => selectedBrands.includes(r.brand));
    }

    // Rating filter
    if (minRating > 0) {
      result = result.filter((r) => r.overall_rating >= minRating);
    }

    // Price filter
    result = result.filter((r) => {
      const p = parsePriceNum(r.price);
      return p >= priceRange[0] && p <= priceRange[1];
    });

    // Sort
    switch (sortBy) {
      case "rating-desc":
        result.sort((a, b) => b.overall_rating - a.overall_rating);
        break;
      case "price-asc":
        result.sort((a, b) => parsePriceNum(a.price) - parsePriceNum(b.price));
        break;
      case "price-desc":
        result.sort((a, b) => parsePriceNum(b.price) - parsePriceNum(a.price));
        break;
      default: // newest
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return result;
  }, [reviews, searchQuery, selectedBrands, priceRange, sortBy, minRating]);

  const meta = category ? CATEGORY_META[decodeURIComponent(category)] : null;
  const pageTitle = meta?.label || "สินค้าทั้งหมด";
  const pageDescription = meta?.description || "รีวิวสินค้าทั้งหมด ทดสอบจริง อัปเดตล่าสุด";

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title={`${pageTitle} — GearTrail`} description={pageDescription} />
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          กลับสู่หน้าหลัก
        </Link>
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">{pageTitle}</h1>
          <p className="text-muted-foreground mt-2">{pageDescription}</p>
        </div>

        {/* Search & Sort bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="ค้นหาชื่อสินค้าหรือแบรนด์..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="เรียงลำดับ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">ใหม่ล่าสุด</SelectItem>
              <SelectItem value="rating-desc">คะแนนสูงสุด</SelectItem>
              <SelectItem value="price-asc">ราคาต่ำ → สูง</SelectItem>
              <SelectItem value="price-desc">ราคาสูง → ต่ำ</SelectItem>
            </SelectContent>
          </Select>
          <Sheet open={showFilters} onOpenChange={setShowFilters}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
                data-testid="mobile-filter-button"
              >
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetHeader className="mb-6">
                <SheetTitle>ตัวกรองสินค้า</SheetTitle>
              </SheetHeader>
              <div className="space-y-6">
                <FilterContent
                  allBrands={allBrands}
                  selectedBrands={selectedBrands}
                  toggleBrand={toggleBrand}
                  minRating={minRating}
                  setMinRating={setMinRating}
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                  maxPrice={maxPrice}
                  hasActiveFilters={hasActiveFilters}
                  clearFilters={clearFilters}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex gap-6">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden md:block w-64 shrink-0">
            <div className="bg-card rounded-xl border p-5 space-y-6 sticky top-24">
              <FilterContent
                allBrands={allBrands}
                selectedBrands={selectedBrands}
                toggleBrand={toggleBrand}
                minRating={minRating}
                setMinRating={setMinRating}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                maxPrice={maxPrice}
                hasActiveFilters={hasActiveFilters}
                clearFilters={clearFilters}
              />
            </div>
          </aside>

          {/* Product grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground text-lg">ไม่พบสินค้าที่ตรงกับเงื่อนไข</p>
                {hasActiveFilters && (
                  <Button variant="link" className="mt-2" onClick={clearFilters}>
                    ล้างตัวกรองทั้งหมด
                  </Button>
                )}
              </div>
            ) : (
              <>
                <p className="text-sm text-muted-foreground mb-4">
                  แสดง {filtered.length} รายการ
                </p>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                  {filtered.map((r) => (
                    <ProductCard
                      key={r.slug}
                      name={r.name}
                      brand={r.brand}
                      image={r.image_url || ""}
                      rating={Number(r.overall_rating)}
                      price={r.price}
                      badge={r.badge || undefined}
                      pros={Array.isArray(r.pros) ? (r.pros as string[]) : []}
                      cons={Array.isArray(r.cons) ? (r.cons as string[]) : []}
                      slug={r.slug}
                      affiliateUrl={r.affiliate_url}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
