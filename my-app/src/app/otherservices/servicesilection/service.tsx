import React from 'react';
import Link from 'next/link'; // Import Link for navigation
import styles from './service.module.css';

const services = [
  { title: 'House Keeping', image: '/house.png', link: './houes_kepping' },
  { title: 'Taxi', image: '/taxi.png', link: './taxi' },
  { title: 'Communication', image: '/communucation.png', link: './Communi' },
  { title: 'Auto Repair', image: '/auto.png', link: './auto_repair' },
  { title: 'Other', image: '/other.png', link: './other' }, // add the relevant link for "Other"
];

export default function ServiceSelection() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Select Your Service Type</h1>
      <div className={styles.rows}>
        <div className={styles.row}>
          <Link href={services[0].link}>
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>{services[0].title}</h2>
              <img src={services[0].image} alt={services[0].title} className={styles.image} />
            </div>
          </Link>
          <Link href={services[1].link}>
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>{services[1].title}</h2>
              <img src={services[1].image} alt={services[1].title} className={styles.image} />
            </div>
          </Link>
        </div>
        <div className={styles.row}>
          <Link href={services[2].link}>
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>{services[2].title}</h2>
              <img src={services[2].image} alt={services[2].title} className={styles.image} />
            </div>
          </Link>
          <Link href={services[3].link}>
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>{services[3].title}</h2>
              <img src={services[3].image} alt={services[3].title} className={styles.image} />
            </div>
          </Link>
        </div>
        <div className={styles.row}>
          <Link href={services[4].link}>
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>{services[4].title}</h2>
              <img src={services[4].image} alt={services[4].title} className={styles.image} />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
