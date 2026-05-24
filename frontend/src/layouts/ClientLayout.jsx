import { Outlet } from 'react-router-dom';
import Navbar from '../components/client/Navbar';
import Footer from '../components/client/Footer';

export default function ClientLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <main><Outlet /></main>
      <Footer />
    </div>
  );
}
