import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import BackButton from '../components/BackButton';
import sanitizeInput from "../helpers/utils.ts";
import { FormData, ActivityType } from '../interfaces/FormData.ts';
import { NumericTextBox, NumericTextBoxChangeEvent } from '@progress/kendo-react-inputs';
import { ButtonGroup, Button } from '@progress/kendo-react-buttons';
import { DropDownList, DropDownListChangeEvent } from '@progress/kendo-react-dropdowns';
import { GridLayout, GridLayoutItem } from '@progress/kendo-react-layout';

interface ActivityItem {
  value: ActivityType;
  label: string;
}

const PlannerForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    destination: '',
    days: 3,
    activities: [],
    budget: 'moderate',
    travelStyle: 'balanced'
  });
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [filteredCities, setFilteredCities] = useState<string[]>([]);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [popularCities, setCities] = useState<{ value: string; text: string }[]>([]);
  useEffect(() => {
    fetch("/cities.json")
      .then(response => response.json())
      .then(data => {
        const formattedCities = data.cities.map((city: string) => ({
          value: city,
          text: city
        }));
        setCities(formattedCities);
      })
      .catch(error => console.error("Error loading cities:", error));
  }, []);

  const handleDestinationChange = (e: DropDownListChangeEvent) => {
    const value = sanitizeInput(e.target.value?.value || '');
    setFormData(prev => ({ ...prev, destination: value }));
  };

  const handleSuggestionClick = (city: string) => {
    setFormData(prev => ({ ...prev, destination: city }));
    setShowSuggestions(false);
  };

  const handleDaysChange = (e: NumericTextBoxChangeEvent) => {
    setFormData(prev => ({ ...prev, days: e.value || 3 }));
  };

  const handleActivityToggle = (activity: ActivityType) => {
    setFormData(prev => ({
      ...prev,
      activities: prev.activities.includes(activity)
        ? prev.activities.filter(a => a !== activity)
        : [...prev.activities, activity]
    }));
  };

  const handleBudgetChange = (e: DropDownListChangeEvent) => {
    setFormData(prev => ({ ...prev, budget: e.target.value as FormData['budget'] }));
  };

  const handleTravelStyleChange = (e: DropDownListChangeEvent) => {
    setFormData(prev => ({ ...prev, travelStyle: e.target.value as FormData['travelStyle'] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.removeItem('travelPlan');
    localStorage.setItem('formData', JSON.stringify(formData));
    navigate('/travel-plan', { state: { formData } });
  };

  const activities: ActivityItem[] = [
    { value: 'discovery', label: 'City Discovery' },
    { value: 'hiking', label: 'Hiking & Nature' },
    { value: 'history', label: 'Historical Sites' },
    { value: 'food', label: 'Food & Cuisine' },
    { value: 'entertainment', label: 'Entertainment' }
  ];

  const budgetOptions = [
    { value: 'budget', label: 'Budget' },
    { value: 'moderate', label: 'Moderate' },
    { value: 'luxury', label: 'Luxury' }
  ];

  const travelStyleOptions = [
    { value: 'relaxed', label: 'Relaxed' },
    { value: 'balanced', label: 'Balanced' },
    { value: 'intensive', label: 'Intensive' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto px-4 py-12"
    >
      <BackButton/>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Create Your Travel Plan</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Destination
          </label>
          <DropDownList
            data={popularCities}
            value={popularCities.find(city => city.value === formData.destination)}
            onChange={handleDestinationChange}
            textField="text"
            dataItemKey="value"
            defaultItem={{ value: '', text: 'Select a destination' }}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Days
          </label>
          <NumericTextBox
            value={formData.days}
            onChange={handleDaysChange}
            min={1}
            max={30}
            required
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Activities
          </label>
          <GridLayout
            cols={[
              { width: '50%' },
              { width: '50%' }
            ]}
            gap={{ rows: 12, cols: 12 }}
            className="w-full"
          >
            {activities.map((activity) => (
              <GridLayoutItem key={activity.value}>
                <Button
                  type="button"
                  togglable
                  selected={formData.activities.includes(activity.value)}
                  onClick={() => handleActivityToggle(activity.value)}
                  className="w-full"
                >
                  {activity.label}
                </Button>
              </GridLayoutItem>
            ))}
          </GridLayout>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Budget Level
          </label>
          <DropDownList
            data={budgetOptions}
            value={budgetOptions.find(option => option.value === formData.budget)}
            onChange={handleBudgetChange}
            textField="label"
            dataItemKey="value"
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Travel Style
          </label>
          <DropDownList
            data={travelStyleOptions}
            value={travelStyleOptions.find(option => option.value === formData.travelStyle)}
            onChange={handleTravelStyleChange}
            textField="label"
            dataItemKey="value"
            className="w-full"
          />
        </div>

        <Button
          type="submit"
          themeColor="primary"
          className="w-full"
        >
          Generate Travel Plan
        </Button>
      </form>
    </motion.div>
  );
}

export default PlannerForm;