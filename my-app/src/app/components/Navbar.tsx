'use client';

import Image from "next/image";
import Link from "next/link";
import { FaUser, FaBell } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check authentication status on component mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch("http://localhost:2000/api/check-auth", {
        method: "GET",
        credentials: "include", // Include cookies
      });

      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Auth check error:", error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterServicesClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      // Redirect to login page with a return URL
      router.push("/login?redirect=/Services_home");
    } else {
      // User is authenticated, proceed to services page
      router.push("/Services_home");
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:2000/api/logout", {
        method: "POST",
        credentials: "include",
      });
      setIsAuthenticated(false);
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (isLoading) {
    return (
      <nav className={styles.navbar}>
        <div className={styles.navbarLeft}>
          <Image src="/logo.png" alt="Travelwish Logo" width={48} height={48} priority />
          <span className={styles.brandName}>Travelwish</span>
        </div>
        <div className={styles.navbarCenter}>
          <span>Loading...</span>
        </div>
        <div className={styles.navbarRight}></div>
      </nav>
    );
  }

  return (
    <nav className={styles.navbar}>
      {/* Logo & Brand */}
      <div className={styles.navbarLeft}>
        <Image src="/logo.png" alt="Travelwish Logo" width={48} height={48} priority />
        <span className={styles.brandName}>Travelwish</span>
      </div>

      {/* Navigation Links */}
      <div className={styles.navbarCenter}>
        <button 
          onClick={handleRegisterServicesClick} 
          className={styles.navLink}
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          Register Services
        </button>
        <Link href="../aboutus" className={styles.navLink}>About Us</Link>
        <Link href="../contactUs" className={styles.navLink}>Contact Us</Link>
      </div>

      {/* User Actions */}
      <div className={styles.navbarRight}>
        {isAuthenticated ? (
          // Show these when user is logged in
          <>
            <Link href="/Dashboard" className={styles.iconButton} aria-label="Profile">
              <FaUser />
            </Link>
            <button 
              onClick={handleLogout} 
              className={styles.loginBtn}
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Log out
            </button>
            <button className={styles.iconButton} aria-label="Notifications">
              <FaBell />
            </button>
          </>
        ) : (
          // Show these when user is NOT logged in
          <>
            <Link href="/login" className={styles.loginBtn}>Log in</Link>
            <Link href="/signup" className={styles.signupBtn}>Sign up</Link>
            <button className={styles.iconButton} aria-label="Notifications">
              <FaBell />
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;