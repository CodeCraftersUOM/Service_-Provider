"use client";

import React, { useState, ChangeEvent } from 'react';
import Head from 'next/head';
import styles from './guide03.module.css';

const OtherServices = () => {
  return (
    <>
      <Head>
        <title>payments</title>
      </Head>
      <div className={styles.container}>
        <form className={styles.form}>
          <h1 className={styles.title}>payments</h1>

          <label htmlFor="Hourly Rate">Hourly Rate</label>
          <input className={styles.input} type="text" id="Hourly Rate" placeholder="Enter your Hourly Rate" />

          <label htmlFor="Full-Day Rate">Full-Day Rate</label>
          <input className={styles.input} type="text" id="Full-Day Rate" placeholder=" Enter you Full-Day Rate" />

          <label htmlFor="Special Package ">Special Package </label>
          <input className={styles.input} type="text" id="Special Package" placeholder="Enter your Special Package" />

          <label htmlFor="Promotions ">Promotions </label>
          <input className={styles.input} type="text" id="Promotions" placeholder="Enter your Promotions" />

        </form>
      </div>



      <Head>
        <title>Legal and Safety</title>
      </Head>
      <div className={styles.container}>
        <form className={styles.form02}>
          <h1 className={styles.title}>Legal and Safety</h1>

          <label htmlFor="License Number">License Number</label>
          <input className={styles.input} type="text" id="License Number" placeholder="Enter your License Number" />

          <label htmlFor="Emergency Contact Information">Emergency Contact Information</label>
          <input className={styles.input} type="text" id="Emergency Contact Information" placeholder=" Enter you Emergency Contact Information" />

          <button className={styles.submitButton} type="submit">Next Page</button>
        </form>
      </div>


    </>
  );
};

export default OtherServices;
