import React from 'react';
import styles from './profile.module.css';
import Image from 'next/image';

const AccountSettings = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.sidebar}>
        <ul>
          <li className={styles.active}>My Profile</li>
          <li>Security</li>
          <li>Teams</li>
          <li>Team Member</li>
          <li>Notifications</li>
          <li>Billing</li>
          <li>Data Export</li>
          <li className={styles.delete}>Delete Account</li>
        </ul>
      </div>

      <div className={styles.content}>
        <h2>My Profile</h2>

        <div className={styles.profileCard}>
          <div className={styles.profileInfo}>
            <Image src="/profile.jpg" alt="Profile" width={70} height={70} className={styles.profileImage} />
            <div>
              <h3>Rafiqur Rahman</h3>
              <p>Team Manager</p>
              <p className={styles.location}>Leeds, United Kingdom</p>
            </div>
          </div>
          <button className={styles.editBtn}>Edit ✎</button>
        </div>

        <div className={styles.infoCard}>
          <div className={styles.cardHeader}>
            <h4>Personal Information</h4>
            <button className={styles.editBtn}>Edit ✎</button>
          </div>
          <div className={styles.grid}>
            <div><span>First Name</span><p>Rafiqur</p></div>
            <div><span>Last Name</span><p>Rahman</p></div>
            <div><span>Email address</span><p>rafiqurrahman51@gmail.com</p></div>
            <div><span>Phone</span><p>+09 345 346 46</p></div>
            <div><span>Bio</span><p>Team Manager</p></div>
          </div>
        </div>

        <div className={styles.infoCard}>
          <div className={styles.cardHeader}>
            <h4>Address</h4>
            <button className={styles.editBtn}>Edit ✎</button>
          </div>
          <div className={styles.grid}>
            <div><span>Country</span><p>United Kingdom</p></div>
            <div><span>City/State</span><p>Leeds, East London</p></div>
            <div><span>Postal Code</span><p>ERT 2354</p></div>
            <div><span>TAX ID</span><p>AS45645756</p></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
