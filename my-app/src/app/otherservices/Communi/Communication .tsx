// pages/other-services.tsx

import React from 'react';
import Head from 'next/head';
import styles from './Communication.module.css';

const OtherServices = () => {
  return (
    <>
      <Head>
        <title>Communication Service</title>
      </Head>
      <div className={styles.container}>
        <form className={styles.form}>
          <h1 className={styles.title}>Communication Service</h1>

          <label htmlFor="Service Types Offered">Service Types Offered </label>
          <input className={styles.input} type="text" id="Service" placeholder="(Internet, phone, TV services, etc.)" />

          <label htmlFor="Service Coverage Area">Service Coverage Area</label>
          <input className={styles.input} type="text" id="Service Area" placeholder=" Enter the Which regions or areas the service covers" />

          <label htmlFor="Pricing Details">Pricing Details</label>
          <input className={styles.input} type="text" id="Pricing Details" placeholder="Rates for common repairs and services" />

          <label htmlFor="Special Equipment">Special Equipment</label>
          <input className={styles.input} type="text" id="Special Equipment" placeholder="Enter your  specialized repair work" />

          <label htmlFor="Service Speed">Service Speed</label>
          <input className={styles.input} type="text" id="Service Speed" placeholder="Internet speed, call quality, etc." />

          <label htmlFor="Payment Methods">Payment Methods</label>
          <input className={styles.input} type="text" id="Payment Methods" placeholder="Enter Payment Methods" />

          <label htmlFor="Promotions">Promotions</label>
          <input className={styles.input} type="text" id="Promotions" placeholder="Enter Promotions" />

          


          <button className={styles.submitButton} type="submit">Submit</button>
        </form>
      </div>
    </>
  );
};

export default OtherServices;
