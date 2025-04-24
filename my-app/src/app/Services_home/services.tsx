import React from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./services.module.css";

const ServiceSelector: React.FC = () => {
  const serviceIcons: string[] = [
    "/guide.png",
    "/health.png",
    "/accomadation.png",
    "/resturant.png",
    "/public_transport.png",
    "/other.png"
  ];

  const serviceNames: string[] = [
    "Guide",
    "Health",
    "Accommodation",
    "Restaurant",
    "Public Transport",
    "Other"
  ];

  const serviceLinks: string[] = [
    "/guide",
    "/health",
    "/accommodation",
    "/restaurant",
    "/public-transport",
    "/otherservices"
  ];

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.user}>● User Name</div>
        <ul className={styles.menu}>
          <li>My profile</li>
          <li>Notification</li>
          <li>Message</li>
          <li>Feedback</li>
          <li>Help</li>
          <li>Orders</li>
          <li>Booking</li>
          <li>Payments</li>
          <li>Setting</li>
          <li>Updates</li>
          <li>Other service</li>
          <li>Log out</li>
        </ul>
      </div>

      {/* Content Area */}
      <div className={styles.contentArea}>
        <div className={styles.wrapper}>
          <h2>
            3 SIMPLE STEPS TO START
            <br />
            SERVICE PROVIDE
            <br />
            ON TRAVELWISH
          </h2>
          <div className={styles.steps}>
            <div className={styles.stepBox}></div>
            <div className={styles.stepBox}></div>
            <div className={styles.stepBox}></div>
          </div>
        </div>

        <div className={styles.mainContent}>
          <h1>What service do you hope to provide?</h1>
          <div className={styles.grid}>
            {serviceIcons.map((icon, index) => (
              <Link href={serviceLinks[index]} key={index}>
                <div className={styles.serviceCard}>
                  <div style={{ textAlign: "center" }}>
                    <p className={styles.serviceLabel}>{serviceNames[index]}</p>
                    <Image
                      src={icon}
                      alt={serviceNames[index]}
                      width={150}
                      height={150}
                      className={styles.serviceImage}
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className={styles.helpText}>
          Need a <a href="#">help?</a>
        </div>
      </div>
    </div>
  );
};

export default ServiceSelector;
