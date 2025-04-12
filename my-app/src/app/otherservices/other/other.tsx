// pages/other-services.tsx

import React from 'react';
import Head from 'next/head';
import styles from './other.module.css';

const OtherServices = () => {
  return (
    <>
      <Head>
        <title>Communication Service</title>
      </Head>
      <div className={styles.container}>
        <form className={styles.form}>
          <h1 className={styles.title}>Communication Service</h1>

          <label htmlFor="Service Description">Service Description </label>
          <input className={styles.input} type="text" id="Service" placeholder="(Details about the type of service offered)" />

          <label htmlFor="Service Categories">Service Categories</label>
          <input className={styles.input} type="text" id="Service Categories" placeholder="  transportation, repair, entertainment, etc" />

          <label htmlFor="Pricing Details">Pricing Details</label>
          <input className={styles.input} type="text" id="Pricing Details" placeholder="Rates for common repairs and services" />

          <label htmlFor="Availability">Availability</label>
          <input className={styles.input} type="text" id="Availability" placeholder="Booking schedules, operational hours" />

          <label htmlFor="Terms and Conditions">Terms and Conditions</label>
          <input className={styles.input} type="text" id="Terms and Conditions" placeholder="(Basic terms regarding service provision." />

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
