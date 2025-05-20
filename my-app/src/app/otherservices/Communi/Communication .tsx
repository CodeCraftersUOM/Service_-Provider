'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import styles from './Communication.module.css';

const CommunicationService = () => {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic here
    router.push('/communication/confirmation');
  };

  return (
    <>
      <Head>
        <title>Communication Services | Professional Connectivity Solutions</title>
        <meta name="description" content="Register your communication services with our professional network" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      
      <div className={styles.container}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <h1 className={styles.title}>Communication Services</h1>
          <p className={styles.subtitle}>Register your communication service provider details</p>

          <div className={styles.formGrid}>
            {/* Left Column */}
            <div className={styles.formColumn}>
              <div className={styles.formGroup}>
                <label htmlFor="serviceTypes">Service Types Offered*</label>
                <input
                  type="text"
                  id="serviceTypes"
                  className={styles.input}
                  placeholder="Internet, phone, TV services, etc."
                  required
                />
                <span className={styles.inputHelp}>List all services you provide</span>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="coverageArea">Service Coverage Area*</label>
                <input
                  type="text"
                  id="coverageArea"
                  className={styles.input}
                  placeholder="Cities, regions or areas covered"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="pricing">Pricing Details*</label>
                <input
                  type="text"
                  id="pricing"
                  className={styles.input}
                  placeholder="Monthly rates, package costs"
                  required
                />
              </div>
            </div>

            {/* Right Column */}
            <div className={styles.formColumn}>
              <div className={styles.formGroup}>
                <label htmlFor="serviceSpeed">Service Speed*</label>
                <input
                  type="text"
                  id="serviceSpeed"
                  className={styles.input}
                  placeholder="Download/upload speeds, call quality"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="paymentMethods">Payment Methods*</label>
                <select id="paymentMethods" className={styles.input} required>
                  <option value="">Select payment methods</option>
                  <option value="credit">Credit/Debit Cards</option>
                  <option value="bank">Bank Transfer</option>
                  <option value="digital">Digital Wallets</option>
                  <option value="cash">Cash</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="promotions">Current Promotions</label>
                <textarea
                  id="promotions"
                  className={`${styles.input} ${styles.textarea}`}
                  placeholder="Special offers, discounts, or bundles"
                  rows={3}
                ></textarea>
              </div>
            </div>
          </div>

          <div className={styles.formFooter}>
            <button type="submit" className={styles.submitButton}>
              Submit 
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CommunicationService;