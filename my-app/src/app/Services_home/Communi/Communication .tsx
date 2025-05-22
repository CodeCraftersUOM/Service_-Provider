'use client';

import React, { useState } from 'react';
import Head from 'next/head';
import styles from './Communication.module.css';

const CommunicationService = () => {
  const [formData, setFormData] = useState({
    serviceTypesOffered: '',
    serviceSpeed: '',
    serviceCoverageArea: '',
    pricingDetails: '',
    paymentMethods: '',
    currentPromotions: '',
  });

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
    setSuccess(false);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      serviceTypesOffered: formData.serviceTypesOffered.split(',').map(item => item.trim()),
      serviceSpeed: formData.serviceSpeed,
      serviceCoverageArea: formData.serviceCoverageArea.split(',').map(item => item.trim()),
      pricingDetails: formData.pricingDetails,
      paymentMethods: [formData.paymentMethods],
      currentPromotions: formData.currentPromotions,
    };

    try {
      const res = await fetch('http://localhost:2000/api/addCommuni', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSuccess(true);
        setError('');
        setFormData({
          serviceTypesOffered: '',
          serviceSpeed: '',
          serviceCoverageArea: '',
          pricingDetails: '',
          paymentMethods: '',
          currentPromotions: '',
        });
      } else {
        const data = await res.json();
        setError(data?.message || 'Failed to submit form');
        setSuccess(false);
      }
    } catch (err) {
      setError('Network error. Please try again.');
      setSuccess(false);
    }
  };

  return (
    <>
      <Head>
        <title>Communication Services | Professional Connectivity Solutions</title>
        <meta name="description" content="Register your communication services with our professional network" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.container}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <h1 className={styles.title}>Communication Services</h1>
          <p className={styles.subtitle}>Register your communication service provider details</p>

          <div className={styles.formGrid}>
            <div className={styles.formColumn}>
              <div className={styles.formGroup}>
                <label htmlFor="serviceTypesOffered">Service Types Offered*</label>
                <input
                  type="text"
                  id="serviceTypesOffered"
                  className={styles.input}
                  placeholder="Internet, phone, TV services, etc."
                  value={formData.serviceTypesOffered}
                  onChange={handleChange}
                  required
                />
                <span className={styles.inputHelp}>Comma-separated list</span>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="serviceCoverageArea">Service Coverage Area*</label>
                <input
                  type="text"
                  id="serviceCoverageArea"
                  className={styles.input}
                  placeholder="Cities, regions or areas covered"
                  value={formData.serviceCoverageArea}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="pricingDetails">Pricing Details*</label>
                <input
                  type="text"
                  id="pricingDetails"
                  className={styles.input}
                  placeholder="Monthly rates, package costs"
                  value={formData.pricingDetails}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className={styles.formColumn}>
              <div className={styles.formGroup}>
                <label htmlFor="serviceSpeed">Service Speed*</label>
                <input
                  type="text"
                  id="serviceSpeed"
                  className={styles.input}
                  placeholder="Download/upload speeds, call quality"
                  value={formData.serviceSpeed}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="paymentMethods">Payment Method*</label>
                <select
                  id="paymentMethods"
                  className={styles.input}
                  value={formData.paymentMethods}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select payment method</option>
                  <option value="Cash">Cash</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit Card">Debit Card</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Online Payment">Online Payment</option>
                  <option value="Mobile Payment">Mobile Payment</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="currentPromotions">Current Promotions</label>
                <textarea
                  id="currentPromotions"
                  className={`${styles.input} ${styles.textarea}`}
                  placeholder="Special offers, discounts, or bundles"
                  rows={3}
                  value={formData.currentPromotions}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>
          </div>

          <div className={styles.formFooter}>
            <button type="submit" className={styles.submitButton}>
              Submit
            </button>
          </div>

          {/* ✅ Success or Error Messages */}
          {success && (
            <p className={styles.successMessage}>Form submitted successfully!</p>
          )}
          {error && (
            <p className={styles.errorMessage}>{error}</p>
          )}
        </form>
      </div>
    </>
  );
};

export default CommunicationService;
