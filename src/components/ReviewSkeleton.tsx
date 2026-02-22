import { Skeleton } from "@/components/ui/skeleton";

export function ProductCardSkeleton() {
  return (
    <div className="bg-card rounded-2xl border border-primary/5 overflow-hidden shadow-sm">
      <Skeleton className="aspect-[4/3] w-full" />
      <div className="p-4 space-y-3">
        <div className="space-y-1">
          <Skeleton className="h-3 w-1/4" />
          <Skeleton className="h-5 w-3/4" />
        </div>
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-1/4" />
        </div>
        <div className="pt-2">
          <Skeleton className="h-10 w-full rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function ReviewDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <Skeleton className="aspect-square w-full rounded-3xl" />
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-12 w-3/4" />
          </div>
          <div className="flex gap-4">
            <Skeleton className="h-16 w-32 rounded-2xl" />
            <Skeleton className="h-16 w-32 rounded-2xl" />
          </div>
          <Skeleton className="h-20 w-full rounded-xl" />
          <div className="flex gap-4">
            <Skeleton className="h-12 w-40 rounded-full" />
            <Skeleton className="h-12 w-40 rounded-full" />
          </div>
        </div>
      </div>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <Skeleton className="h-40 w-full rounded-2xl" />
            <Skeleton className="h-40 w-full rounded-2xl" />
          </div>
          <Skeleton className="h-60 w-full rounded-2xl" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-60 w-full rounded-xl" />
          <Skeleton className="h-40 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
