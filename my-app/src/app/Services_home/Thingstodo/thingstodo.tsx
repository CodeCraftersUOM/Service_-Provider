'use client';
import './StepForm.css';
import { useState } from 'react';

type BaseFormData = {
  name: string;
  email: string;
  phone: string;
  address: string;
};

type BuyThingsData = {
  title: string;
  category: string;
  subcategory: string;
  imageUrl: string;
  description: string;
  location: string;
  googleMapsUrl: string;
  openingHours: string;
  contactInfo: string;
  entryFee: string;
  isCard: boolean;
  isCash: boolean;
  isQRScan: boolean;
  isParking: string;
  contactno: string;
  websiteUrl: string;
  wifi: string;
  washrooms: string;
  familyFriendly: string;
};

type AdventuresData = {
  title: string;
  category: string;
  subcategory: string;
  imageUrl: string;
  description: string;
  googleMapsUrl: string;
  duration: string;
  contactInfo: string;
  bestfor: string;
  price: string;
  bestTimetoVisit: string;
  activities: string;
  whatToWear: string;
  whatToBring: string;
  precautions: string;
  contactno: string;
  websiteUrl: string;
  address: string;
};

export default function RegisterPublisher() {
  const [category, setCategory] = useState<string>('');
  const [currentStep, setCurrentStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState<BaseFormData & Partial<BuyThingsData> & Partial<AdventuresData>>({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      console.log('Category:', category);
      console.log('Form Data:', formData);

      try {
        const response = await fetch('http://localhost:2000/api/buythings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            category,
            ...formData
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
          console.log('Data saved to MongoDB:', result.id);
          setIsSuccess(true);
        } else {
          console.error('Server error:', result.error);
          alert('Failed to submit the form. Please try again.');
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        alert('An error occurred while submitting. Please check console.');
      }
  };


    
  

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const resetForm = () => {
    setIsSuccess(false);
    setCurrentStep(1);
    setCategory('');
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
    });
  };
  const renderCategorySpecificFields = () => {
            let fields: { label: string; name: keyof (BuyThingsData & AdventuresData); type: string }[] = [];

            if (category === 'buythings') {
              fields = [
                { label: 'Title', name: 'title', type: 'text' },
                { label: 'Category', name: 'category', type: 'text' },
                { label: 'Subcategory', name: 'subcategory', type: 'text' },
                { label: 'Image URL', name: 'imageUrl', type: 'text' },
                { label: 'Description', name: 'description', type: 'textarea' },
                { label: 'Location', name: 'location', type: 'text' },
                { label: 'Google Maps URL', name: 'googleMapsUrl', type: 'text' },
                { label: 'Opening Hours', name: 'openingHours', type: 'text' },
                { label: 'Contact Info', name: 'contactInfo', type: 'text' },
                { label: 'Entry Fee', name: 'entryFee', type: 'text' },
                { label: 'Accepts Card?', name: 'isCard', type: 'checkbox' },
                { label: 'Accepts Cash?', name: 'isCash', type: 'checkbox' },
                { label: 'Accepts QR Scan?', name: 'isQRScan', type: 'checkbox' },
                { label: 'Parking', name: 'isParking', type: 'text' },
                { label: 'Contact Number', name: 'contactno', type: 'text' },
                { label: 'Website URL', name: 'websiteUrl', type: 'text' },
                { label: 'WiFi', name: 'wifi', type: 'text' },
                { label: 'Washrooms', name: 'washrooms', type: 'text' },
                { label: 'Family Friendly', name: 'familyFriendly', type: 'text' },
              ];
            } else if (category === 'adventures') {
              fields = [
                { label: 'Title', name: 'title', type: 'text' },
                { label: 'Category', name: 'category', type: 'text' },
                { label: 'Subcategory', name: 'subcategory', type: 'text' },
                { label: 'Image URL', name: 'imageUrl', type: 'text' },
                { label: 'Description', name: 'description', type: 'textarea' },
                { label: 'Google Maps URL', name: 'googleMapsUrl', type: 'text' },
                { label: 'Duration', name: 'duration', type: 'text' },
                { label: 'Contact Info', name: 'contactInfo', type: 'text' },
                { label: 'Best For', name: 'bestfor', type: 'text' },
                { label: 'Price', name: 'price', type: 'text' },
                { label: 'Best Time to Visit', name: 'bestTimetoVisit', type: 'text' },
                { label: 'Activities', name: 'activities', type: 'textarea' },
                { label: 'What To Wear', name: 'whatToWear', type: 'textarea' },
                { label: 'What To Bring', name: 'whatToBring', type: 'textarea' },
                { label: 'Precautions', name: 'precautions', type: 'textarea' },
                { label: 'Contact Number', name: 'contactno', type: 'text' },
                { label: 'Website URL', name: 'websiteUrl', type: 'text' },
                { label: 'Address', name: 'address', type: 'text' },
              ];
            }

            return fields.map((field, index) => (
              <div className="form-field" key={index}>
                <label>{field.label}*</label>
                {field.type === 'textarea' ? (
                  <textarea
                    name={field.name}
                    value={formData[field.name] as string || ''}
                    onChange={handleInputChange}
                    required
                    className="register-textarea"
                    rows={3}
                  />
                ) : field.type === 'checkbox' ? (
                  <input
                    type="checkbox"
                    name={field.name}
                    checked={!!formData[field.name]}
                    onChange={handleInputChange}
                    className="register-checkbox"
                  />
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name] as string || ''}
                    onChange={handleInputChange}
                    className="register-input"
                  />
                )}
              </div>
            ));
          };


  const steps = ['Select Category', 'Publisher Details', 'Category Specific'];

  const getStepClass = (step: number) => {
    if (currentStep > step) return 'step completed';
    if (currentStep === step) return 'step active';
    return 'step';
  };

  if (isSuccess) {
    return (
      <div className="register-container">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '4rem', color: '#22c55e', marginBottom: '1rem' }}>✓</div>
          <h1 className="success-title">Publisher Successfully Registered!</h1>
          <p className="success-text">
            <strong>{formData.name}</strong> has been registered for <strong>{category}</strong>.
          </p>
          <button onClick={resetForm} className="btn btn-secondary">Register Another</button>
        </div>
      </div>
    );
  }

  const categoryTitles: Record<string, string> = {
            buythings: 'Buy Things Details',
            adventures: 'Adventures Details',
            placestovisit: 'Places to Visit Details',
            Learningpoints: 'Learning Points Details',
            specialevents: 'Special Events Details',
            ayurvedha: 'Ayurwedha Details'
          };

  return (
    <>
      <style jsx>{`
        .register-container {
          max-width: 42rem;
          margin: 10rem auto;
          padding: 2rem;
          background: white;
          border-radius: 1rem;
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }
        .register-title {
          font-size: 2.25rem;
          font-weight: 700;
          color: #2563eb;
          text-align: center;
          margin-bottom: 1.5rem;
        }
        .stepper {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          position: relative;
        }
        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          flex: 1;
        }
        .step:not(:last-child)::after {
          content: '';
          position: absolute;
          top: 14px;
          right: -50%;
          width: 100%;
          height: 2px;
          background-color: #d1d5db;
          z-index: -1;
        }
        .step.completed:not(:last-child)::after {
          background-color: #2563eb;
        }
        .circle {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background-color: #d1d5db;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
        }
        .active .circle {
          background-color: #2563eb;
        }
        .completed .circle {
          background-color: #22c55e;
        }
        .label {
          margin-top: 0.5rem;
          font-size: 0.9rem;
          color: #6b7280;
        }
        .active .label {
          color: #2563eb;
          font-weight: 600;
        }
        .form-field {
          margin-bottom: 1.25rem;
        }
        .register-input,
        .register-textarea {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid #d1d5db;
          border-radius: 0.75rem;
          font-size: 1rem;
          outline: none;
        }
        .btn {
          display: inline-block;
          padding: 0.75rem 1.5rem;
          border-radius: 0.75rem;
          font-weight: 600;
          text-align: center;
          cursor: pointer;
          margin: 0.5rem 0.25rem;
        }
        .btn-primary {
          background: linear-gradient(to right, #3b82f6, #1e3a8a);
          color: white;
          border: none;
        }
        .btn-secondary {
          background: #f3f4f6;
          color: #374151;
          border: 1px solid #d1d5db;
        }
        .btn-primary:hover {
          background: linear-gradient(to right, #2563eb, #1e40af);
        }
        .btn-secondary:hover {
          background: #e5e7eb;
        }
      `}</style>

      <form className="register-container" onSubmit={handleSubmit}>
        <div className="progress-bar-container">
          <div
            className="progress-bar-fill"
            style={{ width: `${(currentStep / 3) * 100}%` }}
          ></div>
        </div>

        {/* Step Progress Bar */}
        
        <div className="stepper">
          {steps.map((label, index) => (
            <div key={index} className={getStepClass(index + 1)}>
              <div className="circle">
                {currentStep > index + 1 ? '✓' : index + 1}
              </div>
              <div className="label">{label}</div>
            </div>
          ))}
        </div>

        <h1 className="register-title">Register Publisher</h1>

        
        {/* Step 1: Select Category */}
        {currentStep === 1 && (
          <div className="form-field">
            <label>Select Category *</label>
            <select
              name="category"
              value={category}
              onChange={handleCategoryChange}
              className="register-input"
              required
            >
              <option value="">-- Select a Category --</option>
              <option value="buythings">Buy Things</option>
              <option value="adventures">Adventures</option>
              <option value="placestovisit">Places To Visit</option>
              <option value="learningpoints">Learning Points</option>
              <option value="specialevents">Special Events</option>
              <option value="ayurwedha">Ayurwedha</option>
            </select>
          </div>
        )}

        {/* Step 2: Publisher Details */}
        {currentStep === 2 && (
          <>
            <div className="form-field">
              <label>Publisher Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="register-input"
              />
            </div>
            <div className="form-field">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="register-input"
              />
            </div>
            <div className="form-field">
              <label>Phone *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="register-input"
              />
            </div>
            <div className="form-field">
              <label>Address *</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows={3}
                required
                className="register-textarea"
              />
            </div>
          </>
        )}

        {/* Step 3: Category Specific Details */}
        {currentStep === 3 && (
          <div className='step-form'>
            

  

           <h2>{categoryTitles[category] || 'Category Details'}</h2>
            {renderCategorySpecificFields()}
            <div className="form-field">
              <label>Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title || ''}
                onChange={handleInputChange}
                required
                className="register-input"
                
              />
            </div>
            <div className="form-field">
              <label>Subcategory *</label>
              <input
                type="text"
                name="subcategory"
                value={formData.subcategory || ''}
                onChange={handleInputChange}
                required
                className="register-input"
              />
            </div>
            <div className="form-field">
              <label>Image URL *</label>
              <input
                type="text"
                name="imageUrl"
                value={formData.imageUrl || ''}
                onChange={handleInputChange}
                required
                className="register-input"
              />
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div>
          {currentStep > 1 && (
            <button type="button" onClick={prevStep} className="btn btn-secondary">
              Previous
            </button>
          )}
          {currentStep < 3 ? (
            <button type="button" onClick={nextStep} className="btn btn-primary">
              Next
            </button>
          ) : (
            <button type="submit" className="btn btn-primary">
              Register Publisher
            </button>
          )}
        </div>
      </form>
    </>
  );
}


