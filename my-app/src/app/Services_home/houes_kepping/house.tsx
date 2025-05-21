import React from 'react';
import Head from 'next/head';
import styles from './house.module.css';

const OtherServices = () => {
  return (
    <>
      <Head>
        <title>House Keeping</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div className={styles.container}>
        <form className={styles.form} autoComplete="on" noValidate>
          <h1 className={styles.title}>House Keeping</h1>

          <div className={styles.formColumns}>
            <div className={styles.leftColumn}>
              <label htmlFor="serviceType">Service Type</label>
              <input
                className={styles.input}
                type="text"
                id="serviceType"
                name="serviceType"
                placeholder="e.g., Cleaning, Laundry, etc."
                required
              />

              <label htmlFor="serviceArea">Service Area</label>
              <input
                className={styles.input}
                type="text"
                id="serviceArea"
                name="serviceArea"
                placeholder="Enter the Service Area"
                required
              />

              <label htmlFor="languagesSpoken">Languages Spoken</label>
              <input
                className={styles.input}
                type="text"
                id="languagesSpoken"
                name="languagesSpoken"
                placeholder="Enter Languages"
                required
              />
            </div>

            <div className={styles.rightColumn}>
              <label htmlFor="ratesPricing">Rates/Pricing</label>
              <input
                className={styles.input}
                type="text"
                id="ratesPricing"
                name="ratesPricing"
                placeholder="Enter your Rates/Pricing"
                required
              />

              <label htmlFor="promotions">Promotions</label>
              <input
                className={styles.input}
                type="text"
                id="promotions"
                name="promotions"
                placeholder="Enter Promotions"
              />
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
