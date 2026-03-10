'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Add this import for navigation
import styles from './accommodation.module.css';

interface FormData {
  accommodationName: string;
  ownerFullName: string;
  phoneNumber: string;
  emailAddress: string;
  alternateContactNumber: string;
  propertyType: string;
  locationAddress: string;
  googleMapsLink: string;
  propertyDescription: string;
  starRating: number | '';
  checkInTime: string;
  checkOutTime: string;
  availability: {
    daysOpen: string[];
    is24x7Reception: boolean;
    closedOnHolidays: boolean;
  };
  tourismLicenseNumber: string;
  businessRegistrationNumber: string;
  yearsInOperation: number | '';
  numberOfRooms: number | '';
  maxGuests: number | '';
  minPricePerNight: number | '';
  maxPricePerNight: number | '';
  amenities: {
    pool: boolean;
    gym: boolean;
    spa: boolean;
    restaurantOnSite: boolean;
    barLounge: boolean;
    roomService: boolean;
    laundryService: boolean;
    conciergeService: boolean;
    airportTransfer: boolean;
    petFriendly: boolean;
    eventFacilities: boolean;
    parkingAvailable: boolean;
    wifi: boolean;
    familyAreaKidsFriendly: boolean;
    wheelchairAccessible: boolean;
  };
}

