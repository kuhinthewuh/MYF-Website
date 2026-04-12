export default function Loading() {
  return (
    <div className="flex bg-[#0d1117] h-screen w-full items-center justify-center text-white">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 border-2 border-myf-teal border-t-transparent rounded-full animate-spin" />
        <span className="font-bold text-myf-teal">Loading Analytics Database...</span>
      </div>
    </div>
  );
}
