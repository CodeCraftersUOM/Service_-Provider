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
  const router = useRouter();

  const handleSignup = async () => {
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

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={styles.input}
        />

        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className={styles.input}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
        />

        <input
          type="date"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          className={styles.input}
        />

        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
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
