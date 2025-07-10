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
  "Vehicle Service",
  "Taxi",
  "Communication",
  "House Keeping",
  "Other Services"
];

const serviceDescriptions: string[] = [
  "Professional tour guides for your perfect journey",
  "Healthcare services and medical consultations",
  "Comfortable stays and hospitality services", 
  "Delicious dining and catering experiences",
  "Expert vehicle repair and maintenance",
  "Reliable transportation and taxi services",
  "Telecom and communication solutions",
  "Professional cleaning and housekeeping",
  "Various other professional services"
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
  const [activeMenuItem, setActiveMenuItem] = useState('Services');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const router = useRouter();

  const menuItems = [
    { name: 'Dashboard', icon: '🏠', route: '/dashboard' },
    { name: 'Services', icon: '🛠️', route: '/services' },
    { name: 'My Listings', icon: '📋', route: '/listings' },
    { name: 'Bookings', icon: '📅', route: '/bookings' },
    { name: 'Analytics', icon: '📊', route: '/analytics' },
    { name: 'Messages', icon: '💬', route: '/messages' },
    { name: 'Payments', icon: '💳', route: '/payments' },
    { name: 'Settings', icon: '⚙️', route: '/settings' },
    { name: 'Log Out', icon: '🚪', route: '/logout' }
  ];

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("userSession");
    router.push("/login");
  };

  const handleMenuClick = (menuName: string, route: string) => {
    if (menuName === 'Log Out') {
      handleLogout();
      return;
    }
    setActiveMenuItem(menuName);
    // Uncomment to enable navigation
    // router.push(route);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const renderContent = () => {
    switch (activeMenuItem) {
      case 'Services':
        return (
          <div className={styles.servicesContent}>
            <div className={styles.header}>
              <div className={styles.headerText}>
                <h1 className={styles.heading}>Choose Your Service</h1>
                <p className={styles.subheading}>Select the service you'd like to offer and start your journey</p>
              </div>
              <div className={styles.headerStats}>
                <div className={styles.statCard}>
                  <div className={styles.statNumber}>9</div>
                  <div className={styles.statLabel}>Service Categories</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statNumber}>1000+</div>
                  <div className={styles.statLabel}>Active Providers</div>
                </div>
              </div>
            </div>
            
            <div className={styles.servicesGrid}>
              {serviceIcons.map((icon, index) => (
                <Link href={serviceLinks[index]} key={index} className={styles.serviceCardLink}>
                  <div className={styles.serviceCard}>
                    <div className={styles.serviceIcon}>
                      <Image
                        src={icon}
                        alt={serviceNames[index]}
                        width={60}
                        height={60}
                        className={styles.serviceImage}
                      />
                    </div>
                    <div className={styles.serviceContent}>
                      <h3 className={styles.serviceTitle}>{serviceNames[index]}</h3>
                      <p className={styles.serviceDescription}>{serviceDescriptions[index]}</p>
                    </div>
                    <div className={styles.serviceArrow}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="m9 18 6-6-6-6"/>
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            <div className={styles.bottomSection}>
              <div className={styles.helpCard}>
                <div className={styles.helpIcon}>💡</div>
                <div className={styles.helpText}>
                  <h3>Need Help Getting Started?</h3>
                  <p>Our team is here to guide you through the registration process</p>
                </div>
                <button className={styles.helpButton}>Get Support</button>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className={styles.defaultContent}>
            <div className={styles.comingSoon}>
              <div className={styles.comingSoonIcon}>🚧</div>
              <h2>Coming Soon</h2>
              <p>The {activeMenuItem} section is under development and will be available soon.</p>
              <button 
                className={styles.backButton}
                onClick={() => setActiveMenuItem('Services')}
              >
                Back to Services
              </button>
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
        aria-label="Toggle menu"
      >
        <span className={styles.hamburger}></span>
        <span className={styles.hamburger}></span>
        <span className={styles.hamburger}></span>
      </button>

      {/* Sidebar */}
      <div className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>
        <nav className={styles.sidebarNav}>
          {menuItems.map((item) => (
            <button
              key={item.name}
              className={`${styles.menuItem} ${activeMenuItem === item.name ? styles.menuItemActive : ''}`}
              onClick={() => handleMenuClick(item.name, item.route)}
            >
              <span className={styles.menuIcon}>{item.icon}</span>
              <span className={styles.menuText}>{item.name}</span>
              {activeMenuItem === item.name && <span className={styles.activeIndicator}></span>}
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