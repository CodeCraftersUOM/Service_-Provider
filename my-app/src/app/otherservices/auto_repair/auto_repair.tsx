// pages/other-services.tsx

import React from 'react';
import Head from 'next/head';
import styles from './auto_repair.module.css';

const OtherServices = () => {
  return (
    <>
      <Head>
        <title>Auto Repair</title>
      </Head>
      <div className={styles.container}>
        <form className={styles.form}>
          <h1 className={styles.title}>Auto Repair</h1>

          <label htmlFor="Types of Services Offered ">Types of Services Offered </label>
          <input className={styles.input} type="text" id="Service" placeholder="(Oil change, tire repair, engine diagnostics, etc.)" />

          <label htmlFor="Service Area">Service Area</label>
          <input className={styles.input} type="text" id="Service Area" placeholder=" Enter the Service Area" />

          <label htmlFor="Pricing Details">Pricing Details</label>
          <input className={styles.input} type="text" id="Pricing Details" placeholder="Rates for common repairs and services" />

          <label htmlFor="Special Equipment">Special Equipment</label>
          <input className={styles.input} type="text" id="Special Equipment" placeholder="Enter your  specialized repair work" />

          <label htmlFor="Payment Methods">Payment Methods</label>
          <input className={styles.input} type="text" id="Payment Methods" placeholder="Enter Payment Methods" />

          <label htmlFor="Promotions">Promotions</label>
          <input className={styles.input} type="text" id="Promotions" placeholder="Enter Promotions" />

          <label htmlFor="Emergency Services">Emergency Services</label>
          <input className={styles.input} type="text" id="Promotions" placeholder="24/7 repair or emergency roadside assistance" />


          <button className={styles.submitButton} type="submit">Submit</button>
        </form>
      </div>
    </>
  );
};

export default OtherServices;
