import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Save, Check } from 'lucide-react';
import BackButton from '../components/BackButton';
import { supabase } from '../lib/supabase';
import LoginModal from '../components/LoginModal';
import { useUserStore } from '../stores/useUserStore';
import { FormData } from '../interfaces/FormData';
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';
import { Button } from '@progress/kendo-react-buttons';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const LoadingSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-6 w-3/4 bg-gray-200 rounded mb-4"></div>
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-24">
            <div className="h-4 w-16 bg-gray-200 rounded"></div>
          </div>
          <div className="flex-1">
            <div className="h-5 w-48 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const TravelPlan = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { existingItinerary: existingItineraryId } =
  location.state || {};
  
  const [formData, setFormData] = useState<FormData | null>(null);
  useEffect(() => {
    const storedFormData = localStorage.getItem("formData");
    const initialFormData = storedFormData ? JSON.parse(storedFormData) : null;
    setFormData(location.state?.formData || initialFormData);
    setTravelPlan({...travelPlan, destination: initialFormData?.destination});
  }, [location.state]);
 
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setErrorMessage] = useState<string | null>(null);
  const [allowRetry, setAllowRetry] = useState<boolean>(false);
  const [_, setIsSaved] = useState(false);
  const [savingError, setSavingError] = useState<string | null>(null);
  const [existingItinerary, setExistingItinerary] = useState<string | null>(
    existingItineraryId || null
  );
  const [hasSubscription, setHasSubscription] = useState(false);
  const [checkingSubscription, setCheckingSubscription] = useState(true);
  const requestMade = useRef(false);
  const { user } = useUserStore();
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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
  interface TravelPlan {
    id?: string;
    destination: string;
    days: TravelPlanDay[];
    budgetSummary: string;
  }

  const [travelPlan, setTravelPlan] = useState<TravelPlan>(() => {
    const savedPlan = localStorage.getItem('travelPlan');
    return savedPlan
      ? JSON.parse(savedPlan)
      : {
          destination: formData?.destination || 'Paris',
          days: [],
          budgetSummary: '',
        };
  });

  const checkSubscription = async () => {
    try {
      if (!user) {
        setCheckingSubscription(false);
        return;
      }
      const response = await fetch(`${API_BASE_URL}/check-subscription/${user.email}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const { hasActiveSubscription } = await response.json();
      setHasSubscription(hasActiveSubscription);
    } catch (err) {
      console.error('Error checking subscription:', err);
    } finally {
      setCheckingSubscription(false);
    }
  };

  useEffect(() => {
    if (user) {
      checkSubscription();
    }
  }, [user]);

  useEffect(() => {
    if (user && formData) {
      generateItinerary();
    }
  }, [user, formData]);  

  useEffect(() => {
    if (travelPlan.id) {
      setExistingItinerary(travelPlan.id);
      setIsSaved(true);
    }
  }, [travelPlan]);

  const generateItinerary = async () => {
    if (localStorage.getItem('travelPlan')) {
      return;
    }

    if (requestMade.current) return;
    requestMade.current = true;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/generate-itinerary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate itinerary');
      }

      const data = await response.json();
      if (data.error) {
        setError(data.error, false);
        return;
      }
      const newPlan = {
        ...data,
        destination: formData?.destination,
      };
      setTravelPlan(newPlan);
      localStorage.setItem('travelPlan', JSON.stringify(newPlan));
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const saveToMyItineraries = async () => {
    if (loading || error || !travelPlan.days.length || existingItinerary) {
      return;
    }

    setSavingError(null);

    try {
      if (!user) {
        setSavingError('Please log in to save itineraries');
        return;
      }

      const { data, error: insertError } = await supabase
        .from('itineraries')
        .insert({
          user_id: user.id,
          destination: travelPlan.destination,
          days: travelPlan.days,
          budget_summary: travelPlan.budgetSummary,
        })
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      if (data) {
        const updatedPlan = {
          ...travelPlan,
          id: data.id,
        };
        localStorage.setItem('travelPlan', JSON.stringify(updatedPlan));
        setTravelPlan(updatedPlan);
        setShowSuccessModal(true);
      }

      setIsSaved(true);
    } catch (err) {
      console.error('Error saving itinerary:', err);
      setSavingError('Failed to save itinerary. Please try again.');
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    //navigate('/my-itineraries');
  };

  const handleSuccessModalSubmit = () => {
    setShowSuccessModal(false);
    navigate('/my-itineraries');
  };

  const setError = (message: string | null, allowRetry = true) => {
    setErrorMessage(message);
    setAllowRetry(allowRetry);
  };

  const canSave =
    !loading && !error && travelPlan.days.length > 0 && !existingItinerary;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <BackButton />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm overflow-hidden"
      >
        <div className="bg-blue-600 text-white p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                Your Travel Plan for {travelPlan.destination}
              </h1>
              <p className="text-blue-100">
                Customized itinerary based on your preferences
              </p>
            </div>
            {user && (
              <button
                onClick={saveToMyItineraries}
                disabled={!canSave}
                className={`shrink-0 px-4 py-2 rounded-lg font-semibold flex items-center justify-center transition-colors ${
                  existingItinerary
                    ? 'bg-green-500 text-white cursor-not-allowed'
                    : canSave
                    ? 'bg-white text-blue-600 hover:bg-blue-50'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {existingItinerary ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Saved
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Plan
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        <div className="p-6">
          {savingError && (
            <div className="text-red-600 bg-red-50 p-4 rounded-lg mb-6">
              {savingError}
            </div>
          )}

          {error ? (
            <div className="text-red-600 bg-red-50 p-4 rounded-lg mb-6">
              {error}
              {allowRetry && (<button
                onClick={() => {
                  localStorage.removeItem('travelPlan');
                  requestMade.current = false;
                  generateItinerary();
                }}
                className="ml-4 text-red-700 underline"
              >
                Try Again
              </button>)}
            </div>
          ) : !user ? (
            <>
              <div className="text-red-600 bg-red-50 p-4 rounded-lg mb-6">
                You need to login first to be able to generate your itinerary!
              </div>
              <LoginModal showLoginForm={!user} />
            </>
          ) : loading ? (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                Generating your itinerary...
              </h2>
              <LoadingSkeleton />
            </div>
          ) : (
            <div className="mb-8">
              {travelPlan.days.map((day, dayIndex) =>
                hasSubscription || dayIndex === 0 ? (
                  <div
                    key={dayIndex}
                    className={`mb-8 ${
                      dayIndex + 1 < travelPlan.days.length && hasSubscription
                        ? 'border-b pb-12'
                        : ''
                    }`}
                  >
                    <h2 className="text-2xl font-semibold mb-4">
                      Day {dayIndex + 1}
                    </h2>
                    <div className="space-y-6">
                      {day.activities.map((activity, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start space-x-4"
                        >
                          <div className="flex-shrink-0 w-24">
                            <span className="text-gray-600 font-medium">
                              {activity.time}
                            </span>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-medium text-gray-900">
                              {activity.activity}
                            </h3>
                            <p className="text-gray-600 mt-1">
                              {activity.description}
                            </p>
                            <span className="text-sm text-gray-500 mt-1 block">
                              Duration: {activity.duration}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ) : null
              )}
            </div>
          )}

          {user &&
            !hasSubscription &&
            !checkingSubscription &&
            !loading &&
            !error && (
              <div className="border-t pt-6">
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <Lock className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-xl font-semibold mb-2">
                    Unlock Your Full Travel Plan
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Subscribe to access your complete day-by-day itinerary and
                    unlock premium features.
                  </p>
                  <button
                    onClick={() => setShowSubscriptionModal(true)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Subscribe Now
                  </button>
                </div>
              </div>
            )}
        </div>
      </motion.div>

      {showSubscriptionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-md w-full"
          >
            <h2 className="text-2xl font-bold mb-8">Choose Your Plan</h2>
            <stripe-pricing-table
              pricing-table-id="prctbl_1QvgeCAMf9pPACjRDZEiND2B"
              publishable-key="pk_test_51QtyWgAMf9pPACjRPs2qrQScV4YMq7hUFbZo68eB6AVjcCpTb1qGaiHuRpBfGf7WVmzQDRdbSYNAV0FvLFzgY0Pd002Ho3hqd3"
              customer-email={user?.email}
            ></stripe-pricing-table>
            <button
              onClick={() => setShowSubscriptionModal(false)}
              className="w-full text-gray-600 py-2"
            >
              Cancel
            </button>
          </motion.div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <Dialog
          onClose={handleSuccessModalClose}
          title="Success!"
          className="k-dialog-wrapper"
        >
          <div className="p-6">
            <div className="flex items-center justify-center mb-4">
              <Check className="w-12 h-12 text-green-500" />
            </div>
            <p className="text-center text-gray-700">
              Your itinerary for {travelPlan.destination} has been saved successfully!
            </p>
          </div>
          <DialogActionsBar>
            <Button
              themeColor="primary"
              onClick={handleSuccessModalSubmit}
            >
              View My Itineraries
            </Button>
          </DialogActionsBar>
        </Dialog>
      )}
    </div>
  );
};

export default TravelPlan;