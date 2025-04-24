import React from 'react';
import Head from 'next/head';
import styles from './guide04.module.css';

const OtherServices = () => {
  return (
    <>
      <Head>
        <title> Media and Proof</title>
      </Head>
      <div className={styles.container}>
        <form className={styles.form}>
          <h1 className={styles.title}> Media and Proof</h1>

  
          <label htmlFor="Profile Video Introduction">Profile Video Introduction</label>
          <input className={styles.input} type="file" id="profilePicture" accept="image/*" />
      
          
          <label htmlFor="profilePicture">Upload Profile Picture</label>
          <label className={styles.inputtext}>Photo 01</label>
          <input className={styles.input} type="file" id="photo01" accept="image/*" />
        

          <label className={styles.inputtext}>Photo 02</label>
          <input className={styles.input} type="file" id="photo02" accept="image/*" />
        
          <label className={styles.inputtext}>Photo 03</label>
          <input className={styles.input} type="file" id="photo03" accept="image/*" />
          
          <label className={styles.inputtext}>Photo 04</label>
          <input className={styles.input} type="file" id="photo04" accept="image/*" />
          


          <label htmlFor="Photos  of Customer Testimonials ">Photos  of Customer Testimonials</label>
          <label className={styles.inputtext}>Photo 01</label>
          <input className={styles.input} type="file" id="photo01" accept="image/*" />
          
          <label className={styles.inputtext}>Photo 02</label>
          <input className={styles.input} type="file" id="photo02" accept="image/*" />
          

          <label className={styles.inputtext}>Photo 03</label>
          <input className={styles.input} type="file" id="photo03" accept="image/*" />
          
          <label className={styles.inputtext}>Photo 04</label>
          <input className={styles.input} type="file" id="photo04" accept="image/*" />
          

          <button className={styles.submitButton} type="submit">Submit</button>
        </form>
      </div>
    </>
  );
};

export default OtherServices;
