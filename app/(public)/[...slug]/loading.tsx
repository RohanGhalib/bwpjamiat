import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function DynamicPageLoading() {
  return (
    <div className="min-h-screen pt-40">
      <LoadingSpinner label="Loading page..." className="py-20" />
    </div>
  );
}

