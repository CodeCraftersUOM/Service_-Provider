// pages/other-services.tsx

import React from 'react';
import Head from 'next/head';
import styles from './auto.module.css';

const OtherServices = () => {
  return (
    <>
      <Head>
        <title>Auto Repair</title>
      </Head>
      <div className={styles.container}>
        <form className={styles.form}>
          <h1 className={styles.title}>Auto Repair</h1>

          <label htmlFor="Types of Services Offered ">Types of Services Offered</label>
          <input className={styles.input} type="text" id="Types of Services Offered" placeholder="Oil change, tire repair, engine diagnostics, etc" />

          <label htmlFor="Service Area">Service Area</label>
          <input className={styles.input} type="text" id="Service Area" placeholder=" Enter the Service Area" />

          <label htmlFor="Pricing Details">Pricing Details</label>
          <input className={styles.input} type="text" id="Pricing Details" placeholder="Enter Pricing Details" />

          <label htmlFor="Payment Methods ">Payment Methods </label>
          <input className={styles.input} type="text" id="Payment Methods " placeholder="Enter your Payment Methods  " />

          <label htmlFor="Emergency Services">Emergency Services</label>
          <input className={styles.input} type="text" id="Emergency Services" placeholder="(If they offer 24/7 repair or emergency roadside assistance" />


          <label htmlFor="Promotions and discounts">Promotions and discounts</label>
          <input className={styles.input} type="text" id="Promotions and discounts" placeholder="Enteryou  Promotions and discounts" />


          <button className={styles.submitButton} type="submit">Submit</button>
        </form>
      </div>
    </>
  );
};

export default OtherServices;
