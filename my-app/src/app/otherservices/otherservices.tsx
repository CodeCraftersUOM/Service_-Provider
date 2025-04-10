import React from 'react';
import styles from './otherservices.module.css';

const OtherServiceForm: React.FC = () => {
  return (
    <div className={styles.wrapper}>
         <h2 className="text-xl
    font-bold
    mb-
    text-align: center;
    color: #333;
    margin-top: 300px;">Other Services</h2> 
      <div className={styles.container}>
       
        <form className={styles.form}>
          <input className={styles.input} type="text" placeholder="Business Name" />
          <input className={styles.input} type="text" placeholder="Owner/Representative Name" />
          <input className={styles.input} type="email" placeholder="Business Email" />
          <input className={styles.input} type="tel" placeholder="Business Phone Number" />
          <input className={styles.input} type="text" placeholder="Business Address" />
          <input className={styles.input} type="url" placeholder="Your business Web Site Link" />
          <input className={styles.input} type="text" placeholder="Business Type" />
        </form>
      </div>
    </div>
  );
};

export default OtherServiceForm;