const AccommodationForm: React.FC = () => {
  const router = useRouter(); // Add router hook
  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(false);
  const [data, setData] = useState<FormData>({
    accommodationName: '', ownerFullName: '', phoneNumber: '', emailAddress: '', alternateContactNumber: '',
    propertyType: '', locationAddress: '', googleMapsLink: '', propertyDescription: '', starRating: '',
    checkInTime: '', checkOutTime: '',
    availability: { daysOpen: [], is24x7Reception: false, closedOnHolidays: false },
    tourismLicenseNumber: '', businessRegistrationNumber: '', yearsInOperation: '',
    numberOfRooms: '', maxGuests: '', minPricePerNight: '', maxPricePerNight: '',
    amenities: {
      pool: false, gym: false, spa: false, restaurantOnSite: false, barLounge: false,
      roomService: false, laundryService: false, conciergeService: false, airportTransfer: false,
      petFriendly: false, eventFacilities: false, parkingAvailable: false, wifi: false,
      familyAreaKidsFriendly: false, wheelchairAccessible: false
    }
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const accommodationTypes = [
    'Hotel', 'Guest House', 'Villa', 'Apartment', 'Homestay', 'Resort',
    'Boutique Hotel', 'Motel', 'Bed and Breakfast', 'Other'
  ];
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Add navigation function
  const goToDashboard = () => {
  router.push('/Dashboard'); // Change this to your dashboard route
  };

  // ✅ CONSOLIDATED VALIDATION with same patterns
  const validate = () => {
    const e: {[key: string]: string} = {};
    
    // Required fields
    if (!data.accommodationName.trim()) e.accommodationName = "Accommodation name required";
    if (!data.ownerFullName.trim()) e.ownerFullName = "Owner name required";
    if (!data.emailAddress.trim()) e.emailAddress = "Email required";
    if (!data.propertyType) e.propertyType = "Property type required";
    if (!data.locationAddress.trim()) e.locationAddress = "Location address required";
    if (!data.propertyDescription.trim()) e.propertyDescription = "Property description required";
    if (!data.checkInTime) e.checkInTime = "Check-in time required";
    if (!data.checkOutTime) e.checkOutTime = "Check-out time required";
    if (data.numberOfRooms === '') e.numberOfRooms = "Number of rooms required";
    if (data.maxGuests === '') e.maxGuests = "Max guests required";
    if (data.minPricePerNight === '') e.minPricePerNight = "Min price required";
    if (data.maxPricePerNight === '') e.maxPricePerNight = "Max price required";

    // ✅ Phone validation (10 digits, specific patterns)
    const validatePhone = (phone: string) => {
      const cleaned = phone.replace(/\D/g, '');
      return cleaned.length === 10 && /^(07[0-9]{8}|0[1-9][0-9]{8})$/.test(cleaned);
    };

    if (!data.phoneNumber.trim()) {
      e.phoneNumber = "Phone number required";
    } else if (!validatePhone(data.phoneNumber)) {
      e.phoneNumber = "Invalid phone number (07XXXXXXXX for mobile, 0XXXXXXXXX for landline)";
    }

    // Alternate phone validation (optional but must be valid if provided)
    if (data.alternateContactNumber.trim() && !validatePhone(data.alternateContactNumber)) {
      e.alternateContactNumber = "Invalid alternate contact number";
    }

    // Email validation
    if (data.emailAddress && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.emailAddress)) {
      e.emailAddress = "Invalid email format";
    }

    // ✅ Google Maps link validation (must be Google Maps URL)
    if (data.googleMapsLink.trim()) {
      try {
        const url = new URL(data.googleMapsLink);
        const validDomains = ['maps.google.com', 'maps.google.', 'goo.gl', 'maps.app.goo.gl'];
        if (!validDomains.some(domain => url.hostname.includes(domain) || url.href.includes('maps.google'))) {
          e.googleMapsLink = "Must be a valid Google Maps link";
        }
      } catch {
        e.googleMapsLink = "Invalid Google Maps URL format";
      }
    }

    // ✅ Business registration validation (optional)
    if (data.businessRegistrationNumber.trim()) {
      const reg = data.businessRegistrationNumber.trim().toUpperCase();
      if (!/^(PV|HS|SP|PQ)[0-9]+$|^[0-9]+$/.test(reg)) {
        e.businessRegistrationNumber = "Invalid business registration format (PV12345, HS12345, SP12345, PQ12345, or numeric)";
      }
    }

    // Numeric validations
    if (data.starRating !== '' && (isNaN(+data.starRating) || +data.starRating < 0 || +data.starRating > 5)) {
      e.starRating = "Star rating: 0-5";
    }

    if (data.yearsInOperation !== '' && (isNaN(+data.yearsInOperation) || +data.yearsInOperation < 0)) {
      e.yearsInOperation = "Invalid years in operation";
    }

    if (data.numberOfRooms !== '' && (isNaN(+data.numberOfRooms) || +data.numberOfRooms < 1)) {
      e.numberOfRooms = "Number of rooms must be at least 1";
    }

    if (data.maxGuests !== '' && (isNaN(+data.maxGuests) || +data.maxGuests < 1)) {
      e.maxGuests = "Max guests must be at least 1";
    }

    if (data.minPricePerNight !== '' && (isNaN(+data.minPricePerNight) || +data.minPricePerNight < 0)) {
      e.minPricePerNight = "Min price must be 0 or more";
    }

    if (data.maxPricePerNight !== '' && (isNaN(+data.maxPricePerNight) || +data.maxPricePerNight < 0)) {
      e.maxPricePerNight = "Max price must be 0 or more";
    }

    if (data.minPricePerNight !== '' && data.maxPricePerNight !== '' && 
        +data.minPricePerNight > +data.maxPricePerNight) {
      e.maxPricePerNight = "Max price must be greater than min price";
    }

    // Time validation
    if (data.checkInTime && data.checkOutTime && data.checkInTime >= data.checkOutTime) {
      e.checkOutTime = "Check-out time must be after check-in time";
    }

    return e;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));

    if (type === 'checkbox') {
      if (name.startsWith('amenities.')) {
        const amenityKey = name.split('.')[1] as keyof typeof data.amenities;
        setData(prev => ({ ...prev, amenities: { ...prev.amenities, [amenityKey]: checked } }));
      } else if (name.startsWith('availability.')) {
        const key = name.split('.')[1] as keyof typeof data.availability;
        setData(prev => ({ ...prev, availability: { ...prev.availability, [key]: checked } }));
      }
    } else if (['starRating', 'yearsInOperation', 'numberOfRooms', 'maxGuests', 'minPricePerNight', 'maxPricePerNight'].includes(name)) {
      setData(prev => ({ ...prev, [name]: value === '' ? '' : parseFloat(value) }));
    } else {
      setData(prev => ({ ...prev, [name]: value }));
    }
  };

  const toggleDay = (day: string) => {
    setData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        daysOpen: prev.availability.daysOpen.includes(day)
          ? prev.availability.daysOpen.filter(d => d !== day)
          : [...prev.availability.daysOpen, day]
      }
    }));
  };

  const next = () => {
    const stepErrors = validate();
    const stepFields = {
      1: ['accommodationName', 'ownerFullName', 'phoneNumber', 'emailAddress', 'propertyType'], // Removed alternateContactNumber - it's optional
      2: ['locationAddress', 'propertyDescription', 'checkInTime', 'checkOutTime'] // Removed googleMapsLink and starRating - they're optional
    };
    
    const currentErrors = Object.keys(stepErrors).filter(key => 
      stepFields[step as keyof typeof stepFields]?.includes(key)
    );
    
    if (currentErrors.length === 0) {
      setStep(prev => Math.min(prev + 1, 3));
      setMessage('');
    } else {
      const filtered: {[key: string]: string} = {};
      currentErrors.forEach(key => filtered[key] = stepErrors[key]);
      setErrors(filtered);
      
      // Show which specific fields are missing
      const missingFields = currentErrors.map(key => {
        const fieldNames: {[key: string]: string} = {
          accommodationName: 'Accommodation Name',
          ownerFullName: 'Owner Full Name',
          phoneNumber: 'Phone Number',
          emailAddress: 'Email Address',
          propertyType: 'Property Type',
          locationAddress: 'Location Address',
          propertyDescription: 'Property Description',
          checkInTime: 'Check-in Time',
          checkOutTime: 'Check-out Time'
        };
        return fieldNames[key] || key;
      });
      
      setMessage(`Please fill required fields: ${missingFields.join(', ')}`);
    }
  };

  const submit = async () => {
    const allErrors = validate();
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      setMessage('Fix all errors before submitting');
      return;
    }

    setLoading(true);
    const dataToSend = {
      ...data,
      daysAvailable: data.availability.daysOpen,
      is24x7Reception: data.availability.is24x7Reception,
      availability: undefined
    };

    try {
      const response = await fetch('http://localhost:2000/api/addAccommodation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });
      if (response.ok) {
        setSuccess(true);
      } else {
        const result = await response.json();
        setMessage(`Error: ${result.error || 'Registration failed'}`);
      }
    } catch {
      setMessage('Error: Server connection failed');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setSuccess(false);
    setStep(1);
    setErrors({});
    setMessage('');
    setData({
      accommodationName: '', ownerFullName: '', phoneNumber: '', emailAddress: '', alternateContactNumber: '',
      propertyType: '', locationAddress: '', googleMapsLink: '', propertyDescription: '', starRating: '',
      checkInTime: '', checkOutTime: '',
      availability: { daysOpen: [], is24x7Reception: false, closedOnHolidays: false },
      tourismLicenseNumber: '', businessRegistrationNumber: '', yearsInOperation: '',
      numberOfRooms: '', maxGuests: '', minPricePerNight: '', maxPricePerNight: '',
      amenities: {
        pool: false, gym: false, spa: false, restaurantOnSite: false, barLounge: false,
        roomService: false, laundryService: false, conciergeService: false, airportTransfer: false,
        petFriendly: false, eventFacilities: false, parkingAvailable: false, wifi: false,
        familyAreaKidsFriendly: false, wheelchairAccessible: false
      }
    });
  };

  if (success) {
    return (
      <div className={styles.container}>
        <div className={styles.successWrapper}>
          <div className={styles.successIcon}>✓</div>
          <h1 className={styles.successTitle}>Registration Successful!</h1>
          <p className={styles.successMessage}>
            Your accommodation <strong>{data.accommodationName}</strong> has been successfully registered and added to the system.
          </p>
          <div className={styles.successDetails}>
            <p><strong>Owner:</strong> {data.ownerFullName}</p>
            <p><strong>Type:</strong> {data.propertyType}</p>
            <p><strong>Rooms:</strong> {data.numberOfRooms}</p>
            <p><strong>Max Guests:</strong> {data.maxGuests}</p>
            <p><strong>Contact:</strong> {data.phoneNumber}</p>
            <p><strong>Email:</strong> {data.emailAddress}</p>
          </div>
          <div className={styles.successActions}>
            <button onClick={goToDashboard} className={styles.dashboardButton}>
              Go to Dashboard
            </button>
            <button onClick={reset} className={styles.newRegistrationButton}>
              Register Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        {/* Progress */}
        <div className={styles.progressContainer}>
          <div className={styles.progressBar}></div>
          <div className={styles.stepIndicators}>
            {[1, 2, 3].map(s => (
              <div key={s} className={`${styles.stepIndicator} ${step >= s ? styles.active : ''}`}>
                <div className={styles.stepNumber}>{s}</div>
                <div className={styles.stepLabel}>
                  {s === 1 ? 'Basic' : s === 2 ? 'Details' : 'Info'}
                </div>
              </div>
            ))}
          </div>
        </div>

        <h1 className={styles.title}>Accommodation Registration</h1>
        {message && <div className={`${styles.message} ${message.includes('Error') ? styles.error : styles.warning}`}>{message}</div>}

        <div className={styles.form}>
          {/* Step 1: Basic Information */}
          {step === 1 && (
            <div className={styles.step}>
              <h2>Basic Information</h2>
              
              <div className={styles.row}>
                <div className={styles.field}>
                  <label>Accommodation Name *</label>
                  <input name="accommodationName" value={data.accommodationName} onChange={handleChange}
                         className={`${styles.input} ${errors.accommodationName ? styles.inputError : ''}`}
                         placeholder="Hotel/property name" />
                  {errors.accommodationName && <span className={styles.fieldError}>{errors.accommodationName}</span>}
                </div>
                <div className={styles.field}>
                  <label>Owner Full Name *</label>
                  <input name="ownerFullName" value={data.ownerFullName} onChange={handleChange}
                         className={`${styles.input} ${errors.ownerFullName ? styles.inputError : ''}`}
                         placeholder="Owner's full name" />
                  {errors.ownerFullName && <span className={styles.fieldError}>{errors.ownerFullName}</span>}
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label>Phone Number * <small>(10 digits)</small></label>
                  <input name="phoneNumber" value={data.phoneNumber} onChange={handleChange}
                         className={`${styles.input} ${errors.phoneNumber ? styles.inputError : ''}`}
                         placeholder="0771234567" />
                  {errors.phoneNumber && <span className={styles.fieldError}>{errors.phoneNumber}</span>}
                </div>
                <div className={styles.field}>
                  <label>Email Address *</label>
                  <input type="email" name="emailAddress" value={data.emailAddress} onChange={handleChange}
                         className={`${styles.input} ${errors.emailAddress ? styles.inputError : ''}`}
                         placeholder="email@example.com" />
                  {errors.emailAddress && <span className={styles.fieldError}>{errors.emailAddress}</span>}
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label>Alternate Contact <small>(Optional, 10 digits)</small></label>
                  <input name="alternateContactNumber" value={data.alternateContactNumber} onChange={handleChange}
                         className={`${styles.input} ${errors.alternateContactNumber ? styles.inputError : ''}`}
                         placeholder="0112345678" />
                  {errors.alternateContactNumber && <span className={styles.fieldError}>{errors.alternateContactNumber}</span>}
                </div>
                <div className={styles.field}>
                  <label>Property Type *</label>
                  <select name="propertyType" value={data.propertyType} onChange={handleChange}
                          className={`${styles.select} ${errors.propertyType ? styles.inputError : ''}`}>
                    <option value="">Select Type</option>
                    {accommodationTypes.map(type => <option key={type} value={type}>{type}</option>)}
                  </select>
                  {errors.propertyType && <span className={styles.fieldError}>{errors.propertyType}</span>}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Details & Times */}
          {step === 2 && (
            <div className={styles.step}>
              <h2>Details & Times</h2>
              
              <div className={styles.field}>
                <label>Location Address *</label>
                <textarea name="locationAddress" value={data.locationAddress} onChange={handleChange}
                          className={`${styles.textarea} ${errors.locationAddress ? styles.inputError : ''}`}
                          rows={3} placeholder="Full address of property" />
                {errors.locationAddress && <span className={styles.fieldError}>{errors.locationAddress}</span>}
              </div>

              <div className={styles.field}>
                <label>Google Maps Link <small>(Optional - Google Maps only)</small></label>
                <input type="url" name="googleMapsLink" value={data.googleMapsLink} onChange={handleChange}
                       className={`${styles.input} ${errors.googleMapsLink ? styles.inputError : ''}`}
                       placeholder="Google Maps URL" />
                {errors.googleMapsLink && <span className={styles.fieldError}>{errors.googleMapsLink}</span>}
              </div>

              <div className={styles.field}>
                <label>Property Description *</label>
                <textarea name="propertyDescription" value={data.propertyDescription} onChange={handleChange}
                          className={`${styles.textarea} ${errors.propertyDescription ? styles.inputError : ''}`}
                          rows={4} placeholder="Describe your property" />
                {errors.propertyDescription && <span className={styles.fieldError}>{errors.propertyDescription}</span>}
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label>Star Rating <small>(0-5, optional)</small></label>
                  <input type="number" name="starRating" value={data.starRating} onChange={handleChange}
                         className={`${styles.input} ${errors.starRating ? styles.inputError : ''}`}
                         min="0" max="5" step="0.5" placeholder="0-5 stars" />
                  {errors.starRating && <span className={styles.fieldError}>{errors.starRating}</span>}
                </div>
                <div className={styles.field}>
                  <label>Check-in Time *</label>
                  <input type="time" name="checkInTime" value={data.checkInTime} onChange={handleChange}
                         className={`${styles.input} ${errors.checkInTime ? styles.inputError : ''}`} />
                  {errors.checkInTime && <span className={styles.fieldError}>{errors.checkInTime}</span>}
                </div>
                <div className={styles.field}>
                  <label>Check-out Time *</label>
                  <input type="time" name="checkOutTime" value={data.checkOutTime} onChange={handleChange}
                         className={`${styles.input} ${errors.checkOutTime ? styles.inputError : ''}`} />
                  {errors.checkOutTime && <span className={styles.fieldError}>{errors.checkOutTime}</span>}
                </div>
              </div>

              <div className={styles.field}>
                <label>Availability Days <small>(Optional)</small></label>
                <div className={styles.checkboxGrid}>
                  {daysOfWeek.map(day => (
                    <label key={day} className={styles.checkboxLabel}>
                      <input type="checkbox" checked={data.availability.daysOpen.includes(day)}
                             onChange={() => toggleDay(day)} />
                      {day.slice(0, 3)}
                    </label>
                  ))}
                </div>
              </div>

              <div className={styles.checkboxRow}>
                <label className={styles.checkboxLabel}>
                  <input type="checkbox" name="availability.is24x7Reception" 
                         checked={data.availability.is24x7Reception} onChange={handleChange} />
                  24x7 Reception
                </label>
                <label className={styles.checkboxLabel}>
                  <input type="checkbox" name="availability.closedOnHolidays"
                         checked={data.availability.closedOnHolidays} onChange={handleChange} />
                  Closed on Holidays
                </label>
              </div>
            </div>
          )}

          {/* Step 3: Additional Information */}
          {step === 3 && (
            <div className={styles.step}>
              <h2>Additional Information</h2>
              
              <div className={styles.row}>
                <div className={styles.field}>
                  <label>Tourism License <small>(Optional)</small></label>
                  <input name="tourismLicenseNumber" value={data.tourismLicenseNumber} onChange={handleChange}
                         className={styles.input} placeholder="Tourism license number" />
                </div>
                <div className={styles.field}>
                  <label>Business Registration <small>(Optional - PV12345, etc.)</small></label>
                  <input name="businessRegistrationNumber" value={data.businessRegistrationNumber} onChange={handleChange}
                         className={`${styles.input} ${errors.businessRegistrationNumber ? styles.inputError : ''}`}
                         placeholder="Business registration" />
                  {errors.businessRegistrationNumber && <span className={styles.fieldError}>{errors.businessRegistrationNumber}</span>}
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label>Years in Operation <small>(Optional)</small></label>
                  <input type="number" name="yearsInOperation" value={data.yearsInOperation} onChange={handleChange}
                         className={`${styles.input} ${errors.yearsInOperation ? styles.inputError : ''}`}
                         min="0" placeholder="Years operating" />
                  {errors.yearsInOperation && <span className={styles.fieldError}>{errors.yearsInOperation}</span>}
                </div>
                <div className={styles.field}>
                  <label>Number of Rooms *</label>
                  <input type="number" name="numberOfRooms" value={data.numberOfRooms} onChange={handleChange}
                         className={`${styles.input} ${errors.numberOfRooms ? styles.inputError : ''}`}
                         min="1" placeholder="Total rooms" />
                  {errors.numberOfRooms && <span className={styles.fieldError}>{errors.numberOfRooms}</span>}
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label>Max Guests *</label>
                  <input type="number" name="maxGuests" value={data.maxGuests} onChange={handleChange}
                         className={`${styles.input} ${errors.maxGuests ? styles.inputError : ''}`}
                         min="1" placeholder="Maximum guests" />
                  {errors.maxGuests && <span className={styles.fieldError}>{errors.maxGuests}</span>}
                </div>
                <div className={styles.field}>
                  <label>Min Price/Night *</label>
                  <input type="number" name="minPricePerNight" value={data.minPricePerNight} onChange={handleChange}
                         className={`${styles.input} ${errors.minPricePerNight ? styles.inputError : ''}`}
                         min="0" placeholder="Minimum price" />
                  {errors.minPricePerNight && <span className={styles.fieldError}>{errors.minPricePerNight}</span>}
                </div>
                <div className={styles.field}>
                  <label>Max Price/Night *</label>
                  <input type="number" name="maxPricePerNight" value={data.maxPricePerNight} onChange={handleChange}
                         className={`${styles.input} ${errors.maxPricePerNight ? styles.inputError : ''}`}
                         min="0" placeholder="Maximum price" />
                  {errors.maxPricePerNight && <span className={styles.fieldError}>{errors.maxPricePerNight}</span>}
                </div>
              </div>

              <div className={styles.field}>
                <label>Amenities <small>(Optional - Select any that apply)</small></label>
                <div className={styles.checkboxGrid}>
                  {Object.entries(data.amenities).map(([key, value]) => (
                    <label key={key} className={styles.checkboxLabel}>
                      <input type="checkbox" name={`amenities.${key}`} checked={value} onChange={handleChange} />
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className={styles.buttonContainer}>
            {step > 1 && <button onClick={() => setStep(step - 1)} className={styles.prevButton}>Previous</button>}
            {step < 3 ? (
              <button onClick={next} className={styles.nextButton}>Next</button>
            ) : (
              <button onClick={submit} disabled={loading} className={styles.submitButton}>
                {loading ? 'Registering...' : 'Register Accommodation'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccommodationForm;