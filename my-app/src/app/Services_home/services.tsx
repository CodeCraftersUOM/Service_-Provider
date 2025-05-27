"use client";
import React, { useState } from "react";
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
  "Services_home/other"
];

const ServiceSelector: React.FC = () => {
  const [activeMenuItem, setActiveMenuItem] = useState('Other Services');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const router = useRouter();

  const menuItems = [
    { name: 'My Profile', icon: '👤' },
    { name: 'Notification', icon: '🔔' },
    { name: 'Help', icon: '❓' },
    { name: 'Orders', icon: '📦' },
    { name: 'Booking', icon: '📅' },
    { name: 'Payments', icon: '💳' },
    { name: 'Setting', icon: '⚙️' },
    { name: 'Updates', icon: '🔄' },
    { name: 'Log Out', icon: '🚪' }
  ];

  const handleLogout = () => {
    // Implement your actual logout logic here
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("userSession");
    router.push("/login");
  };

  const handleMenuClick = (menuName: string) => {
    if (menuName === 'Log Out') {
      handleLogout();
      return;
    }
    if (menuName === 'My Profile') {
      router.push('/dashboard');
      return;
    }
    setActiveMenuItem(menuName);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const renderContent = () => {
    switch (activeMenuItem) {
      case 'Other Services':
        return (
          <div className={styles.servicesContent}>
            <div className={styles.header}>
              <h1 className={styles.heading}>What service do you hope to provide?</h1>
              <div className={styles.accentLine}></div>
            </div>
            
            <div className={styles.servicesGrid}>
              {serviceIcons.map((icon, index) => (
                <div className={styles.serviceCard} key={index}>
                  <div className={styles.serviceCardContent}>
                    <p className={styles.serviceLabel}>{serviceNames[index]}</p>
                    <Link href={serviceLinks[index]} className={styles.serviceLink}>
                      <div className={styles.imageContainer}>
                        <Image
                          src={icon}
                          alt={serviceNames[index]}
                          width={120}
                          height={120}
                          className={styles.serviceImage}
                        />
                      </div>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            
            <div className={styles.helpSection}>
              <p className={styles.helpText}>
                Need <a href="#" className={styles.helpLink}>help?</a>
              </p>
            </div>
          </div>
        );
      default:
        return (
          <div className={styles.defaultContent}>
            <div className={styles.header}>
              <h1 className={styles.heading}>{activeMenuItem}</h1>
              <div className={styles.accentLine}></div>
            </div>
            <div className={styles.comingSoon}>
              <div className={styles.comingSoonIcon}>🚧</div>
              <h2>Coming Soon</h2>
              <p>This section is under development and will be available soon.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={styles.container}>
      {/* Mobile Menu Toggle */}
      <button 
        className={styles.mobileMenuToggle}
        onClick={toggleSidebar}
      >
        ☰
      </button>

      {/* Sidebar */}
      <div className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>
        <div className={styles.sidebarHeader}>
          <h2 className={styles.sidebarTitle}>Services</h2>
          <button 
            className={styles.sidebarToggle}
            onClick={toggleSidebar}
          >
            {isSidebarOpen ? '◀' : '▶'}
          </button>
        </div>
        
        <div className={styles.userInfo}>
          <div className={styles.userAvatar}>
            <span className={styles.userInitial}>U</span>
          </div>
          <span className={styles.userName}>User Name</span>
        </div>
        
        <nav className={styles.sidebarNav}>
          {menuItems.map((item) => (
            <button
              key={item.name}
              className={`${styles.menuItem} ${activeMenuItem === item.name ? styles.menuItemActive : ''}`}
              onClick={() => handleMenuClick(item.name)}
            >
              <span className={styles.menuIcon}>{item.icon}</span>
              <span className={styles.menuText}>{item.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className={`${styles.mainContent} ${isSidebarOpen ? styles.mainContentShifted : ''}`}>
        {renderContent()}
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className={styles.overlay}
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default ServiceSelector;