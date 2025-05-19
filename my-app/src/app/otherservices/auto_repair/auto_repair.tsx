'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import styles from './auto_repair.module.css';

const AutoRepair = () => {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/auto-repair/confirmation');
  };

  return (
    <>
      <Head>
        <title>Auto Repair Services | Professional Automotive Solutions</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Professional auto repair services form" />
      </Head>
      <div className={styles.container}>
        <form className={styles.form} onSubmit={handleSubmit} autoComplete="on" noValidate>
          <h1 className={styles.title}>Auto Repair Services</h1>

          <div className={styles.columnsContainer}>
            {/* First column with 4 fields */}
            <div className={styles.column}>
              <div className={styles.formGroup}>
                <label htmlFor="serviceTypes">Services Offered</label>
                <input
                  className={styles.input}
                  type="text"
                  id="serviceTypes"
                  name="serviceTypes"
                  placeholder="Oil changes, brakes, diagnostics, etc."
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="serviceArea">Service Area</label>
                <input
                  className={styles.input}
                  type="text"
                  id="serviceArea"
                  name="serviceArea"
                  placeholder="Cities/regions you serve"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="pricing">Pricing Details</label>
                <input
                  className={styles.input}
                  type="text"
                  id="pricing"
                  name="pricing"
                  placeholder="Rates for common services"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="equipment">Special Equipment</label>
                <input
                  className={styles.input}
                  type="text"
                  id="equipment"
                  name="equipment"
                  placeholder="Specialized tools/equipment"
                />
              </div>
            </div>

            {/* Second column with 2 fields */}
            <div className={styles.column}>
              <div className={styles.formGroup}>
                <label htmlFor="payment">Payment Methods</label>
                <input
                  className={styles.input}
                  type="text"
                  id="payment"
                  name="payment"
                  placeholder="Credit cards, cash, financing"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="emergency">Emergency Services</label>
                <input
                  className={styles.input}
                  type="text"
                  id="emergency"
                  name="emergency"
                  placeholder="24/7 or roadside assistance"
                />
              </div>
            </div>
          </div>

          <button className={styles.submitButton} type="submit">
            Submit 
          </button>
        </form>
      </div>
    </>
  );
};

export default AutoRepair;