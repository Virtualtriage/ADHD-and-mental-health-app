import React, { useState } from 'react';
import BookAppointmentModal from '../pages/BookAppointmentModal';
import AppointmentBookedModal from '../pages/AppointmentBookedModal';
import '../styles/directBookingModal.css';

const DirectBookingModal = ({
  isOpen,
  onClose,
  doctor
}) => {
  const [appointmentType, setAppointmentType] = useState("initial");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [showAppointmentBooked, setShowAppointmentBooked] = useState(false);
  const [appointmentId, setAppointmentId] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);

  // Get current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Get min date (today)
  const getMinDate = () => {
    return getCurrentDate();
  };

  // Extract price from doctor.price (format: "£500")
  const getAppointmentFee = () => {
    if (!doctor || !doctor.price) return 0;
    const priceStr = doctor.price.replace('£', '').replace(',', '');
    return parseInt(priceStr) || 0;
  };

  // Time slots
  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30'
  ];

  const handleDateChange = (e) => {
    const selectedDateValue = e.target.value;
    const selectedDateObj = new Date(selectedDateValue);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDateObj < today) {
      alert("Please select a date from today onwards.");
      setSelectedDate(getCurrentDate());
      return;
    }

    setSelectedDate(selectedDateValue);
    setSelectedSlot(""); // Clear slot when date changes
  };

  const handleSlotSelection = (slot) => {
    // Check if slot is in the past for today
    if (selectedDate === getCurrentDate()) {
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();
      const slotTime = slot.split(':').map(Number);
      const slotMinutes = slotTime[0] * 60 + slotTime[1];
      
      if (slotMinutes <= currentTime) {
        alert("Please select a time slot in the future.");
        return;
      }
    }

    setSelectedSlot(selectedSlot === slot ? "" : slot);
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!appointmentType) {
        alert("Please select an appointment type.");
        return;
      }
      setCurrentStep(2);
    }
  };

  const handleBackStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleProceedToBooking = () => {
    if (!selectedDate) {
      alert("Please select a date.");
      return;
    }
    if (!selectedSlot) {
      alert("Please select a time slot.");
      return;
    }
    
    setIsBookingModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsBookingModalOpen(false);
    setShowAppointmentBooked(false);
    setSelectedDate("");
    setSelectedSlot("");
    setAppointmentType("initial");
    setCurrentStep(1);
    setAppointmentId(null);
    onClose();
  };

  const handleAppointmentBooked = (id) => {
    setAppointmentId(id);
    setIsBookingModalOpen(false);
    setShowAppointmentBooked(true);
  };

  // Don't render if modal is not open or no doctor
  if (!isOpen || !doctor) {
    return null;
  }

  const appointmentFee = getAppointmentFee();

  return (
    <>
      {/* Main Booking Modal */}
      <div className="modal-direct-booking-overlay" onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleCloseModal();
        }
      }}>
        <div className="modal-direct-booking-modal">
          <div className="modal-direct-booking-header">
            <div className="modal-direct-booking-title-section">
              <h2 className="modal-direct-booking-title">Book Appointment</h2>
              <p className="modal-direct-booking-subtitle">
                Schedule your appointment with <strong>{doctor.name}</strong>
              </p>
            </div>
            <button
              className="modal-direct-booking-close-button"
              onClick={handleCloseModal}
              aria-label="Close"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <div className="modal-direct-booking-content">
            {/* Step 1: Appointment Type Selection */}
            {currentStep === 1 && (
              <div className="modal-direct-booking-step">
                <div className="modal-direct-booking-step-header">
                  <h3 className="modal-direct-booking-step-title">Select Appointment Type</h3>
                  <p className="modal-direct-booking-step-description">Choose the type of consultation you need</p>
                </div>

                <div className="modal-direct-booking-type-cards">
                  <div className="modal-direct-booking-type-card">
                    <div className="modal-direct-booking-type-card-header">
                      <h4>Initial Consultation</h4>
                      <div className="modal-direct-booking-type-price">
                        {doctor.price}
                      </div>
                    </div>
                    <p className="modal-direct-booking-type-description">
                      First-time consultation with detailed assessment
                    </p>
                    <button
                      className={`modal-direct-booking-type-select-btn ${appointmentType === 'initial' ? 'selected' : ''}`}
                      onClick={() => setAppointmentType('initial')}
                    >
                      {appointmentType === 'initial' ? 'Selected' : 'Select'}
                    </button>
                  </div>

                  <div className="modal-direct-booking-type-card">
                    <div className="modal-direct-booking-type-card-header">
                      <h4>Follow-up Visit</h4>
                      <div className="modal-direct-booking-type-price">
                        {doctor.price}
                      </div>
                    </div>
                    <p className="modal-direct-booking-type-description">
                      Follow-up consultation for ongoing treatment
                    </p>
                    <button
                      className={`modal-direct-booking-type-select-btn ${appointmentType === 'follow_up' ? 'selected' : ''}`}
                      onClick={() => setAppointmentType('follow_up')}
                    >
                      {appointmentType === 'follow_up' ? 'Selected' : 'Select'}
                    </button>
                  </div>
                </div>

                <div className="modal-direct-booking-step-navigation">
                  <button
                    className="modal-direct-booking-next-button"
                    onClick={handleNextStep}
                    disabled={!appointmentType}
                  >
                    Continue to Date Selection
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Date & Time Selection */}
            {currentStep === 2 && (
              <div className="modal-direct-booking-step">
                <div className="modal-direct-booking-step-header">
                  <h3 className="modal-direct-booking-step-title">Select Date & Time</h3>
                  <p className="modal-direct-booking-step-description">Choose your preferred appointment date and time</p>
                </div>

                <div className="modal-direct-booking-date-time-selection">
                  <div className="form-group">
                    <label>Select Date *</label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={handleDateChange}
                      min={getMinDate()}
                      required
                    />
                  </div>

                  {selectedDate && (
                    <div className="form-group">
                      <label>Select Time *</label>
                      <div className="time-slots-grid">
                        {timeSlots.map((slot) => {
                          const isPast = selectedDate === getCurrentDate() && (() => {
                            const now = new Date();
                            const currentTime = now.getHours() * 60 + now.getMinutes();
                            const slotTime = slot.split(':').map(Number);
                            const slotMinutes = slotTime[0] * 60 + slotTime[1];
                            return slotMinutes <= currentTime;
                          })();

                          return (
                            <button
                              key={slot}
                              type="button"
                              className={`time-slot-btn ${selectedSlot === slot ? 'selected' : ''} ${isPast ? 'disabled' : ''}`}
                              onClick={() => !isPast && handleSlotSelection(slot)}
                              disabled={isPast}
                            >
                              {slot}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <div className="modal-direct-booking-step-navigation">
                  <button
                    className="modal-direct-booking-back-button"
                    onClick={handleBackStep}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Back
                  </button>
                  <button
                    className="modal-direct-booking-proceed-button"
                    disabled={!selectedSlot || !selectedDate}
                    onClick={handleProceedToBooking}
                  >
                    Continue to Booking
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Book Appointment Modal */}
      {isBookingModalOpen && (
        <BookAppointmentModal
          practitioner={doctor}
          selectedDate={selectedDate}
          selectedSlot={selectedSlot}
          onClose={handleCloseModal}
          appointmentType={appointmentType}
          appointmentFee={appointmentFee}
          onAppointmentBooked={handleAppointmentBooked}
        />
      )}

      {/* Appointment Booked Confirmation */}
      {showAppointmentBooked && (
        <AppointmentBookedModal
          appointment_id={appointmentId}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default DirectBookingModal;
