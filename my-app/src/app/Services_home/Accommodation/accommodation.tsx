"use client";

import React, { useState } from "react";
import styles from "./accommodation.module.css";

interface AccommodationFormData {
  accommodationName: string;
  ownerFullName: string;
  phoneNumber: string;
  emailAddress: string;
  alternateContactNumber: string;
  propertyType: string;
  locationAddress: string;
  googleMapsLink: string;
  propertyDescription: string;
  starRating: number | "";

  checkInTime: string;
  checkOutTime: string;

  availability: {
    daysOpen: string[];
    is24x7Reception: boolean;
    closedOnHolidays: boolean;
  };

  tourismLicenseNumber: string;
  businessRegistrationNumber: string;
  yearsInOperation: number | "";
  numberOfRooms: number | ""; // Make sure these are required for step 3
  maxGuests: number | ""; // Make sure these are required for step 3
  minPricePerNight: number | ""; // Make sure these are required for step 3
  maxPricePerNight: number | ""; // Make sure these are required for step 3

  amenities: {
    pool: boolean;
    gym: boolean;
    spa: boolean;
    restaurantOnSite: boolean;
    barLounge: boolean;
    roomService: boolean;
    laundryService: boolean;
    conciergeService: boolean;
    airportTransfer: boolean;
    petFriendly: boolean;
    eventFacilities: boolean;
    parkingAvailable: boolean;
    wifi: boolean;
    familyAreaKidsFriendly: boolean;
    wheelchairAccessible: boolean;
  };
}

const AccommodationRegistrationForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState<AccommodationFormData>({
    accommodationName: "",
    ownerFullName: "",
    phoneNumber: "",
    emailAddress: "",
    alternateContactNumber: "",
    propertyType: "",
    locationAddress: "",
    googleMapsLink: "",
    propertyDescription: "",
    starRating: "",

    checkInTime: "",
    checkOutTime: "",

    availability: {
      daysOpen: [],
      is24x7Reception: false,
      closedOnHolidays: false,
    },

    tourismLicenseNumber: "",
    businessRegistrationNumber: "",
    yearsInOperation: "",
    numberOfRooms: "",
    maxGuests: "",
    minPricePerNight: "",
    maxPricePerNight: "",

    amenities: {
      pool: false,
      gym: false,
      spa: false,
      restaurantOnSite: false,
      barLounge: false,
      roomService: false,
      laundryService: false,
      conciergeService: false,
      airportTransfer: false,
      petFriendly: false,
      eventFacilities: false,
      parkingAvailable: false,
      wifi: false,
      familyAreaKidsFriendly: false,
      wheelchairAccessible: false,
    },
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const accommodationTypes = [
    "Hotel",
    "Guest House",
    "Villa",
    "Apartment",
    "Homestay",
    "Resort",
    "Boutique Hotel",
    "Motel",
    "Bed and Breakfast",
    "Other",
  ];
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checkbox = e.target as HTMLInputElement;
      if (name.startsWith("amenities.")) {
        const amenityKey = name.split(
          "."
        )[1] as keyof typeof formData.amenities;
        setFormData((prev) => ({
          ...prev,
          amenities: {
            ...prev.amenities,
            [amenityKey]: checkbox.checked,
          },
        }));
      } else if (name.startsWith("availability.")) {
        const availabilityKey = name.split(
          "."
        )[1] as keyof typeof formData.availability;
        setFormData((prev) => ({
          ...prev,
          availability: {
            ...prev.availability,
            [availabilityKey]: checkbox.checked,
          },
        }));
      }
    } else if (
      name === "starRating" ||
      name === "yearsInOperation" ||
      name === "numberOfRooms" ||
      name === "maxGuests" ||
      name === "minPricePerNight" ||
      name === "maxPricePerNight"
    ) {
      setFormData((prev) => ({
        ...prev,
        [name]: value === "" ? "" : parseFloat(value),
      }));
    } else if (name === "checkInTime" || name === "checkOutTime") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleDaysChange = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      availability: {
        ...prev.availability,
        daysOpen: prev.availability.daysOpen.includes(day)
          ? prev.availability.daysOpen.filter((d) => d !== day)
          : [...prev.availability.daysOpen, day],
      },
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(
          formData.accommodationName &&
          formData.ownerFullName &&
          formData.phoneNumber &&
          formData.emailAddress &&
          formData.propertyType
        );
      case 2:
        return !!(
          formData.locationAddress &&
          formData.propertyDescription &&
          formData.checkInTime &&
          formData.checkOutTime
        );
      case 3:
        // FIX: Add validation for fields in step 3
        return !!(
          formData.numberOfRooms !== "" &&
          formData.maxGuests !== "" &&
          formData.minPricePerNight !== "" &&
          formData.maxPricePerNight !== ""
        );
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
      setMessage("");
    } else {
      setMessage("Please fill in all required fields before proceeding.");
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    setMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Ensure step 3 is validated before final submission
    if (!validateStep(3)) {
      setMessage("Please fill in all required fields in the final step.");
      setLoading(false);
      return;
    }

    const dataToSend = {
      ...formData,
      daysAvailable: formData.availability.daysOpen,
      is24x7Reception: formData.availability.is24x7Reception,
      availability: undefined, // Remove the nested availability object before sending
    };

    try {
      const response = await fetch(
        "http://localhost:2000/api/addAccommodation",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSend),
        }
      );

      if (response.ok) {
        setIsSuccess(true);
      } else {
        const errorData = await response.json();
        setMessage(
          `Error: ${errorData.error || "Failed to register accommodation"}`
        );
        if (errorData.details) {
          Object.values(errorData.details).forEach((detail) => {
            console.error(detail);
          });
        }
      }
    } catch (error) {
      setMessage("Error: Failed to connect to server");
      console.error("Frontend fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setIsSuccess(false);
    setCurrentStep(1);
    setFormData({
      accommodationName: "",
      ownerFullName: "",
      phoneNumber: "",
      emailAddress: "",
      alternateContactNumber: "",
      propertyType: "",
      locationAddress: "",
      googleMapsLink: "",
      propertyDescription: "",
      starRating: "",

      checkInTime: "",
      checkOutTime: "",

      availability: {
        daysOpen: [],
        is24x7Reception: false,
        closedOnHolidays: false,
      },

      tourismLicenseNumber: "",
      businessRegistrationNumber: "",
      yearsInOperation: "",
      numberOfRooms: "",
      maxGuests: "",
      minPricePerNight: "",
      maxPricePerNight: "",

      amenities: {
        pool: false,
        gym: false,
        spa: false,
        restaurantOnSite: false,
        barLounge: false,
        roomService: false,
        laundryService: false,
        conciergeService: false,
        airportTransfer: false,
        petFriendly: false,
        eventFacilities: false,
        parkingAvailable: false,
        wifi: false,
        familyAreaKidsFriendly: false,
        wheelchairAccessible: false,
      },
    });
  };

  if (isSuccess) {
    return (
      <div className={styles.container}>
        <div className={styles.successWrapper}>
          <div className={styles.successIcon}>
            <svg
              width="80"
              height="80"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22,4 12,14.01 9,11.01"></polyline>
            </svg>
          </div>
          <h1 className={styles.successTitle}>
            Accommodation Successfully Registered!
          </h1>
          <p className={styles.successMessage}>
            Congratulations! Your accommodation{" "}
            <strong>{formData.accommodationName}</strong> has been successfully
            registered in our system.
          </p>
          <div className={styles.successDetails}>
            <p>
              <strong>Owner:</strong> {formData.ownerFullName}
            </p>
            <p>
              <strong>Property Type:</strong> {formData.propertyType}
            </p>
            <p>
              <strong>Email:</strong> {formData.emailAddress}
            </p>
          </div>
          <button onClick={resetForm} className={styles.newRegistrationButton}>
            Register Another Accommodation
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <div className={styles.progressContainer}>
          <div className={styles.progressBar}></div>
          <div className={styles.stepIndicators}>
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`${styles.stepIndicator} ${
                  currentStep >= step ? styles.active : ""
                }`}
              >
                <div className={styles.stepNumber}>{step}</div>
                <div className={styles.stepLabel}>
                  {step === 1 && "Basic Info"}
                  {step === 2 && "Details & Times"}
                  {step === 3 && "Additional Info"}
                </div>
              </div>
            ))}
          </div>
        </div>

        <h1 className={styles.title}>Accommodation Registration</h1>

        {message && (
          <div
            className={`${styles.message} ${
              message.includes("Error") ? styles.error : styles.warning
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          {currentStep === 1 && (
            <div className={styles.step}>
              <h2 className={styles.stepTitle}>Step 1: Basic Information</h2>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor="accommodationName" className={styles.label}>
                    Accommodation Name *
                  </label>
                  <input
                    type="text"
                    id="accommodationName"
                    name="accommodationName"
                    value={formData.accommodationName}
                    onChange={handleInputChange}
                    className={styles.input}
                    required
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="ownerFullName" className={styles.label}>
                    Owner Full Name *
                  </label>
                  <input
                    type="text"
                    id="ownerFullName"
                    name="ownerFullName"
                    value={formData.ownerFullName}
                    onChange={handleInputChange}
                    className={styles.input}
                    required
                  />
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor="phoneNumber" className={styles.label}>
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className={styles.input}
                    required
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="emailAddress" className={styles.label}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="emailAddress"
                    name="emailAddress"
                    value={formData.emailAddress}
                    onChange={handleInputChange}
                    className={styles.input}
                    required
                  />
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label
                    htmlFor="alternateContactNumber"
                    className={styles.label}
                  >
                    Alternate Contact Number
                  </label>
                  <input
                    type="tel"
                    id="alternateContactNumber"
                    name="alternateContactNumber"
                    value={formData.alternateContactNumber}
                    onChange={handleInputChange}
                    className={styles.input}
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="propertyType" className={styles.label}>
                    Property Type *
                  </label>
                  <select
                    id="propertyType"
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleInputChange}
                    className={styles.select}
                    required
                  >
                    <option value="">Select Property Type</option>
                    {accommodationTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className={styles.step}>
              <h2 className={styles.stepTitle}>Step 2: Details & Times</h2>

              <div className={styles.field}>
                <label htmlFor="locationAddress" className={styles.label}>
                  Location Address *
                </label>
                <textarea
                  id="locationAddress"
                  name="locationAddress"
                  value={formData.locationAddress}
                  onChange={handleInputChange}
                  className={styles.textarea}
                  rows={3}
                  required
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="googleMapsLink" className={styles.label}>
                  Google Maps Link
                </label>
                <input
                  type="url"
                  id="googleMapsLink"
                  name="googleMapsLink"
                  value={formData.googleMapsLink}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="https://maps.google.com/..."
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="propertyDescription" className={styles.label}>
                  Property Description *
                </label>
                <textarea
                  id="propertyDescription"
                  name="propertyDescription"
                  value={formData.propertyDescription}
                  onChange={handleInputChange}
                  className={styles.textarea}
                  rows={4}
                  required
                />
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor="starRating" className={styles.label}>
                    Star Rating
                  </label>
                  <input
                    type="number"
                    id="starRating"
                    name="starRating"
                    value={formData.starRating}
                    onChange={handleInputChange}
                    className={styles.input}
                    min="0"
                    max="5"
                    step="0.5"
                  />
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor="checkInTime" className={styles.label}>
                    Check-in Time *
                  </label>
                  <input
                    type="time"
                    id="checkInTime"
                    name="checkInTime"
                    value={formData.checkInTime}
                    onChange={handleInputChange}
                    className={styles.input}
                    required
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="checkOutTime" className={styles.label}>
                    Check-out Time *
                  </label>
                  <input
                    type="time"
                    id="checkOutTime"
                    name="checkOutTime"
                    value={formData.checkOutTime}
                    onChange={handleInputChange}
                    className={styles.input}
                    required
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Availability Days</label>
                <div className={styles.checkboxGrid}>
                  {daysOfWeek.map((day) => (
                    <label key={day} className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={formData.availability.daysOpen.includes(day)}
                        onChange={() => handleDaysChange(day)}
                        className={styles.checkbox}
                      />
                      {day}
                    </label>
                  ))}
                </div>
              </div>

              <div className={styles.checkboxRow}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="availability.is24x7Reception"
                    checked={formData.availability.is24x7Reception}
                    onChange={handleInputChange}
                    className={styles.checkbox}
                  />
                  24x7 Reception
                </label>

                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="availability.closedOnHolidays"
                    checked={formData.availability.closedOnHolidays}
                    onChange={handleInputChange}
                    className={styles.checkbox}
                  />
                  Closed on Holidays
                </label>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className={styles.step}>
              <h2 className={styles.stepTitle}>
                Step 3: Additional Information
              </h2>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label
                    htmlFor="tourismLicenseNumber"
                    className={styles.label}
                  >
                    Tourism License Number
                  </label>
                  <input
                    type="text"
                    id="tourismLicenseNumber"
                    name="tourismLicenseNumber"
                    value={formData.tourismLicenseNumber}
                    onChange={handleInputChange}
                    className={styles.input}
                  />
                </div>

                <div className={styles.field}>
                  <label
                    htmlFor="businessRegistrationNumber"
                    className={styles.label}
                  >
                    Business Registration Number
                  </label>
                  <input
                    type="text"
                    id="businessRegistrationNumber"
                    name="businessRegistrationNumber"
                    value={formData.businessRegistrationNumber}
                    onChange={handleInputChange}
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor="yearsInOperation" className={styles.label}>
                    Years in Operation
                  </label>
                  <input
                    type="number"
                    id="yearsInOperation"
                    name="yearsInOperation"
                    value={formData.yearsInOperation}
                    onChange={handleInputChange}
                    className={styles.input}
                    min="0"
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="numberOfRooms" className={styles.label}>
                    Number of Rooms *
                  </label>
                  <input
                    type="number"
                    id="numberOfRooms"
                    name="numberOfRooms"
                    value={formData.numberOfRooms}
                    onChange={handleInputChange}
                    className={styles.input}
                    min="0"
                    required // Marked as required
                  />
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor="maxGuests" className={styles.label}>
                    Max Guests *
                  </label>
                  <input
                    type="number"
                    id="maxGuests"
                    name="maxGuests"
                    value={formData.maxGuests}
                    onChange={handleInputChange}
                    className={styles.input}
                    min="1"
                    required // Marked as required
                  />
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor="minPricePerNight" className={styles.label}>
                    Min Price Per Night *
                  </label>
                  <input
                    type="number"
                    id="minPricePerNight"
                    name="minPricePerNight"
                    value={formData.minPricePerNight}
                    onChange={handleInputChange}
                    className={styles.input}
                    min="0"
                    required // Marked as required
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="maxPricePerNight" className={styles.label}>
                    Max Price Per Night *
                  </label>
                  <input
                    type="number"
                    id="maxPricePerNight"
                    name="maxPricePerNight"
                    value={formData.maxPricePerNight}
                    onChange={handleInputChange}
                    className={styles.input}
                    min="0"
                    required // Marked as required
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Amenities</label>
                <div className={styles.checkboxGrid}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="amenities.pool"
                      checked={formData.amenities.pool}
                      onChange={handleInputChange}
                      className={styles.checkbox}
                    />
                    Pool
                  </label>

                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="amenities.gym"
                      checked={formData.amenities.gym}
                      onChange={handleInputChange}
                      className={styles.checkbox}
                    />
                    Gym
                  </label>

                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="amenities.spa"
                      checked={formData.amenities.spa}
                      onChange={handleInputChange}
                      className={styles.checkbox}
                    />
                    Spa
                  </label>

                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="amenities.restaurantOnSite"
                      checked={formData.amenities.restaurantOnSite}
                      onChange={handleInputChange}
                      className={styles.checkbox}
                    />
                    Restaurant On-site
                  </label>

                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="amenities.barLounge"
                      checked={formData.amenities.barLounge}
                      onChange={handleInputChange}
                      className={styles.checkbox}
                    />
                    Bar/Lounge
                  </label>

                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="amenities.roomService"
                      checked={formData.amenities.roomService}
                      onChange={handleInputChange}
                      className={styles.checkbox}
                    />
                    Room Service
                  </label>

                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="amenities.laundryService"
                      checked={formData.amenities.laundryService}
                      onChange={handleInputChange}
                      className={styles.checkbox}
                    />
                    Laundry Service
                  </label>

                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="amenities.conciergeService"
                      checked={formData.amenities.conciergeService}
                      onChange={handleInputChange}
                      className={styles.checkbox}
                    />
                    Concierge Service
                  </label>

                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="amenities.parkingAvailable"
                      checked={formData.amenities.parkingAvailable}
                      onChange={handleInputChange}
                      className={styles.checkbox}
                    />
                    Parking Available
                  </label>

                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="amenities.wifi"
                      checked={formData.amenities.wifi}
                      onChange={handleInputChange}
                      className={styles.checkbox}
                    />
                    WiFi
                  </label>

                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="amenities.petFriendly"
                      checked={formData.amenities.petFriendly}
                      onChange={handleInputChange}
                      className={styles.checkbox}
                    />
                    Pet Friendly
                  </label>

                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="amenities.airportTransfer"
                      checked={formData.amenities.airportTransfer}
                      onChange={handleInputChange}
                      className={styles.checkbox}
                    />
                    Airport Transfer
                  </label>

                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="amenities.wheelchairAccessible"
                      checked={formData.amenities.wheelchairAccessible}
                      onChange={handleInputChange}
                      className={styles.checkbox}
                    />
                    Wheelchair Accessible
                  </label>

                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="amenities.eventFacilities"
                      checked={formData.amenities.eventFacilities}
                      onChange={handleInputChange}
                      className={styles.checkbox}
                    />
                    Event Facilities
                  </label>

                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="amenities.familyAreaKidsFriendly"
                      checked={formData.amenities.familyAreaKidsFriendly}
                      onChange={handleInputChange}
                      className={styles.checkbox}
                    />
                    Family Area/Kids Friendly
                  </label>
                </div>
              </div>
            </div>
          )}

          <div className={styles.buttonContainer}>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className={styles.prevButton}
              >
                Previous
              </button>
            )}

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className={styles.nextButton}
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className={styles.submitButton}
                disabled={loading}
              >
                {loading ? "Registering..." : "Register Accommodation"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccommodationRegistrationForm;
