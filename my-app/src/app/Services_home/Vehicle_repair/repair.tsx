'use client';

import React, { useState } from 'react';
import styles from './vehicleRepair.module.css';
import { useRouter } from 'next/navigation';

interface FormData {
  serviceName: string;
  ownerFullName: string;
  phoneNumber: string;
  emailAddress: string;
  serviceType: string;
  locationAddress: string;
  serviceDescription: string;
  numberOfMechanics: number;
  vehicleCapacity: number;
  servicesOffered: {
    engineRepair: boolean;
    brakeService: boolean;
    oilChange: boolean;
    tireService: boolean;
    electricalRepair: boolean;
    bodyWork: boolean;
  };
  vehicleTypesServiced: {
    cars: boolean;
    motorcycles: boolean;
    trucks: boolean;
    vans: boolean;
  };
}

const VehicleRepairServiceForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    serviceName: '',
    ownerFullName: '',
    phoneNumber: '',
    emailAddress: '',
    serviceType: '',
    locationAddress: '',
    serviceDescription: '',
    numberOfMechanics: 1,
    vehicleCapacity: 1,
    servicesOffered: {
      engineRepair: false,
      brakeService: false,
      oilChange: false,
      tireService: false,
      electricalRepair: false,
      bodyWork: false,
    },
    vehicleTypesServiced: {
      cars: true,
      motorcycles: false,
      trucks: false,
      vans: false,
    },
  });

  const serviceTypes = [
    "Auto Repair Shop", "Tire Service", "Oil Change", "Body Shop",
    "Brake Service", "Engine Repair", "Electrical Service", "Other"
  ];

  const validate = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.serviceName.trim()) newErrors.serviceName = "Service name is required";
    if (!formData.ownerFullName.trim()) newErrors.ownerFullName = "Owner name is required";
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required";
    if (!formData.emailAddress.trim()) newErrors.emailAddress = "Email is required";
    if (!formData.serviceType) newErrors.serviceType = "Service type is required";
    if (!formData.locationAddress.trim()) newErrors.locationAddress = "Address is required";
    
    if (currentStep === 2) {
      const hasService = Object.values(formData.servicesOffered).some(service => service);
      if (!hasService) newErrors.services = "Select at least one service";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : false;
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? parseInt(value) || 0 : value)
    }));
  };

  const handleServiceChange = (service: keyof FormData['servicesOffered']) => {
    if (errors.services) setErrors(prev => ({ ...prev, services: '' }));
    setFormData(prev => ({
      ...prev,
      servicesOffered: { ...prev.servicesOffered, [service]: !prev.servicesOffered[service] }
    }));
  };

  const handleVehicleTypeChange = (type: keyof FormData['vehicleTypesServiced']) => {
    setFormData(prev => ({
      ...prev,
      vehicleTypesServiced: { ...prev.vehicleTypesServiced, [type]: !prev.vehicleTypesServiced[type] }
    }));
  };

  const nextStep = () => {
    if (validate()) {
      setCurrentStep(2);
      setMessage('');
    } else {
      setMessage('Please fix the errors below');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      setMessage('Please fix all errors');
      return;
    }
    
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:2000/api/addVehicleRepairService', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSuccess(true);
      } else {
        const data = await response.json();
        setMessage(`Error: ${data.message || 'Registration failed'}`);
      }
    } catch (error) {
      setMessage('Error: Connection failed');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setIsSuccess(false);
    setCurrentStep(1);
    setErrors({});
    setMessage('');
  };

  if (isSuccess) {
    return (
      <div className={styles.container}>
        <div className={styles.success}>
          <h1>✅ Registration Successful!</h1>
          <p><strong>{formData.serviceName}</strong> has been registered successfully.</p>
          <div className={styles.details}>
            <p><strong>Owner:</strong> {formData.ownerFullName}</p>
            <p><strong>Type:</strong> {formData.serviceType}</p>
            <p><strong>Contact:</strong> {formData.phoneNumber}</p>
          </div>
          <button onClick={resetForm} className={styles.button}>Register Another</button>
          <button onClick={() => router.push('/Dashboard')} className={styles.button}>Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <h1>Vehicle Repair Service Registration</h1>
        
        <div className={styles.progress}>
          <div className={styles.progressBar} style={{ width: `${(currentStep / 2) * 100}%` }}></div>
        </div>
        
        {message && <div className={styles.message}>{message}</div>}

        <form onSubmit={handleSubmit}>
          {currentStep === 1 && (
            <div className={styles.step}>
              <h2>Basic Information</h2>
              
              <div className={styles.row}>
                <div className={styles.field}>
                  <label>Service Name *</label>
                  <input
                    type="text"
                    name="serviceName"
                    value={formData.serviceName}
                    onChange={handleInputChange}
                    className={errors.serviceName ? styles.error : ''}
                  />
                  {errors.serviceName && <span className={styles.errorText}>{errors.serviceName}</span>}
                </div>

                <div className={styles.field}>
                  <label>Owner Name *</label>
                  <input
                    type="text"
                    name="ownerFullName"
                    value={formData.ownerFullName}
                    onChange={handleInputChange}
                    className={errors.ownerFullName ? styles.error : ''}
                  />
                  {errors.ownerFullName && <span className={styles.errorText}>{errors.ownerFullName}</span>}
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className={errors.phoneNumber ? styles.error : ''}
                  />
                  {errors.phoneNumber && <span className={styles.errorText}>{errors.phoneNumber}</span>}
                </div>

                <div className={styles.field}>
                  <label>Email *</label>
                  <input
                    type="email"
                    name="emailAddress"
                    value={formData.emailAddress}
                    onChange={handleInputChange}
                    className={errors.emailAddress ? styles.error : ''}
                  />
                  {errors.emailAddress && <span className={styles.errorText}>{errors.emailAddress}</span>}
                </div>
              </div>

              <div className={styles.field}>
                <label>Service Type *</label>
                <select
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleInputChange}
                  className={errors.serviceType ? styles.error : ''}
                >
                  <option value="">Select Service Type</option>
                  {serviceTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.serviceType && <span className={styles.errorText}>{errors.serviceType}</span>}
              </div>

              <div className={styles.field}>
                <label>Address *</label>
                <textarea
                  name="locationAddress"
                  value={formData.locationAddress}
                  onChange={handleInputChange}
                  className={errors.locationAddress ? styles.error : ''}
                  rows={3}
                />
                {errors.locationAddress && <span className={styles.errorText}>{errors.locationAddress}</span>}
              </div>

              <div className={styles.field}>
                <label>Description</label>
                <textarea
                  name="serviceDescription"
                  value={formData.serviceDescription}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>

              <button type="button" onClick={nextStep} className={styles.button}>Next</button>
            </div>
          )}

          {currentStep === 2 && (
            <div className={styles.step}>
              <h2>Services & Details</h2>
              
              <div className={styles.row}>
                <div className={styles.field}>
                  <label>Number of Mechanics</label>
                  <input
                    type="number"
                    name="numberOfMechanics"
                    value={formData.numberOfMechanics}
                    onChange={handleInputChange}
                    min="1"
                  />
                </div>

                <div className={styles.field}>
                  <label>Vehicle Capacity</label>
                  <input
                    type="number"
                    name="vehicleCapacity"
                    value={formData.vehicleCapacity}
                    onChange={handleInputChange}
                    min="1"
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label>Services Offered *</label>
                <div className={styles.checkboxGrid}>
                  {Object.entries(formData.servicesOffered).map(([service, checked]) => (
                    <label key={service} className={styles.checkbox}>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => handleServiceChange(service as keyof FormData['servicesOffered'])}
                      />
                      {service.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </label>
                  ))}
                </div>
                {errors.services && <span className={styles.errorText}>{errors.services}</span>}
              </div>

              <div className={styles.field}>
                <label>Vehicle Types</label>
                <div className={styles.checkboxGrid}>
                  {Object.entries(formData.vehicleTypesServiced).map(([type, checked]) => (
                    <label key={type} className={styles.checkbox}>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => handleVehicleTypeChange(type as keyof FormData['vehicleTypesServiced'])}
                      />
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </label>
                  ))}
                </div>
              </div>

              <div className={styles.buttons}>
                <button type="button" onClick={() => setCurrentStep(1)} className={styles.buttonSecondary}>
                  Previous
                </button>
                <button type="submit" disabled={loading} className={styles.button}>
                  {loading ? 'Registering...' : 'Register Service'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default VehicleRepairServiceForm;