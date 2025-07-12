'use client';

import React, { useState } from 'react';
import styles from './health.module.css';
import { useRouter } from 'next/navigation';

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

interface FieldErrors {
  [key: string]: string;
}

const DoctorRegistration: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
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

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const router = useRouter();

  // ✅ UPDATED VALIDATION FUNCTIONS to match your backend rules
  const validateFullName = (name: string): string => {
    if (!name.trim()) return "Full name is required";
    if (name.length < 2) return "Name must be at least 2 characters";
    if (name.length > 50) return "Name must be less than 50 characters";
    if (!/^[a-zA-Z\s.]+$/.test(name)) return "Name can only contain letters, spaces, and periods";
    return "";
  };

  const validateSpecialty = (specialty: string): string => {
    if (!specialty) return "Medical specialty is required";
    return "";
  };

  // ✅ UPDATED: Years of experience must be 1 or more
  const validateExperienceYears = (years: string): string => {
    if (!years) return "Years of experience is required";
    const numYears = parseInt(years);
    if (isNaN(numYears)) return "Please enter a valid number";
    if (numYears < 1) return "Years of experience must be 1 or more"; // ✅ Changed from 0 to 1
    if (numYears > 60) return "Please enter a valid number of years";
    return "";
  };

  // ✅ UPDATED: License number must be present (more strict)
  const validateLicenseNumber = (license: string): string => {
    if (!license.trim()) return "License number is required";
    // ✅ Simplified - just needs to be present
    return "";
  };

  const validateEmail = (email: string): string => {
    if (!email.trim()) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const validatePhone = (phone: string): string => {
    if (!phone.trim()) return "Phone number is required";
    // General phone number validation (allows various formats)
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanPhone = phone.replace(/[\s\-\(\)\.]/g, '');
    if (!phoneRegex.test(cleanPhone)) return "Please enter a valid phone number";
    if (cleanPhone.length < 10) return "Phone number must be at least 10 digits";
    return "";
  };

  // ✅ UPDATED: Address must be of your medical center (more specific)
  const validateAddress = (address: string): string => {
    if (!address.trim()) return "Address of your medical center is required";
    if (address.length < 10) return "Address must be at least 10 characters"; // ✅ Increased from 5 to 10
    if (address.length > 200) return "Address must be less than 200 characters"; // ✅ Increased from 100 to 200
    return "";
  };

  // ✅ UPDATED: City must be the city of your institution
  const validateCity = (city: string): string => {
    if (!city.trim()) return "City of your institution is required";
    if (city.length < 2) return "City must be at least 2 characters";
    if (city.length > 50) return "City must be less than 50 characters";
    if (!/^[a-zA-Z\s.]+$/.test(city)) return "City can only contain letters, spaces, and periods";
    return "";
  };

  const validateState = (state: string): string => {
    if (!state.trim()) return "State is required";
    if (state.length < 2) return "State must be at least 2 characters";
    if (state.length > 50) return "State must be less than 50 characters";
    if (!/^[a-zA-Z\s.]+$/.test(state)) return "State can only contain letters, spaces, and periods";
    return "";
  };

  const validateZipCode = (zipCode: string): string => {
    if (!zipCode.trim()) return "ZIP code is required";
    // Supports various ZIP code formats (US, UK, Canada, etc.)
    const zipRegex = /^[a-zA-Z0-9\s-]{3,10}$/;
    if (!zipRegex.test(zipCode)) return "Please enter a valid ZIP code";
    return "";
  };

  const validateMedicalSchool = (school: string): string => {
    if (!school.trim()) return "Medical school is required";
    if (school.length < 3) return "Medical school name must be at least 3 characters";
    if (school.length > 100) return "Medical school name must be less than 100 characters";
    return "";
  };

  const validateGraduationYear = (year: string): string => {
    if (!year) return "Graduation year is required";
    const numYear = parseInt(year);
    const currentYear = new Date().getFullYear();
    if (isNaN(numYear)) return "Please enter a valid year";
    if (numYear < 1950) return "Graduation year cannot be before 1950";
    if (numYear > currentYear) return "Graduation year cannot be in the future";
    if (numYear > currentYear - 3) return "Must have graduated at least 3 years ago to practice";
    return "";
  };

  // ✅ UPDATED: Certifications & Additional Qualifications must be mentioned
  const validateCertifications = (certifications: string): string => {
    if (!certifications.trim()) return "Certifications & Additional Qualifications must be mentioned";
    if (certifications.length < 10) return "Please provide details about your certifications (at least 10 characters)";
    if (certifications.length > 500) return "Certifications description must be less than 500 characters"; // ✅ Reduced from 1000 to 500
    return "";
  };

  const validateStep = (step: number): FieldErrors => {
    const errors: FieldErrors = {};
    
    switch (step) {
      case 1:
        errors.fullName = validateFullName(formData.fullName);
        errors.specialty = validateSpecialty(formData.specialty);
        errors.experienceYears = validateExperienceYears(formData.experienceYears);
        errors.licenseNumber = validateLicenseNumber(formData.licenseNumber);
        break;
      case 2:
        errors.email = validateEmail(formData.email);
        errors.phone = validatePhone(formData.phone);
        errors.address = validateAddress(formData.address);
        errors.city = validateCity(formData.city);
        errors.state = validateState(formData.state);
        errors.zipCode = validateZipCode(formData.zipCode);
        break;
      case 3:
        errors.medicalSchool = validateMedicalSchool(formData.medicalSchool);
        errors.graduationYear = validateGraduationYear(formData.graduationYear);
        errors.certifications = validateCertifications(formData.certifications);
        break;
    }
    
    // Remove empty errors
    Object.keys(errors).forEach(key => {
      if (!errors[key]) delete errors[key];
    });
    
    return errors;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNext = () => {
    const errors = validateStep(currentStep);
    setFieldErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
      setMessage('');
    } else {
      setMessage('Please fix the errors below before proceeding.');
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setMessage('');
    setFieldErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all steps
    const step1Errors = validateStep(1);
    const step2Errors = validateStep(2);
    const step3Errors = validateStep(3);
    const allErrors = { ...step1Errors, ...step2Errors, ...step3Errors };
    
    setFieldErrors(allErrors);
    
    if (Object.keys(allErrors).length > 0) {
      setMessage('Please fix all errors before submitting.');
      return;
    }
    
    setLoading(true);
    setMessage('');

    try {
      // ✅ UPDATED API endpoint to match your backend
      const response = await fetch('http://localhost:2000/api/addHelth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();

      if (response.ok) {
        setIsSuccess(true);
      } else {
        // ✅ UPDATED: Better backend error handling
        if (responseData.errors && Array.isArray(responseData.errors)) {
          const backendErrors: FieldErrors = {};
          responseData.errors.forEach((error: any) => {
            if (error.field) {
              backendErrors[error.field] = error.message;
            }
          });
          setFieldErrors(backendErrors);
          setMessage('Please fix the validation errors below.');
        } else {
          setMessage(`Error: ${responseData.message || 'Failed to register doctor'}`);
        }
      }
    } catch (error) {
      setMessage('Error: Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const redirectDashboard = () => {
    router.push('/Dashboard');
  }

  const resetForm = () => {
    setIsSuccess(false);
    setCurrentStep(1);
    setFieldErrors({});
    setMessage('');
    setFormData({
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
          <h1 className={styles.successTitle}>Doctor Successfully Registered!</h1>
          <p className={styles.successMessage}>
            Congratulations! <strong>Dr. {formData.fullName}</strong> has been successfully registered in our healthcare system.
          </p>
          <div className={styles.successDetails}>
            <p><strong>Name:</strong> Dr. {formData.fullName}</p>
            <p><strong>Specialty:</strong> {formData.specialty}</p>
            <p><strong>Email:</strong> {formData.email}</p>
            <p><strong>Experience:</strong> {formData.experienceYears} years</p>
            <p><strong>License:</strong> {formData.licenseNumber}</p>
          </div>
          <button onClick={resetForm} className={styles.newRegistrationButton}>
            Register Another Doctor
          </button>
      
          <button onClick={redirectDashboard} className={styles.newRegistrationButton}>
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

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
          className={`${styles.input} ${fieldErrors.fullName ? styles.inputError : ''}`}
          placeholder="Enter full name"
        />
        {fieldErrors.fullName && <p className={styles.fieldError}>{fieldErrors.fullName}</p>}
      </div>
      
      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="specialty">Medical Specialty *</label>
        <select
          id="specialty"
          name="specialty"
          value={formData.specialty}
          onChange={handleInputChange}
          className={`${styles.select} ${fieldErrors.specialty ? styles.inputError : ''}`}
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
          <option value="Gynecology">Gynecology</option>
          <option value="Oncology">Oncology</option>
          <option value="Radiology">Radiology</option>
          <option value="Anesthesiology">Anesthesiology</option>
        </select>
        {fieldErrors.specialty && <p className={styles.fieldError}>{fieldErrors.specialty}</p>}
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="experienceYears">Years of Experience * <span style={{fontSize: '0.8em', color: '#666'}}>(Must be 1 or more)</span></label>
          <input
            type="number"
            id="experienceYears"
            name="experienceYears"
            value={formData.experienceYears}
            onChange={handleInputChange}
            className={`${styles.input} ${fieldErrors.experienceYears ? styles.inputError : ''}`}
            min="1"
            max="60"
            placeholder="Enter years of experience"
          />
          {fieldErrors.experienceYears && <p className={styles.fieldError}>{fieldErrors.experienceYears}</p>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="licenseNumber">License Number * <span style={{fontSize: '0.8em', color: '#666'}}>(Required)</span></label>
          <input
            type="text"
            id="licenseNumber"
            name="licenseNumber"
            value={formData.licenseNumber}
            onChange={handleInputChange}
            className={`${styles.input} ${fieldErrors.licenseNumber ? styles.inputError : ''}`}
            placeholder="Enter medical license number"
          />
          {fieldErrors.licenseNumber && <p className={styles.fieldError}>{fieldErrors.licenseNumber}</p>}
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
          className={`${styles.input} ${fieldErrors.email ? styles.inputError : ''}`}
          placeholder="Enter email address"
        />
        {fieldErrors.email && <p className={styles.fieldError}>{fieldErrors.email}</p>}
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="phone">Phone Number *</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          className={`${styles.input} ${fieldErrors.phone ? styles.inputError : ''}`}
          placeholder="Enter phone number"
        />
        {fieldErrors.phone && <p className={styles.fieldError}>{fieldErrors.phone}</p>}
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="address">Address of Medical Center * <span style={{fontSize: '0.8em', color: '#666'}}>(10-200 characters)</span></label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          className={`${styles.input} ${fieldErrors.address ? styles.inputError : ''}`}
          placeholder="Enter full address of your medical center"
        />
        {fieldErrors.address && <p className={styles.fieldError}>{fieldErrors.address}</p>}
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="city">City of Institution *</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            className={`${styles.input} ${fieldErrors.city ? styles.inputError : ''}`}
            placeholder="Enter city of your institution"
          />
          {fieldErrors.city && <p className={styles.fieldError}>{fieldErrors.city}</p>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="state">State *</label>
          <input
            type="text"
            id="state"
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            className={`${styles.input} ${fieldErrors.state ? styles.inputError : ''}`}
            placeholder="Enter state"
          />
          {fieldErrors.state && <p className={styles.fieldError}>{fieldErrors.state}</p>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="zipCode">ZIP Code *</label>
          <input
            type="text"
            id="zipCode"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleInputChange}
            className={`${styles.input} ${fieldErrors.zipCode ? styles.inputError : ''}`}
            placeholder="Enter ZIP code"
          />
          {fieldErrors.zipCode && <p className={styles.fieldError}>{fieldErrors.zipCode}</p>}
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
          className={`${styles.input} ${fieldErrors.medicalSchool ? styles.inputError : ''}`}
          placeholder="Enter medical school name"
        />
        {fieldErrors.medicalSchool && <p className={styles.fieldError}>{fieldErrors.medicalSchool}</p>}
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="graduationYear">Graduation Year *</label>
        <input
          type="number"
          id="graduationYear"
          name="graduationYear"
          value={formData.graduationYear}
          onChange={handleInputChange}
          className={`${styles.input} ${fieldErrors.graduationYear ? styles.inputError : ''}`}
          min="1950"
          max="2025"
          placeholder="Enter graduation year"
        />
        {fieldErrors.graduationYear && <p className={styles.fieldError}>{fieldErrors.graduationYear}</p>}
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="certifications">
          Certifications & Additional Qualifications * <span style={{fontSize: '0.8em', color: '#666'}}>(Required - {formData.certifications.length}/500)</span>
        </label>
        <textarea
          id="certifications"
          name="certifications"
          value={formData.certifications}
          onChange={handleInputChange}
          className={`${styles.textarea} ${fieldErrors.certifications ? styles.inputError : ''}`}
          rows={4}
          placeholder="List any board certifications, fellowships, or additional qualifications... (Required)"
        />
        {fieldErrors.certifications && <p className={styles.fieldError}>{fieldErrors.certifications}</p>}
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

        {message && (
          <div className={`${styles.message} ${message.includes('Error') ? styles.error : styles.warning}`}>
            {message}
          </div>
        )}

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
                disabled={loading}
              >
                {loading ? 'Registering...' : 'Submit Registration'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorRegistration;