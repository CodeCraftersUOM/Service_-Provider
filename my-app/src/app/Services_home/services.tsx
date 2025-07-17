"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./services.module.css";

const serviceIcons: string[] = [
  "/guide.png",
  "/health.png",
  "/accomadation.png",
  "/resturant.png",
  "/auto.png",
  "/taxi.png",
  "/communucation.png",
  "/house.png",
  "/things_to_do.png",
  "/other.png"
  
];

const serviceNames: string[] = [
  "Guide",
  "Health",
  "Accommodation",
  "Restaurant",
  "Vehicle Service center",
  "Taxi",
  "Communication",
  "House Keeping",
  "Things To Do",
  "Other Services"
  
];

const serviceLinks: string[] = [
  "Services_home/guide",
  "Services_home/health",
  "Services_home/accommodation",
  "Services_home/Restaurent",
  "Services_home/Vehicle_repair",
  "Services_home/taxi",
  "Services_home/Communi",
  "Services_home/houes_kepping",
  "Services_home/Things_to_do",
  "Services_home/other"
  
];

const ServiceSelector: React.FC = () => {
  const router = useRouter();

  const handleLogout = () => {
    // Implement your actual logout logic here
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("userSession");
    router.push("/login");
  };

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.user}>● User Name</div>
        <ul className={styles.menu}>
          <li>My Profile</li>
          <li>Notification</li>
          <li>Help</li>
          <li>Orders</li>
          <li>Booking</li>
          <li>Payments</li>
          <li>Setting</li>
          <li>Updates</li>
          <li>Other Services</li>
          <li 
            onClick={handleLogout}
            className={styles.logoutItem}
          >
            Log Out
          </li>
        </ul>
      </div>

      {/* Main Service Selection Grid */}
      <div className={styles.mainContent}>
        <h1>What service do you hope to provide?</h1>
        <div className={styles.grid}>
          {serviceIcons.map((icon, index) => (
            <div className={styles.serviceCard} key={index}>
              <div style={{ textAlign: "center" }}>
                <p className={styles.serviceLabel}>{serviceNames[index]}</p>
                <Link href={serviceLinks[index]}>
                  <Image
                    src={icon}
                    alt={serviceNames[index]}
                    width={150}
                    height={150}
                    className={styles.serviceImage}
                  />
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.helpText}>
          Need <a href="#">help?</a>
        </div>
      </div>
    </div>
  );
};

export default ServiceSelector;