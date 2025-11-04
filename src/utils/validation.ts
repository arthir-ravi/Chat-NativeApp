import { object, string, ref } from 'yup';
import i18n from '../assets/i18n/i18n';

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export const createRegisterSchema = object().shape({
  name: string().trim().required(i18n.t('name_is_required')),
  email: string().trim().email(i18n.t('enter_a_valid_email')).required(i18n.t('email_is_required')),
  password: string()
    .trim()
    .matches(PASSWORD_REGEX, i18n.t('password_min_length'))
    .required(i18n.t('password_required')),
});

export const createLoginSchema = object().shape({
  email: string().trim().email(i18n.t('enter_a_valid_email')).required(i18n.t('email_is_required')),
  password: string().trim().required(i18n.t('password_required')),
});


