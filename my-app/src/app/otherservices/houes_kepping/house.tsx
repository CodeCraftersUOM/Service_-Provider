// pages/other-services.tsx

import React from 'react';
import Head from 'next/head';
import styles from './house.module.css';

const OtherServices = () => {
  return (
    <>
      <Head>
        <title>House Kepping</title>
      </Head>
      <div className={styles.container}>
        <form className={styles.form}>
          <h1 className={styles.title}>House Kepping</h1>

          <label htmlFor="Service Type ">Service Type </label>
          <input className={styles.input} type="text" id="Service Type" placeholder="(e.g., Cleaning, Laundry, etc.)" />

          <label htmlFor="Service Area">Service Area</label>
          <input className={styles.input} type="text" id="Service Area" placeholder=" Enter the Service Area" />

          <label htmlFor="Languages Spoken">Languages Spoken</label>
          <input className={styles.input} type="text" id="Languages Spoken" placeholder="Enter Languages" />

          <label htmlFor="Rates/Pricing">Rates/Pricing</label>
          <input className={styles.input} type="text" id="Rates/Pricing" placeholder="Enter your Rates/Pricing" />

          <label htmlFor="Promotions">Promotions</label>
          <input className={styles.input} type="text" id="Promotions" placeholder="Enter Promotions" />

          <button className={styles.submitButton} type="submit">Submit</button>
        </form>
      </div>
    </>
  );
};

export default OtherServices;
