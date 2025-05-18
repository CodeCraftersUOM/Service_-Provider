'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import styles from './otherservices.module.css';

const OtherServices = () => {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/otherservices/servicesilection');
  };

  return (
    <>
      <Head>
        <title>Other Services</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className={styles.container}>
        <form className={styles.form} onSubmit={handleSubmit} autoComplete="on" noValidate>
          <h1 className={styles.title}>Other Services</h1>

          <div className={styles.columnsContainer}>
            {/* First column with 4 fields */}
            <div className={styles.column}>
              <div className={styles.formGroup}>
                <label htmlFor="businessName">Business Name</label>
                <input
                  className={styles.input}
                  type="text"
                  id="businessName"
                  name="businessName"
                  placeholder="Enter Business Name"
                  required
                  autoComplete="organization"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="ownerName">Owner/Representative Name</label>
                <input
                  className={styles.input}
                  type="text"
                  id="ownerName"
                  name="ownerName"
                  placeholder="Enter Name"
                  required
                  autoComplete="name"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email">Business Email</label>
                <input
                  className={styles.input}
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter Email Address"
                  required
                  autoComplete="email"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="phone">Business Phone Number</label>
                <input
                  className={styles.input}
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="Enter Phone Number"
                  required
                  autoComplete="tel"
                />
              </div>
            </div>

            {/* Second column with 2 fields */}
            <div className={styles.column}>
              <div className={styles.formGroup}>
                <label htmlFor="address">Business Address</label>
                <input
                  className={styles.input}
                  type="text"
                  id="address"
                  name="address"
                  placeholder="Enter Address"
                  required
                  autoComplete="street-address"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="website">Business Website Link</label>
                <input
                  className={styles.input}
                  type="url"
                  id="website"
                  name="website"
                  placeholder="Enter Website URL"
                  autoComplete="url"
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

export default OtherServices;