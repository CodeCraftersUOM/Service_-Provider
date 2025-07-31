'use client';

import Image from "next/image";
import Link from "next/link";
import { FaUser } from "react-icons/fa";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import styles from "./Navbar.module.css";
import NotificationPanel from "./NotificationPanel";

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const checkAuthStatus = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:2000/api/check-auth", {
        method: "GET",
        credentials: "include", // Include cookies
      });

      const newAuthStatus = response.ok;
      
      // Only update state if it actually changed to prevent unnecessary re-renders
      if (newAuthStatus !== isAuthenticated) {
        setIsAuthenticated(newAuthStatus);
      }
    } catch (error) {
      console.error("Auth check error:", error);
      if (isAuthenticated !== false) {
        setIsAuthenticated(false);
      }
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Check authentication status on component mount and when pathname changes
  useEffect(() => {
    checkAuthStatus();
  }, [pathname, checkAuthStatus]);

  // Listen for custom auth events
  useEffect(() => {
    const handleAuthChange = () => {
      checkAuthStatus();
    };

    // Listen for storage events (for cross-tab updates)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_status_changed') {
        checkAuthStatus();
      }
    };

    // Listen for custom events
    window.addEventListener('authStateChanged', handleAuthChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('authStateChanged', handleAuthChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [checkAuthStatus]);

  // Periodic auth check (optional - for extra reliability)
  useEffect(() => {
    const interval = setInterval(() => {
      checkAuthStatus();
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [checkAuthStatus]);

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
      
      // Trigger custom event to notify other components
      window.dispatchEvent(new CustomEvent('authStateChanged'));
      
      // Also trigger storage event for cross-tab updates
      localStorage.setItem('auth_status_changed', Date.now().toString());
      localStorage.removeItem('auth_status_changed');
      
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

            <NotificationPanel />
            {/* REMOVED: <NotificationDropdown /> */}
          </>
        ) : (
          // Show these when user is NOT logged in
          <>
            <Link href="/login" className={styles.loginBtn}>Log in</Link>
            <Link href="/signup" className={styles.signupBtn}>Sign up</Link>

            <NotificationPanel />
            {/* REMOVED: <NotificationDropdown /> */}
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;