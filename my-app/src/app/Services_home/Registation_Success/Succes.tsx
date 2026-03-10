'use client';

import { useRouter } from 'next/navigation';
import styles from './Succes.module.css';
import { FaCheckCircle } from 'react-icons/fa';
import Link from 'next/link';

<Link href="/Dashboard" className={styles.button}>
  Go to Dashboard
</Link>


const RegisterSuccess = () => {
  const router = useRouter();

  const handleGoToDashboard = () => {
    router.push('/Dashboard');
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <FaCheckCircle className={styles.icon} />
        <h1 className={styles.title}>Registration Successful</h1>
        <p className={styles.subtitle}>
          Welcome aboard! Your account has been created successfully.
        </p>
        <Link href="/Dashboard" className={styles.button}>
            Go to Dashboard
            </Link>
      </div>
    </div>
  );
};

export default RegisterSuccess;
