export default function LoadingSpinner({
  label = 'Loading...',
  className = '',
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-center gap-3 text-slate-500 ${className}`}>
      <div className="h-5 w-5 border-2 border-[#123962] border-t-transparent rounded-full animate-spin" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

