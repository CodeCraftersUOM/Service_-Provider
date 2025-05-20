// pages/taxi.tsx
import React from 'react';
import Head from 'next/head';
import styles from './taxi.module.css';

const TaxiService = () => {
  return (
    <>
      <Head>
        <title>Premium Taxi Services | Book Your Ride</title>
        <meta name="description" content="Reliable and comfortable taxi services with transparent pricing" />
      </Head>
      <div className={styles.container}>
        <form className={styles.form}>
          <h1 className={styles.title}>
            <span className={styles.titleMain}>Premium Taxi</span>
            <span className={styles.titleSub}>Service Registration</span>
          </h1>

          <div className={styles.formGrid}>
            {/* Column 1 */}
            <div className={styles.col}>
              <div className={styles.inputGroup}>
                <label htmlFor="vehicleType">Vehicle Type *</label>
                <select className={styles.input} id="vehicleType" required>
                  <option value="">Select your vehicle</option>
                  <option value="sedan">Sedan (4 passengers)</option>
                  <option value="suv">SUV (6 passengers)</option>
                  <option value="van">Van (8+ passengers)</option>
                  <option value="luxury">Luxury Vehicle</option>
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="licensePlate">License Plate Number *</label>
                <input 
                  className={styles.input} 
                  type="text" 
                  id="licensePlate" 
                  placeholder="ABC-1234" 
                  required 
                  pattern="[A-Za-z0-9-]{6,8}"
                />
                <span className={styles.inputHint}>Format: ABC-1234 or similar</span>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="serviceArea">Service Area *</label>
                <input 
                  className={styles.input} 
                  type="text" 
                  id="serviceArea" 
                  placeholder="City or region served" 
                  required 
                />
              </div>
            </div>

            {/* Column 2 */}
            <div className={styles.col}>
              <div className={styles.inputGroup}>
                <label htmlFor="rateStructure">Rate Structure *</label>
                <select className={styles.input} id="rateStructure" required>
                  <option value="">Select pricing model</option>
                  <option value="metered">Metered (per km/mile)</option>
                  <option value="flat">Flat Rate (per trip)</option>
                  <option value="hourly">Hourly Rate</option>
                  <option value="airport">Airport Special</option>
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="bookingMethod">Booking Method *</label>
                <div className={styles.radioGroup}>
                  <label className={styles.radioLabel}>
                    <input type="radio" name="bookingMethod" value="app" className={styles.radioInput} />
                    <span className={styles.radioCustom}></span>
                    Mobile App
                  </label>
                  <label className={styles.radioLabel}>
                    <input type="radio" name="bookingMethod" value="call" className={styles.radioInput} />
                    <span className={styles.radioCustom}></span>
                    Phone Call
                  </label>
                  <label className={styles.radioLabel}>
                    <input type="radio" name="bookingMethod" value="web" className={styles.radioInput} />
                    <span className={styles.radioCustom}></span>
                    Website
                  </label>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="features">Special Features</label>
                <div className={styles.checkboxGroup}>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" id="wifi" className={styles.checkboxInput} />
                    <span className={styles.checkboxCustom}></span>
                    WiFi Available
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" id="childSeat" className={styles.checkboxInput} />
                    <span className={styles.checkboxCustom}></span>
                    Child Seats
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" id="wheelchair" className={styles.checkboxInput} />
                    <span className={styles.checkboxCustom}></span>
                    Wheelchair Accessible
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.buttonWrapper}>
            <button className={styles.submitButton} type="submit">
              Register Your Taxi Service
              <span className={styles.buttonIcon}>→</span>
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default TaxiService;