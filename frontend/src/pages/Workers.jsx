import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar';
import Footer from '../components/navigation/Footer';
import WorkerCard from '../components/cards/WorkerCard';
import Input from '../components/ui/Input';
import { workers as defaultWorkers } from '../mock/data/workers';

/**
 * Workers Page — SevaSangam
 * Browse and find verified cooperative workers.
 */
const Workers = () => {
  const [workersList] = useState(defaultWorkers);
  const [searchSkill, setSearchSkill] = useState('');
  const navigate = useNavigate();

  const filteredWorkers = workersList.filter((worker) => {
    if (!searchSkill) return true;
    return (
      worker.name.toLowerCase().includes(searchSkill.toLowerCase()) ||
      worker.skills.some((s) => s.toLowerCase().includes(searchSkill.toLowerCase()))
    );
  });

  const handleBook = (worker) => {
    navigate(`/booking?workerId=${worker.id}`);
  };

  const handleViewProfile = (worker) => {
    navigate(`/workers/${worker.id}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Verified Cooperative Workers
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Fair opportunities. All workers belong to certified cooperative societies.
          </p>
        </div>

        <div className="max-w-md mb-8">
          <Input
            placeholder="Search by worker name or skill (e.g. plumbing, wiring)..."
            value={searchSkill}
            onChange={(e) => setSearchSkill(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredWorkers.map((worker) => (
            <WorkerCard
              key={worker.id}
              worker={worker}
              onBook={handleBook}
              onViewProfile={handleViewProfile}
            />
          ))}
        </div>

        {filteredWorkers.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
            <p className="text-slate-500 text-sm">No workers found matching your query.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Workers;
