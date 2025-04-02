import styles from "./RightSection.module.css";
import { FaUserTie, FaHospitalSymbol, FaTools, FaBus, FaTaxi, FaHome, FaBroom, FaUtensils } from "react-icons/fa";
import React from "react";

const services = [
  { icon: <FaUserTie />, label: "Guide" },
  { icon: <FaHospitalSymbol />, label: "Medical" },
  { icon: <FaTools />, label: "Repair" },
  { icon: <FaBus />, label: "Transport" },
  { icon: <FaTaxi />, label: "Taxi" },
  { icon: <FaHome />, label: "Home Services" },
  { icon: <FaBroom />, label: "Cleaning" },
  { icon: <FaUtensils />, label: "Food" }
];

const RightSection: React.FC = () => {
  return (
    <div className={styles.right}>
      <h2>What service do you hope to provide?</h2>
      <div className={styles.servicesGrid}>
        {services.map((service, index) => (
          <div key={index} className={styles.serviceCard}>
            <div className={styles.icon}>{service.icon}</div>
            <p>{service.label}</p>
          </div>
        ))}
      </div>

      {/* Steps Section */}
      <div className={styles.stepsContainer}>
        <h3>3 SIMPLE STEPS TO START <br /> SERVICE PROVIDE ON TRAVELWISH</h3>
        <div className={styles.stepBox}></div>
        <div className={styles.stepBox}></div>
        <div className={styles.stepBox}></div>
        <button className={styles.registerButton}>Register</button>
        <p>Need a <a href="#">help?</a></p>
      </div>
    </div>
  );
};

export default RightSection;
