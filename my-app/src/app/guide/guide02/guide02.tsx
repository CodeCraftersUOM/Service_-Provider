// pages/other-services.tsx

import React from 'react';
import Head from 'next/head';
import styles from './guide02.module.css';

const OtherServices = () => {
  return (
    <>
      <Head>
        <title>Location Details</title>
      </Head>
      <div className={styles.container}>
        <form className={styles.form}>
          <h1 className={styles.title}>Location Details</h1>

          <label htmlFor="Full Name">Base Location</label>
          <input className={styles.input} type="text" id="Base Location" placeholder="Enter your Base Location" />

          <label htmlFor="Areas Covered">Areas Covered</label>
          <input className={styles.input} type="text" id="Areas Covered" placeholder=" Enter you  covered ares" />

          <label htmlFor="Availability ">Availability </label>
          <input className={styles.input} type="text" id="Availability" placeholder="Enter your Availability " />

        </form>
      </div>



      <Head>
        <title>Languages & Experience  </title>
      </Head>
      <div className={styles.container}>
        <form className={styles.form02}>
          <h1 className={styles.title}>Languages & Experience</h1>

          <label htmlFor="languagee">List of languages they can fluently speak</label>
          <input className={styles.input} type="text" id="language" placeholder="e.g., Sinhala, Tamil, English, French, German, etc" />

          <label htmlFor="Years of Experience as a Guide">Years of Experience as a Guide</label>
          <input className={styles.input} type="number" id="Years of Experience as a Guide" placeholder=" Enter you  Experience yers" />

          <label htmlFor="Certifications ">Certifications</label>
          <input className={styles.input} type="text" id="Certifications" placeholder="Enter your Certifications " />

          <label htmlFor="Skills">Skills</label>
          <input className={styles.input} type="text" id="Skills" placeholder="Enter your Skills " />

          <label htmlFor="Specialized Tours Offered">Specialized Tours Offered</label>
          <input className={styles.input} type="text" id="Specialized Tours Offered" placeholder="e.g., historical, wildlife, cultural, adventure, food tours,) " />

          <button className={styles.submitButton} type="submit">Next Page</button>
        </form>
      </div>


    </>
  );
};

export default OtherServices;
