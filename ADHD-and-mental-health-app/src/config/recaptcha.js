// reCAPTCHA Configuration
// Replace these with your actual reCAPTCHA keys from Google Console
const RECAPTCHA_SITE_KEY = process.env.REACT_APP_RECAPTCHA_SITE_KEY;
export const RECAPTCHA_CONFIG = {
  // Site key for client-side (public)
  SITE_KEY:RECAPTCHA_SITE_KEY
};

// Instructions to get reCAPTCHA keys:
// 1. Go to https://www.google.com/recaptcha/admin
// 2. Click "+" to create a new site
// 3. Choose reCAPTCHA v2 "I'm not a robot" Checkbox
// 4. Add your domain(s) to the list
// 5. Copy the Site Key and Secret Key
// 6. Add them to your .env file:
//    REACT_APP_RECAPTCHA_SITE_KEY=your-site-key-here
//    REACT_APP_RECAPTCHA_SECRET_KEY=your-secret-key-here 