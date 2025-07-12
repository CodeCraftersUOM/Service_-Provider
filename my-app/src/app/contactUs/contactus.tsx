"use client";

import React, { useState } from "react";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import styles from "./contactus.module.css";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const contactInfo = [
    {
      icon: <FaPhone />,
      title: "Phone",
      details: ["+1 (555) 123-4567", "+1 (555) 987-6543"],
      description: "Call us anytime, 24/7 support available"
    },
    {
      icon: <FaEnvelope />,
      title: "Email",
      details: ["hello@travelwish.com", "support@travelwish.com"],
      description: "We'll respond within 24 hours"
    },
    {
      icon: <FaMapMarkerAlt />,
      title: "Office",
      details: ["123 Travel Street", "New York, NY 10001"],
      description: "Visit us during business hours"
    },
    {
      icon: <FaClock />,
      title: "Business Hours",
      details: ["Mon - Fri: 9:00 AM - 6:00 PM", "Sat - Sun: 10:00 AM - 4:00 PM"],
      description: "EST timezone"
    }
  ];

  const faqs = [
    {
      question: "How do I register as a service provider?",
      answer: "Simply click on 'Register Services' in our navbar and follow the step-by-step registration process."
    },
    {
      question: "Is there a fee to join Travelwish?",
      answer: "Registration is free for travelers. Service providers pay a small commission only when they receive bookings."
    },
    {
      question: "How do you ensure service quality?",
      answer: "All service providers go through a verification process and are rated by travelers after each service."
    },
    {
      question: "What if I need to cancel a booking?",
      answer: "You can cancel bookings through your dashboard. Cancellation policies vary by service provider."
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would normally send the data to your backend
      console.log('Form submitted:', formData);
      
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Get in <span className={styles.accent}>Touch</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
        <div className={styles.heroDecoration}>
          <div className={styles.floatingShape}></div>
          <div className={styles.floatingShape}></div>
          <div className={styles.floatingShape}></div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className={styles.contactInfo}>
        <div className={styles.contactGrid}>
          {contactInfo.map((info, index) => (
            <div key={index} className={styles.contactCard}>
              <div className={styles.contactIcon}>{info.icon}</div>
              <h3 className={styles.contactTitle}>{info.title}</h3>
              <div className={styles.contactDetails}>
                {info.details.map((detail, idx) => (
                  <p key={idx} className={styles.contactDetail}>{detail}</p>
                ))}
              </div>
              <p className={styles.contactDescription}>{info.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Main Content */}
      <section className={styles.mainContent}>
        <div className={styles.contentWrapper}>
          {/* Contact Form */}
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Send us a Message</h2>
            <p className={styles.sectionSubtitle}>
              Fill out the form below and we'll get back to you within 24 hours.
            </p>

            <form onSubmit={handleSubmit} className={styles.contactForm}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="name" className={styles.label}>Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className={styles.input}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="email" className={styles.label}>Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className={styles.input}
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="subject" className={styles.label}>Subject *</label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className={styles.select}
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="partnership">Partnership</option>
                  <option value="feedback">Feedback</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="message" className={styles.label}>Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className={styles.textarea}
                  placeholder="Tell us how we can help you..."
                />
              </div>

              {submitStatus === 'success' && (
                <div className={styles.successMessage}>
                  Thank you for your message! We'll get back to you soon.
                </div>
              )}

              {submitStatus === 'error' && (
                <div className={styles.errorMessage}>
                  Sorry, there was an error sending your message. Please try again.
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className={`${styles.submitButton} ${isSubmitting ? styles.submitting : ''}`}
              >
                {isSubmitting ? (
                  <>
                    <span className={styles.spinner}></span>
                    Sending...
                  </>
                ) : (
                  'Send Message'
                )}
              </button>
            </form>
          </div>

          {/* FAQ Section */}
          <div className={styles.faqSection}>
            <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
            <div className={styles.faqList}>
              {faqs.map((faq, index) => (
                <div key={index} className={styles.faqItem}>
                  <h4 className={styles.faqQuestion}>{faq.question}</h4>
                  <p className={styles.faqAnswer}>{faq.answer}</p>
                </div>
              ))}
            </div>

            {/* Social Media */}
            <div className={styles.socialSection}>
              <h3 className={styles.socialTitle}>Follow Us</h3>
              <p className={styles.socialSubtitle}>Stay connected for updates and travel tips</p>
              <div className={styles.socialLinks}>
                <a href="#" className={styles.socialLink} aria-label="Facebook">
                  <FaFacebookF />
                </a>
                <a href="#" className={styles.socialLink} aria-label="Twitter">
                  <FaTwitter />
                </a>
                <a href="#" className={styles.socialLink} aria-label="Instagram">
                  <FaInstagram />
                </a>
                <a href="#" className={styles.socialLink} aria-label="LinkedIn">
                  <FaLinkedinIn />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className={styles.mapSection}>
        <div className={styles.mapContainer}>
          <div className={styles.mapPlaceholder}>
            <FaMapMarkerAlt className={styles.mapIcon} />
            <h3>Visit Our Office</h3>
            <p>123 Travel Street, New York, NY 10001</p>
            <button className={styles.mapButton}>View on Google Maps</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;