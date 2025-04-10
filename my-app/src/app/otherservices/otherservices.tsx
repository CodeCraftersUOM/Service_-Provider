// pages/other-services.tsx

import React from 'react';
import Head from 'next/head';
import styles from './otherservices.module.css';

const OtherServices = () => {
  return (
    <>
      <Head>
        <title>Other Services</title>
      </Head>
      <div className={styles.container}>
        <form className={styles.form}>
          <h1 className={styles.title}>Other Services</h1>

          <label htmlFor="businessName">Business Name</label>
          <input className={styles.input} type="text" id="businessName" placeholder="Enter Business Name" />

          <label htmlFor="ownerName">Owner/Representative Name</label>
          <input className={styles.input} type="text" id="ownerName" placeholder="Enter Name" />

          <label htmlFor="email">Business Email</label>
          <input className={styles.input} type="email" id="email" placeholder="Enter Email Address" />

          <label htmlFor="phone">Business Phone Number</label>
          <input className={styles.input} type="tel" id="phone" placeholder="Enter Phone Number" />

          <label htmlFor="address">Business Address</label>
          <input className={styles.input} type="text" id="address" placeholder="Enter Address" />

          <label htmlFor="website">Business Website Link</label>
          <input className={styles.input} type="url" id="website" placeholder="Enter Website URL" />

          <button className={styles.submitButton} type="submit">Submit</button>
        </form>
      </div>
    </>
  );
};

export default OtherServices;
