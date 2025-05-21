'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import styles from './guide.module.css';

type GuideFormData = {
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
};

const GuideForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<GuideFormData>({
    name: '',
    gender: 'Male',
    dob: '',
    nic: '',
    contact: '',
    email: '',
    coveredLocations: [],
    availability: [],
    languages: ['English'],
    experiences: '',
    description: '',
  });
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: keyof GuideFormData, value: string) => {
    setFormData(prev => {
      const currentValues = prev[name] as string[];
      return {
        ...prev,
        [name]: currentValues.includes(value)
          ? currentValues.filter(item => item !== value)
          : [...currentValues, value]
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch('http://localhost:2000/api/addGuide', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit form');
      }

      router.push('/submission-success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    }
  };

  const locations = [
    'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
    'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
    'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
    'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla',
    'Monaragala', 'Ratnapura', 'Kegalle'
  ];

  return (
    <>
      <Head>
        <title>Guide Registration</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className={styles.container}>
        <form className={styles.form} onSubmit={handleSubmit} autoComplete="on" noValidate>
          <h1 className={styles.title}>Guide Registration</h1>
          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.columnsContainer}>
            {/* Personal Information Column */}
            <div className={styles.column}>
              <div className={styles.formGroup}>
                <label htmlFor="name">Full Name</label>
                <input
                  className={styles.input}
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="gender">Gender</label>
                <select
                  className={styles.input}
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="dob">Date of Birth</label>
                <input
                  className={styles.input}
                  type="date"
                  id="dob"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="nic">NIC Number</label>
                <input
                  className={styles.input}
                  type="text"
                  id="nic"
                  name="nic"
                  value={formData.nic}
                  onChange={handleInputChange}
                  pattern="^(?:\d{9}[vVxX]|\d{12})$"
                  title="Sri Lankan NIC format (old or new)"
                  required
                />
              </div>
            </div>
            {/* Contact Information Column */}
            <div className={styles.column}>
              <div className={styles.formGroup}>
                <label htmlFor="contact">Contact Number</label>
                <input
                  className={styles.input}
                  type="tel"
                  id="contact"
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  pattern="^(?:\+94|0)[1-9]\d{8}$"
                  title="Sri Lankan phone number format"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="email">Email Address</label>
                <input
                  className={styles.input}
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Availability</label>
                <div className={styles.checkboxGroup}>
                  {['Weekdays', 'Weekends'].map(option => (
                    <label key={option}>
                      <input
                        type="checkbox"
                        checked={formData.availability.includes(option)}
                        onChange={() => handleCheckboxChange('availability', option)}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Languages</label>
                <div className={styles.checkboxGroup}>
                  {['English', 'Sinhala', 'Tamil', 'Japanese', 'German', 'French'].map(lang => (
                    <label key={lang}>
                      <input
                        type="checkbox"
                        checked={formData.languages.includes(lang)}
                        onChange={() => handleCheckboxChange('languages', lang)}
                      />
                      {lang}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Locations Section */}
          <div className={styles.formGroup}>
            <label>Covered Locations</label>
            <div className={styles.locationsGrid}>
              {locations.map(location => (
                <label key={location} className={styles.locationCheckbox}>
                  <input
                    type="checkbox"
                    checked={formData.coveredLocations.includes(location)}
                    onChange={() => handleCheckboxChange('coveredLocations', location)}
                  />
                  {location}
                </label>
              ))}
            </div>
          </div>
          {/* Experiences and Description */}
          <div className={styles.formGroup}>
            <label htmlFor="experiences">Experiences</label>
            <textarea
              className={styles.textarea}
              id="experiences"
              name="experiences"
              value={formData.experiences}
              onChange={handleInputChange}
              rows={4}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="description">Description</label>
            <textarea
              className={styles.textarea}
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
            />
          </div>
          <button className={styles.submitButton} type="submit">
            Register as Guide
          </button>
        </form>
      </div>
    </>
  );
};

export default GuideForm;
