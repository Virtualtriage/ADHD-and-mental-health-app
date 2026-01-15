import React, { useState, useEffect} from "react";
import { FaCreditCard, FaLock, FaTimes, FaSave, FaHistory } from 'react-icons/fa';
import {CardElement} from "@stripe/react-stripe-js";
import axiosInstance from './axiosConfig';
import '../styles/stripePaymentModal.css';

// Lazy load Stripe - only loads when this modal is actually opened
const STRIPE_KEY = 'pk_live_51MkDNUKx0rXRL6v7CPCCeukNvoyvRBJJC8igLsmC1wR3BN4qx9BrAZ6VnZiy7Hqg0E3m4jg0esk8qFejT5HMRN3h00CCt4iMlG';
let stripePromise = null;
let StripeModules = null;

const loadStripeModules = async () => {
  if (!StripeModules) {
    const [stripeJs, stripeReact] = await Promise.all([
      import("@stripe/stripe-js"),
      import("@stripe/react-stripe-js")
    ]);

    if (!stripePromise) {
      stripePromise = stripeJs.loadStripe(STRIPE_KEY);
    }

    StripeModules = {
      Elements: stripeReact.Elements,
      CardElement: stripeReact.CardElement,
      useStripe: stripeReact.useStripe,
      useElements: stripeReact.useElements
    };
  }
  return { stripePromise, ...StripeModules };
};
// const stripePromise = loadStripe('pk_test_51RosFuKflAs4AkzUOBEpYfBbZvACTuky8JGNUmTC3uUGrqjgxd7BkyL3qtlq15UEvEkyEoMya6CpAThsUL0YjSaI00XfkISHBe');

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '14px',
      color: '#32325d',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  },
};

