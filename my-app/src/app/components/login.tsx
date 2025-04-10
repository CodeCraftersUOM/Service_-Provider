import React from "react";
import styles from "./login.module.css"; // Import the CSS module

const Login = () => {
  return (
    <div className={styles.container}>
      <button className={`${styles.button} ${styles.loginBtn}`}>LOG IN</button>
      <span className={styles.separator}>_____  OR  _____ </span>
      <button className={`${styles.button} ${styles.signupBtn}`}>SIGN UP</button>
    </div>
  );
};

export default Login;
