import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Activity, Lock } from 'lucide-react';
import { Button } from '@progress/kendo-react-buttons';
import { Calendar as KendoCalendar, CalendarChangeEvent } from '@progress/kendo-react-dateinputs';
import '@progress/kendo-theme-default/dist/all.css';
import { useState } from 'react';

const HomePage = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6"
        >
          Your Dream Destinations Await
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-gray-600 max-w-3xl mx-auto"
        >
          Join Catch Flights Club and let us craft your perfect travel itinerary based on your preferences and interests.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            themeColor="primary"
            size="large"
            onClick={() => navigate('/create-plan')}
            className="mt-8"
          >
            Start Planning
          </Button>
        </motion.div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {[
          {
            icon: <MapPin className="w-8 h-8 text-blue-600" />,
            title: "Choose Destination",
            description: "Select your dream destination from anywhere in the world"
          },
          {
            icon: <Calendar className="w-8 h-8 text-blue-600" />,
            title: "Set Duration",
            description: "Plan your trip duration and we'll optimize your time"
          },
          {
            icon: <Activity className="w-8 h-8 text-blue-600" />,
            title: "Pick Activities",
            description: "Choose your preferred activities and experiences"
          },
          {
            icon: <Lock className="w-8 h-8 text-blue-600" />,
            title: "Unlock Full Plan",
            description: "Subscribe to access your complete day-by-day itinerary"
          }
        ].map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 * (index + 3) }}
            className="bg-white p-6 rounded-lg shadow-sm"
          >
            <div className="mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Calendar Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6 }}
        className="bg-white p-6 mb-16 rounded-lg shadow-sm m-auto"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Plan Your Next Adventure</h2>
        <div className="flex flex-col items-center">
          <KendoCalendar
            value={selectedDate}
            onChange={(e: CalendarChangeEvent) => setSelectedDate(e.value)}
            min={new Date()}
            className="k-calendar"
          />
          {selectedDate && (
            <Button
              themeColor="primary"
              className="mt-4"
              onClick={() => navigate('/create-plan')}
            >
              Start Planning for {selectedDate.toLocaleDateString()}
            </Button>
          )}
        </div>
      </motion.div>

      <div className="relative">
        <img
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
          alt="Travel Planning"
          className="w-full h-[400px] object-cover rounded-xl"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 rounded-xl flex items-center justify-center">
          <div className="text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Adventure?</h2>
            <button
              onClick={() => navigate('/create-plan')}
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Join Catch Flights Club
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;