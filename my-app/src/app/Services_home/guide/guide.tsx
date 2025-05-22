'use client';

import React, { useState } from 'react';
import styles from './guide.module.css';

const initialState = {
  name: '',
  gender: '',
  dob: '',
  nic: '',
  contact: '',
  email: '',
  coveredLocations: [] as string[],
  availability: [] as string[],
  languages: [] as string[],
  experiences: '',
  description: '',
};

const locations = [
  'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
  'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
  'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
  'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla',
  'Monaragala', 'Ratnapura', 'Kegalle'
];

const availabilityOptions = ['Weekdays', 'Weekends'];

const languageOptions = [
  'English', 'Sinhala', 'Tamil', 'Japanese', 'German', 'French'
];

const ModernGuideForm: React.FC = () => {
  const [formData, setFormData] = useState(initialState);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'pending' | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedTags, setSelectedTags] = useState<{
    languages: string[],
    availability: string[],
    coveredLocations: string[]
  }>({
    languages: [],
    availability: [],
    coveredLocations: []
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleTag = (type: 'languages' | 'availability' | 'coveredLocations', value: string) => {
    setSelectedTags(prev => {
      const newTags = {...prev};
      if (newTags[type].includes(value)) {
        // Remove tag if already selected
        newTags[type] = newTags[type].filter(tag => tag !== value);
      } else {
        // Add tag if not selected
        newTags[type] = [...newTags[type], value];
      }
      
      // Update formData as well
      setFormData(prevForm => ({
        ...prevForm,
        [type]: newTags[type]
      }));
      
      return newTags;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('Submitting...');
    setMessageType('pending');

    try {
      const res = await fetch('http://localhost:2000/api/addGuide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setMessage('Guide added successfully!');
        setMessageType('success');
        setFormData(initialState);
        setSelectedTags({
          languages: [],
          availability: [],
          coveredLocations: []
        });
      } else {
        const data = await res.json();
        setMessage(`Error: ${data.message || 'Failed to add guide'}`);
        setMessageType('error');
      }
    } catch {
      setMessage('Error: Could not connect to the server.');
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
        <h2 className={styles.heading}>Guide Registration</h2>
        
        <div className={styles.progressBar}>
          <div className={styles.progressStep}>
            <div className={`${styles.stepCircle} ${step >= 1 ? styles.active : ''}`}>1</div>
            <span>Personal Info</span>
          </div>
          <div className={styles.progressLine}></div>
          <div className={styles.progressStep}>
            <div className={`${styles.stepCircle} ${step >= 2 ? styles.active : ''}`}>2</div>
            <span>Coverage & Skills</span>
          </div>
          <div className={styles.progressLine}></div>
          <div className={styles.progressStep}>
            <div className={`${styles.stepCircle} ${step >= 3 ? styles.active : ''}`}>3</div>
            <span>Experience</span>
          </div>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {step === 1 && (
            <div className={styles.formStep}>
              <div className={styles.formGroup}>
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  className={styles.input}
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="gender">Gender</label>
                <select
                  id="gender"
                  className={styles.select}
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="dob">Date of Birth</label>
                <input
                  id="dob"
                  className={styles.input}
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="nic">National ID Number</label>
                <input
                  id="nic"
                  className={styles.input}
                  name="nic"
                  placeholder="Enter your NIC number"
                  value={formData.nic}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="contact">Contact Number</label>
                <input
                  id="contact"
                  className={styles.input}
                  name="contact"
                  placeholder="Enter your contact number"
                  value={formData.contact}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  className={styles.input}
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleChange}
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
                <label>Languages</label>
                <div className={styles.tagContainer}>
                  {languageOptions.map(lang => (
                    <div 
                      key={lang}
                      className={`${styles.tag} ${selectedTags.languages.includes(lang) ? styles.tagSelected : ''}`}
                      onClick={() => toggleTag('languages', lang)}
                    >
                      {lang}
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Availability</label>
                <div className={styles.tagContainer}>
                  {availabilityOptions.map(option => (
                    <div 
                      key={option}
                      className={`${styles.tag} ${selectedTags.availability.includes(option) ? styles.tagSelected : ''}`}
                      onClick={() => toggleTag('availability', option)}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Covered Locations</label>
                <div className={styles.tagContainer}>
                  {locations.map(location => (
                    <div 
                      key={location}
                      className={`${styles.tag} ${selectedTags.coveredLocations.includes(location) ? styles.tagSelected : ''}`}
                      onClick={() => toggleTag('coveredLocations', location)}
                    >
                      {location}
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
              <div className={styles.formGroup}>
                <label htmlFor="experiences">Professional Experience</label>
                <textarea
                  id="experiences"
                  className={styles.textarea}
                  name="experiences"
                  placeholder="Describe your professional experience, certifications, and qualifications"
                  value={formData.experiences}
                  onChange={handleChange}
                  rows={5}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="description">About You</label>
                <textarea
                  id="description"
                  className={styles.textarea}
                  name="description"
                  placeholder="Tell us about yourself, your guiding style, and what travelers can expect"
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                />
              </div>

              <div className={styles.buttonContainer}>
                <button type="button" className={styles.backButton} onClick={prevStep}>
                  <span className={styles.buttonIcon}>←</span> Back
                </button>
                <button 
                  type="submit" 
                  className={styles.submitButton}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
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
};
 
export default ModernGuideForm;