// pages/other-services.tsx

import React from 'react';
import Head from 'next/head';
import styles from './card.module.css';

const OtherServices = () => {
  return (
    <>
      <Head>
        <title>card details</title>
      </Head>
      <div className={styles.container}>
        <form className={styles.form}>
          <h1 className={styles.title}>Add your Card Details</h1>

          <label htmlFor="card holder name">Card holder name</label>
          <input className={styles.input} type="text" id="Card holder name" placeholder="Enter Card holder name" />

          <label htmlFor="Card Number"> Card Number</label>
          <input className={styles.input} type="number" id=" Number" placeholder=" Enter card Number" />

          <label htmlFor="expair date">Expair Date</label>
          <input className={styles.input} type="number" id="Service Area" placeholder="Enter Expair date" />

          <label htmlFor="Cvv">Cvv</label>
          <input className={styles.input} type="number" id="Rate Structure" placeholder="Enter your Cvv" />


          <button className={styles.submitButton} type="submit">Submit</button>
        </form>
      </div>
    </>
  );
};

export default OtherServices;
