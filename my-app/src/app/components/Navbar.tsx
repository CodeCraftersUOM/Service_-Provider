'use client';

import Image from "next/image";
import Link from "next/link";
import { FaUser, FaBell } from "react-icons/fa";
import styles from "./Navbar.module.css";

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      {/* Left Side - Logo and Brand Name */}
      <div className={styles.navbarLeft}>
        <Link href="/">
          <Image
            src="/logo.png"
            alt="Travelwish Logo"
            width={50}
            height={50}
            priority
            unoptimized
            className={styles.logo}
          />
        </Link>
        <span className={styles.brandName}>Travelwish</span>
      </div>

      {/* Center - Navigation Links */}
      <div className={styles.navbarCenter}>
        <Link href="#" className={styles.navLink}>
          Become a <br /> Service Provider
        </Link>
        <Link href="#" className={styles.navLink}>Categories</Link>
        <Link href="#" className={styles.navLink}>About</Link>
      </div>

      {/* Right Side - Icons and Auth Links */}
      <div className={styles.navbarRight}>
        <FaUser className={styles.icon} aria-label="User" />
        <Link href="/login" className={styles.navLink}>Log in</Link>
        <span className={styles.separator}>|</span>
        <Link href="/signup" className={styles.navLink}>Sign up</Link>
        <FaBell className={styles.icon} aria-label="Notifications" />
      </div>
    </nav>
  );
};

export default Navbar;
