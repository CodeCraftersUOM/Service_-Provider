"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from "./loginpage.module.css";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/Dashboard';

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:2000/api/check-auth", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          // User is already logged in, redirect them
          router.push(redirectUrl);
        }
      } catch (error) {
        // User is not logged in, stay on login page
        console.log("User not authenticated");
      }
    };

    checkAuth();
  }, [router, redirectUrl]);

  // Validation functions
  const validateEmail = (email: string): string => {
    if (!email.trim()) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const validatePassword = (password: string): string => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    return "";
  };

  const validateForm = (): boolean => {
    const errors: {[key: string]: string} = {};
    
    errors.email = validateEmail(email);
    errors.password = validatePassword(password);
    
    // Remove empty errors
    Object.keys(errors).forEach(key => {
      if (!errors[key]) delete errors[key];
    });
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
    
    // Update the corresponding state
    switch (field) {
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
    }
  };

  // Function to notify navbar and other components about auth state change
  const notifyAuthStateChange = () => {
    // Trigger custom event to notify navbar and other components
    window.dispatchEvent(new CustomEvent('authStateChanged'));
    
    // Also trigger storage event for cross-tab updates
    localStorage.setItem('auth_status_changed', Date.now().toString());
    localStorage.removeItem('auth_status_changed');
  };

  const handleLogin = async () => {
    // Clear previous errors
    setError('');
    
    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch("http://localhost:2000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // send cookies if using auth with cookies
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login successful:", data);

        // Notify all components about the authentication state change
        notifyAuthStateChange();

        // Small delay to ensure the navbar updates before navigation
        setTimeout(() => {
          // Redirect to the originally requested page or dashboard
          router.push(redirectUrl);
        }, 100);
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Welcome Back!</h2>
        <p className={styles.subtitle}>
          {searchParams.get('redirect') ? 
            'Please log in to access this page' : 
            'Login to your account'
          }
        </p>

        {error && <p className={styles.error}>{error}</p>}

        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`${styles.input} ${fieldErrors.email ? styles.inputError : ''}`}
          />
          {fieldErrors.email && <p className={styles.fieldError}>{fieldErrors.email}</p>}
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            className={`${styles.input} ${fieldErrors.password ? styles.inputError : ''}`}
          />
          {fieldErrors.password && <p className={styles.fieldError}>{fieldErrors.password}</p>}
        </div>

        <button onClick={handleLogin} className={styles.button}>LOG IN</button>

        <p className={styles.footer}>
          Don't have an account?{" "}
          <Link href="/signup" className={styles.link}>Sign up</Link>
        </p>
      </div>
    </div>
  );
}