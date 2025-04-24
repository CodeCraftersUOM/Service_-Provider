import React from "react";
import Link from "next/link";
import styles from "./login.module.css";

const Login = () => {
  return (
    <div className={styles.container}>
      <Link href="/login">
        <button className={`${styles.button} ${styles.loginBtn}`}>LOG IN</button>
      </Link>
      <span className={styles.separator}>_____  OR  _____ </span>
      <Link href="/signup">
        <button className={`${styles.button} ${styles.signupBtn}`}>SIGN UP</button>
      </Link>
    </div>
  );
};

export default Login;
