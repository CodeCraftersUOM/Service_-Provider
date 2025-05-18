'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import styles from './otherservices.module.css';

const OtherServices = () => {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Handle form submission logic here (e.g., send data to backend)

    // Navigate to the service selection page
    router.push('/otherservices/servicesilection');
  };

  return (
    <>
      <Head>
        <title>Other Services</title>
        {/* Import modern font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div className={styles.container}>
        <form className={styles.form} onSubmit={handleSubmit} autoComplete="on" noValidate>
          <h1 className={styles.title}>Other Services</h1>

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

          <label htmlFor="website">Business Website Link</label>
          <input
            className={styles.input}
            type="url"
            id="website"
            name="website"
            placeholder="Enter Website URL"
            autoComplete="url"
          />

          <button className={styles.submitButton} type="submit">
            Submit
          </button>
        </form>
      </div>
    </>
  );
};

export default OtherServices;
