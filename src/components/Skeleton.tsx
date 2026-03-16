export function ProductSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-200 h-64 rounded-lg mb-4"></div>
      <div className="bg-gray-200 h-4 w-3/4 rounded mb-2"></div>
      <div className="bg-gray-200 h-4 w-1/2 rounded"></div>
      <div className="bg-gray-200 h-6 w-1/3 rounded mt-3"></div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(count)].map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="animate-pulse bg-white rounded-xl p-6 shadow-md">
      <div className="bg-gray-200 h-40 rounded-lg mb-4"></div>
      <div className="bg-gray-200 h-4 w-3/4 rounded mb-2"></div>
      <div className="bg-gray-200 h-4 w-1/2 rounded"></div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-200 h-8 w-48 rounded mb-6"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function ButtonSkeleton() {
  return (
    <div className="animate-pulse bg-gray-200 h-10 w-24 rounded-lg"></div>
  );
}

export function InputSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-200 h-4 w-16 rounded mb-2"></div>
      <div className="bg-gray-200 h-10 w-full rounded-lg"></div>
    </div>
  );
}
