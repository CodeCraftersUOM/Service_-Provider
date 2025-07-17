"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import styles from "./services.module.css";

// Loading component
const LoadingSpinner = () => (
  <div className={styles.loadingContainer}>
    <div className={styles.spinner}></div>
    <p>Checking authentication...</p>
  </div>
);

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
  
  "/other.png",
  "/thingstodo.png"
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
  "Things To Do",
  "Other Services"
  
  "Other Services",
  "Things to do"
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
  "Various other professional services",
  "Buythings, different adventures with special events"
];

const serviceLinks: string[] = [
  "Services_home/guide",
  "Services_home/health",
  "Services_home/Accommodation",
  "Services_home/Restaurent",
  "Services_home/Vehicle_repair",
  "Services_home/taxi",
  "Services_home/Communi",
  "Services_home/houes_kepping",
  "Services_home/other",
  "Services_home/Thingstodo"
  "Services_home/Things_to_do",
  "Services_home/other"
  
];

const ServiceSelector: React.FC = () => {
  const [activeMenuItem, setActiveMenuItem] = useState('Services');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  // Check authentication on component mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch("http://localhost:2000/api/check-auth", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setIsAuthenticated(true);
        setUser(data.user);
      } else {
        // User is not authenticated, redirect to login
        router.push("/login?redirect=/Services_home");
        return;
      }
    } catch (error) {
      console.error("Auth check error:", error);
      // On error, redirect to login
      router.push("/login?redirect=/Services_home");
      return;
    } finally {
      setIsLoading(false);
    }
  };

  const menuItems = [
    { name: 'Dashboard', icon: '🏠', route: '../Dashboard' },
    { name: 'Services', icon: '🛠️', route: '/services' },
    { name: 'My Listings', icon: '📋', route: '/listings' },
    { name: 'Bookings', icon: '📅', route: '/bookings' },
    { name: 'Analytics', icon: '📊', route: '/analytics' },
    { name: 'Messages', icon: '💬', route: '/messages' },
    { name: 'Payments', icon: '💳', route: '/payments' },
    { name: 'Settings', icon: '⚙️', route: '/settings' },
    { name: 'Help', icon: '💡', route: '/Services_home/help' },
    { name: 'Log Out', icon: '🚪', route: '/logout' }
  ];

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:2000/api/logout", {
        method: "POST",
        credentials: "include",
      });
      
      // Clear local state
      setIsAuthenticated(false);
      setUser(null);
      
      // Redirect to home page
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      // Even if logout fails, redirect to home
      router.push("/");
    }
  };

  const handleMenuClick = (menuName: string, route: string) => {
    if (menuName === 'Log Out') {
      handleLogout();
      return;
    }
    if (menuName === 'Dashboard') {
      router.push(route);
      return;
    }
    if (menuName === 'Help') {
      router.push(route);
      return;
    }
    setActiveMenuItem(menuName);
    // Uncomment to enable navigation
    // router.push(route);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Show loading spinner while checking authentication
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // If not authenticated, this component won't render 
  // (user will be redirected to login)
  if (!isAuthenticated) {
    return null;
  }

  const renderContent = () => {
    switch (activeMenuItem) {
      case 'Services':
        return (
          <div className={styles.servicesContent}>
            <div className={styles.header}>
              <div className={styles.headerText}>
                <h1 className={styles.heading}>
                  Welcome back, {user?.fullName || user?.username}!
                </h1>
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
                <button className={styles.helpButton}onClick={() => router.push('/Services_home/help')} > Get Support</button>
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
        <div className={styles.userInfo}>
          <p>Welcome, {user?.fullName || user?.username}</p>
          <small>{user?.email}</small>
        </div>
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