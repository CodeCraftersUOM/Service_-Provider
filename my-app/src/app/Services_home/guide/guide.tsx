'use client';

import React, { useState } from 'react';
import styles from './guide.module.css';
import { useRouter } from 'next/navigation';

interface GuideFormData {
  name: string;
  gender: string;
  dob: string;
  nic: string;
  contact: string;
  email: string;
  coveredLocations: string[];
  availability: string[];
  languages: string[];
  experiences: string;
  description: string;
}

const GuideRegistrationForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState<GuideFormData>({
    name: '',
    gender: '',
    dob: '',
    nic: '',
    contact: '',
    email: '',
    coveredLocations: [],
    availability: [],
    languages: [],
    experiences: '',
    description: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const locations = [
    'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
    'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
    'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
    'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla',
    'Monaragala', 'Ratnapura', 'Kegalle'
  ];

  const availabilityOptions = ['Weekdays', 'Weekends', 'Both', 'Flexible'];

  const languageOptions = [
    'English', 'Sinhala', 'Tamil', 'Japanese', 'German', 'French', 'Spanish', 'Chinese'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayChange = (arrayName: keyof Pick<GuideFormData, 'coveredLocations' | 'availability' | 'languages'>, value: string) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].includes(value)
        ? prev[arrayName].filter(item => item !== value)
        : [...prev[arrayName], value]
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.name && formData.gender && formData.dob && formData.nic && formData.contact && formData.email);
      case 2:
        return !!(formData.languages.length > 0 && formData.availability.length > 0 && formData.coveredLocations.length > 0);
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
      const response = await fetch('http://localhost:2000/api/addGuide', {
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
        setMessage(`Error: ${errorData.message || 'Failed to register guide'}`);
      }
    } catch (error) {
      setMessage('Error: Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };
const redirectDashboard=()=>{
    router.push('/Dashboard');
  }
  const resetForm = () => {
    setIsSuccess(false);
    setCurrentStep(1);
    setFormData({
      name: '',
      gender: '',
      dob: '',
      nic: '',
      contact: '',
      email: '',
      coveredLocations: [],
      availability: [],
      languages: [],
      experiences: '',
      description: '',
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
          <h1 className={styles.successTitle}>Guide Successfully Registered!</h1>
          <p className={styles.successMessage}>
            Congratulations! <strong>{formData.name}</strong> has been successfully registered as a tour guide in our system.
          </p>
          <div className={styles.successDetails}>
            <p><strong>Name:</strong> {formData.name}</p>
            <p><strong>Languages:</strong> {formData.languages.join(', ')}</p>
            <p><strong>Email:</strong> {formData.email}</p>
            <p><strong>Locations:</strong> {formData.coveredLocations.length} areas covered</p>
          </div>
          <button onClick={resetForm} className={styles.newRegistrationButton}>
            Register Another Guide
          </button>
      
          <button onClick={redirectDashboard} className={styles.newRegistrationButton}>
            Go to Dashboard
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
                  {step === 1 && 'Personal Info'}
                  {step === 2 && 'Skills & Coverage'}
                  {step === 3 && 'Experience'}
                </div>
              </div>
            ))}
          </div>
        </div>

        <h1 className={styles.title}>Guide Registration</h1>
        
        {message && (
          <div className={`${styles.message} ${message.includes('Error') ? styles.error : styles.warning}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className={styles.step}>
              <h2 className={styles.stepTitle}>Step 1: Personal Information</h2>
              
              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor="name" className={styles.label}>Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="gender" className={styles.label}>Gender *</label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className={styles.select}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor="dob" className={styles.label}>Date of Birth *</label>
                  <input
                    type="date"
                    id="dob"
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                    className={styles.input}
                    required
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="nic" className={styles.label}>National ID Number *</label>
                  <input
                    type="text"
                    id="nic"
                    name="nic"
                    value={formData.nic}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="Enter your NIC number"
                    required
                  />
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor="contact" className={styles.label}>Contact Number *</label>
                  <input
                    type="tel"
                    id="contact"
                    name="contact"
                    value={formData.contact}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="Enter your contact number"
                    required
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="email" className={styles.label}>Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="Enter your email address"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Skills & Coverage */}
          {currentStep === 2 && (
            <div className={styles.step}>
              <h2 className={styles.stepTitle}>Step 2: Skills & Coverage</h2>
              
              <div className={styles.field}>
                <label className={styles.label}>Languages *</label>
                <div className={styles.checkboxGrid}>
                  {languageOptions.map(language => (
                    <label key={language} className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={formData.languages.includes(language)}
                        onChange={() => handleArrayChange('languages', language)}
                        className={styles.checkbox}
                      />
                      {language}
                    </label>
                  ))}
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Availability *</label>
                <div className={styles.checkboxRow}>
                  {availabilityOptions.map(option => (
                    <label key={option} className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={formData.availability.includes(option)}
                        onChange={() => handleArrayChange('availability', option)}
                        className={styles.checkbox}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Covered Locations *</label>
                <div className={styles.checkboxGrid}>
                  {locations.map(location => (
                    <label key={location} className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={formData.coveredLocations.includes(location)}
                        onChange={() => handleArrayChange('coveredLocations', location)}
                        className={styles.checkbox}
                      />
                      {location}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Experience */}
          {currentStep === 3 && (
            <div className={styles.step}>
              <h2 className={styles.stepTitle}>Step 3: Experience & About You</h2>
              
              <div className={styles.field}>
                <label htmlFor="experiences" className={styles.label}>Professional Experience</label>
                <textarea
                  id="experiences"
                  name="experiences"
                  value={formData.experiences}
                  onChange={handleInputChange}
                  className={styles.textarea}
                  rows={5}
                  placeholder="Describe your professional experience, certifications, and qualifications as a tour guide"
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="description" className={styles.label}>About You</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className={styles.textarea}
                  rows={5}
                  placeholder="Tell us about yourself, your guiding style, and what travelers can expect when touring with you"
                />
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
                {loading ? 'Registering...' : 'Register Guide'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default GuideRegistrationForm;