import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { AppProvider } from './context/AppContext';
import AppRoutes from './routes/AppRoutes';

/**
 * Root Application Component — SevaSangam
 * "Trusted Services. Fair Opportunities. Stronger Communities."
 */
function App() {
  return (
    <Router>
      <LanguageProvider>
        <AuthProvider>
          <AppProvider>
            <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
              <AppRoutes />
            </div>
          </AppProvider>
        </AuthProvider>
      </LanguageProvider>
    </Router>
  );
}

export default App;
