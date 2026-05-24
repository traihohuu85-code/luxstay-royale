import { useEffect, useState } from 'react';
import http from '../../api/http';
import BranchCard from '../../components/client/BranchCard';

export default function BranchesPage() {
  const [branches, setBranches] = useState([]);
  useEffect(() => { http.get('/branches').then((res) => setBranches(res.data)); }, []);
  return (
    <div className="container-lux py-14">
      <div className="glass-panel mb-10 overflow-hidden p-8 md:p-10">
        <p className="section-kicker">Hệ thống cơ sở</p>
        <h1 className="section-title mt-3">Các chi nhánh LuxStay Royale</h1>        
      </div>
      <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">{branches.map((branch) => <BranchCard key={branch.id} branch={branch} />)}</div>
    </div>
  );
}
