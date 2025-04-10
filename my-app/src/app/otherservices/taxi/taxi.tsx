// pages/other-services.tsx

import React from 'react';
import Head from 'next/head';
import styles from './taxi.module.css';

const OtherServices = () => {
  return (
    <>
      <Head>
        <title>Taxi</title>
      </Head>
      <div className={styles.container}>
        <form className={styles.form}>
          <h1 className={styles.title}>Taxi</h1>

          <label htmlFor="Vehicle Type ">Vehicle Type</label>
          <input className={styles.input} type="text" id="Vehicle Type" placeholder="Enter your Vehicle Type" />

          <label htmlFor="License Plate Number">License Plate Number</label>
          <input className={styles.input} type="text" id="License Plate Number" placeholder=" Enter the License Plate Number" />

          <label htmlFor="Service Area">Service Area</label>
          <input className={styles.input} type="text" id="Service Area" placeholder="Enter Service Area" />

          <label htmlFor="Rate Structure">Rate Structure</label>
          <input className={styles.input} type="text" id="Rate Structure" placeholder="Enter your Rate Structure" />

          <label htmlFor="Preferred Booking Method">Preferred Booking Method</label>
          <input className={styles.input} type="text or url" id="Preferred Booking Method" placeholder="Enteryou  App link, call, etc" />


          <label htmlFor="Promotions and discounts">Promotions and discounts</label>
          <input className={styles.input} type="text" id="Promotions and discounts" placeholder="Enteryou  Promotions and discounts" />


          <button className={styles.submitButton} type="submit">Submit</button>
        </form>
      </div>
    </>
  );
};

export default OtherServices;
