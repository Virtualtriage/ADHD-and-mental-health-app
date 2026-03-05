import React from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { FaApple, FaMicrosoft, FaGoogle } from "react-icons/fa";
import "../styles/AppointmentBookedModal.css";

const AppointmentBookedModal = ({ appointment_id, onClose, appointmentStart, appointmentEnd }) => {
  // Helper to format date for ICS (YYYYMMDDTHHmmssZ)
  const formatICS = (date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };
  // Helper to format date for Google/Outlook (YYYYMMDDTHHmmssZ)
  const formatCal = (date) => formatICS(date);
  // Helper to format date for Outlook (YYYY-MM-DDTHH:mm:ssZ)
  const formatOutlook = (date) => date.toISOString().split('.')[0] + 'Z';

  const startICS = appointmentStart ? formatICS(new Date(appointmentStart)) : '20240101T120000Z';
  const endICS = appointmentEnd ? formatICS(new Date(appointmentEnd)) : '20240101T130000Z';
  const startOutlook = appointmentStart ? formatOutlook(new Date(appointmentStart)) : '2024-01-01T12:00:00Z';
  const endOutlook = appointmentEnd ? formatOutlook(new Date(appointmentEnd)) : '2024-01-01T13:00:00Z';

  const icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nDTSTART:${startICS}\nDTEND:${endICS}\nSUMMARY:Doctor Appointment\nEND:VEVENT\nEND:VCALENDAR`;
  const icsHref = `data:text/calendar;charset=utf-8,${icsContent}`;
  const googleHref = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Doctor%20Appointment&dates=${startICS}/${endICS}`;
  const outlookHref = `https://outlook.office.com/calendar/0/deeplink/compose?subject=Doctor%20Appointment&startdt=${startOutlook}&enddt=${endOutlook}`;

  return (
    <div className="appointment-booked-modal-overlay">
      <div className="appointment-booked-modal-content">
        <h2>Appointment Booked Successfully!</h2>
        <p>Your appointment has been successfully booked</p>

        <h4>
          <FaCalendarAlt /> You can add this appointment in your calendar for reminders by selecting one of your calendars below:
        </h4>
        <div className="appointment-calendar-buttons">
          <a 
            className="appointment-booked-link"
            href={icsHref}
            download="appointment.ics"
          >
            <FaApple /> Add to iCal
          </a>
          <a
            className="appointment-booked-link" 
            href={outlookHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaMicrosoft /> Add to Microsoft Calendar
          </a>
          <a
            className="appointment-booked-link"
            href={googleHref}
            target="_blank" 
            rel="noopener noreferrer"
          >
            <FaGoogle /> Add to Google Calendar
          </a>
        </div>
        <button className="appointment-booked-modal-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default AppointmentBookedModal;
