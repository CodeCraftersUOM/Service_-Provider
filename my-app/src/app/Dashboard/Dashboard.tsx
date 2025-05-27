"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './Dashboard.module.css';

interface UserData {
  fullName: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

const Dashboard = () => {
  const [userData, setUserData] = useState<UserData>({
    fullName: '',
    username: '',
    email: '',
    createdAt: '',
    updatedAt: ''
  });
  
  const [activeMenuItem, setActiveMenuItem] = useState('My Profile');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    { name: 'Dash Board', icon: '👤' },
    { name: 'Notification', icon: '🔔' },
    { name: 'Help', icon: '❓' },
    { name: 'Orders', icon: '📦' },
    { name: 'Booking', icon: '📅' },
    { name: 'Payments', icon: '💳' },
    { name: 'Setting', icon: '⚙️' },
    { name: 'Updates', icon: '🔄' },
    { name: 'Other Services', icon: '🛠️' },
    { name: 'Log Out', icon: '🚪' }
  ];

  const fetchUserData = async () => {
    try {
      const response = await axios.get('http://localhost:2000/api/getSingleUser', {
        withCredentials: true,
      });
      setUserData(response.data.data);
    } catch (err) {
      console.error('Failed to fetch user data:', err);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleMenuClick = (menuName: string) => {
    if (menuName === 'Log Out') {
      // Handle logout logic here
      console.log('Logging out...');
      return;
    }
    setActiveMenuItem(menuName);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const renderContent = () => {
    switch (activeMenuItem) {
      case 'My Profile':
        return (
          <div className={styles.profileContent}>
            <div className={styles.header}>
              <h1 className={styles.heading}>My Profile</h1>
              <div className={styles.accentLine}></div>
            </div>
            
            <div className={styles.profileCard}>
              <div className={styles.profileHeader}>
                <div className={styles.avatar}>
                  <span className={styles.avatarText}>
                    {userData.fullName ? userData.fullName.charAt(0).toUpperCase() : 'U'}
                  </span>
                </div>
                <div className={styles.profileInfo}>
                  <h2 className={styles.profileName}>{userData.fullName || 'User Name'}</h2>
                  <p className={styles.profileEmail}>{userData.email || 'user@example.com'}</p>
                </div>
              </div>

              <div className={styles.cardContent}>
                <div className={styles.row}>
                  <div className={styles.labelGroup}>
                    <span className={styles.label}>Full Name</span>
                    <span className={styles.value}>{userData.fullName || '--'}</span>
                  </div>
                  <div className={styles.labelGroup}>
                    <span className={styles.label}>Username</span>
                    <span className={styles.value}>{userData.username || '--'}</span>
                  </div>
                </div>

                <div className={styles.row}>
                  <div className={styles.labelGroup}>
                    <span className={styles.label}>Email Address</span>
                    <span className={styles.value}>{userData.email || '--'}</span>
                  </div>
                </div>

                <div className={styles.statsContainer}>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Joined On</span>
                    <span className={styles.statValue}>
                      {userData.createdAt ? new Date(userData.createdAt).toLocaleDateString() : '--'}
                    </span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Last Updated</span>
                    <span className={styles.statValue}>
                      {userData.updatedAt ? new Date(userData.updatedAt).toLocaleDateString() : '--'}
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
    <div className={styles.dashboardContainer}>
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
          <h2 className={styles.sidebarTitle}>Dashboard</h2>
          <button 
            className={styles.sidebarToggle}
            onClick={toggleSidebar}
          >
            {isSidebarOpen ? '◀' : '▶'}
          </button>
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

export default Dashboard;