export default function Modal({ open, title, children, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-6 shadow-luxury">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-900">{title}</h2>
          <button onClick={onClose} className="rounded-full bg-slate-100 px-3 py-1 text-xl hover:bg-slate-200">×</button>
        </div>
        {children}
      </div>
    </div>
  );
}