const CheckoutForm = ({ appointmentData, onSuccess, onClose, StripeHooks }) => {
  const stripe = StripeHooks.useStripe();
  const elements = StripeHooks.useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [succeeded, setSucceeded] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [savePaymentMethod, setSavePaymentMethod] = useState(true);
  const [savedPaymentMethods, setSavedPaymentMethods] = useState([]);
  const [useSavedPayment, setUseSavedPayment] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

  //PROMO CODE FUNCTIONS
  const [promoCode, setPromoCode] = useState("");
  const [validatingPromo, setValidatingPromo] = useState(false);
  const [promoValidated, setPromoValidated] = useState(false);
  const [promoError, setPromoError] = useState(null);
  const [promoDiscount, setPromoDiscount] = useState(null);

  // Fetch saved payment methods when component loads
  useEffect(() => {
    const fetchSavedPaymentMethods = async () => {
      try {
        // You can fetch saved payment methods from your backend
        // For now, we'll use localStorage as an example
        const savedMethods = localStorage.getItem('savedPaymentMethods');
        if (savedMethods) {
          setSavedPaymentMethods(JSON.parse(savedMethods));
        }
      } catch (error) {
        console.error('Error fetching saved payment methods:', error);
      }
    };

    fetchSavedPaymentMethods();
  }, []);

  // Determine if this is initial or follow-up appointment
  const isInitialAppointment = () => {
    // Use the appointment type passed from parent component
    return appointmentData.appointmentType === "initial";
  };

  // Get the appropriate fee based on appointment type
  const getAppointmentFee = () => {
    if (isInitialAppointment()) {
      return appointmentData.scheduleData?.initial_appointment_fee || appointmentData.amount;
    } else {
      return appointmentData.scheduleData?.follow_up_appointment_fee;
    }
  };

  // Get appointment type
  const getAppointmentType = () => {
    return isInitialAppointment() ? "Initial Consultation" : "Follow-up Consultation";
  };

  // Validate promo code
  const validatePromoCode = async () => {
    const promoCodeTrimmed = promoCode.trim();
    if (!promoCodeTrimmed) {
      setPromoError("Please enter a promo code");
      return;
    }

    setValidatingPromo(true);
    setPromoError(null);
    setPromoValidated(false);
    setPromoDiscount(null);

    try {
      const amount = parseFloat(getAppointmentFee());
      const response = await axiosInstance.post(
        "/stripe/promo-validator/",
        {
          amount: amount,
          promo_code: promoCodeTrimmed
        },
        {
          headers: {
            Authorization: `Bearer ${appointmentData.token}`,
          },
        }
      );

      if (response.status === 200 && response.data && response.data.status === true) {
        setPromoValidated(true);
        // Store discount info from API response
        setPromoDiscount({
          promo_code: response.data.promo_code,
          discount: response.data.discount,
          final_amount: response.data.final_amount,
          currency: response.data.currency
        });
        setPromoError(null);
      } else {
        throw new Error(response.data?.message || "Invalid promo code");
      }
    } catch (err) {
      setPromoValidated(false);
      setPromoDiscount(null);
      setPromoError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Invalid promo code. Please try again."
      );
    } finally {
      setValidatingPromo(false);
    }
  };

  // Get final amount after discount
  const getFinalAmount = () => {
    if (promoValidated && promoDiscount && promoDiscount.final_amount !== undefined) {
      return parseFloat(promoDiscount.final_amount);
    }
    return parseFloat(getAppointmentFee());
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSucceeded(false);

    try {
      // Validate Stripe and Elements
      if (!stripe || !elements) {
        throw new Error("Payment system not available. Please refresh and try again.");
      }

      let paymentMethod;

      if (useSavedPayment && selectedPaymentMethod) {
        // Use saved payment method
        paymentMethod = selectedPaymentMethod;
      } else {
        // Create payment method from card details
        const { error: paymentMethodError, paymentMethod: newPaymentMethod } = await stripe.createPaymentMethod({
          type: 'card',
          card: elements.getElement(CardElement),
        });

        if (paymentMethodError) {
          throw new Error(paymentMethodError.message);
        }
        paymentMethod = newPaymentMethod;
      }

      // Prepare the payload for backend
      const promoCodeTrimmed = promoCode.trim();
      const finalAmount = getFinalAmount();
      const paymentPayload = {
        doctor_id: appointmentData.doctor_id || appointmentData.Health_Professional_id,
        appointment_fee: finalAmount,
        appointment_type: getAppointmentType(),
        date: appointmentData.appointmentDate || appointmentData.selectedDate,
       
        // Use final amount as provided by API (already in correct format)
        amount: Math.round(parseFloat(finalAmount)),
        // Include card payment method for backend processing
        payment_method_id: paymentMethod.id,
      
        // Include additional data if needed
        schedule_id: appointmentData.scheduleData?.Schecule_id,
        duration: appointmentData.scheduleData?.Appointment_Duration,
        currency: (promoValidated && promoDiscount?.currency) 
          ? promoDiscount.currency 
          : (!appointmentData.scheduleData?.Currency || appointmentData.scheduleData?.Currency === "" || appointmentData.scheduleData?.Currency === "£") 
            ? "gbp" 
            : appointmentData.scheduleData?.Currency,
        // Include package_info from appointmentData
        package_info: appointmentData.package_info,
        
        // Include customer details
        customer_name: customerName,
        customer_email: customerEmail,
        save_payment_method: savePaymentMethod,

        // Include promo code flag and code if validated
        promo_applied: promoValidated && promoCodeTrimmed ? true : false,
        ...(promoCodeTrimmed && promoValidated ? { promo_code: promoCodeTrimmed } : {})
        
      };

      // Call your custom backend API
      const res = await axiosInstance.post(
        "/stripe-connect/payment-processing/",
        paymentPayload,
        {
          headers: {
            Authorization: `Bearer ${appointmentData.token}`,
          },
        }
      );

      // Check if payment was successful (status 200)
      if (res.status === 200) {
        
        setSucceeded(true);
        
        // Save payment method if requested
        if (savePaymentMethod) {
          savePaymentMethodLocally(paymentMethod);
        }
        
        const paymentResult = {
          success: true,
          message: res.data.message || "Payment successful",
          data: res.data,
          payment_method_id: paymentMethod.id
        };

        // Show success message for 2 seconds before closing
        setTimeout(() => {
          onSuccess(paymentResult);
        }, 2000);
      } else {
        // Handle non-200 status (like 400 Bad Request)
        throw new Error(res.data.error || res.data.message || 'Payment failed');
      }
    } catch (err) {
      console.error("Payment error:", err);
      
      // Handle axios error response (400 Bad Request)
      if (err.response && err.response.data) {
        const errorData = err.response.data;
        let errorMessage = errorData.error || errorData.message || "Payment failed. Please try again.";
        
        // Handle specific Stripe Connect PaymentMethod error
        if (errorMessage.includes("No such PaymentMethod") || errorMessage.includes("PaymentMethod")) {
          errorMessage = "The payment method is invalid or expired. Please enter a new card and try again.";
          
          // Clear saved payment method if using one
          if (useSavedPayment && selectedPaymentMethod) {
            // Remove from localStorage
            try {
              const savedMethods = JSON.parse(localStorage.getItem('savedPaymentMethods') || '[]');
              const updatedMethods = savedMethods.filter(method => method.id !== selectedPaymentMethod.id);
              localStorage.setItem('savedPaymentMethods', JSON.stringify(updatedMethods));
              setSavedPaymentMethods(updatedMethods);
              setUseSavedPayment(false);
              setSelectedPaymentMethod(null);
            } catch (error) {
              console.error('Error removing invalid payment method:', error);
            }
          }
        }
        
        setError(errorMessage);
      } else {
        // Handle other errors (network, etc.)
        setError(err.message || "Payment failed. Please try again.");
      }
      
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  const savePaymentMethodLocally = (paymentMethod) => {
    try {
      const savedMethods = JSON.parse(localStorage.getItem('savedPaymentMethods') || '[]');
      const newMethod = {
        id: paymentMethod.id,
        card: {
          brand: paymentMethod.card.brand,
          last4: paymentMethod.card.last4,
          exp_month: paymentMethod.card.exp_month,
          exp_year: paymentMethod.card.exp_year
        },
        customer_email: customerEmail,
        saved_at: new Date().toISOString()
      };

      // Check if method already exists
      const exists = savedMethods.find(method => method.id === paymentMethod.id);
      if (!exists) {
        savedMethods.push(newMethod);
        localStorage.setItem('savedPaymentMethods', JSON.stringify(savedMethods));
        setSavedPaymentMethods(savedMethods);
      }
    } catch (error) {
      console.error('Error saving payment method:', error);
    }
  };

  return (
    <div className="stripe-payment-modal">
      <div className="payment-modal-content">
        <div className="payment-modal-header">
          <div className="payment-header-left">
            <FaCreditCard className="payment-icon" />
            <div>
              <h3>Payment</h3>
              <p>Secure payment by Stripe</p>
            </div>
          </div>
          <button
            className="payment-close-btn"
            onClick={handleClose}
            disabled={loading}
          >
            <FaTimes />
          </button>
        </div>

        <div className="payment-modal-body">
          {succeeded ? (
            // Success state
            <div className="payment-success">
              <div className="success-icon">✅</div>
              <h3>Payment Successful!</h3>
              <p>Payment processed. Redirecting...</p>
              <div className="success-details">
                <div className="success-item">
                  <span>Amount:</span>
                  <span>${getAppointmentFee()}</span>
                </div>
                <div className="success-item">
                  <span>Type:</span>
                  <span>{getAppointmentType()}</span>
                </div>
              </div>
            </div>
          ) : (
            // Payment form state
            <>
              <div className="payment-summary">
                <div className="package-info">
                  <h4>{getAppointmentType()}</h4>
                  <div className="amount-details">
                    {promoValidated && promoDiscount && getFinalAmount() < parseFloat(getAppointmentFee()) ? (
                      <>
                        <div className="amount-original">£{parseFloat(getAppointmentFee()).toFixed(2)}</div>
                        <div className="amount-final">£{getFinalAmount().toFixed(2)}</div>
                      </>
                    ) : (
                      <div className="amount">£{parseFloat(getAppointmentFee()).toFixed(2)}</div>
                    )}
                  </div>
                </div>
                <div className="security-badge">
                  <FaLock />
                  <span>Secure Payment</span>
                </div>
              </div>

              <form className="payment-form" onSubmit={handleSubmit}>
                {/* Customer Details */}
                <div className="customer-details">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Address *</label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="Enter your email address"
                      required
                    />
                  </div>
                </div>

                {/* Promo Code */}
                <div className="promo-code-section">
                  <label>Promo Code (optional)</label>
                  <div className="promo-code-row">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => {
                        setPromoCode(e.target.value);
                        // Reset validation when code changes
                        if (promoValidated || promoError) {
                          setPromoValidated(false);
                          setPromoError(null);
                          setPromoDiscount(null);
                        }
                      }}
                      placeholder="Enter promo code"
                      autoComplete="off"
                      disabled={loading || validatingPromo}
                      className={promoValidated ? "promo-valid" : promoError ? "promo-invalid" : ""}
                    />
                    <button
                      type="button"
                      className="promo-apply-btn"
                      onClick={validatePromoCode}
                      disabled={loading || validatingPromo || !promoCode.trim()}
                      title="Apply promo code"
                    >
                      {validatingPromo ? "Validating..." : "Apply"}
                    </button>
                    {promoCode.trim() && (
                      <button
                        type="button"
                        className="promo-remove-btn"
                        onClick={() => {
                          setPromoCode("");
                          setPromoValidated(false);
                          setPromoError(null);
                          setPromoDiscount(null);
                        }}
                        disabled={loading || validatingPromo}
                        title="Clear promo code"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  {promoValidated && promoDiscount && (
                    <div className="promo-success">
                      <span>✓ Promo code "{promoDiscount.promo_code}" applied successfully!</span>
                      <div className="promo-final-amount">
                        Final Amount: £{getFinalAmount().toFixed(2)}
                      </div>
                    </div>
                  )}
                  {promoError && (
                    <div className="promo-error-message">
                      <span>{promoError}</span>
                    </div>
                  )}
                </div>

                {/* Saved Payment Methods */}
                {savedPaymentMethods.length > 0 && (
                  <div className="saved-payment-methods">
                    <div className="saved-methods-header">
                      <FaHistory />
                      <span>Saved Payment Methods</span>
                    </div>
                    <div className="saved-methods-list">
                      {savedPaymentMethods.map((method) => (
                        <div
                          key={method.id}
                          className={`saved-method ${selectedPaymentMethod?.id === method.id ? 'selected' : ''}`}
                          onClick={() => {
                            setSelectedPaymentMethod(method);
                            setUseSavedPayment(true);
                          }}
                        >
                          <FaCreditCard />
                          <span>{method.card.brand} •••• {method.card.last4}</span>
                          <span>Expires {method.card.exp_month}/{method.card.exp_year}</span>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      className="use-new-card-btn"
                      onClick={() => {
                        setUseSavedPayment(false);
                        setSelectedPaymentMethod(null);
                      }}
                    >
                      Use New Card
                    </button>
                  </div>
                )}

                {/* New Card Information */}
                {!useSavedPayment && (
                  <div className="card-element-container">
                    <label>Card Information *</label>
                    <CardElement options={CARD_ELEMENT_OPTIONS} />
                  </div>
                )}

                {/* Save Payment Method Option */}
                {!useSavedPayment && (
                  <div className="save-payment-option">
                    <label>
                      <input
                        type="checkbox"
                        checked={savePaymentMethod}
                        onChange={(e) => setSavePaymentMethod(e.target.checked)}
                      />
                      <FaSave />
                      <span>Save this payment method for future use</span>
                    </label>
                  </div>
                )}

                {error && (
                  <div className="payment-error">
                    <span>{error}</span>
                  </div>
                )}

                <button 
                  type="submit" 
                  className="payment-button"
                  disabled={!stripe || loading || (!useSavedPayment && (!customerName || !customerEmail))}
                >
                  {loading ? "Processing Payment..." : "Pay Now"}
                </button>
              </form>

              <div className="payment-footer">
                <p>Your payment is secured by Stripe's industry-leading security standards</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const StripePaymentModal = ({ appointmentData, onSuccess, onClose, isOpen }) => {
  const [stripeModules, setStripeModules] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    if (isOpen && !stripeModules) {
      loadStripeModules().then(modules => {
        setStripeModules(modules);
        setLoading(false);
      });
    } else if (!isOpen) {
      setStripeModules(null);
      setLoading(true);
    }
  }, [isOpen, stripeModules]);

  if (!isOpen) return null;
  if (loading || !stripeModules) {
    return (
      <div className="stripe-payment-modal-overlay">
        <div className="stripe-payment-modal-content">
          <div>Loading payment form...</div>
        </div>
      </div>
    );
  }

  const { Elements, stripePromise: sp } = stripeModules;

  return (
    <Elements stripe={sp}>
      <CheckoutForm
        StripeHooks={stripeModules}
        appointmentData={appointmentData}
        onSuccess={onSuccess}
        onClose={onClose}
      />
    </Elements>
  );
};

export default StripePaymentModal;