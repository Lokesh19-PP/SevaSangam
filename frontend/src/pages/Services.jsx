import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar';
import Footer from '../components/navigation/Footer';
import ServiceCard from '../components/cards/ServiceCard';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import { services as defaultServices } from '../mock/data/services';

/**
 * Neo-Brutalist Services Page — SevaSangam
 * Browse and search available cooperative services with category filters.
 */
const Services = () => {
  const [servicesList] = useState(defaultServices);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const navigate = useNavigate();

  const categories = ['All', ...new Set(servicesList.map((s) => s.category))];

  const filteredServices = servicesList.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSelectService = (service) => {
    navigate(`/booking?serviceId=${service.id}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF6]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Header Ribbon */}
        <div className="bg-yellow-300 rounded-3xl border-3 border-black p-8 shadow-neo-lg mb-10">
          <Badge variant="default" size="sm" shadow className="mb-2">
            🏛️ Direct Labour Federation Catalog
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-black font-display tracking-tight mt-1">
            Cooperative Services Directory
          </h1>
          <p className="text-sm sm:text-base font-bold text-slate-900 mt-2 max-w-2xl">
            Transparent pricing, skilled trade guild verification, and collective quality assurance.
          </p>
        </div>

        {/* Search & Category Filter Pills */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-10">
          <div className="w-full md:w-96">
            <Input
              placeholder="Search services (e.g. electrical, plumbing, cleaning)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<span className="text-lg">🔍</span>}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 text-xs font-extrabold rounded-xl border-2 border-black transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-teal-400 text-black shadow-neo-sm -translate-x-0.5 -translate-y-0.5'
                      : 'bg-white text-slate-800 hover:bg-yellow-100 hover:shadow-neo-xs'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onSelect={handleSelectService}
            />
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border-3 border-black shadow-neo">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-black font-extrabold text-lg">No services found matching your criteria.</p>
            <p className="text-slate-600 font-semibold text-xs mt-1">Try clearing the search filter or selecting another category.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Services;
