export default function EmptyState({ title = 'Không có dữ liệu', description = 'Hãy thử thay đổi bộ lọc hoặc thêm dữ liệu mới.' }) {
  return (
    <div className="glass-panel p-10 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-300/15 text-3xl">✨</div>
      <h3 className="font-display text-2xl font-bold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
    </div>
  );
}
