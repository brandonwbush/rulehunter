export function SkeletonLoader() {
  return (
    <div className="min-h-screen bg-background py-8 px-4 animate-pulse">
      <div className="max-w-6xl mx-auto">
        {/* Header skeleton */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-muted rounded"></div>
                <div className="w-48 h-10 bg-muted rounded"></div>
              </div>
              <div className="w-64 h-6 bg-muted rounded mb-2"></div>
              <div className="flex gap-4">
                <div className="w-40 h-4 bg-muted rounded"></div>
                <div className="w-32 h-4 bg-muted rounded"></div>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="w-24 h-10 bg-muted rounded"></div>
              <div className="w-24 h-10 bg-muted rounded"></div>
            </div>
          </div>
        </div>

        {/* Stats skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-card rounded-lg p-4 border border-border">
              <div className="w-16 h-4 bg-muted rounded mb-2"></div>
              <div className="w-24 h-8 bg-muted rounded"></div>
            </div>
          ))}
        </div>

        {/* Example arrays skeleton */}
        <div className="bg-accent/30 border border-accent rounded-lg p-4 mb-6">
          <div className="w-48 h-4 bg-muted rounded mb-2"></div>
          <div className="w-full h-6 bg-muted rounded"></div>
        </div>

        {/* Panels skeleton */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-card rounded-lg p-6 border border-border">
            <div className="w-32 h-6 bg-muted rounded mb-4"></div>
            <div className="w-full h-10 bg-muted rounded mb-2"></div>
            <div className="w-full h-10 bg-muted rounded mb-4"></div>
            <div className="w-full h-32 bg-muted rounded"></div>
          </div>
          <div className="bg-card rounded-lg p-6 border border-border">
            <div className="w-32 h-6 bg-muted rounded mb-4"></div>
            <div className="w-full h-48 bg-muted rounded mb-4"></div>
            <div className="w-full h-12 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
