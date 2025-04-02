'use client';
import { useState } from 'react';
import Link from 'next/link';
import './service.module.css';

export default function ServiceProvide() {
  const services = [
    { name: 'Tour Guide', icon: '🧑‍✈️' },
    { name: 'Medical', icon: '➕' },
    { name: 'Maintenance', icon: '🛠' },
    { name: 'Car Rental', icon: '🚗' },
    { name: 'Taxi', icon: '🚕' },
    { name: 'Housing', icon: '🏠' },
    { name: 'Personal Assistance', icon: '💁' },
    { name: 'Food Service', icon: '🍽' },
  ];

  return (
    <div className="container">
      <div className="content-box">
        <h1 className="title">What service do you hope to provide?</h1>
        <div className="grid-container">
          {services.map((service, index) => (
            <div key={index} className="service-card">
              <span className="icon">{service.icon}</span>
              <p className="service-name">{service.name}</p>
            </div>
          ))}
        </div>
        <div className="steps-box">
          <h2 className="steps-title">3 SIMPLE STEPS TO START SERVICE PROVIDE ON TRAVELWISH</h2>
          <div className="steps-container">
            <div className="step"></div>
            <div className="step"></div>
            <div className="step"></div>
          </div>
          <button className="register-button">Register</button>
          <p className="help-text">Need <Link href="#" className="help-link">help?</Link></p>
        </div>
      </div>
    </div>
  );
}
