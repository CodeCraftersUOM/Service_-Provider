'use client';

import { useState } from 'react';
import styles from './repair.module.css';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const serviceOptions = [
  'Engine Repair', 'Brake Service', 'Transmission Repair', 'Oil Change', 
  'Tire Service', 'Battery Service', 'Air Conditioning', 'Electrical Repair',
  'Body Work', 'Paint Service', 'Windshield Repair', 'Suspension Repair',
  'Exhaust Service', 'Diagnostic Service', 'Towing Service', 'Emergency Repair'
];

export default function ModernVehicleRepairForm() {
  const [formData, setFormData] = useState({
    businessName: '',
    ownerFullName: '',
    businessPhoneNumber: '',
    businessEmailAddress: '',
    businessWebsite: '',
    businessDescription: '',
    locationAddress: '',
    googleMapsLink: '',
    servicesOffered: [] as string[],
    workingHours: {
      daysOpen: [] as string[],
      openingTime: '',
      closingTime: ''
    },
    businessRegistrationNumber: '',
    licenseDocumentUrl: '',
    termsAgreed: false
  });

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'pending' | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;

    if (name.startsWith('workingHours.')) {
      const key = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        workingHours: { ...prev.workingHours, [key]: value }
      }));
    } else if (name === 'termsAgreed') {
      setFormData({ ...formData, termsAgreed: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleDaysChange = (day: string) => {
    setFormData((prev) => {
      const days = prev.workingHours.daysOpen.includes(day)
        ? prev.workingHours.daysOpen.filter(d => d !== day)
        : [...prev.workingHours.daysOpen, day];
      return {
        ...prev,
        workingHours: { ...prev.workingHours, daysOpen: days }
      };
    });
  };

  const toggleService = (service: string) => {
    setFormData(prev => {
      const services = prev.servicesOffered.includes(service)
        ? prev.servicesOffered.filter(s => s !== service)
        : [...prev.servicesOffered, service];
      return { ...prev, servicesOffered: services };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('Submitting...');
    setMessageType('pending');

    try {
      const res = await fetch('http://localhost:2000/api/addRepair', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      
      if (res.ok && data.success) {
        setMessage('Vehicle repair business registered successfully!');
        setMessageType('success');
        // Reset form
        setFormData({
          businessName: '',
          ownerFullName: '',
          businessPhoneNumber: '',
          businessEmailAddress: '',
          businessWebsite: '',
          businessDescription: '',
          locationAddress: '',
          googleMapsLink: '',
          servicesOffered: [],
          workingHours: {
            daysOpen: [],
            openingTime: '',
            closingTime: ''
          },
          businessRegistrationNumber: '',
          licenseDocumentUrl: '',
          termsAgreed: false
        });
        setStep(1);
      } else {
        setMessage(`Error: ${data.message || data.error || 'Failed to register business'}`);
        setMessageType('error');
      }
    } catch (error) {
      console.error('Connection error:', error);
      setMessage('Error: Could not connect to the server. Please make sure your backend is running.');
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h2 className={styles.heading}>Vehicle Repair Business Registration</h2>
        
        <div className={styles.progressBar}>
          <div className={styles.progressStep}>
            <div className={`${styles.stepCircle} ${step >= 1 ? styles.active : ''}`}>1</div>
            <span>Business Info</span>
          </div>
          <div className={styles.progressLine}></div>
          <div className={styles.progressStep}>
            <div className={`${styles.stepCircle} ${step >= 2 ? styles.active : ''}`}>2</div>
            <span>Location & Services</span>
          </div>
          <div className={styles.progressLine}></div>
          <div className={styles.progressStep}>
            <div className={`${styles.stepCircle} ${step >= 3 ? styles.active : ''}`}>3</div>
            <span>Schedule & Legal</span>
          </div>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {step === 1 && (
            <div className={styles.formStep}>
              <div className={styles.formGroup}>
                <label htmlFor="businessName">Business Name</label>
                <input
                  id="businessName"
                  className={styles.input}
                  name="businessName"
                  placeholder="Enter your business name"
                  value={formData.businessName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="ownerFullName">Owner's Full Name</label>
                <input
                  id="ownerFullName"
                  className={styles.input}
                  name="ownerFullName"
                  placeholder="Enter owner's full name"
                  value={formData.ownerFullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="businessPhoneNumber">Business Phone Number</label>
                <input
                  id="businessPhoneNumber"
                  className={styles.input}
                  name="businessPhoneNumber"
                  placeholder="Enter business phone number"
                  value={formData.businessPhoneNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="businessEmailAddress">Business Email Address</label>
                <input
                  id="businessEmailAddress"
                  className={styles.input}
                  name="businessEmailAddress"
                  type="email"
                  placeholder="Enter business email address"
                  value={formData.businessEmailAddress}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="businessWebsite">Business Website</label>
                <input
                  id="businessWebsite"
                  className={styles.input}
                  name="businessWebsite"
                  placeholder="Enter website URL (optional)"
                  value={formData.businessWebsite}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="businessDescription">Business Description</label>
                <textarea
                  id="businessDescription"
                  className={styles.textarea}
                  name="businessDescription"
                  placeholder="Describe your repair business, specialties, and experience"
                  value={formData.businessDescription}
                  onChange={handleChange}
                  rows={4}
                  required
                />
              </div>

              <div className={styles.buttonContainer}>
                <button type="button" className={styles.nextButton} onClick={nextStep}>
                  Next <span className={styles.buttonIcon}>→</span>
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className={styles.formStep}>
              <div className={styles.formGroup}>
                <label htmlFor="locationAddress">Location Address</label>
                <input
                  id="locationAddress"
                  className={styles.input}
                  name="locationAddress"
                  placeholder="Enter your business address"
                  value={formData.locationAddress}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="googleMapsLink">Google Maps Link</label>
                <input
                  id="googleMapsLink"
                  className={styles.input}
                  name="googleMapsLink"
                  placeholder="Enter Google Maps link (optional)"
                  value={formData.googleMapsLink}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.formGroup} style={{gridColumn: 'span 2'}}>
                <label>Services Offered</label>
                <div className={styles.tagContainer}>
                  {serviceOptions.map(service => (
                    <div 
                      key={service}
                      className={`${styles.tag} ${formData.servicesOffered.includes(service) ? styles.tagSelected : ''}`}
                      onClick={() => toggleService(service)}
                    >
                      {service}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className={styles.buttonContainer}>
                <button type="button" className={styles.backButton} onClick={prevStep}>
                  <span className={styles.buttonIcon}>←</span> Back
                </button>
                <button type="button" className={styles.nextButton} onClick={nextStep}>
                  Next <span className={styles.buttonIcon}>→</span>
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className={styles.formStep}>
              <div className={styles.formGroup} style={{gridColumn: 'span 2'}}>
                <label>Working Days</label>
                <div className={styles.dayContainer}>
                  {daysOfWeek.map(day => (
                    <div 
                      key={day}
                      className={`${styles.dayTag} ${formData.workingHours.daysOpen.includes(day) ? styles.daySelected : ''}`}
                      onClick={() => handleDaysChange(day)}
                    >
                      {day}
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="openingTime">Opening Time</label>
                <input
                  id="openingTime"
                  className={styles.input}
                  name="workingHours.openingTime"
                  type="time"
                  value={formData.workingHours.openingTime}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="closingTime">Closing Time</label>
                <input
                  id="closingTime"
                  className={styles.input}
                  name="workingHours.closingTime"
                  type="time"
                  value={formData.workingHours.closingTime}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="businessRegistrationNumber">Business Registration Number</label>
                <input
                  id="businessRegistrationNumber"
                  className={styles.input}
                  name="businessRegistrationNumber"
                  placeholder="Enter registration number (optional)"
                  value={formData.businessRegistrationNumber}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="licenseDocumentUrl">License Document URL</label>
                <input
                  id="licenseDocumentUrl"
                  className={styles.input}
                  name="licenseDocumentUrl"
                  placeholder="Enter license document URL (optional)"
                  value={formData.licenseDocumentUrl}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.formGroup} style={{gridColumn: 'span 2'}}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="termsAgreed"
                    checked={formData.termsAgreed}
                    onChange={handleChange}
                    required
                  />
                  <span className={styles.checkboxText}>
                    I agree to the Terms & Conditions and Privacy Policy
                  </span>
                </label>
              </div>

              <div className={styles.buttonContainer}>
                <button type="button" className={styles.backButton} onClick={prevStep}>
                  <span className={styles.buttonIcon}>←</span> Back
                </button>
                <button 
                  type="submit" 
                  className={styles.submitButton}
                  disabled={isSubmitting || !formData.termsAgreed}
                >
                  {isSubmitting ? 'Submitting...' : 'Register Business'}
                </button>
              </div>
            </div>
          )}
        </form>

        {message && (
          <div className={`${styles.message} ${styles[messageType]}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}