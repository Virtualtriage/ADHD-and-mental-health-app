import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../config/axiosConfig";
import AppointmentBookedModal from "../pages/AppointmentBookedModal";
import StripePaymentModal from "../config/StripePaymentModal";
import "../styles/BookAppointmentModal.css";

const BookAppointmentModal = ({
  practitioner,
  selectedSlot,
  selectedDate,
  onClose,
  appointmentType,
  appointmentFee,
  onAppointmentBooked,
  scheduleData
}) => {
  // Defensive check to prevent errors if practitioner is undefined

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    weight: "",
    bodyPoints: [],
    preappointmentdetail_id: "",
    pre_appointment_details: [],
    body_chart_image: "",
    date: "",
    time: "",
    patient_address: "",
  });

  const imgRef = useRef(null); // Ref for image
  const containerRef = useRef(null); // Ref for container div
  const chartRef = useRef(null);

  const [isBooked, setIsBooked] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [chartScreenshot, setChartScreenshot] = useState(null);
  const [appointmentId, setAppointmentId] = useState(null); // Store booked appointment ID
  const [fetchingDetails, setFetchingDetails] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [insuranceDetails, setInsuranceDetails] = useState(null);
  const [insuranceFormData, setInsuranceFormData] = useState({
    insurancebooking_Id: "",
    insuarance_number: "",
    insurance_company_name: "",
    group_number: "",
    coverage_type: "",
    date_of_issue: "",
    date_of_expiry: "",
    preauth_number: "",
  });

  // New state for enhanced UX
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStepName, setCurrentStepName] = useState("Personal Information");

  // Step configuration for better navigation
  const stepConfig = {
    1: { name: "Personal Information", icon: "👤" },
    2: { name: "Health Assessment", icon: "🏥" },
    3: { name: "Appointment Confirmation", icon: "✅" },
    4: { name: "Insurance Information", icon: "🛡️" },
    5: { name: "Payment", icon: "💳" }
  };

  // Enhanced validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    return phoneRegex.test(cleanPhone);
  };

  const validateForm = (stepNumber) => {
    const newErrors = {};

    if (stepNumber === 1) {
      if (!formData.fullName?.trim()) newErrors.fullName = "Full name is required";
      if (!formData.email?.trim()) newErrors.email = "Email is required";
      else if (!validateEmail(formData.email)) newErrors.email = "Please enter a valid email";
      if (!formData.phone?.trim()) newErrors.phone = "Phone number is required";
      else if (!validatePhone(formData.phone)) newErrors.phone = "Please enter a valid phone number";
      if (!formData.age?.trim()) newErrors.age = "Age is required";
      else if (isNaN(formData.age) || formData.age < 1 || formData.age > 120) {
        newErrors.age = "Please enter a valid age between 1 and 120";
      }
      if (!formData.gender?.trim()) newErrors.gender = "Gender is required";
      if (!formData.patient_address?.trim()) newErrors.patient_address = "Address is required";
    }

    if (stepNumber === 4) {
      if (!insuranceFormData.insurance_company_name?.trim()) {
        newErrors.insurance_company_name = "Insurance company name is required";
      }
      if (!insuranceFormData.insuarance_number?.trim()) {
        newErrors.insuarance_number = "Policy number is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Clear errors when user starts typing
  const clearError = (field) => {
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      date: selectedDate,
      time: selectedSlot,
    }));
  }, [selectedDate, selectedSlot]);

  // **Fetch Charting Details API**
  useEffect(() => {
    if (!practitioner) return;

    const fetchChartingDetails = async () => {
      try {
        const response = await axiosInstance.get(
          `/patient/charting/get-charting-details/?doctor_id=${practitioner.Health_Professional_Id}`
        );

        if (response.status === 200 && response.data.status) {
          setFormData((prev) => ({
            ...prev,
            preappointmentdetail_id: response.data.data.id,
            body_chart_image: response.data.data.body_chart_image,
            pre_appointment_details: response.data.data.questions.map((q) => ({
              id: q.id,
              question: q.question,
              answer: "",
            })),
          }));
        }
      } catch (error) {
        console.error("Error fetching charting details:", error);
      }
    };

    fetchChartingDetails();
  }, [practitioner && practitioner.Health_Professional_Id]);

  // Pre-fill insurance form when step 4 is reached
  useEffect(() => {
    if (step === 4) {
      prefillInsuranceForm();
    }
  }, [step]);

  // Cleanup insurance data when component unmounts
  useEffect(() => {
    return () => {
      sessionStorage.removeItem("insuranceData");
    };
  }, []);

  if (!practitioner) return null;

  // **Handle Input Changes**
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    clearError(name);
  };

  // **Handle Dynamic Questions Input**
  const handleDynamicInputChange = (id, value) => {
    setFormData((prevData) => ({
      ...prevData,
      pre_appointment_details: prevData.pre_appointment_details.map((q) =>
        q.id === id ? { ...q, answer: value } : q
      ),
    }));
  };

  // **Handle Body Chart Click**
  const handleBodyChartClick = (e) => {
    if (!chartRef.current) return;

    const chartRect = chartRef.current.getBoundingClientRect();
    const x = (e.clientX - chartRect.left) / chartRect.width;
    const y = (e.clientY - chartRect.top) / chartRect.height;

    // Ensure coordinates are within bounds
    const boundedX = Math.max(0, Math.min(1, x));
    const boundedY = Math.max(0, Math.min(1, y));

    setFormData((prevData) => ({
      ...prevData,
      bodyPoints: [
        ...prevData.bodyPoints,
        { x_axis: boundedX, y_axis: boundedY, question: "", answer: "" },
      ],
    }));
  };

  // **Handle Explanation for Body Chart Pins**
  const handleBodyPointExplanationChange = (index, question, answer) => {
    setFormData((prevData) => {
      const updatedBodyPoints = [...prevData.bodyPoints];
      updatedBodyPoints[index] = {
        ...updatedBodyPoints[index],
        question,
        answer,
      };
      return { ...prevData, bodyPoints: updatedBodyPoints };
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Invalid Date"; // Handle empty date

    const dateObj = new Date(dateString);

    if (isNaN(dateObj)) {
      console.error("🚨 Invalid date format received:", dateString);
      return "Invalid Date";
    }

    const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // Ensure 2-digit month
    const day = String(dateObj.getDate()).padStart(2, "0"); // Ensure 2-digit day
    const year = dateObj.getFullYear();

    return `${month}/${day}/${year}`; // Convert to MM/DD/YYYY
  };

  // **Handle Booking API Call**
  const handleBooking = async () => {
    setLoading(true);

    try {
      // Convert base64 to Blob if chartScreenshot exists
      let blob = null;
      if (chartScreenshot) {
        blob = await fetch(chartScreenshot).then((res) => res.blob());
      }
      if (!practitioner) return null;

      // Create FormData
      const submissionData = new FormData();
      submissionData.append("date", formatDate(selectedDate));
      submissionData.append("time", selectedSlot);
      submissionData.append("doctor_id", practitioner.Health_Professional_Id);
      submissionData.append("gender", formData.gender);
      submissionData.append("full_name", formData.fullName);
      submissionData.append("age", formData.age);
      submissionData.append("weight", formData.weight);
      submissionData.append("email", formData.email);
      submissionData.append("mobile_number", formData.phone);
      submissionData.append(
        "preappointmentdetail_id",
        formData.preappointmentdetail_id
      );
      submissionData.append("body_chart_image", formData.body_chart_image);
      submissionData.append("appointment_type", appointmentType);
      submissionData.append("appointment_fee", appointmentFee);
      submissionData.append("patient_address", formData.patient_address);
      // Convert structured objects to JSON strings
      submissionData.append(
        "pre_appointment_details",
        JSON.stringify(formData.pre_appointment_details)
      );
      submissionData.append("body_points", JSON.stringify(formData.bodyPoints));

      const response = await axiosInstance.post(
        "/patient/appointment/book-appointment/",
        submissionData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200 && response.data.status) {
        const bookedAppointmentId = response.data.appointment_id;
        setAppointmentId(bookedAppointmentId);
        setIsBooked(true);
        setShowPaymentModal(false); // Close payment modal after successful booking
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseBookedModal = () => {
    setIsBooked(false); // Hide the modal when closed
    onClose(); // Also close the main booking modal
  };

  const handleProceedToStep3 = () => {
    setStep(3);
    setCurrentStepName(stepConfig[3].name);
  };

  const handleProceedToPayment = () => {
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async (paymentResult) => {

    if (paymentResult.success) {
      // Check if insurance data exists (user provided insurance details)
      const insuranceData = sessionStorage.getItem("insuranceData");

      if (insuranceData) {
        try {
          // Send insurance details to medserve after successful payment
          const medserveResponse = await axiosInstance.post(
            "/api/v1/patient/insurance/send_to_medserve/",
            JSON.parse(insuranceData)
          );

          if (medserveResponse.status === 200) {
            
          } else {
            
          }
        } catch (medserveError) {
          console.error("Error sending insurance details to medserve after payment:", medserveError);
          // Don't block the booking flow if medserve call fails
        }

        // Clear insurance data from session storage
        sessionStorage.removeItem("insuranceData");
      }

      // After successful payment (and medserve call if applicable), proceed with booking
      handleBooking();
    } else {
      console.error("Payment failed:", paymentResult.message);
      // Handle payment failure if needed
    }
  };

  // Handle insurance form input changes
  const handleInsuranceInputChange = (e) => {
    const { name, value } = e.target;
    setInsuranceFormData(prev => ({
      ...prev,
      [name]: value
    }));
    clearError(name);
  };

  // Pre-fill insurance form with available data
  const prefillInsuranceForm = () => {
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    setInsuranceFormData(prev => ({
      ...prev,
      // Pre-fill with user data if available
      insurancebooking_Id: prev.insurancebooking_Id || "",
      insuarance_number: prev.insuarance_number || "",
      insurance_company_name: prev.insurance_company_name || "",
      group_number: prev.group_number || "",
      coverage_type: prev.coverage_type || "",
      date_of_issue: prev.date_of_issue || "",
      date_of_expiry: prev.date_of_expiry || "",
      preauth_number: prev.preauth_number || "",
    }));
  };

  // Check if all required insurance fields are filled
  const isInsuranceFormValid = () => {
    return insuranceFormData.insurance_company_name &&
      insuranceFormData.insurance_company_name.trim() !== '' &&
      insuranceFormData.insuarance_number &&
      insuranceFormData.insuarance_number.trim() !== '';
  };

  // Submit insurance form with complete API data
  const handleInsuranceFormSubmit = async () => {
    if (!validateForm(4)) {
      return;
    }

    try {

      // Get auth token
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        alert("Please log in to save insurance details.");
        return;
      }

      // Store insurance data for later use (after payment success)
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");

      // Prepare the insurance data according to the new API specification
      const insuranceData = {
        insurancebooking_Id: insuranceFormData.insurancebooking_Id || "",
        insuarance_number: insuranceFormData.insuarance_number,
        insurance_company_name: insuranceFormData.insurance_company_name,
        group_number: insuranceFormData.group_number || "",
        coverage_type: insuranceFormData.coverage_type || "",
        date_of_issue: insuranceFormData.date_of_issue || "",
        date_of_expiry: insuranceFormData.date_of_expiry || "",
        preauth_number: insuranceFormData.preauth_number || ""
      };

      // Call the new insurance API
      const response = await axiosInstance.post(
        "/patient/insurance/add_insurance/",
        insuranceData,
        {
          headers: {
            "Authorization": `Bearer ${authToken}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (response.status === 200) {

        // Store insurance data in session storage for use after payment
        sessionStorage.setItem("insuranceData", JSON.stringify(insuranceData));

        setInsuranceDetails(insuranceFormData);
        setStep(5); // Go to payment notice step
        setCurrentStepName(stepConfig[5].name);
      } else {
        throw new Error("Failed to save insurance details");
      }
    } catch (error) {
      console.error("Error saving insurance details:", error);
      alert("Error saving insurance details. Please try again.");
    }
  };

  // Handle skip insurance and go to payment
  const handleSkipInsurance = () => {
    setShowPaymentModal(true); // Go directly to Stripe modal
  };

  // Handle proceed to payment with insurance check
  const handleProceedToPaymentWithInsurance = async () => {
    // Go directly to insurance step
    setInsuranceDetails(null);
    setStep(4);
    setCurrentStepName(stepConfig[4].name);
  };

  // Handle proceed to payment from Step 5
  const handleProceedToPaymentFromStep5 = () => {
    setShowPaymentModal(true);
  };

  // Get the correct previous step
  const getPreviousStep = (currentStep) => {
    if (currentStep === 3) {
      // If we're in step 3, go back to step 1 if no body chart, otherwise step 2
      return hasBodyChartImage() ? 2 : 1;
    }
    if (currentStep === 4) {
      return 3;
    }
    if (currentStep === 5) {
      return 4;
    }
    return currentStep - 1;
  };

  // Handle back button with step name updates
  const handleBack = () => {
    const prevStep = getPreviousStep(step);
    setStep(prevStep);
    setCurrentStepName(stepConfig[prevStep].name);
  };

  // Check if body chart image exists and has content
  const hasBodyChartImage = () => {
    return formData.body_chart_image &&
      formData.body_chart_image.trim() !== '' &&
      formData.body_chart_image !== 'null' &&
      formData.body_chart_image !== 'undefined';
  };

  // Modified step 1 proceed function to skip step 2 if no body chart
  const handleStep1Proceed = () => {
    if (!validateForm(1)) {
      return;
    }

    if (hasBodyChartImage()) {
      setStep(2);
      setCurrentStepName(stepConfig[2].name);
    } else {
      setStep(3);
      setCurrentStepName(stepConfig[3].name);
    }
  };

  return (
    <div className="book-appointment-modal-overlay">
      <div className="book-appointment-modal-content">
        {/* Header with Progress Indicator */}

        <button
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close modal"
        >
          ×
        </button>

        {/* Step 1 - Personal Information */}
        {step === 1 && (
          <div className="booking-step">
            <div className="step-content">
              <div className="step-header">
                <h3>Personal Information</h3>
              </div>

              <div className="form-section">
                {/* Personal Details Card */}
                <div className="info-card">

                  <div className="form-grid">
                    <div className="form-field">
                      <label htmlFor="fullName">
                        Full Name *
                      </label>
                      <input
                        id="fullName"
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        className={errors.fullName ? 'error' : ''}
                        required
                      />
                      {errors.fullName && <span className="error-message">{errors.fullName}</span>}
                    </div>

                    <div className="form-field">
                      <label htmlFor="email">
                        Email Address *
                      </label>
                      <input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your@email.com"
                        className={errors.email ? 'error' : ''}
                        required
                      />
                      {errors.email && <span className="error-message">{errors.email}</span>}
                    </div>

                    <div className="form-field">
                      <label htmlFor="phone">
                        Phone Number *
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+1 (555) 123-4567"
                        className={errors.phone ? 'error' : ''}
                        required
                      />
                      {errors.phone && <span className="error-message">{errors.phone}</span>}
                    </div>

                    <div className="form-field">
                      <label htmlFor="age">
                        Age *
                      </label>
                      <input
                        id="age"
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                        placeholder="25"
                        min="1"
                        max="120"
                        className={errors.age ? 'error' : ''}
                        required
                      />
                      {errors.age && <span className="error-message">{errors.age}</span>}
                    </div>
                  </div>
                </div>

                {/* Address & Gender Card */}
                <div className="info-card">
                  <div className="form-grid">
                    <div className="form-field full-width">
                      <label htmlFor="patient_address">
                        Address *
                      </label>
                      <input
                        id="patient_address"
                        type="text"
                        name="patient_address"
                        value={formData.patient_address}
                        onChange={handleInputChange}
                        placeholder="Enter your full address"
                        className={errors.patient_address ? 'error' : ''}
                        required
                      />
                      {errors.patient_address && <span className="error-message">{errors.patient_address}</span>}
                    </div>

                    <div className="form-field gender-field">
                      <label htmlFor="gender">
                        Gender *
                      </label>
                      <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className={errors.gender ? 'error' : ''}
                        required
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                      {errors.gender && <span className="error-message">{errors.gender}</span>}
                    </div>
                  </div>
                </div>
              </div>

              <div className="step-actions">
                <button
                  className="proceed-button"
                  onClick={handleStep1Proceed}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Validating...' : 'Continue'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2 - Dynamic Questions & Body Chart */}
        {step === 2 && hasBodyChartImage() && (
          <div className="booking-step">
            <div className="step-content">
              <div className="step-header">
                <h3>Health Assessment</h3>
                <p>Please answer the health questions and mark any areas of concern on the body chart</p>
              </div>

              <div className="form-section">
                {formData.pre_appointment_details.map((q) => (
                  <div key={q.id} className="form-field full-width">
                    <label htmlFor={`question-${q.id}`}>{q.question}</label>
                    <textarea
                      id={`question-${q.id}`}
                      value={q.answer}
                      onChange={(e) =>
                        handleDynamicInputChange(q.id, e.target.value)
                      }
                      placeholder="Please provide your answer..."
                      required
                    />
                  </div>
                ))}

                {/* **Body Chart Image with Clickable Pins** */}
                <div className="body-chart-container">
                  <h4>Click on the body chart to mark areas of concern</h4>
                  <div
                    ref={chartRef}
                    className="chart-wrapper"
                    onClick={handleBodyChartClick}
                  >
                    <img
                      ref={imgRef}
                      src={formData.body_chart_image}
                      className="charting-image"
                      alt="Body Chart"
                    />

                    {formData.bodyPoints.map((point, index) => (
                      <div
                        key={index}
                        className="body-point"
                        style={{
                          top: `${point.y_axis * (imgRef.current?.height || 0)}px`,
                          left: `${point.x_axis * (imgRef.current?.width || 0)}px`,
                        }}
                      >
                        {index + 1}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Input Fields for Pins */}
                {formData.bodyPoints.length > 0 && (
                  <div className="body-chart-explanations">
                    <h4>Explain the marked areas</h4>
                    {formData.bodyPoints.map((point, index) => (
                      <div key={index} className="form-field full-width">
                        <label htmlFor={`point-${index}`}>Point {index + 1} - Description</label>
                        <textarea
                          id={`point-${index}`}
                          value={point.answer}
                          onChange={(e) =>
                            handleBodyPointExplanationChange(
                              index,
                              point.question,
                              e.target.value
                            )
                          }
                          placeholder="Describe the issue or concern at this location..."
                          required
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="step-actions">
                <button
                  className="back-button"
                  onClick={handleBack}
                >
                  Back
                </button>
                <button
                  className="proceed-button"
                  onClick={handleProceedToStep3}
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 4 - Insurance Information */}
        {step === 4 && (
          <div className="booking-step">
            <div className="step-content">
              <div className="step-header">
                <h3>Insurance Information</h3>
                <p>Provide your insurance details or skip to pay directly</p>
              </div>

              <div className="form-section">
                <div className="insurance-form">
                  <div className="form-row">
                    <div className="form-field">
                      <label htmlFor="insurancebooking_Id">Insurance ID</label>
                      <input
                        id="insurancebooking_Id"
                        type="text"
                        name="insurancebooking_Id"
                        value={insuranceFormData.insurancebooking_Id}
                        onChange={handleInsuranceInputChange}
                        placeholder="Enter insurance ID"
                      />
                    </div>
                    <div className="form-field">
                      <label htmlFor="insuarance_number">Policy Number *</label>
                      <input
                        id="insuarance_number"
                        type="text"
                        name="insuarance_number"
                        value={insuranceFormData.insuarance_number}
                        onChange={handleInsuranceInputChange}
                        placeholder="Enter policy number"
                        className={errors.insuarance_number ? 'error' : ''}
                        required
                      />
                      {errors.insuarance_number && <span className="error-message">{errors.insuarance_number}</span>}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-field">
                      <label htmlFor="insurance_company_name">Insurance Company *</label>
                      <input
                        id="insurance_company_name"
                        type="text"
                        name="insurance_company_name"
                        value={insuranceFormData.insurance_company_name}
                        onChange={handleInsuranceInputChange}
                        placeholder="Enter insurance company name"
                        className={errors.insurance_company_name ? 'error' : ''}
                        required
                      />
                      {errors.insurance_company_name && <span className="error-message">{errors.insurance_company_name}</span>}
                    </div>
                    <div className="form-field">
                      <label htmlFor="group_number">Group Number</label>
                      <input
                        id="group_number"
                        type="text"
                        name="group_number"
                        value={insuranceFormData.group_number}
                        onChange={handleInsuranceInputChange}
                        placeholder="Enter group number"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-field">
                      <label htmlFor="coverage_type">Coverage Type</label>
                      <input
                        id="coverage_type"
                        type="text"
                        name="coverage_type"
                        value={insuranceFormData.coverage_type}
                        onChange={handleInsuranceInputChange}
                        placeholder="Enter Coverage Type"
                      />
                    </div>
                    <div className="form-field">
                      <label htmlFor="date_of_issue">Effective Date</label>
                      <input
                        id="date_of_issue"
                        type="date"
                        name="date_of_issue"
                        value={insuranceFormData.date_of_issue}
                        onChange={handleInsuranceInputChange}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-field">
                      <label htmlFor="date_of_expiry">Expiration Date</label>
                      <input
                        id="date_of_expiry"
                        type="date"
                        name="date_of_expiry"
                        value={insuranceFormData.date_of_expiry}
                        onChange={handleInsuranceInputChange}
                      />
                    </div>
                    <div className="form-field">
                      <label htmlFor="preauth_number">Pre-Authorization Number</label>
                      <input
                        id="preauth_number"
                        type="text"
                        name="preauth_number"
                        value={insuranceFormData.preauth_number}
                        onChange={handleInsuranceInputChange}
                        placeholder="Enter pre-auth number"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="step-actions">
                <button
                  className="back-button"
                  onClick={handleBack}
                >
                  Back
                </button>
                <div className="insurance-buttons">
                  <button
                    className="insurance-skip-button"
                    onClick={handleSkipInsurance}
                  >
                    Skip Insurance - Pay Directly
                  </button>
                  <button
                    className="insurance-save-button"
                    onClick={handleInsuranceFormSubmit}
                    disabled={!isInsuranceFormValid() || isSubmitting}
                  >
                    {isSubmitting ? 'Saving...' : 'Save Insurance & Continue'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 5 - Payment */}
        {step === 5 && (
          <div className="booking-step">
            <div className="step-content">
              <div className="step-header">
                <h3>Payment</h3>
                <p>Complete your payment to confirm your appointment</p>
              </div>

              <div className="payment-section">
                <div className="insurance-notice">
                  <div className="notice-icon">🛡️</div>
                  <div className="notice-content">
                    <h4>Insurance Coverage Notice</h4>
                    <p>
                      Your payment is on hold until your insurance provider reviews and accepts the claim.
                      Once the insurance claim is accepted, the charged amount will be refunded.
                    </p>
                  </div>
                </div>

                <div className="payment-summary">
                  <div className="payment-item">
                    <span className="payment-label">Appointment Fee</span>
                    <span className="payment-value">£{appointmentFee}</span>
                  </div>
                </div>
              </div>

              <div className="step-actions">
                <button
                  className="back-button"
                  onClick={handleBack}
                >
                  Back
                </button>
                <button
                  className="proceed-button"
                  onClick={handleProceedToPaymentFromStep5}
                >
                  Proceed to Payment
                </button>
              </div>
            </div>
          </div>
        )}

        {/* **Appointment Successfully Booked Modal** */}
        {isBooked && (
          <AppointmentBookedModal
            appointment_id={appointmentId}
            onClose={onClose}
            appointmentStart={selectedDate + " " + selectedSlot + ":00"}
            appointmentEnd={selectedDate + " " + selectedSlot + ":00"}
          />
        )}
        {step === 3 && (
          <div className="booking-step">
            <div className="step-content">
              <div className="step-header">
                <h3>Confirm Appointment</h3>
                <p>Please review your appointment details and proceed to payment</p>
              </div>

              <div className="confirmation-section">
                <div className="confirmation-grid">
                  <div className="confirmation-item">
                    <span className="confirmation-label">Doctor</span>
                    <span className="confirmation-value">{practitioner.Full_Name}</span>
                  </div>
                  <div className="confirmation-item">
                    <span className="confirmation-label">Full Name</span>
                    <span className="confirmation-value">{formData.fullName}</span>
                  </div>
                  <div className="confirmation-item">
                    <span className="confirmation-label">Email</span>
                    <span className="confirmation-value">{formData.email}</span>
                  </div>
                  <div className="confirmation-item">
                    <span className="confirmation-label">Phone</span>
                    <span className="confirmation-value">{formData.phone}</span>
                  </div>
                  <div className="confirmation-item">
                    <span className="confirmation-label">Date</span>
                    <span className="confirmation-value">{selectedDate || "Not selected"}</span>
                  </div>
                  <div className="confirmation-item">
                    <span className="confirmation-label">Time</span>
                    <span className="confirmation-value">{selectedSlot || "Not selected"}</span>
                  </div>
                  <div className="confirmation-item">
                    <span className="confirmation-label">Appointment Type</span>
                    <span className="confirmation-value">{appointmentType}</span>
                  </div>
                  <div className="confirmation-item">
                    <span className="confirmation-label">Fee</span>
                    <span className="confirmation-value">£{appointmentFee}</span>
                  </div>
                </div>

                {/* Emergency Disclaimer */}
                <div style={{
                  marginTop: '20px',
                  marginBottom: '20px',
                  padding: '12px 16px',
                  backgroundColor: '#fff3cd',
                  border: '1px solid #ffc107',
                  borderRadius: '6px',
                  fontSize: '13px',
                  color: '#856404',
                  textAlign: 'center',
                  lineHeight: '1.5'
                }}>
                  <strong>⚠️ Important:</strong> Virtual Triage is not a healthcare provider. This service is not for emergencies – call 999 if you need urgent help.
                </div>

                <div className="terms-section">
                  <div className="terms-checkbox">
                    <input
                      type="checkbox"
                      id="terms-checkbox"
                      checked={isAgreed}
                      onChange={() => setIsAgreed(!isAgreed)}
                    />
                    <label htmlFor="terms-checkbox" style={{ fontSize: '13px', lineHeight: '1.6' }}>
                      I understand that all medical services are provided independently by clinicians and not by Virtual Triage, and I agree to the{" "}
                      <a href="/terms-and-conditions" target="_blank" rel="noopener noreferrer" style={{ color: "#007bff", textDecoration: "underline" }}>
                        Terms & Conditions
                      </a>
                      ,{" "}
                      <a href="/privacy-notice" target="_blank" rel="noopener noreferrer" style={{ color: "#007bff", textDecoration: "underline" }}>
                        Privacy Notice
                      </a>
                      ,{" "}
                      <a href="/cookie-policy" target="_blank" rel="noopener noreferrer" style={{ color: "#007bff", textDecoration: "underline" }}>
                        Cookie Policy
                      </a>
                      {" "}and{" "}
                      <a href="/appointment-terms" target="_blank" rel="noopener noreferrer" style={{ color: "#007bff", textDecoration: "underline" }}>
                        Appointment Terms & Medical Disclaimer
                      </a>
                      .
                    </label>
                  </div>
                </div>
              </div>

              <div className="step-actions">
                <button
                  className="back-button"
                  onClick={handleBack}
                >
                  Back
                </button>
                <button
                  className="proceed-button"
                  onClick={handleProceedToPaymentWithInsurance}
                  disabled={!isAgreed}
                >
                  Continue to Payment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Insurance Form Modal */}
      {/* This section is no longer needed as insurance details are integrated into steps 4 and 5 */}

      {/* Stripe Payment Modal */}
      <StripePaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        appointmentData={{
          doctor_id: practitioner?.Health_Professional_Id,
          appointmentDate: selectedDate,
          appointmentType: appointmentType, // "initial" or "follow_up"
          amount: appointmentFee,
          scheduleData: scheduleData || {
            initial_appointment_fee: appointmentFee,
            follow_up_appointment_fee: appointmentFee,
            Currency: "£"
          },
          package_info: scheduleData?.package_info,
          token: localStorage.getItem("authToken") // Add auth token
        }}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default BookAppointmentModal;