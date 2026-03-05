import React, { useState, useRef } from "react";
import { FaPhone, FaEnvelope, FaUser } from "react-icons/fa";
import { FaYoutube, FaInstagram, FaFacebook, FaLinkedin, FaTwitter } from "react-icons/fa";
import ReCAPTCHA from "react-google-recaptcha";
import { RECAPTCHA_CONFIG } from "../config/recaptcha";
import "../styles/footer.css";

function Footer() {
  const [loading, setLoading] = useState(false);
  const [captchaValue, setCaptchaValue] = useState(null);
  const [status, setStatus] = useState(null);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [isHuman, setIsHuman] = useState(false);
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const recaptchaRef = useRef(null);

  return (
    <footer className="footer-contact">
      <div className="footer-contact-container">
        <div className="footer-top-section">
          <div className="footer-left-column">
          <div className="footer-links-container">
              <div className="footer-link-group">
                <h4 className="footer-link-title">Platform</h4>
                <ul className="footer-link-list">
                  <li><a href="https://virtualtriage.ai/find-practitioners">Find Doctors</a></li>
                  <li><a href="https://virtualtriage.ai/pricing">Pricing</a></li>
                  <li><a href="https://virtualtriage.ai/about">About</a></li>
                  <li><a href="https://virtualtriage.ai/compliance">Security & Compliance</a></li>
                  <li><a href="https://virtualtriage.ai/patients-booking-gp">GPs on Virtual Triage</a></li>
                </ul>
              </div>
              <div className="footer-link-group">
                <h4 className="footer-link-title">Resources</h4>
                <ul className="footer-link-list">
                  <li><a href="https://virtualtriage.ai/privacy-notice" target="_blank" rel="noreferrer">Privacy Notice</a></li>
                  <li><a href="https://virtualtriage.ai/cookie-policy" target="_blank" rel="noreferrer">Cookie Policy</a></li>
                  <li><a href="https://virtualtriage.ai/terms-and-conditions" target="_blank" rel="noreferrer">Terms &amp; Conditions</a></li>
                  <li><a href="https://virtualtriage.ai/clinician-provider-agreement" target="_blank" rel="noreferrer">Clinician Provider Agreement</a></li>
                  <li><a href="https://virtualtriage.ai/appointment-terms" target="_blank" rel="noreferrer">Appointment Terms &amp; Medical</a></li>
                  <li><a href="#disclaimer">Disclaimer</a></li>
                </ul>
              </div>
              <div className="footer-link-group">
                <h4 className="footer-link-title">Contact</h4>
                <ul className="footer-link-list">
                  <li><a href="mailto:teams@virtualtriage.ai">Email support</a></li>
                  <li><a href="tel:+442045865400">Call us</a></li>
                  <li><a href="https://virtualtriage.ai/contact">Contact form</a></li>
                  <li>
                    <button
                      className="platform-status-btn"
                      disabled
                      title="Coming Soon"
                      aria-disabled="true"
                    >
                      Platform status
                    </button>
                  </li>
                </ul>
              </div>
            </div>
            <div className="footer-brand-section">
              <h3 className="footer-brand-title">Virtual Triage</h3>
              <p className="footer-brand-description">
                Professional digital health platform connecting patients and clinicians with secure appointments, messaging, and video consultations.
              </p>
              <div className="footer-contact-details">
                <a href="tel:+442045865400" className="footer-contact-item">
                  <FaPhone />
                  <span>+44 20 4586 5400</span>
                </a>
                <a href="mailto:teams@virtualtriage.ai" className="footer-contact-item">
                  <FaEnvelope />
                  <span>teams@virtualtriage.ai</span>
                </a>
              </div>
              <div className="footer-social-section">
                <p className="footer-social-title">Connect with us</p>
                <div className="footer-social-icons">
                  <a href="https://www.youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube">
                    <FaYoutube />
                  </a>
                  <a href="https://www.instagram.com/virtualtriage_/" target="_blank" rel="noreferrer" aria-label="Instagram">
                    <FaInstagram />
                  </a>
                  <a href="https://www.facebook.com/virtualtriage?mibextid=ZbWKwL" target="_blank" rel="noreferrer" aria-label="Facebook">
                    <FaFacebook />
                  </a>
                  <a href="https://www.linkedin.com/company/virtualtriage/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                    <FaLinkedin />
                  </a>
                  <a href="https://twitter.com/virtual_triage" target="_blank" rel="noreferrer" aria-label="Twitter">
                    <FaTwitter />
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="footer-right-column">
            <div className="contact-form-section">
              <h3 className="newsletter-title">Subscribe to our newsletter</h3>
              <p className="newsletter-description">
                Insights on product updates, uptime notices, and clinical platform improvements.
              </p>
          <form className="contact-form" onSubmit={async (e) => {
            e.preventDefault();

            // Check if consent is accepted
            if (!consentAccepted) {
              setStatus("Please accept the consent terms to continue.");
              return;
            }

            // Check if user confirmed they're human
            if (!isHuman) {
              setStatus("Please confirm you're not a robot.");
              return;
            }

            // Check if reCAPTCHA is completed
            if (!captchaValue) {
              setStatus("Please complete the reCAPTCHA verification.");
              return;
            }

            setLoading(true);
            setStatus(null);

            const submitData = {
              name: formData.name,
              number: '',
              email: formData.email,
              message: 'feature request',
              type: 'contact',
            };

            try {
              const response = await fetch('https://portal.virtualtriage.ca/contact_email', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(submitData),
              });
              if (!response.ok) {
                throw new Error('Failed to send newsletter subscription');
              }
              setStatus('Subscription successful!');
              // Reset form and states
              setFormData({ name: '', email: '' });
              setCaptchaValue(null);
              setShowCaptcha(false);
              setIsHuman(false);
              setConsentAccepted(false);
              // Reset reCAPTCHA
              if (recaptchaRef.current) {
                recaptchaRef.current.reset();
              }
            } catch (error) {
              console.error('Error sending subscription:', error);
              setStatus('There was an error sending your subscription. Please try again later.');
              // Reset reCAPTCHA on error
              if (recaptchaRef.current) {
                recaptchaRef.current.reset();
              }
              setCaptchaValue(null);
            } finally {
              setLoading(false);
            }
          }}>
            <div className="input-wrapper">
              <FaUser />
              <input
                type="text"
                placeholder="Full Name"
                name="from_name"
                value={formData.name}
                required
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="input-wrapper">
              <FaEnvelope />
              <input
                type="email"
                placeholder="Email"
                name="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="consent">
              <label className="consent-checkbox-container">
                <input
                  type="checkbox"
                  checked={consentAccepted}
                  onChange={(e) => {
                    setConsentAccepted(e.target.checked);
                    if (e.target.checked && status && status.includes("consent")) {
                      setStatus(null);
                    }
                  }}
                />
                <span>
                  I agree to receive SMS messages from Virtual Triage, including appointment reminders, account alerts, and customer care updates. Message frequency varies. Reply STOP to opt-out. Standard message and data rates may apply.
                </span>
              </label>
            </div>

            {/* Human verification checkbox */}
            <div className="human-verification">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={isHuman}
                  onChange={(e) => {
                    setIsHuman(e.target.checked);
                    setShowCaptcha(e.target.checked);
                    if (e.target.checked && status && status.includes("robot")) {
                      setStatus(null);
                    }
                    if (!e.target.checked) {
                      setShowCaptcha(false);
                      setCaptchaValue(null);
                      if (recaptchaRef.current) {
                        recaptchaRef.current.reset();
                      }
                    }
                  }}
                />
                <span className="checkmark"></span>
                <span className="checkbox-text">I'm not a robot</span>
              </label>
            </div>

            {/* reCAPTCHA - only shown after checkbox is checked and button is clicked */}
            {showCaptcha && (
              <div className="recaptcha-container-footer">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={RECAPTCHA_CONFIG.SITE_KEY}
                  onChange={(value) => {
                    setCaptchaValue(value);
                    // Clear any previous error messages when user completes reCAPTCHA
                    if (value && status && status.includes("reCAPTCHA")) {
                      setStatus(null);
                    }
                  }}
                  theme="light"
                  size="normal"
                />
              </div>
            )}

            <button
              className="footer-submit-button"
              type="submit"
              disabled={loading || !consentAccepted || (isHuman && !captchaValue)}
            >
              {loading ? (
                <span className="loader"></span>
              ) : (
                "Submit"
              )}
            </button>

            {status && (
              <div className={`status-message ${status.includes("success") ? "success" : "error"}`}>
                {status}
              </div>
            )}
          </form>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer Section */}
      <div className="footer-legal" id="disclaimer">
        <div className="footer-legal-container">
          <div className="footer-disclaimer-content">
            <h4 className="disclaimer-title">Disclaimer</h4>
            <p className="disclaimer-text">
              Virtual Triage does not provide medical advice, diagnosis, or treatment. We are not a healthcare provider. Our role is solely to facilitate connections between patients and licensed medical professionals. All medical services are rendered independently by the healthcare providers with whom users choose to engage. Users are encouraged to verify the credentials of any provider and consult directly with them regarding their medical needs. We do not assume responsibility for the quality or outcomes of any services provided.
            </p>
          </div>
          <div className="footer-legal-bottom">
            <div className="footer-copyright">
              <p className="copyright-text">© 2026 Virtual Triage. All rights reserved.</p>
              <p className="footer-legal-text">
                Virtual Triage is a registered company in the United Kingdom, operating in compliance with UK regulations and data protection standards.
              </p>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('cookieConsent');
                window.location.reload();
              }}
              className="cookie-settings-btn"
            >
              Cookie Settings
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

