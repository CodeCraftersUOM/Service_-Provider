"use client";

import React, { useState } from 'react';
import styles from './taxi.module.css';
interface FormData {
  // Personal Information
  fullName: string;
  cnic: string;
  contactNumber: string;
  emailAddress: string;
  alternatePhone: string;
  profilePhotoUrl: string;
  
  // License & Experience
  drivingLicenseNumber: string;
  licenseExpiryDate: string;
  drivingLicenseUpload: string;
  yearsOfExperience: number;
  
  // Vehicle & Service Information
  vehicleMakeModel: string;
  vehicleType: string;
  vehicleRegistrationNumber: string;
  seatingCapacity: number;
  hasAirConditioning: boolean;
  hasLuggageSpace: boolean;
  vehicleImages: string[];
  serviceCity: string;
  availableDays: string[];
  availableTimeSlot: string;
  is24x7Available: boolean;
  vehicleRegistrationDocument: string;
  insuranceDocument: string;
}

const TaxiDriverRegistration: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    cnic: '',
    contactNumber: '',
    emailAddress: '',
    alternatePhone: '',
    profilePhotoUrl: '',
    drivingLicenseNumber: '',
    licenseExpiryDate: '',
    drivingLicenseUpload: '',
    yearsOfExperience: 0,
    vehicleMakeModel: '',
    vehicleType: '',
    vehicleRegistrationNumber: '',
    seatingCapacity: 0,
    hasAirConditioning: false,
    hasLuggageSpace: false,
    vehicleImages: [],
    serviceCity: '',
    availableDays: [],
    availableTimeSlot: '',
    is24x7Available: false,
    vehicleRegistrationDocument: '',
    insuranceDocument: ''
  });

  const vehicleTypes = ['Sedan', 'Mini', 'SUV', 'Van', 'Rickshaw', 'Luxury'];
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: checkbox.checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleDaysChange = (day: string) => {
    setFormData(prev => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter(d => d !== day)
        : [...prev.availableDays, day]
    }));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission here
  };

  const renderStepIndicator = () => (
    <div className={styles.stepIndicator}>
      {[1, 2, 3].map((step) => (
        <div key={step} className={styles.stepIndicatorItem}>
          <div className={`${styles.stepNumber} ${currentStep >= step ? styles.stepActive : ''}`}>
            {step}
          </div>
          <span className={styles.stepLabel}>
            {step === 1 ? 'Personal Info' : step === 2 ? 'Vehicle & License' : 'Service Details'}
          </span>
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className={styles.stepContent}>
      <h2 className={styles.stepTitle}>Personal Information</h2>
      
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Full Name *</label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleInputChange}
          className={styles.formInput}
          required
        />
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>CNIC *</label>
          <input
            type="text"
            name="cnic"
            value={formData.cnic}
            onChange={handleInputChange}
            className={styles.formInput}
            placeholder="00000-0000000-0"
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Contact Number *</label>
          <input
            type="tel"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleInputChange}
            className={styles.formInput}
            required
          />
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Email Address *</label>
        <input
          type="email"
          name="emailAddress"
          value={formData.emailAddress}
          onChange={handleInputChange}
          className={styles.formInput}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Alternate Phone</label>
        <input
          type="tel"
          name="alternatePhone"
          value={formData.alternatePhone}
          onChange={handleInputChange}
          className={styles.formInput}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Profile Photo</label>
        <input
          type="file"
          name="profilePhotoUrl"
          onChange={handleInputChange}
          className={styles.fileInput}
          accept="image/*"
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className={styles.stepContent}>
      <h2 className={styles.stepTitle}>Vehicle & License Information</h2>
      
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Driving License Number *</label>
          <input
            type="text"
            name="drivingLicenseNumber"
            value={formData.drivingLicenseNumber}
            onChange={handleInputChange}
            className={styles.formInput}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>License Expiry Date</label>
          <input
            type="date"
            name="licenseExpiryDate"
            value={formData.licenseExpiryDate}
            onChange={handleInputChange}
            className={styles.formInput}
          />
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Driving License Upload</label>
        <input
          type="file"
          name="drivingLicenseUpload"
          onChange={handleInputChange}
          className={styles.fileInput}
          accept="image/*,.pdf"
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Years of Experience</label>
        <input
          type="number"
          name="yearsOfExperience"
          value={formData.yearsOfExperience}
          onChange={handleInputChange}
          className={styles.formInput}
          min="0"
        />
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Vehicle Make & Model *</label>
          <input
            type="text"
            name="vehicleMakeModel"
            value={formData.vehicleMakeModel}
            onChange={handleInputChange}
            className={styles.formInput}
            placeholder="e.g., Toyota Corolla"
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Vehicle Type *</label>
          <select
            name="vehicleType"
            value={formData.vehicleType}
            onChange={handleInputChange}
            className={styles.formSelect}
            required
          >
            <option value="">Select Vehicle Type</option>
            {vehicleTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Vehicle Registration Number *</label>
          <input
            type="text"
            name="vehicleRegistrationNumber"
            value={formData.vehicleRegistrationNumber}
            onChange={handleInputChange}
            className={styles.formInput}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Seating Capacity *</label>
          <input
            type="number"
            name="seatingCapacity"
            value={formData.seatingCapacity}
            onChange={handleInputChange}
            className={styles.formInput}
            min="1"
            required
          />
        </div>
      </div>

      <div className={styles.checkboxRow}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            name="hasAirConditioning"
            checked={formData.hasAirConditioning}
            onChange={handleInputChange}
            className={styles.checkbox}
          />
          Air Conditioning Available
        </label>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            name="hasLuggageSpace"
            checked={formData.hasLuggageSpace}
            onChange={handleInputChange}
            className={styles.checkbox}
          />
          Luggage Space Available
        </label>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Vehicle Images</label>
        <input
          type="file"
          name="vehicleImages"
          onChange={handleInputChange}
          className={styles.fileInput}
          accept="image/*"
          multiple
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className={styles.stepContent}>
      <h2 className={styles.stepTitle}>Service Details</h2>
      
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Service City *</label>
        <input
          type="text"
          name="serviceCity"
          value={formData.serviceCity}
          onChange={handleInputChange}
          className={styles.formInput}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Available Days *</label>
        <div className={styles.daysGrid}>
          {daysOfWeek.map((day) => (
            <label key={day} className={styles.dayLabel}>
              <input
                type="checkbox"
                checked={formData.availableDays.includes(day)}
                onChange={() => handleDaysChange(day)}
                className={styles.checkbox}
              />
              {day}
            </label>
          ))}
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Available Time Slot *</label>
        <input
          type="text"
          name="availableTimeSlot"
          value={formData.availableTimeSlot}
          onChange={handleInputChange}
          className={styles.formInput}
          placeholder="e.g., 9:00 AM - 6:00 PM"
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            name="is24x7Available"
            checked={formData.is24x7Available}
            onChange={handleInputChange}
            className={styles.checkbox}
          />
          Available 24/7
        </label>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Vehicle Registration Document</label>
        <input
          type="file"
          name="vehicleRegistrationDocument"
          onChange={handleInputChange}
          className={styles.fileInput}
          accept="image/*,.pdf"
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Insurance Document</label>
        <input
          type="file"
          name="insuranceDocument"
          onChange={handleInputChange}
          className={styles.fileInput}
          accept="image/*,.pdf"
        />
      </div>
    </div>
  );

  return (
    <div className={styles.registrationContainer}>
      <div className={styles.registrationCard}>
        <div className={styles.header}>
          <h1 className={styles.title}>Taxi Driver Registration</h1>
          <p className={styles.subtitle}>Join our platform and start earning today</p>
        </div>

        {renderStepIndicator()}

        <form onSubmit={handleSubmit} className={styles.form}>
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}

          <div className={styles.buttonGroup}>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handlePrevious}
                className={styles.buttonSecondary}
              >
                Previous
              </button>
            )}
            
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className={styles.buttonPrimary}
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className={styles.buttonPrimary}
              >
                Submit Registration
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaxiDriverRegistration;