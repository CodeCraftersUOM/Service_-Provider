"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./signuppage.module.css";

const SignupPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('male');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});
  const router = useRouter();

  // Validation functions
  const validateUsername = (username: string): string => {
    if (!username.trim()) return "Username is required";
    if (username.length < 3) return "Username must be at least 3 characters";
    if (username.length > 20) return "Username must be less than 20 characters";
    if (!/^[a-zA-Z0-9_]+$/.test(username)) return "Username can only contain letters, numbers, and underscores";
    return "";
  };

  const validateFullName = (fullName: string): string => {
    if (!fullName.trim()) return "Full name is required";
    if (fullName.length < 2) return "Full name must be at least 2 characters";
    if (fullName.length > 50) return "Full name must be less than 50 characters";
    if (!/^[a-zA-Z\s]+$/.test(fullName)) return "Full name can only contain letters and spaces";
    return "";
  };

  const validateEmail = (email: string): string => {
    if (!email.trim()) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const validatePassword = (password: string): string => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!/(?=.*[a-z])/.test(password)) return "Password must contain at least one lowercase letter";
    if (!/(?=.*[A-Z])/.test(password)) return "Password must contain at least one uppercase letter";
    if (!/(?=.*\d)/.test(password)) return "Password must contain at least one number";
    if (!/(?=.*[@$!%*?&])/.test(password)) return "Password must contain at least one special character (@$!%*?&)";
    return "";
  };

  const validateDateOfBirth = (dateOfBirth: string): string => {
    if (!dateOfBirth) return "Date of birth is required";
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    if (birthDate > today) return "Date of birth cannot be in the future";
    if (age < 13) return "You must be at least 13 years old";
    if (age > 120) return "Please enter a valid date of birth";
    return "";
  };

  const validateForm = (): boolean => {
    const errors: {[key: string]: string} = {};
    
    errors.username = validateUsername(username);
    errors.fullName = validateFullName(fullName);
    errors.email = validateEmail(email);
    errors.password = validatePassword(password);
    errors.dateOfBirth = validateDateOfBirth(dateOfBirth);
    
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
      case 'username':
        setUsername(value);
        break;
      case 'fullName':
        setFullName(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'dateOfBirth':
        setDateOfBirth(value);
        break;
      case 'gender':
        setGender(value);
        break;
    }
  };

  const handleSignup = async () => {
    // Clear previous errors
    setError('');
    
    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      const res = await fetch("http://localhost:2000/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, email, password, fullName, dateOfBirth, gender }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Signup failed");
        return;
      }

      console.log("Signup successful:", data);
      router.push("/login");
    } catch (err) {
      console.error("Error during signup:", err);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Welcome</h2>
        <p className={styles.subtitle}>Create your account</p>

        {error && <p className={styles.error}>{error}</p>}

        <div>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => handleInputChange('username', e.target.value)}
            className={`${styles.input} ${fieldErrors.username ? styles.inputError : ''}`}
          />
          {fieldErrors.username && <p className={styles.fieldError}>{fieldErrors.username}</p>}
        </div>

        <div>
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            className={`${styles.input} ${fieldErrors.fullName ? styles.inputError : ''}`}
          />
          {fieldErrors.fullName && <p className={styles.fieldError}>{fieldErrors.fullName}</p>}
        </div>

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

        <div>
          <input
            type="date"
            value={dateOfBirth}
            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
            className={`${styles.input} ${fieldErrors.dateOfBirth ? styles.inputError : ''}`}
          />
          {fieldErrors.dateOfBirth && <p className={styles.fieldError}>{fieldErrors.dateOfBirth}</p>}
        </div>

        <select
          value={gender}
          onChange={(e) => handleInputChange('gender', e.target.value)}
          className={styles.input}
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
          <option value="prefer-not-to-say">Prefer not to say</option>
        </select>

        <button onClick={handleSignup} className={styles.button}>
          SIGN UP
        </button>

        <p className={styles.footer}>
          Already have an account?{" "}
          <Link href="/login" className={styles.link}>Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;