'use client';

import React, { useState } from 'react';

// Interface for the form data structure
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

// Interface for field validation errors
interface FieldErrors {
  [key: string]: string;
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
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  
  // REMOVED: useRouter as it's Next.js specific and causes compilation errors in other environments.
  // const router = useRouter();

  // Constants for form options
  const businessTypes = ['Dine-in', 'Takeaway', 'Delivery Only', 'Cloud Kitchen', 'Cafe/Bakery'];
  const cuisineOptions = ['Sri Lankan', 'Indian', 'Chinese', 'Italian', 'Continental', 'Fast Food', 'Street Food', 'BBQ/Grill', 'Seafood', 'Vegan/Vegetarian', 'Desserts/Bakery', 'Others'];
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Consolidated validation function
  const validate = (data: RestaurantFormData): FieldErrors => {
    const errors: FieldErrors = {};
    
    // Required fields validation
    if (!data.restaurantName.trim()) errors.restaurantName = "Restaurant name is required";
    if (!data.ownerFullName.trim()) errors.ownerFullName = "Owner name is required";
    if (!data.emailAddress.trim()) errors.emailAddress = "Email is required";
    if (!data.businessType) errors.businessType = "Business type is required";
    if (data.cuisineTypes.length === 0) errors.cuisineTypes = "At least one cuisine type is required";
    if (data.workingHours.daysOpen.length === 0) errors.workingDays = "At least one working day is required";
    if (!data.workingHours.openingTime) errors.openingTime = "Opening time is required";
    if (!data.workingHours.closingTime) errors.closingTime = "Closing time is required";

    // Sri Lankan phone validation helper
    const validateSriLankanPhone = (phone: string) => {
      const cleaned = phone.replace(/\D/g, '');
      return cleaned.length === 10 && /^0[1-9][0-9]{8}$/.test(cleaned);
    };

    if (!data.phoneNumber.trim()) {
      errors.phoneNumber = "Phone number is required";
    } else if (!validateSriLankanPhone(data.phoneNumber)) {
      errors.phoneNumber = "Enter a valid 10-digit Sri Lankan phone number (e.g., 07XXXXXXXX)";
    }

    // Alternate contact (optional but must be valid if provided)
    if (data.alternateContactNumber && !validateSriLankanPhone(data.alternateContactNumber)) {
      errors.alternateContactNumber = "Enter a valid 10-digit Sri Lankan phone number if provided";
    }

    // Email validation
    if (data.emailAddress && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.emailAddress)) {
      errors.emailAddress = "Enter a valid email address";
    }

    // Business registration (optional but must be valid if provided)
    if (data.businessRegistrationNumber) {
      const cleanReg = data.businessRegistrationNumber.trim().toUpperCase();
      if (!/^(PV|HS|SP|PQ)[0-9]+$|^[0-9]+$/.test(cleanReg)) {
        errors.businessRegistrationNumber = "Enter a valid Sri Lankan business registration (e.g., PV12345)";
      }
    }

