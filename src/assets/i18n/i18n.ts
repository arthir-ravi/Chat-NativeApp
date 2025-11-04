import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      name_is_required: 'Name is required',
      email_is_required: 'Email is required',
      enter_a_valid_email: 'Enter a valid email address',
      password_required: 'Password is required',
      password_min_length: 'Password must be at least 8 characters long, with uppercase, lowercase, and a number.',
      login: 'Login',
      register: 'Register',
      forgot_password: 'Forgot Password?',
      confirm_password: 'Confirm Password',
      success: 'Success',
      something_went_wrong: 'Something went wrong. Please try again.',
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
