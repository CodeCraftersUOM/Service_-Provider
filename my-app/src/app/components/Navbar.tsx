'use client';

import Image from "next/image";
import Link from "next/link";
import { FaUser, FaBell } from "react-icons/fa";
import styles from "./Navbar.module.css";

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      {/* Logo & Brand */}
      <div className={styles.navbarLeft}>

        <Image src="/logo.png" alt="Travelwish Logo" width={48} height={48} priority />

        <span className={styles.brandName}>Travelwish</span>
      </div>

      {/* Navigation Links */}
      <div className={styles.navbarCenter}>

        <Link href="#" className={styles.navLink}>Become a<br />Service Provider</Link>

        <Link href="#" className={styles.navLink}>Categories</Link>
        <Link href="#" className={styles.navLink}>About</Link>
      </div>


      {/* User Actions */}
      <div className={styles.navbarRight}>
        <button className={styles.iconButton} aria-label="Profile">
          <FaUser />
        </button>
        <Link href="#" className={styles.loginBtn}>Log in</Link>
        <Link href="#" className={styles.signupBtn}>Sign up</Link>
        <button className={styles.iconButton} aria-label="Notifications">
          <FaBell />
        </button>

      </div>
    </nav>
  );
};

export default Navbar;
