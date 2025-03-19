import { Link, useLocation } from 'react-router-dom';
import { Plane, LogIn, User, LogOut, Map, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useUserStore } from '../stores/useUserStore';
import LoginModal from '../components/LoginModal';
import { Button } from '@progress/kendo-react-buttons';

const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
};

const Navbar = () => {
  const { user, fetchUserLoading, logout } = useUserStore();
  const location = useLocation();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const handleLogout = async () => {
    logout();
    setIsMenuOpen(false);
  };

  const NavItems = ({ isMobile = false }) => (
    <>
      {location.pathname !== '/create-plan' && (
        <Link
          to="/create-plan"
          className={isMobile ? 'w-full mb-2 block' : ''}
          onClick={() => setIsMenuOpen(false)}
        >
          <Button
            themeColor="primary"
            className={isMobile ? 'w-full' : ''}
          >
            Create Plan
          </Button>
        </Link>
      )}
      {user && (
        <Link
          to="/my-itineraries"
          className={isMobile ? 'w-full mb-2 block' : ''}
          onClick={() => setIsMenuOpen(false)}
        >
          <Button
            themeColor="light"
            className={isMobile ? 'w-full' : ''}
          >
            <Map className="h-4 w-4 mr-2" />
            My Itineraries
          </Button>
        </Link>
      )}
      {user ? (
        <div className={`flex ${isMobile ? 'flex-col space-y-3' : 'items-center space-x-4'}`}>
          <div className={`flex items-center space-x-2 ${isMobile ? 'justify-center p-2 bg-gray-50 rounded-md' : ''}`}>
            <User className="h-5 w-5 text-gray-600" />
            <span className="text-sm text-gray-700">{user.email}</span>
          </div>
          <Button
            themeColor="light"
            onClick={handleLogout}
            className={isMobile ? 'w-full' : ''}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      ) : (
        <Button
          themeColor="light"
          onClick={() => {
            setShowLoginModal(true);
            setIsMenuOpen(false);
          }}
          disabled={fetchUserLoading}
          className={isMobile ? 'w-full' : ''}
        >
          <LogIn className="h-4 w-4 mr-2" />
          Login
        </Button>
      )}
    </>
  );

  return (
    <>
      <nav className="bg-white shadow-sm relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center space-x-2" onClick={() => setIsMenuOpen(false)}>
              <Plane className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">
                Catch Flights Club
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:space-x-4">
              <NavItems />
            </div>

            {/* Mobile Menu Button */}
            {isMobile && (
              <Button
                themeColor="light"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {isMobile && isMenuOpen && (
        <div className="fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsMenuOpen(false)} />
          <div className="fixed right-0 top-0 h-full w-[300px] bg-white shadow-lg">
            <div className="p-4">
              <NavItems isMobile />
            </div>
          </div>
        </div>
      )}

      <LoginModal
        showLoginForm={showLoginModal}
        setShowLoginModal={setShowLoginModal}
        modal={true}
      />
    </>
  );
};

export default Navbar;