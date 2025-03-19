import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import PlannerForm from './pages/PlannerForm';
import TravelPlan from './pages/TravelPlan';
import Checkout from './pages/Checkout';
import AuthCallback from './pages/AuthCallback';
import MyItineraries from './pages/MyItineraries';
import { useEffect } from 'react';
import { useUserStore } from './stores/useUserStore';

function App() {
  const fetchUser = useUserStore((state) => state.fetchUser);
  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create-plan" element={<PlannerForm />} />
          <Route path="/travel-plan" element={<TravelPlan />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/my-itineraries" element={<MyItineraries />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;