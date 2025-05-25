'use client';

import React, { useState } from 'react';
import styles from './helth.module.css';

interface DoctorFormData {
  fullName: string;
  specialty: string;
  experienceYears: string;
  licenseNumber: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  medicalSchool: string;
  graduationYear: string;
  certifications: string;
}

const DoctorRegistration: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<DoctorFormData>({
    fullName: '',
    specialty: '',
    experienceYears: '',
    licenseNumber: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    medicalSchool: '',
    graduationYear: '',
    certifications: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
    // Handle form submission logic here
    alert('Registration submitted successfully!');
  };

  const renderStep1 = () => (
    <div className={styles.stepContent}>
      <h2 className={styles.stepTitle}>Personal Information</h2>
      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="fullName">Full Name *</label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleInputChange}
          className={styles.input}
          required
        />
      </div>
      
      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="specialty">Medical Specialty *</label>
        <select
          id="specialty"
          name="specialty"
          value={formData.specialty}
          onChange={handleInputChange}
          className={styles.select}
          required
        >
          <option value="">Select Specialty</option>
          <option value="Cardiology">Cardiology</option>
          <option value="Dermatology">Dermatology</option>
          <option value="Emergency Medicine">Emergency Medicine</option>
          <option value="Family Medicine">Family Medicine</option>
          <option value="Internal Medicine">Internal Medicine</option>
          <option value="Neurology">Neurology</option>
          <option value="Orthopedics">Orthopedics</option>
          <option value="Pediatrics">Pediatrics</option>
          <option value="Psychiatry">Psychiatry</option>
          <option value="Surgery">Surgery</option>
        </select>
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="experienceYears">Years of Experience *</label>
          <input
            type="number"
            id="experienceYears"
            name="experienceYears"
            value={formData.experienceYears}
            onChange={handleInputChange}
            className={styles.input}
            min="0"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="licenseNumber">License Number *</label>
          <input
            type="text"
            id="licenseNumber"
            name="licenseNumber"
            value={formData.licenseNumber}
            onChange={handleInputChange}
            className={styles.input}
            required
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className={styles.stepContent}>
      <h2 className={styles.stepTitle}>Contact Information</h2>
      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="email">Email Address *</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className={styles.input}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="phone">Phone Number *</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          className={styles.input}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="address">Address *</label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          className={styles.input}
          required
        />
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="city">City *</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="state">State *</label>
          <input
            type="text"
            id="state"
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="zipCode">ZIP Code *</label>
          <input
            type="text"
            id="zipCode"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleInputChange}
            className={styles.input}
            required
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className={styles.stepContent}>
      <h2 className={styles.stepTitle}>Professional Information</h2>
      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="medicalSchool">Medical School *</label>
        <input
          type="text"
          id="medicalSchool"
          name="medicalSchool"
          value={formData.medicalSchool}
          onChange={handleInputChange}
          className={styles.input}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="graduationYear">Graduation Year *</label>
        <input
          type="number"
          id="graduationYear"
          name="graduationYear"
          value={formData.graduationYear}
          onChange={handleInputChange}
          className={styles.input}
          min="1950"
          max="2025"
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="certifications">Certifications & Additional Qualifications</label>
        <textarea
          id="certifications"
          name="certifications"
          value={formData.certifications}
          onChange={handleInputChange}
          className={styles.textarea}
          rows={4}
          placeholder="List any board certifications, fellowships, or additional qualifications..."
        />
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <h1 className={styles.title}>Doctor Registration</h1>
        
        <div className={styles.progressContainer}>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill} 
              style={{ width: `${(currentStep / 3) * 100}%` }}
            ></div>
          </div>
          <div className={styles.stepIndicators}>
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`${styles.stepIndicator} ${
                  currentStep >= step ? styles.active : ''
                }`}
              >
                <div className={styles.stepNumber}>{step}</div>
                <div className={styles.stepLabel}>
                  {step === 1 ? 'Personal' : step === 2 ? 'Contact' : 'Professional'}
                </div>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.step}>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
          </div>

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

export default DoctorRegistration;