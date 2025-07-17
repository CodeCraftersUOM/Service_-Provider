"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  FaSearch, 
  FaChevronDown, 
  FaChevronUp, 
  FaHeadset, 
  FaEnvelope, 
  FaPhone 
} from "react-icons/fa";
import styles from "./help.module.css";

const Help = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const faqs = [
    {
      id: 1,
      question: "How do I register as a service provider?",
      answer: "Click 'Register Services' in the navbar, choose your service category, fill out the form, and wait for approval. It's that simple!"
    },
    {
      id: 2,
      question: "How do I book a service?",
      answer: "Browse services, select a provider, choose your date and time, make payment, and you're all set!"
    },
    {
      id: 3,
      question: "How do I reset my password?",
      answer: "Click 'Forgot Password' on the login page, enter your email, and follow the reset link we send you."
    },
    {
      id: 4,
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and bank transfers. All payments are secure and encrypted."
    },
    {
      id: 5,
      question: "How do I get paid as a service provider?",
      answer: "Payments are transferred to your bank account within 3-5 business days after service completion."
    },
    {
      id: 6,
      question: "What if I'm not satisfied with a service?",
      answer: "Contact our support team immediately. We have a satisfaction guarantee and will resolve any issues."
    },
    {
      id: 7,
      question: "How do I update my profile?",
      answer: "Go to your Dashboard, click 'Settings', edit your information, and save changes."
    },
    {
      id: 8,
      question: "Why can't I access my dashboard?",
      answer: "Try clearing your browser cache, logging out and back in, or contact support if the issue persists."
    }
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleFaq = (faqId: number) => {
    setExpandedFaq(expandedFaq === faqId ? null : faqId);
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Help Center</h1>
        <p className={styles.subtitle}>Find answers to your questions</p>
        
        {/* Search */}
        <div className={styles.searchBox}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search for help..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.content}>
        {/* Quick Help Cards */}
        <div className={styles.quickHelp}>
          <Link href="/contact" className={styles.helpCard}>
            <FaHeadset className={styles.cardIcon} />
            <h3>Contact Support</h3>
            <p>Get help from our team</p>
          </Link>
          
          <a href="mailto:support@travelwish.com" className={styles.helpCard}>
            <FaEnvelope className={styles.cardIcon} />
            <h3>Email Us</h3>
            <p>support@travelwish.com</p>
          </a>
          
          <a href="tel:+1-555-123-4567" className={styles.helpCard}>
            <FaPhone className={styles.cardIcon} />
            <h3>Call Us</h3>
            <p>+1 (555) 123-4567</p>
          </a>
        </div>

        {/* FAQ Section */}
        <div className={styles.faqSection}>
          <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
          
          <div className={styles.faqList}>
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => (
                <div key={faq.id} className={styles.faqItem}>
                  <button
                    className={styles.faqQuestion}
                    onClick={() => toggleFaq(faq.id)}
                  >
                    <span>{faq.question}</span>
                    {expandedFaq === faq.id ? <FaChevronUp /> : <FaChevronDown />}
                  </button>
                  {expandedFaq === faq.id && (
                    <div className={styles.faqAnswer}>
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className={styles.noResults}>
                <p>No results found. Try a different search term.</p>
              </div>
            )}
          </div>
        </div>

        {/* Contact Section */}
        <div className={styles.contactSection}>
          <h2>Still Need Help?</h2>
          <p>Our support team is here to help you 24/7</p>
          <Link href="/contact" className={styles.contactButton}>
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Help;