"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import axios from 'axios';
import styles from './Dashboard.module.css';

interface UserData {
  fullName: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

// Loading component
const LoadingSpinner = () => (
  <div className={styles.loadingContainer}>
    <div className={styles.spinner}></div>
    <p>Checking authentication...</p>
  </div>
);

const Dashboard = () => {
  const [userData, setUserData] = useState<UserData>({
    fullName: '',
    username: '',
    email: '',
    createdAt: '',
    updatedAt: ''
  });
  
  const [activeMenuItem, setActiveMenuItem] = useState('Dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  // Same sidebar as Services page
  const menuItems = [
    { name: 'Dashboard', icon: '🏠', route: '/Dashboard' },
    { name: 'Services', icon: '🛠️', route: '/Services_home' },
    { name: 'My Listings', icon: '📋', route: '/listings' },
    { name: 'Bookings', icon: '📅', route: '/bookings' },
    { name: 'Analytics', icon: '📊', route: '/analytics' },
    { name: 'Messages', icon: '💬', route: '/messages' },
    { name: 'Payments', icon: '💳', route: '/payments' },
    { name: 'Settings', icon: '⚙️', route: '/settings' },
    { name: 'Help', icon: '💡', route: '/Services_home/help' },
    { name: 'Log Out', icon: '🚪', route: '/logout' }
  ];

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
        console.log('Auth check response:', data); // Debug log
        setIsAuthenticated(true);
        setUser(data.user);
        
        // Fetch user data after successful auth check
        await fetchUserData();
      } else {
        console.log('Auth check failed, redirecting to login');
        router.push("/login?redirect=/Dashboard");
        return;
      }
    } catch (error) {
      console.error("Auth check error:", error);
      router.push("/login?redirect=/Dashboard");
      return;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserData = async () => {
    try {
      console.log('Fetching user data...'); // Debug log
      const response = await axios.get('http://localhost:2000/api/getSingleUser', {
        withCredentials: true,
      });
      
      console.log('User data response:', response.data); // Debug log
      
      if (response.data && response.data.data) {
        setUserData(response.data.data);
        console.log('User data set:', response.data.data); // Debug log
      } else {
        console.error('Invalid user data structure:', response.data);
      }
    } catch (err) {
      console.error('Failed to fetch user data:', err);
      
      // If the specific endpoint fails, try to get user info from auth check
      if (user) {
        setUserData({
          fullName: user.fullName || '',
          username: user.username || '',
          email: user.email || '',
          createdAt: user.createdAt || '',
          updatedAt: user.updatedAt || ''
        });
      }
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:2000/api/logout", {
        method: "POST",
        credentials: "include",
      });
      
      setIsAuthenticated(false);
      setUser(null);
      setUserData({
        fullName: '',
        username: '',
        email: '',
        createdAt: '',
        updatedAt: ''
      });
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      router.push("/");
    }
  };

  const handleMenuClick = (menuName: string, route: string) => {
    if (menuName === 'Log Out') {
      handleLogout();
      return;
    }
    if (menuName === 'Services') {
      router.push(route);
      return;
    }
    if (menuName === 'Help') {
      router.push(route);
      return;
    }
    setActiveMenuItem(menuName);
    // Uncomment to enable navigation for other pages
    // router.push(route);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Show loading spinner while checking authentication
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return null;
  }

  const renderContent = () => {
    switch (activeMenuItem) {
      case 'Dashboard':
        return (
          <div className={styles.servicesContent}>
            <div className={styles.header}>
              <div className={styles.headerText}>
                <h1 className={styles.heading}>
                  Welcome back, {userData.fullName || user?.fullName || user?.username || 'User'}!
                </h1>
                <p className={styles.subheading}>Here's your dashboard overview</p>
              </div>
            </div>
            
            <div className={styles.profileCard}>
              <div className={styles.profileHeader}>
                <div className={styles.profileAvatar}>
                  <span className={styles.profileInitial}>
                    {(userData.fullName || user?.fullName || user?.username || 'U').charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className={styles.profileInfo}>
                  <h2 className={styles.profileName}>
                    {userData.fullName || user?.fullName || user?.username || 'User Name'}
                  </h2>
                  <p className={styles.profileEmail}>
                    {userData.email || user?.email || 'user@example.com'}
                  </p>
                </div>
              </div>

              <div className={styles.profileContent}>
                <div className={styles.profileRow}>
                  <div className={styles.profileField}>
                    <span className={styles.fieldLabel}>Full Name</span>
                    <span className={styles.fieldValue}>
                      {userData.fullName || user?.fullName || '--'}
                    </span>
                  </div>
                  <div className={styles.profileField}>
                    <span className={styles.fieldLabel}>Username</span>
                    <span className={styles.fieldValue}>
                      {userData.username || user?.username || '--'}
                    </span>
                  </div>
                </div>

                <div className={styles.profileRow}>
                  <div className={styles.profileField}>
                    <span className={styles.fieldLabel}>Email Address</span>
                    <span className={styles.fieldValue}>
                      {userData.email || user?.email || '--'}
                    </span>
                  </div>
                </div>

                <div className={styles.profileStats}>
                  <div className={styles.profileStat}>
                    <span className={styles.statLabel}>Joined On</span>
                    <span className={styles.statValue}>
                      {(userData.createdAt || user?.createdAt) ? 
                        new Date(userData.createdAt || user?.createdAt).toLocaleDateString() : 
                        '--'
                      }
                    </span>
                  </div>
                  <div className={styles.profileStat}>
                    <span className={styles.statLabel}>Last Updated</span>
                    <span className={styles.statValue}>
                      {(userData.updatedAt || user?.updatedAt) ? 
                        new Date(userData.updatedAt || user?.updatedAt).toLocaleDateString() : 
                        '--'
                      }
                    </span>
                  </div>
                </div>
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
                onClick={() => setActiveMenuItem('Dashboard')}
              >
                Back to Dashboard
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
          <p>Welcome, {userData.fullName || user?.fullName || user?.username || 'User'}</p>
          <small>{userData.email || user?.email || 'No email'}</small>
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

export default Dashboard;