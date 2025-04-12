// components/ServiceSelection.tsx
import React from 'react';
import styles from './service.module.css';

const services = [
    { title: 'House Keeping', image: '/house.png' },
    { title: 'Taxi', image: '/taxi.png' },
    { title: 'Communication', image: '/communucation.png' },
    { title: 'Auto Repair', image: '/auto.png' },
    { title: 'Other', image: '/other.png' }, // if this image exists
  ];

export default function ServiceSelection() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Select Your Service Type</h1>
      <div className={styles.rows}>
        <div className={styles.row}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>{services[0].title}</h2>
            <img src={services[0].image} alt={services[0].title} className={styles.image} />
          </div>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>{services[1].title}</h2>
            <img src={services[1].image} alt={services[1].title} className={styles.image} />
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>{services[2].title}</h2>
            <img src={services[2].image} alt={services[2].title} className={styles.image} />
          </div>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>{services[3].title}</h2>
            <img src={services[3].image} alt={services[3].title} className={styles.image} />
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>{services[4].title}</h2>
            <img src={services[4].image} alt={services[4].title} className={styles.image} />
          </div>
        </div>
      </div>
    </div>
  );
}