    return errors;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: "" }));
    }
    
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      if (name.startsWith('amenities.')) {
        const key = name.split('.')[1] as keyof typeof formData.amenities;
        setFormData(prev => ({ ...prev, amenities: { ...prev.amenities, [key]: checkbox.checked } }));
      } else if (name.startsWith('workingHours.')) {
        const key = name.split('.')[1] as keyof typeof formData.workingHours;
        setFormData(prev => ({ ...prev, workingHours: { ...prev.workingHours, [key]: checkbox.checked } }));
      }
    } else if (name === 'yearsInOperation' || name === 'numberOfBranches') {
      setFormData(prev => ({ ...prev, [name]: value === '' ? '' : parseInt(value, 10) }));
    } else if (name.startsWith('workingHours.')) {
      const key = name.split('.')[1] as keyof typeof formData.workingHours;
      setFormData(prev => ({ ...prev, workingHours: { ...prev.workingHours, [key]: value } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleArrayChange = (arrayName: 'cuisineTypes' | 'daysOpen', value: string) => {
    const fieldName = arrayName === 'daysOpen' ? 'workingDays' : arrayName;
    if (fieldErrors[fieldName]) {
      setFieldErrors(prev => ({ ...prev, [fieldName]: "" }));
    }

    if (arrayName === 'daysOpen') {
      setFormData(prev => ({
        ...prev,
        workingHours: {
          ...prev.workingHours,
          daysOpen: prev.workingHours.daysOpen.includes(value)
            ? prev.workingHours.daysOpen.filter(d => d !== value)
            : [...prev.workingHours.daysOpen, value]
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        cuisineTypes: prev.cuisineTypes.includes(value)
          ? prev.cuisineTypes.filter(c => c !== value)
          : [...prev.cuisineTypes, value]
      }));
    }
  };

  const nextStep = () => {
    const errors = validate(formData);
    const stepFields: { [key: number]: string[] } = {
      1: ['restaurantName', 'ownerFullName', 'phoneNumber', 'emailAddress', 'alternateContactNumber', 'businessType'],
      2: ['cuisineTypes', 'workingDays', 'openingTime', 'closingTime'],
      3: ['businessRegistrationNumber']
    };
    
    const stepErrors = Object.keys(errors).filter(key => stepFields[currentStep].includes(key));
    
    if (stepErrors.length === 0) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
      setMessage('');
      setFieldErrors({});
    } else {
      const filteredErrors: FieldErrors = {};
      stepErrors.forEach(key => filteredErrors[key] = errors[key]);
      setFieldErrors(filteredErrors);
      setMessage('Please fix the errors below to continue.');
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setMessage('');
    setFieldErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validate(formData);
    
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setMessage('Please fix all errors before submitting.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:2000/api/addRestaurant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSuccess(true);
      } else {
        const data = await response.json();
        setMessage(`Error: ${data.message || 'Failed to register restaurant'}`);
      }
    } catch (error) {
      console.error("Submission error:", error);
      setMessage('Error: Failed to connect to the server. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setIsSuccess(false);
    setCurrentStep(1);
    setFieldErrors({});
    setMessage('');
    setFormData({
      restaurantName: '', ownerFullName: '', phoneNumber: '', emailAddress: '', alternateContactNumber: '',
      businessType: '', locationAddress: '', googleMapsLink: '', cuisineTypes: [],
      workingHours: { daysOpen: [], openingTime: '', closingTime: '', is24x7Available: false, closedOnHolidays: false },
      foodSafetyLicenseUrl: '', businessRegistrationNumber: '', yearsInOperation: '', numberOfBranches: '',
      amenities: { outdoorSeating: false, liveMusic: false, parkingAvailable: false, wifi: false, familyAreaKidsFriendly: false, wheelchairAccessible: false }
    });
  };

  // Success screen view
  if (isSuccess) {
    return (
      <div className="container">
        <div className="successWrapper">
          <div className="successIcon">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22,4 12,14.01 9,11.01"></polyline>
            </svg>
          </div>
          <h1 className="successTitle">Restaurant Successfully Registered!</h1>
          <p className="successMessage">
            Congratulations! <strong>{formData.restaurantName}</strong> has been registered.
          </p>
          <div className="successDetails">
            <p><strong>Owner:</strong> {formData.ownerFullName}</p>
            <p><strong>Type:</strong> {formData.businessType}</p>
            <p><strong>Email:</strong> {formData.emailAddress}</p>
          </div>
          <div className="successButtonContainer">
            <button onClick={resetForm} className="newRegistrationButton">Register Another</button>
            {/* FIXED: Replaced Next.js router with standard window.location for navigation */}
            <button onClick={() => window.location.href = '/Dashboard'} className="dashboardButton">Go to Dashboard</button>
          </div>
        </div>
      </div>
    );
  }

  // Helper function to render form fields
  const renderField = (name: string, label: string, type = 'text', required = false, options?: string[]) => (
    <div className="field">
      <label className="label">
        {label} {required && <span className="requiredAsterisk">*</span>} 
      </label>
      {type === 'select' ? (
        <select name={name} value={formData[name as keyof RestaurantFormData] as string} onChange={handleInputChange} 
                className={`select ${fieldErrors[name] ? 'inputError' : ''}`}>
          <option value="">Select {label}</option>
          {options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      ) : type === 'textarea' ? (
        <textarea name={name} value={formData[name as keyof RestaurantFormData] as string} onChange={handleInputChange}
                  className={`textarea ${fieldErrors[name] ? 'inputError' : ''}`} rows={3} />
      ) : (
        <input type={type} name={name} value={formData[name as keyof RestaurantFormData] as string} onChange={handleInputChange}
               className={`input ${fieldErrors[name] ? 'inputError' : ''}`} />
      )}
      {fieldErrors[name] && <p className="fieldError">{fieldErrors[name]}</p>}
    </div>
  );
  
  // Main form view
  return (
    <>
      {/* FIXED: Embedded CSS to resolve module import error */}
      <style>{`
        .container {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          background-color: #f4f7f9;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          padding: 2rem;
        }
        .formWrapper {
          background-color: #ffffff;
          padding: 2.5rem;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 800px;
        }
        .progressContainer {
          margin-bottom: 2rem;
        }
        .progressBar {
          background-color: #e0e0e0;
          border-radius: 5px;
          height: 10px;
        }
        .progressFill {
          background-color: #4a90e2;
          height: 100%;
          border-radius: 5px;
          transition: width 0.3s ease-in-out;
        }
        .stepIndicators {
          display: flex;
          justify-content: space-between;
          margin-top: 0.5rem;
        }
        .stepIndicator {
          display: flex;
          align-items: center;
          color: #a0a0a0;
        }
        .stepIndicator.active {
          color: #4a90e2;
          font-weight: bold;
        }
        .stepNumber {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background-color: #e0e0e0;
          color: #ffffff;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-right: 0.5rem;
        }
        .stepIndicator.active .stepNumber {
          background-color: #4a90e2;
        }
        .stepLabel {
          font-size: 0.9rem;
        }
        .title {
          font-size: 2rem;
          font-weight: bold;
          text-align: center;
          margin-bottom: 1rem;
          color: #333;
        }
        .stepTitle {
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
          color: #444;
          border-bottom: 2px solid #f0f0f0;
          padding-bottom: 0.5rem;
        }
        .message {
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          text-align: center;
        }
        .error {
          background-color: #fbe9e7;
          color: #c62828;
          border: 1px solid #ffab91;
        }
        .warning {
          background-color: #fff3e0;
          color: #f57c00;
          border: 1px solid #ffcc80;
        }
        .form {
          display: flex;
          flex-direction: column;
        }
        .step {
          animation: fadeIn 0.5s;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }
        .field {
          display: flex;
          flex-direction: column;
        }
        .label {
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #555;
        }
        .requiredAsterisk {
          color: #c62828;
        }
        .input, .select, .textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ccc;
          border-radius: 6px;
          font-size: 1rem;
          transition: border-color 0.2s;
        }
        .input:focus, .select:focus, .textarea:focus {
          outline: none;
          border-color: #4a90e2;
          box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
        }
        .inputError {
          border-color: #c62828;
        }
        .fieldError {
          color: #c62828;
          font-size: 0.875rem;
          margin-top: 0.25rem;
        }
        .checkboxGrid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 0.75rem;
          margin-top: 0.5rem;
        }
        .checkboxLabel {
          display: flex;
          align-items: center;
          cursor: pointer;
        }
        .checkbox {
          margin-right: 0.5rem;
        }
        .checkboxRow {
          display: flex;
          gap: 2rem;
          margin-top: 1rem;
        }
        .buttonContainer {
          display: flex;
          justify-content: space-between;
          margin-top: 2rem;
        }
        .prevButton, .nextButton, .submitButton {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 6px;
          font-size: 1rem;
          font-weight: bold;
          cursor: pointer;
          transition: background-color 0.2s, transform 0.1s;
        }
        .prevButton {
          background-color: #e0e0e0;
          color: #333;
        }
        .nextButton {
          background-color: #4a90e2;
          color: white;
        }
        .submitButton {
          background-color: #28a745;
          color: white;
        }
        .submitButton:disabled {
          background-color: #9e9e9e;
          cursor: not-allowed;
        }
        .prevButton:hover, .nextButton:hover, .submitButton:hover:not(:disabled) {
          transform: translateY(-2px);
        }
        .successWrapper {
          text-align: center;
          padding: 3rem;
          background-color: #ffffff;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
        .successIcon {
          color: #28a745;
          margin-bottom: 1rem;
        }
        .successTitle {
          font-size: 2rem;
          color: #333;
        }
        .successMessage {
          font-size: 1.1rem;
          color: #555;
          margin-top: 0.5rem;
        }
        .successDetails {
          margin-top: 1.5rem;
          padding: 1rem;
          background-color: #f9f9f9;
          border-radius: 8px;
          display: inline-block;
        }
        .successButtonContainer {
          margin-top: 2rem;
          display: flex;
          justify-content: center;
          gap: 1rem;
        }
        .newRegistrationButton, .dashboardButton {
          padding: 0.75rem 1.5rem;
          border-radius: 6px;
          font-size: 1rem;
          font-weight: bold;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .newRegistrationButton {
          background-color: #4a90e2;
          color: white;
          border: 1px solid #4a90e2;
        }
        .dashboardButton {
          background-color: #f0f0f0;
          color: #333;
          border: 1px solid #ccc;
        }
      `}</style>
      <div className="container">
        <div className="formWrapper">
          <div className="progressContainer">
            <div className="progressBar">
              <div className="progressFill" style={{ width: `${((currentStep - 1) / 2) * 100}%` }}></div>
            </div>
            <div className="stepIndicators">
              {[1, 2, 3].map(step => (
                <div key={step} className={`stepIndicator ${currentStep >= step ? 'active' : ''}`}>
                  <div className="stepNumber">{step}</div>
                  <div className="stepLabel">
                    {step === 1 ? 'Basic Info' : step === 2 ? 'Business Details' : 'Additional Info'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <h1 className="title">Restaurant Registration</h1>
          
          {message && <div className={`message ${message.includes('Error') ? 'error' : 'warning'}`}>{message}</div>}

          <form className="form" noValidate>
            {currentStep === 1 && (
              <div className="step">
                <h2 className="stepTitle">Step 1: Basic Information</h2>
                <div className="row">
                  {renderField('restaurantName', 'Restaurant Name', 'text', true)}
                  {renderField('ownerFullName', 'Owner Full Name', 'text', true)}
                </div>
                <div className="row">
                  {renderField('phoneNumber', 'Phone Number', 'tel', true)}
                  {renderField('emailAddress', 'Email Address', 'email', true)}
                </div>
                <div className="row">
                  {renderField('alternateContactNumber', 'Alternate Contact', 'tel')}
                  {renderField('businessType', 'Business Type', 'select', true, businessTypes)}
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="step">
                <h2 className="stepTitle">Step 2: Business Details</h2>
                {renderField('locationAddress', 'Location Address (Optional)', 'textarea')}
                {renderField('googleMapsLink', 'Google Maps Link (Optional)', 'url')}
                
                <div className="field">
                  <label className="label">Cuisine Types <span className="requiredAsterisk">*</span></label>
                  <div className="checkboxGrid">
                    {cuisineOptions.map(cuisine => (
                      <label key={cuisine} className="checkboxLabel">
                        <input type="checkbox" checked={formData.cuisineTypes.includes(cuisine)} 
                               onChange={() => handleArrayChange('cuisineTypes', cuisine)} className="checkbox" />
                        {cuisine}
                      </label>
                    ))}
                  </div>
                  {fieldErrors.cuisineTypes && <p className="fieldError">{fieldErrors.cuisineTypes}</p>}
                </div>

                <div className="field">
                  <label className="label">Working Days <span className="requiredAsterisk">*</span></label>
                  <div className="checkboxGrid">
                    {daysOfWeek.map(day => (
                      <label key={day} className="checkboxLabel">
                        <input type="checkbox" checked={formData.workingHours.daysOpen.includes(day)}
                               onChange={() => handleArrayChange('daysOpen', day)} className="checkbox" />
                        {day}
                      </label>
                    ))}
                  </div>
                  {fieldErrors.workingDays && <p className="fieldError">{fieldErrors.workingDays}</p>}
                </div>

                <div className="row">
                  <div className="field">
                    <label className="label">Opening Time <span className="requiredAsterisk">*</span></label>
                    <input type="time" name="workingHours.openingTime" value={formData.workingHours.openingTime} 
                           onChange={handleInputChange} className={`input ${fieldErrors.openingTime ? 'inputError' : ''}`} />
                    {fieldErrors.openingTime && <p className="fieldError">{fieldErrors.openingTime}</p>}
                  </div>
                  <div className="field">
                    <label className="label">Closing Time <span className="requiredAsterisk">*</span></label>
                    <input type="time" name="workingHours.closingTime" value={formData.workingHours.closingTime}
                           onChange={handleInputChange} className={`input ${fieldErrors.closingTime ? 'inputError' : ''}`} />
                    {fieldErrors.closingTime && <p className="fieldError">{fieldErrors.closingTime}</p>}
                  </div>
                </div>

                <div className="checkboxRow">
                  <label className="checkboxLabel">
                    <input type="checkbox" name="workingHours.is24x7Available" checked={formData.workingHours.is24x7Available}
                           onChange={handleInputChange} className="checkbox" />
                    24x7 Available
                  </label>
                  <label className="checkboxLabel">
                    <input type="checkbox" name="workingHours.closedOnHolidays" checked={formData.workingHours.closedOnHolidays}
                           onChange={handleInputChange} className="checkbox" />
                    Closed on Holidays
                  </label>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="step">
                <h2 className="stepTitle">Step 3: Additional Information</h2>
                <div className="row">
                  {renderField('businessRegistrationNumber', 'Business Registration Number (Optional)')}
                  {renderField('foodSafetyLicenseUrl', 'Food Safety License URL (Optional)', 'url')}
                </div>
                <div className="row">
                  {renderField('yearsInOperation', 'Years in Operation (Optional)', 'number')}
                  {renderField('numberOfBranches', 'Number of Branches (Optional)', 'number')}
                </div>

                <div className="field">
                  <label className="label">Amenities (Optional)</label>
                  <div className="checkboxGrid">
                    {Object.entries(formData.amenities).map(([key, value]) => (
                      <label key={key} className="checkboxLabel">
                        <input type="checkbox" name={`amenities.${key}`} checked={value} onChange={handleInputChange} className="checkbox" />
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="buttonContainer">
              {currentStep > 1 && <button type="button" onClick={prevStep} className="prevButton">Previous</button>}
              {currentStep < 3 ? (
                <button type="button" onClick={nextStep} className="nextButton">Next</button>
              ) : (
                <button type="submit" className="submitButton" disabled={loading} onClick={handleSubmit}>
                  {loading ? 'Registering...' : 'Register Restaurant'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default RestaurantRegistrationForm;
