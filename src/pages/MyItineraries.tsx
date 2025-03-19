import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Trash2 } from 'lucide-react';
import BackButton from '../components/BackButton';
import { supabase } from '../lib/supabase';
import { Button } from '@progress/kendo-react-buttons';
import { Loader } from '@progress/kendo-react-indicators';
import { Notification, NotificationGroup } from '@progress/kendo-react-notification';

interface Activity {
  time: string;
  activity: string;
  description: string;
  duration: string;
}

interface TravelPlanDay {
  day: string;
  activities: Activity[];
}

interface Itinerary {
  id: string;
  destination: string;
  days: TravelPlanDay[];
  budget_summary: string;
  created_at: string;
}

const MyItineraries = () => {
  const navigate = useNavigate();
  const [itineraries, setItineraries] = React.useState<Itinerary[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [notifications, setNotifications] = React.useState<Array<{ id: number; type: 'success' | 'error'; message: string }>>([]);

  useEffect(() => {
    fetchItineraries();
  }, []);

  const fetchItineraries = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setError('Please log in to view your itineraries');
        setLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('itineraries')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setItineraries(data || []);
    } catch (err) {
      console.error('Error fetching itineraries:', err);
      setError('Failed to load itineraries');
    } finally {
      setLoading(false);
    }
  };

  const deleteItinerary = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('itineraries')
        .delete()
        .eq('id', id);

      if (deleteError) {
        throw deleteError;
      }

      setItineraries(prev => prev.filter(i => i.id !== id));
      const notificationId = Date.now();
      setNotifications(prev => [...prev, {
        id: notificationId,
        type: 'success',
        message: 'Itinerary deleted successfully!'
      }]);

      // Auto-dismiss after 4 seconds
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
      }, 4000);
    } catch (err) {
      console.error('Error deleting itinerary:', err);
      setError('Failed to delete itinerary');
      const notificationId = Date.now();
      setNotifications(prev => [...prev, {
        id: notificationId,
        type: 'error',
        message: 'Failed to delete itinerary'
      }]);

      // Auto-dismiss after 4 seconds
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
      }, 4000);
    }
  };

  const viewItinerary = (itinerary: Itinerary) => {
    const travelPlan = {
      id: itinerary.id,
      destination: itinerary.destination,
      days: itinerary.days,
      budgetSummary: itinerary.budget_summary
    };
    localStorage.setItem('travelPlan', JSON.stringify(travelPlan));
    navigate('/travel-plan', { state: { existingItinerary: itinerary.id } });
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <BackButton />
        <div className="text-center py-12">
          <Loader size="large" themeColor="primary" />
          <p className="mt-4 text-gray-600">Loading your itineraries...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <BackButton />
        <div className="text-center py-12">
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
          <button
            onClick={() => navigate('/create-plan')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Create New Plan
          </button>
        </div>
      </div>
    );
  }

  if (itineraries.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <BackButton />
        <div className="text-center py-12">
          <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Itineraries Yet</h2>
          <p className="text-gray-600 mb-6">Start planning your next adventure!</p>
          <button
            onClick={() => navigate('/create-plan')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Create New Plan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <BackButton />
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Itineraries</h1>
      
      <NotificationGroup
        style={{
          right: 20,
          bottom: 20,
          alignItems: 'flex-end',
          flexWrap: 'wrap-reverse',
          position: 'fixed',
          zIndex: 9999
        }}
      >
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            className={`k-notification-${notification.type}`}
            closable={true}
            onClose={() => {
              setNotifications(prev => prev.filter(n => n.id !== notification.id));
            }}
          >
            {notification.message}
          </Notification>
        ))}
      </NotificationGroup>

      <div className="grid gap-6">
        {itineraries.map((itinerary) => (
          <motion.div
            key={itinerary.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {itinerary.destination}
                </h2>
                <div className="flex items-center text-gray-600 mb-4">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{itinerary.days.length} days</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  themeColor="primary"
                  onClick={() => viewItinerary(itinerary)}
                >
                  View
                </Button>
                <Button
                  themeColor="error"
                  onClick={() => deleteItinerary(itinerary.id)}
                  className="p-2"
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>
            </div>
            <p className="text-gray-600 text-sm">{itinerary.budget_summary}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MyItineraries;