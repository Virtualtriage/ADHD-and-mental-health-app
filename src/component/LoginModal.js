import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { jwtDecode } from "jwt-decode";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axiosInstance from "../config/axiosConfig";
import '../styles/LoginModal.css';

const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  // View states
  const [isOTPView, setIsOTPView] = useState(false);
  const [isSignupView, setIsSignupView] = useState(false);
  const [isForgotPasswordView, setIsForgotPasswordView] = useState(false);
  const [isNewPasswordView, setIsNewPasswordView] = useState(false);

  // Form data
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Loading and visibility states
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  // OTP type tracking
  const [isForgotPasswordOTP, setIsForgotPasswordOTP] = useState(false);
  const [isSignupOTP, setIsSignupOTP] = useState(false);

  // Signup form state
  const [signupData, setSignupData] = useState({
    full_name: "",
    email: "",
    password: "",
    country: "",
  });
  const [signupPasswordVisible, setSignupPasswordVisible] = useState(false);
  const [signupPasswordFocused, setSignupPasswordFocused] = useState(false);
  const [signupValidation, setSignupValidation] = useState({
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
    isMinLength: false,
  });
  const [signupError, setSignupError] = useState("");
  const [loginError, setLoginError] = useState("");
  const [otpError, setOtpError] = useState("");

  // Password visibility toggles
  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  const toggleSignupPasswordVisibility = () => {
    setSignupPasswordVisible((prev) => !prev);
  };

  const toggleNewPasswordVisibility = () => {
    setNewPasswordVisible((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible((prev) => !prev);
  };

  // Validate Password Input for signup
  const validatePassword = (password) => {
    setSignupValidation({
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      isMinLength: password.length >= 8,
    });
  };

  // Handle signup input change
  const handleSignupInputChange = (e) => {
    const { name, value } = e.target;
    setSignupData({ ...signupData, [name]: value });

    if (name === "password") {
      validatePassword(value);
    }
  };

  // Validate signup form
  const validateSignupForm = () => {
    const { full_name, email, password, country } = signupData;

    if (!full_name || !email || !password || !country) {
      return "All fields are required.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Invalid email format.";
    }

    if (
      !signupValidation.hasUpperCase ||
      !signupValidation.hasLowerCase ||
      !signupValidation.hasNumber ||
      !signupValidation.hasSpecialChar ||
      !signupValidation.isMinLength
    ) {
      return "Password does not meet security requirements.";
    }

    return "";
  };

  // Login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    setLoginError("");
    try {
      const response = await axiosInstance.post("/patient/auth/login/", {
        email,
        password,
        sender_id: "senderid",
        device_type: "web"
      });

      if (response.status === 200 && response.data.status !== false) {
        // Store password temporarily for portal login
        sessionStorage.setItem("tempPassword", password);
        localStorage.setItem("authToken", response.data.token);
        setIsOTPView(true);
        setIsForgotPasswordOTP(false);
        setIsSignupOTP(false);
        setLoginError("");
        toast.success("Please enter the OTP sent to your email");
      } else {
        // Handle invalid credentials or other backend error
        const msg = response.data?.message || "Invalid credentials. Please try again.";
        if (msg.toLowerCase().includes("invalid credentials")) {
          setLoginError("Invalid credentials. Please check your email and password.");
          toast.error("Invalid credentials. Please check your email and password.");
        } else {
          setLoginError(msg);
          toast.error(msg);
        }
      }
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      if (msg && msg.toLowerCase().includes("invalid credentials")) {
        setLoginError("Invalid credentials. Please check your email and password.");
        toast.error("Invalid credentials. Please check your email and password.");
      } else {
        setLoginError(msg || "Something went wrong. Please try again later.");
        toast.error(msg || "Something went wrong. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Signup handler
  const handleSignup = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const validationError = validateSignupForm();
    if (validationError) {
      setSignupError(validationError);
      toast.error(validationError);
      return;
    }

    setLoading(true);
    setSignupError("");
    try {
      const response = await axiosInstance.post("/patient/auth/signup/", signupData);

      if (response.status === 200 && response.data.status) {
        toast.success("Signup successful! Please check your email for OTP.");
        // Switch to OTP view with signup data
        setEmail(signupData.email);
        setIsSignupView(false);
        setIsOTPView(true);
        setIsForgotPasswordOTP(false);
        setIsSignupOTP(true);
        // Store signup data for OTP verification
        sessionStorage.setItem("signupData", JSON.stringify({
          Full_Name: response.data.data.Full_Name,
          Email: response.data.data.Email,
          Password: response.data.data.Password,
          Sender_ID: "Sender_ID",
          Device_type: "web",
          Country: response.data.data.Country,
        }));
        // Reset signup form
        setSignupData({ full_name: "", email: "", password: "", country: "" });
        setSignupValidation({
          hasUpperCase: false,
          hasLowerCase: false,
          hasNumber: false,
          hasSpecialChar: false,
          isMinLength: false,
        });
      } else {
        // Handle specific backend message for email already exist
        const msg = response.data?.message || "Signup failed. Please try again.";
        if (msg.toLowerCase().includes("email") && msg.toLowerCase().includes("exist")) {
          setSignupError("Email already exists. Please login or use a different email.");
          toast.error("Email already exists. Please login or use a different email.");
        } else {
          setSignupError(msg);
          toast.error(msg);
        }
      }
    } catch (error) {
      // Specific error for email already exists
      const msg = error.response?.data?.message || error.message;
      if (msg && msg.toLowerCase().includes("email") && msg.toLowerCase().includes("exist")) {
        setSignupError("Email already exists. Please login or use a different email.");
        toast.error("Email already exists. Please login or use a different email.");
      } else {
        setSignupError(msg || "An error occurred. Please try again later.");
        toast.error(msg || "An error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  // OTP verification handler
  const handleOTPVerification = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!email) {
      toast.error("Email is missing. Please go back and try again.");
      return;
    }

    setLoading(true);
    setOtpError("");
    try {
      let endpoint, requestData;

      if (isSignupOTP) {
        // Signup OTP verification
        const signupData = JSON.parse(sessionStorage.getItem("signupData") || "{}");
        endpoint = "/patient/auth/signup-verificafion/"; // Note: typo in original endpoint
        requestData = {
          Full_Name: signupData.Full_Name,
          Email: signupData.Email,
          Password: signupData.Password,
          Sender_ID: signupData.Sender_ID,
          Device_type: signupData.Device_type,
          Country: signupData.Country,
          otp: otp,
        };
      } else if (isForgotPasswordOTP) {
        // Forgot password OTP verification
        endpoint = "/patient/auth/forgot-password/verify-otp/";
        requestData = {
          email: email,
          otp: otp
        };
      } else {
        // Login OTP verification
        endpoint = "/patient/auth/login-verification/";
        requestData = {
          email: email,
          otp: otp
        };
      }

      const response = await axiosInstance.post(endpoint, requestData);
      const data = response.data;

      if ((response.status === 200 || response.status === 201) && data?.status) {
        setOtpError("");
        if (isSignupOTP && data?.status) {
          // Signup OTP success - redirect to login
          localStorage.setItem("authToken", data.token);
          sessionStorage.removeItem("signupData");
          toast.success("OTP verified successfully! Please login.");
          setIsOTPView(false);
          setIsSignupOTP(false);
          // Reset to login view
          setEmail('');
          setPassword('');
          setOtp('');
        } else if (isForgotPasswordOTP && data?.status) {
          // Forgot password OTP success - proceed to new password
          toast.success("OTP verified successfully!");
          setIsOTPView(false);
          setIsNewPasswordView(true);
        } else if (!isSignupOTP && !isForgotPasswordOTP && data?.status) {
          // Login OTP success - complete login
          const userData = {
            email: email,
            token: data.token,
            timestamp: new Date().getTime()
          };

          localStorage.setItem("authToken", data.token);
          localStorage.setItem("userData", JSON.stringify(userData));

          // Clear temporary password
          sessionStorage.removeItem("tempPassword");

          toast.success("OTP verified successfully!");

          // Close modal and trigger success callback
          onClose();
          if (onLoginSuccess) {
            onLoginSuccess();
          }
        }
      } else {
        // Specific error for wrong/invalid OTP
        const msg = data?.message || "Invalid OTP!";
        if (msg.toLowerCase().includes("otp")) {
          setOtpError("Invalid OTP. Please check the code and try again.");
          toast.warning("Invalid OTP. Please check the code and try again.");
        } else {
          setOtpError(msg);
          toast.error(msg);
        }
      }
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      if (msg && msg.toLowerCase().includes("otp")) {
        setOtpError("Invalid OTP. Please check the code and try again.");
        toast.warning("Invalid OTP. Please check the code and try again.");
      } else {
        setOtpError(msg || "Something went wrong, please try again.");
        toast.error(msg || "Something went wrong, please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Forgot password handler
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post("/patient/auth/forgot-password/send-email/", {
        email,
      });

      if (response.status === 200) {
        localStorage.setItem("authToken", response.data.token);
        toast.success("Password reset code sent to your email!");
        // Switch to OTP view for password reset
        setIsForgotPasswordView(false);
        setIsOTPView(true);
        setIsForgotPasswordOTP(true);
        setIsSignupOTP(false);
      } else {
        toast.error("Invalid Email. Please try again.");
      }
    } catch (error) {
      console.error("One or more issues found:", error);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // New password handler
  const handleNewPassword = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!newPassword || !confirmPassword) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    // Validate password strength (same as signup)
    const passwordValidation = {
      hasUpperCase: /[A-Z]/.test(newPassword),
      hasLowerCase: /[a-z]/.test(newPassword),
      hasNumber: /\d/.test(newPassword),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
      isMinLength: newPassword.length >= 8,
    };

    if (!Object.values(passwordValidation).every(Boolean)) {
      toast.error("Password does not meet security requirements.");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post("/patient/auth/forgot-password/reset/", {
        email: email,
        password: newPassword,
      });

      if (response.status === 200) {
        toast.success("Password reset successfully! Please login with your new password.");
        // Reset to login view instead of closing modal
        setIsNewPasswordView(false);
        setIsOTPView(false);
        setIsForgotPasswordView(false);
        setIsSignupView(false);
        setIsForgotPasswordOTP(false);
        setIsSignupOTP(false);
        // Clear form data
        setEmail('');
        setPassword('');
        setOtp('');
        setNewPassword('');
        setConfirmPassword('');
        // Clear session storage
        sessionStorage.removeItem("tempPassword");
        sessionStorage.removeItem("signupData");
      } else {
        toast.error("Failed to reset password. Please try again.");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Google Sign-In Effect
  useEffect(() => {
    const initializeGoogleAuth = () => {
      if (isOpen && window.google && !isForgotPasswordView && !isOTPView && !isNewPasswordView) {
        try {
          // eslint-disable-next-line no-undef
          google.accounts.id.initialize({
            client_id: "915629878612-onuco3uedr9mphji79d2340jrdjh8cfc.apps.googleusercontent.com",
            callback: handleGoogleResponse,
          });

          // Clear any existing buttons first
          const existingLoginBtn = document.getElementById("google-login-btn");
          const existingSignupBtn = document.getElementById("google-signup-btn");

          if (existingLoginBtn) existingLoginBtn.innerHTML = '';
          if (existingSignupBtn) existingSignupBtn.innerHTML = '';

          // Render Google button for login view
          if (!isSignupView && existingLoginBtn) {
            // eslint-disable-next-line no-undef
            google.accounts.id.renderButton(
              existingLoginBtn,
              { theme: "outline", size: "large", width: "250", text: "signin_with" }
            );
          }

          // Render Google button for signup view
          if (isSignupView && existingSignupBtn) {
            // eslint-disable-next-line no-undef
            google.accounts.id.renderButton(
              existingSignupBtn,
              { theme: "outline", size: "large", width: "250", text: "signup_with" }
            );
          }
        } catch (error) {
          console.error("Error initializing Google Auth:", error);
        }
      }
    };

    // Check if Google API is loaded
    if (window.google) {
      initializeGoogleAuth();
    } else {
      // Wait for Google API to load
      const checkGoogleLoaded = setInterval(() => {
        if (window.google) {
          clearInterval(checkGoogleLoaded);
          initializeGoogleAuth();
        }
      }, 100);

      // Cleanup interval after 10 seconds
      setTimeout(() => {
        clearInterval(checkGoogleLoaded);
      }, 10000);
    }

    // Cleanup function
    return () => {
      // Clear any existing Google buttons when component unmounts or dependencies change
      const existingLoginBtn = document.getElementById("google-login-btn");
      const existingSignupBtn = document.getElementById("google-signup-btn");

      if (existingLoginBtn) existingLoginBtn.innerHTML = '';
      if (existingSignupBtn) existingSignupBtn.innerHTML = '';
    };
  }, [isOpen, isSignupView, isForgotPasswordView, isOTPView, isNewPasswordView]);

  const handleGoogleResponse = async (response) => {

    const id_token = response.credential;
    const decoded = jwtDecode(id_token);
    const email = decoded.email;
    const full_name = decoded.name || `${decoded.given_name} ${decoded.family_name}`;

    try {
      const res = await axiosInstance.post("/patient/auth/google-signin/", {
        email: email,
        full_name: full_name,
        sender_id: "8327873829",
        device_type: "web", // Changed from "mobile" to "web" for website
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.status === 200) {
        localStorage.setItem("authToken", res.data.token);
        toast.success("Google login successful!");
        onClose();
        if (onLoginSuccess) {
          onLoginSuccess();
        }
      } else {
        console.error("Unexpected response status:", res.status);
        toast.error("Something went wrong with Google login.");
      }
    } catch (err) {
      console.error("Google login error:", err);
      console.error("Error response:", err.response?.data);
      console.error("Error status:", err.response?.status);

      const errorMessage = err.response?.data?.message || err.message || "Google login failed. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handleClose = () => {
    setEmail('');
    setPassword('');
    setOtp('');
    setNewPassword('');
    setConfirmPassword('');
    setLoading(false);
    setIsOTPView(false);
    setIsSignupView(false);
    setIsForgotPasswordView(false);
    setIsNewPasswordView(false);
    setIsForgotPasswordOTP(false);
    setIsSignupOTP(false);
    setPasswordVisible(false);
    setSignupPasswordVisible(false);
    setNewPasswordVisible(false);
    setConfirmPasswordVisible(false);
    setSignupData({ full_name: "", email: "", password: "", country: "" });
    setSignupValidation({
      hasUpperCase: false,
      hasLowerCase: false,
      hasNumber: false,
      hasSpecialChar: false,
      isMinLength: false,
    });
    setSignupError("");
    setLoginError("");
    setOtpError("");
    // Clear session storage
    sessionStorage.removeItem("tempPassword");
    sessionStorage.removeItem("signupData");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={handleClose}>×</button>

        <h1 className="formhead">
          {isOTPView ? 'OTP Verification' :
            isSignupView ? 'Patient Sign Up' :
              isForgotPasswordView ? 'Forgot Password' :
                isNewPasswordView ? 'Set Your New Password' :
                  'Patient Login'}
        </h1>

        {isOTPView ? (
          <>
            {!email ? (
              <div className="error-message">
                <p>Email is missing. Please go back and try again.</p>
                <button
                  className="modal-link back-button"
                  onClick={() => {
                    setIsOTPView(false);
                    setIsSignupView(false);
                    setIsForgotPasswordView(false);
                    setIsSignupOTP(false);
                    setIsForgotPasswordOTP(false);
                    setOtpError("");
                  }}
                >
                  ← Back to Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleOTPVerification}>
                <div className="form-group">
                  <label htmlFor="otp-input">Enter OTP</label>
                  <input
                    id="otp-input"
                    type="text"
                    placeholder="Enter the OTP sent to your email"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                </div>
                {isOTPView && otpError && (
                  <div className="modal-error-message">{otpError}</div>
                )}
                <button
                  className="login-submit-button"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </button>

                <div className="modal-links">
                  <button
                    type="button"
                    className="modal-link back-button"
                    onClick={() => {
                      setIsOTPView(false);
                      setIsSignupView(false);
                      setIsForgotPasswordView(false);
                      setIsSignupOTP(false);
                      setIsForgotPasswordOTP(false);
                      setOtpError("");
                    }}
                  >
                    ← Back to Login
                  </button>
                </div>
              </form>
            )}
          </>
        ) : isNewPasswordView ? (
          <form onSubmit={handleNewPassword}>
            <div className="form-group">
              <div style={{ position: "relative", width: "100%" }}>
                <input
                  type={newPasswordVisible ? "text" : "password"}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  style={{ paddingRight: "40px" }}
                />
                {newPasswordVisible ? (
                  <FaEyeSlash
                    onClick={toggleNewPasswordVisibility}
                    style={{
                      position: "absolute",
                      top: "60%",
                      right: "10px",
                      transform: "translateY(-80%)",
                      cursor: "pointer",
                      color: "#aaa",
                    }}
                  />
                ) : (
                  <FaEye
                    onClick={toggleNewPasswordVisibility}
                    style={{
                      position: "absolute",
                      top: "60%",
                      right: "10px",
                      transform: "translateY(-80%)",
                      cursor: "pointer",
                      color: "#aaa",
                    }}
                  />
                )}
              </div>
            </div>
            <div className="form-group">
              <div style={{ position: "relative", width: "100%" }}>
                <input
                  type={confirmPasswordVisible ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  style={{ paddingRight: "40px" }}
                />
                {confirmPasswordVisible ? (
                  <FaEyeSlash
                    onClick={toggleConfirmPasswordVisibility}
                    style={{
                      position: "absolute",
                      top: "60%",
                      right: "10px",
                      transform: "translateY(-80%)",
                      cursor: "pointer",
                      color: "#aaa",
                    }}
                  />
                ) : (
                  <FaEye
                    onClick={toggleConfirmPasswordVisibility}
                    style={{
                      position: "absolute",
                      top: "60%",
                      right: "10px",
                      transform: "translateY(-80%)",
                      cursor: "pointer",
                      color: "#aaa",
                    }}
                  />
                )}
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="login-submit-button"
            >
              {loading ? 'Saving...' : 'Set Password'}
            </button>

            <div className="modal-links">
              <button
                type="button"
                className="modal-link back-button"
                onClick={() => {
                  setIsNewPasswordView(false);
                  setIsOTPView(true);
                }}
              >
                ← Back to OTP
              </button>
            </div>
          </form>
        ) : isForgotPasswordView ? (
          <form onSubmit={handleForgotPassword}>
            <div className="form-group">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="login-submit-button"
            >
              {loading ? 'Sending...' : 'Send Code'}
            </button>

            <div className="modal-links">
              <button
                type="button"
                className="modal-link back-button"
                onClick={() => setIsForgotPasswordView(false)}
              >
                ← Back to Login
              </button>
            </div>
          </form>
        ) : isSignupView ? (
          <form onSubmit={handleSignup}>
            {/* Row 1: Full Name and Email */}
            <div style={{ display: 'flex', gap: '15px' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Full Name:</label>
                <input
                  type="text"
                  name="full_name"
                  placeholder="Full Name"
                  value={signupData.full_name}
                  onChange={handleSignupInputChange}
                  required
                />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={signupData.email}
                  onChange={handleSignupInputChange}
                  required
                />
              </div>
            </div>

            {/* Row 2: Country Selection */}
            <div className="form-group">
              <label>Country:</label>
              <select
                name="country"
                value={signupData.country}
                onChange={handleSignupInputChange}
                required
                className="country-select"
              >
                <option value="">Select a country</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Canada">Canada</option>
                <option value="United States">United States</option>
                <option value="Pakistan">Pakistan</option>
              </select>
            </div>

            {/* Row 3: Password */}
            <div className="form-group">
              <label>Password:</label>
              <div style={{ position: "relative", width: "100%" }}>
                <input
                  type={signupPasswordVisible ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={signupData.password}
                  onChange={handleSignupInputChange}
                  onFocus={() => setSignupPasswordFocused(true)}
                  onBlur={() => setSignupPasswordFocused(false)}
                  required
                  style={{ paddingRight: "40px" }}
                />
                {signupPasswordVisible ? (
                  <FaEyeSlash
                    onClick={toggleSignupPasswordVisibility}
                    style={{
                      position: "absolute",
                      top: "50%",
                      right: "10px",
                      transform: "translateY(-80%)",
                      cursor: "pointer",
                      color: "#aaa",
                    }}
                  />
                ) : (
                  <FaEye
                    onClick={toggleSignupPasswordVisibility}
                    style={{
                      position: "absolute",
                      top: "50%",
                      right: "10px",
                      transform: "translateY(-80%)",
                      cursor: "pointer",
                      color: "#aaa",
                    }}
                  />
                )}
              </div>
            </div>

            {/* Row 4: Password Instructions - Only show when password field is focused */}
            {signupPasswordFocused && (
              <div style={{ marginTop: '10px' }}>
                {/* Password Validation Indicators */}
                <div className="password-validation" style={{ fontSize: '0.8rem', marginBottom: '10px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
                    <span style={{ color: signupValidation.hasUpperCase ? "green" : "red" }}>
                      at least one uppercase letter
                    </span>
                    <span style={{ color: signupValidation.hasLowerCase ? "green" : "red" }}>
                      at least one lowercase letter
                    </span>
                    <span style={{ color: signupValidation.hasNumber ? "green" : "red" }}>
                      at least one number
                    </span>
                    <span style={{ color: signupValidation.hasSpecialChar ? "green" : "red" }}>
                      at least one special character
                    </span>
                    <span style={{ color: signupValidation.isMinLength ? "green" : "red" }}>
                      at least 8 characters
                    </span>
                  </div>
                </div>

                {/* Password Strength Indicator */}
                <div className="password-strength-bar">
                  <div
                    className="password-strength-fill"
                    style={{
                      width: `${(Object.values(signupValidation).filter(Boolean).length / 5) * 100}%`,
                      backgroundColor:
                        Object.values(signupValidation).filter(Boolean).length <= 2
                          ? "red"
                          : Object.values(signupValidation).filter(Boolean).length === 3
                            ? "orange"
                            : "green",
                    }}
                  ></div>
                </div>
              </div>
            )}

            {signupError && (
              <div className="modal-error-message">{signupError}</div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="login-submit-button"
            >
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>

            <div className="modal-links">
              <button
                type="button"
                className="modal-link"
                onClick={() => { setIsSignupView(false); setSignupError(""); }}
              >
                Already have an account? Login Here
              </button>
            </div>

            {/* Google Signup Button */}
            <div className="google-login-container">
              <div id="google-signup-btn"></div>
            </div>
          </form>
        ) : (
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <div style={{ position: "relative", width: "100%" }}>
                <input
                  type={passwordVisible ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ paddingRight: "40px" }}
                />
                {passwordVisible ? (
                  <FaEyeSlash
                    onClick={togglePasswordVisibility}
                    style={{
                      position: "absolute",
                      top: "60%",
                      right: "10px",
                      transform: "translateY(-80%)",
                      cursor: "pointer",
                      color: "#aaa",
                    }}
                  />
                ) : (
                  <FaEye
                    onClick={togglePasswordVisibility}
                    style={{
                      position: "absolute",
                      top: "60%",
                      right: "10px",
                      transform: "translateY(-80%)",
                      cursor: "pointer",
                      color: "#aaa",
                    }}
                  />
                )}
              </div>
            </div>
            {!isSignupView && !isOTPView && !isForgotPasswordView && !isNewPasswordView && loginError && (
              <div className="modal-error-message">{loginError}</div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="login-submit-button"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <div className="modal-links">
              <button
                type="button"
                className="modal-link"
                onClick={() => { setIsForgotPasswordView(true); setLoginError(""); }}
              >
                Forgot your password?
              </button>
              <button
                type="button"
                className="modal-link"
                onClick={() => { setIsSignupView(true); setLoginError(""); }}
              >
                Don't have an account? Signup Now!
              </button>
            </div>

            {/* Google Login Button */}
            <div className="google-login-container">
              <div id="google-login-btn"></div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginModal; 
