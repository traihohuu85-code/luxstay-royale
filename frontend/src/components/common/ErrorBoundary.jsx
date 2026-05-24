import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message || 'Ứng dụng gặp lỗi khi tải giao diện.' };
  }

  componentDidCatch(error, info) {
    console.error('LuxStay UI error:', error, info);
  }

  resetApp = () => {
    localStorage.removeItem('luxstay_user');
    localStorage.removeItem('luxstay_token');
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen bg-slate-950 px-6 py-16 text-slate-100">
        <div className="mx-auto max-w-2xl rounded-[2rem] border border-white/10 bg-white/[0.075] p-8 shadow-2xl backdrop-blur-xl">
          <p className="text-sm font-black uppercase tracking-[0.35em] text-amber-200">LuxStay Royale</p>
          <h1 className="mt-4 text-3xl font-black text-white">Giao diện đang gặp lỗi tải dữ liệu cục bộ</h1>
          <p className="mt-3 leading-7 text-slate-300">
            Lỗi này thường xảy ra khi trình duyệt còn lưu session cũ trong localStorage. Bấm nút bên dưới để xóa session cũ và tải lại trang.
          </p>
          <pre className="mt-5 overflow-auto rounded-2xl bg-slate-950/80 p-4 text-sm text-red-200">{this.state.message}</pre>
          <button onClick={this.resetApp} className="mt-6 rounded-full bg-amber-300 px-6 py-3 font-black text-slate-950 shadow-lg transition hover:-translate-y-0.5">
            Xóa session và tải lại
          </button>
        </div>
      </div>
    );
  }
}