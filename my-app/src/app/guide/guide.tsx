// pages/other-services.tsx

import React from 'react';
import Head from 'next/head';
import styles from './guide.module.css';

const OtherServices = () => {
  return (
    <>
      <Head>
        <title>Guide</title>
      </Head>
      <div className={styles.container}>
        <form className={styles.form}>
          <h1 className={styles.title}>Guide</h1>

          <label htmlFor="Full Name">Full Name</label>
          <input className={styles.input} type="text" id="Full Name" placeholder="Enter your full Name" />

          <label htmlFor="Service Area">Gender</label>
          <input className={styles.input} type="text" id="Gender" placeholder=" Enter your  Gender" />

          <label htmlFor="Date of Birth ">Date of Birth </label>
          <input className={styles.input} type="text" id="Date of Birth " placeholder="Enter your Date of Birth " />

          <label htmlFor="National ID">National ID Number</label>
          <input className={styles.input} type="number" id="National ID" placeholder="Enter your National ID" />

          <label htmlFor="Contact Number">Contact Number</label>
          <input className={styles.input} type="number" id="Contact Number" placeholder="Enteryour Contact Number" />

          <label htmlFor="Email Address">Email Address</label>
          <input className={styles.input} type="email" id="Email Address" placeholder="Enter your Email Address" />

          <button className={styles.submitButton} type="submit">Next Page</button>
        </form>
      </div>
    </>
  );
};

export default OtherServices;
