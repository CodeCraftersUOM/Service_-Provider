'use client';

import React, { useState } from 'react';
import styles from './resturent.module.css';

interface RestaurantFormData {
  restaurantName: string;
  ownerFullName: string;
  phoneNumber: string;
  emailAddress: string;
  alternateContactNumber: string;
  businessType: string;
  locationAddress: string;
  googleMapsLink: string;
  cuisineTypes: string[];
  workingHours: {
    daysOpen: string[];
    openingTime: string;
    closingTime: string;
    is24x7Available: boolean;
    closedOnHolidays: boolean;
  };
  foodSafetyLicenseUrl: string;
  businessRegistrationNumber: string;
  yearsInOperation: number | '';
  numberOfBranches: number | '';
  amenities: {
    outdoorSeating: boolean;
    liveMusic: boolean;
    parkingAvailable: boolean;
    wifi: boolean;
    familyAreaKidsFriendly: boolean;
    wheelchairAccessible: boolean;
  };
}

const RestaurantRegistrationForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState<RestaurantFormData>({
    restaurantName: '',
    ownerFullName: '',
    phoneNumber: '',
    emailAddress: '',
    alternateContactNumber: '',
    businessType: '',
    locationAddress: '',
    googleMapsLink: '',
    cuisineTypes: [],
    workingHours: {
      daysOpen: [],
      openingTime: '',
      closingTime: '',
      is24x7Available: false,
      closedOnHolidays: false,
    },
    foodSafetyLicenseUrl: '',
    businessRegistrationNumber: '',
    yearsInOperation: '',
    numberOfBranches: '',
    amenities: {
      outdoorSeating: false,
      liveMusic: false,
      parkingAvailable: false,
      wifi: false,
      familyAreaKidsFriendly: false,
      wheelchairAccessible: false,
    },
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const businessTypes = ['Dine-in', 'Takeaway', 'Delivery Only', 'Cloud Kitchen', 'Cafe/Bakery'];
  const cuisineOptions = [
    'Indian', 'Chinese', 'Italian', 'Continental', 'Fast Food', 'Street Food',
    'BBQ/Grill', 'Seafood', 'Vegan/Vegetarian', 'Desserts/Bakery', 'Others'
  ];
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      if (name.startsWith('amenities.')) {
        const amenityKey = name.split('.')[1] as keyof typeof formData.amenities;
        setFormData(prev => ({
          ...prev,
          amenities: {
            ...prev.amenities,
            [amenityKey]: checkbox.checked
          }
        }));
      } else if (name.startsWith('workingHours.')) {
        const workingHoursKey = name.split('.')[1] as keyof typeof formData.workingHours;
        setFormData(prev => ({
          ...prev,
          workingHours: {
            ...prev.workingHours,
            [workingHoursKey]: checkbox.checked
          }
        }));
      }
    } else if (name === 'yearsInOperation' || name === 'numberOfBranches') {
      setFormData(prev => ({
        ...prev,
        [name]: value === '' ? '' : parseInt(value)
      }));
    } else if (name.startsWith('workingHours.')) {
      const workingHoursKey = name.split('.')[1] as keyof typeof formData.workingHours;
      setFormData(prev => ({
        ...prev,
        workingHours: {
          ...prev.workingHours,
          [workingHoursKey]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleCuisineChange = (cuisine: string) => {
    setFormData(prev => ({
      ...prev,
      cuisineTypes: prev.cuisineTypes.includes(cuisine)
        ? prev.cuisineTypes.filter(c => c !== cuisine)
        : [...prev.cuisineTypes, cuisine]
    }));
  };

  const handleDaysChange = (day: string) => {
    setFormData(prev => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        daysOpen: prev.workingHours.daysOpen.includes(day)
          ? prev.workingHours.daysOpen.filter(d => d !== day)
          : [...prev.workingHours.daysOpen, day]
      }
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.restaurantName && formData.ownerFullName && formData.phoneNumber && formData.emailAddress && formData.businessType);
      case 2:
        return !!(formData.locationAddress && formData.cuisineTypes.length > 0 && formData.workingHours.daysOpen.length > 0 && formData.workingHours.openingTime && formData.workingHours.closingTime);
      case 3:
        return true; // Step 3 has no required fields
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
      setMessage('');
    } else {
      setMessage('Please fill in all required fields before proceeding.');
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:2000/api/addResturent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSuccess(true);
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.message || 'Failed to register restaurant'}`);
      }
    } catch (error) {
      setMessage('Error: Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setIsSuccess(false);
    setCurrentStep(1);
    setFormData({
      restaurantName: '',
      ownerFullName: '',
      phoneNumber: '',
      emailAddress: '',
      alternateContactNumber: '',
      businessType: '',
      locationAddress: '',
      googleMapsLink: '',
      cuisineTypes: [],
      workingHours: {
        daysOpen: [],
        openingTime: '',
        closingTime: '',
        is24x7Available: false,
        closedOnHolidays: false,
      },
      foodSafetyLicenseUrl: '',
      businessRegistrationNumber: '',
      yearsInOperation: '',
      numberOfBranches: '',
      amenities: {
        outdoorSeating: false,
        liveMusic: false,
        parkingAvailable: false,
        wifi: false,
        familyAreaKidsFriendly: false,
        wheelchairAccessible: false,
      },
    });
  };

  if (isSuccess) {
    return (
      <div className={styles.container}>
        <div className={styles.successWrapper}>
          <div className={styles.successIcon}>
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22,4 12,14.01 9,11.01"></polyline>
            </svg>
          </div>
          <h1 className={styles.successTitle}>Restaurant Successfully Registered!</h1>
          <p className={styles.successMessage}>
            Congratulations! Your restaurant <strong>{formData.restaurantName}</strong> has been successfully registered in our system.
          </p>
          <div className={styles.successDetails}>
            <p><strong>Owner:</strong> {formData.ownerFullName}</p>
            <p><strong>Business Type:</strong> {formData.businessType}</p>
            <p><strong>Email:</strong> {formData.emailAddress}</p>
          </div>
          <button onClick={resetForm} className={styles.newRegistrationButton}>
            Register Another Restaurant
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        {/* Progress Bar */}
        <div className={styles.progressContainer}>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill} 
              style={{ width: `${(currentStep / 3) * 100}%` }}
            ></div>
          </div>
          <div className={styles.stepIndicators}>
            {[1, 2, 3].map(step => (
              <div 
                key={step}
                className={`${styles.stepIndicator} ${currentStep >= step ? styles.active : ''}`}
              >
                <div className={styles.stepNumber}>{step}</div>
                <div className={styles.stepLabel}>
                  {step === 1 && 'Basic Info'}
                  {step === 2 && 'Business Details'}
                  {step === 3 && 'Additional Info'}
                </div>
              </div>
            ))}
          </div>
        </div>

        <h1 className={styles.title}>Restaurant Registration</h1>
        
        {message && (
          <div className={`${styles.message} ${message.includes('Error') ? styles.error : styles.warning}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className={styles.step}>
              <h2 className={styles.stepTitle}>Step 1: Basic Information</h2>
              
              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor="restaurantName" className={styles.label}>Restaurant Name *</label>
                  <input
                    type="text"
                    id="restaurantName"
                    name="restaurantName"
                    value={formData.restaurantName}
                    onChange={handleInputChange}
                    className={styles.input}
                    required
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="ownerFullName" className={styles.label}>Owner Full Name *</label>
                  <input
                    type="text"
                    id="ownerFullName"
                    name="ownerFullName"
                    value={formData.ownerFullName}
                    onChange={handleInputChange}
                    className={styles.input}
                    required
                  />
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor="phoneNumber" className={styles.label}>Phone Number *</label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className={styles.input}
                    required
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="emailAddress" className={styles.label}>Email Address *</label>
                  <input
                    type="email"
                    id="emailAddress"
                    name="emailAddress"
                    value={formData.emailAddress}
                    onChange={handleInputChange}
                    className={styles.input}
                    required
                  />
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor="alternateContactNumber" className={styles.label}>Alternate Contact Number</label>
                  <input
                    type="tel"
                    id="alternateContactNumber"
                    name="alternateContactNumber"
                    value={formData.alternateContactNumber}
                    onChange={handleInputChange}
                    className={styles.input}
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="businessType" className={styles.label}>Business Type *</label>
                  <select
                    id="businessType"
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleInputChange}
                    className={styles.select}
                    required
                  >
                    <option value="">Select Business Type</option>
                    {businessTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Business Details */}
          {currentStep === 2 && (
            <div className={styles.step}>
              <h2 className={styles.stepTitle}>Step 2: Business Details</h2>
              
              <div className={styles.field}>
                <label htmlFor="locationAddress" className={styles.label}>Location Address *</label>
                <textarea
                  id="locationAddress"
                  name="locationAddress"
                  value={formData.locationAddress}
                  onChange={handleInputChange}
                  className={styles.textarea}
                  rows={3}
                  required
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="googleMapsLink" className={styles.label}>Google Maps Link</label>
                <input
                  type="url"
                  id="googleMapsLink"
                  name="googleMapsLink"
                  value={formData.googleMapsLink}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="https://maps.google.com/..."
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Cuisine Types *</label>
                <div className={styles.checkboxGrid}>
                  {cuisineOptions.map(cuisine => (
                    <label key={cuisine} className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={formData.cuisineTypes.includes(cuisine)}
                        onChange={() => handleCuisineChange(cuisine)}
                        className={styles.checkbox}
                      />
                      {cuisine}
                    </label>
                  ))}
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Working Days *</label>
                <div className={styles.checkboxGrid}>
                  {daysOfWeek.map(day => (
                    <label key={day} className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={formData.workingHours.daysOpen.includes(day)}
                        onChange={() => handleDaysChange(day)}
                        className={styles.checkbox}
                      />
                      {day}
                    </label>
                  ))}
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor="workingHours.openingTime" className={styles.label}>Opening Time *</label>
                  <input
                    type="time"
                    id="workingHours.openingTime"
                    name="workingHours.openingTime"
                    value={formData.workingHours.openingTime}
                    onChange={handleInputChange}
                    className={styles.input}
                    required
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="workingHours.closingTime" className={styles.label}>Closing Time *</label>
                  <input
                    type="time"
                    id="workingHours.closingTime"
                    name="workingHours.closingTime"
                    value={formData.workingHours.closingTime}
                    onChange={handleInputChange}
                    className={styles.input}
                    required
                  />
                </div>
              </div>

              <div className={styles.checkboxRow}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="workingHours.is24x7Available"
                    checked={formData.workingHours.is24x7Available}
                    onChange={handleInputChange}
                    className={styles.checkbox}
                  />
                  24x7 Available
                </label>

                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="workingHours.closedOnHolidays"
                    checked={formData.workingHours.closedOnHolidays}
                    onChange={handleInputChange}
                    className={styles.checkbox}
                  />
                  Closed on Holidays
                </label>
              </div>
            </div>
          )}

          {/* Step 3: Additional Information */}
          {currentStep === 3 && (
            <div className={styles.step}>
              <h2 className={styles.stepTitle}>Step 3: Additional Information</h2>
              
              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor="businessRegistrationNumber" className={styles.label}>Business Registration Number</label>
                  <input
                    type="text"
                    id="businessRegistrationNumber"
                    name="businessRegistrationNumber"
                    value={formData.businessRegistrationNumber}
                    onChange={handleInputChange}
                    className={styles.input}
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="foodSafetyLicenseUrl" className={styles.label}>Food Safety License URL</label>
                  <input
                    type="url"
                    id="foodSafetyLicenseUrl"
                    name="foodSafetyLicenseUrl"
                    value={formData.foodSafetyLicenseUrl}
                    onChange={handleInputChange}
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor="yearsInOperation" className={styles.label}>Years in Operation</label>
                  <input
                    type="number"
                    id="yearsInOperation"
                    name="yearsInOperation"
                    value={formData.yearsInOperation}
                    onChange={handleInputChange}
                    className={styles.input}
                    min="0"
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="numberOfBranches" className={styles.label}>Number of Branches</label>
                  <input
                    type="number"
                    id="numberOfBranches"
                    name="numberOfBranches"
                    value={formData.numberOfBranches}
                    onChange={handleInputChange}
                    className={styles.input}
                    min="0"
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Amenities</label>
                <div className={styles.checkboxGrid}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="amenities.outdoorSeating"
                      checked={formData.amenities.outdoorSeating}
                      onChange={handleInputChange}
                      className={styles.checkbox}
                    />
                    Outdoor Seating
                  </label>

                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="amenities.liveMusic"
                      checked={formData.amenities.liveMusic}
                      onChange={handleInputChange}
                      className={styles.checkbox}
                    />
                    Live Music
                  </label>

                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="amenities.parkingAvailable"
                      checked={formData.amenities.parkingAvailable}
                      onChange={handleInputChange}
                      className={styles.checkbox}
                    />
                    Parking Available
                  </label>

                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="amenities.wifi"
                      checked={formData.amenities.wifi}
                      onChange={handleInputChange}
                      className={styles.checkbox}
                    />
                    WiFi
                  </label>

                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="amenities.familyAreaKidsFriendly"
                      checked={formData.amenities.familyAreaKidsFriendly}
                      onChange={handleInputChange}
                      className={styles.checkbox}
                    />
                    Family Area (Kids Friendly)
                  </label>

                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="amenities.wheelchairAccessible"
                      checked={formData.amenities.wheelchairAccessible}
                      onChange={handleInputChange}
                      className={styles.checkbox}
                    />
                    Wheelchair Accessible
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className={styles.buttonContainer}>
            {currentStep > 1 && (
              <button type="button" onClick={prevStep} className={styles.prevButton}>
                Previous
              </button>
            )}
            
            {currentStep < 3 ? (
              <button type="button" onClick={nextStep} className={styles.nextButton}>
                Next
              </button>
            ) : (
              <button
                type="submit"
                className={styles.submitButton}
                disabled={loading}
              >
                {loading ? 'Registering...' : 'Register Restaurant'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default RestaurantRegistrationForm;