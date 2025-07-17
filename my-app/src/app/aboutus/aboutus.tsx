"use client";

import React from "react";
import Image from "next/image";
import { FaGlobe, FaUsers, FaHeart, FaStar, FaShieldAlt, FaClock } from "react-icons/fa";
import styles from "./aboutus.module.css";

const AboutUs = () => {
  const stats = [
    { number: "10K+", label: "Happy Travelers", icon: <FaUsers /> },
    { number: "500+", label: "Service Providers", icon: <FaGlobe /> },
    { number: "50+", label: "Cities Covered", icon: <FaStar /> },
    { number: "24/7", label: "Customer Support", icon: <FaClock /> }
  ];

  const values = [
    {
      icon: <FaHeart />,
      title: "Passion for Travel",
      description: "We believe travel transforms lives and creates unforgettable memories"
    },
    {
      icon: <FaShieldAlt />,
      title: "Trust & Safety",
      description: "Your safety and security are our top priorities in every service we provide"
    },
    {
      icon: <FaUsers />,
      title: "Community First",
      description: "Building connections between travelers and local service providers worldwide"
    }
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      image: "/team1.jpg", // You'll need to add these images
      description: "Travel enthusiast with 15+ years in hospitality industry"
    },
    {
      name: "Michael Chen",
      role: "CTO",
      image: "/team2.jpg",
      description: "Tech innovator passionate about creating seamless travel experiences"
    },
    {
      name: "Emma Rodriguez",
      role: "Head of Operations",
      image: "/team3.jpg",
      description: "Operations expert ensuring quality service delivery worldwide"
    }
  ];

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>
              Your Journey, <span className={styles.accent}>Our Mission</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Connecting travelers with trusted local service providers to create 
              extraordinary experiences around the world.
            </p>
          </div>
          <div className={styles.heroImage}>
            <div className={styles.imageWrapper}>
              <Image
                src="/about-hero.jpg" // You'll need to add this image
                alt="Travel experiences"
                width={600}
                height={400}
                className={styles.heroImg}
              />
              <div className={styles.floatingCard}>
                <FaGlobe className={styles.cardIcon} />
                <span>Worldwide Coverage</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.stats}>
        <div className={styles.statsGrid}>
          {stats.map((stat, index) => (
            <div key={index} className={styles.statCard}>
              <div className={styles.statIcon}>{stat.icon}</div>
              <div className={styles.statNumber}>{stat.number}</div>
              <div className={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Story Section */}
      <section className={styles.story}>
        <div className={styles.storyContent}>
          <div className={styles.storyText}>
            <h2 className={styles.sectionTitle}>Our Story</h2>
            <p className={styles.storyParagraph}>
              Founded in 2020, Travelwish was born from a simple idea: every traveler 
              deserves access to authentic, reliable, and high-quality services wherever 
              they go. We started as a small team of travel enthusiasts who experienced 
              firsthand the challenges of finding trustworthy local services while exploring new destinations.
            </p>
            <p className={styles.storyParagraph}>
              Today, we've grown into a global platform that connects thousands of travelers 
              with verified service providers across multiple categories. From tour guides 
              who know hidden gems to reliable transportation and comfortable accommodations, 
              we ensure every aspect of your journey is taken care of.
            </p>
            <div className={styles.storyHighlight}>
              <FaStar className={styles.highlightIcon} />
              <span>Making travel accessible, safe, and memorable for everyone</span>
            </div>
          </div>
          <div className={styles.storyImage}>
            <Image
              src="/story-image.jpg" // You'll need to add this image
              alt="Our journey"
              width={500}
              height={350}
              className={styles.storyImg}
            />
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className={styles.values}>
        <h2 className={styles.sectionTitle}>Our Values</h2>
        <div className={styles.valuesGrid}>
          {values.map((value, index) => (
            <div key={index} className={styles.valueCard}>
              <div className={styles.valueIcon}>{value.icon}</div>
              <h3 className={styles.valueTitle}>{value.title}</h3>
              <p className={styles.valueDescription}>{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className={styles.team}>
        <h2 className={styles.sectionTitle}>Meet Our Team</h2>
        <p className={styles.teamSubtitle}>
          Passionate individuals dedicated to revolutionizing your travel experience
        </p>
        <div className={styles.teamGrid}>
          {team.map((member, index) => (
            <div key={index} className={styles.teamCard}>
              <div className={styles.teamImageWrapper}>
                <Image
                  src={member.image}
                  alt={member.name}
                  width={300}
                  height={300}
                  className={styles.teamImage}
                />
              </div>
              <div className={styles.teamInfo}>
                <h3 className={styles.teamName}>{member.name}</h3>
                <p className={styles.teamRole}>{member.role}</p>
                <p className={styles.teamDescription}>{member.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>Ready to Start Your Journey?</h2>
          <p className={styles.ctaSubtitle}>
            Join thousands of travelers who trust Travelwish for their adventures
          </p>
          <div className={styles.ctaButtons}>
            <button className={styles.primaryButton}>Explore Services</button>
            <button className={styles.secondaryButton}>Become a Provider</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;