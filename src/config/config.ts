/**
 * PUERTO
 */
export const PORT = process.env.PORT || 5001;

/**
 * Database connection
 */
export const MONGO_CONNECTION =
  process.env.MONGO_CONNECTION ||
  'mongodb+srv://tyto:5epXXvk0yxBqkk7c@cluster0.9jous.mongodb.net/packuba';
//'mongodb+srv://tyto:O1OdIZvXX5dHuMNJ@cluster0-fkyqi.mongodb.net/packuba';

/**
 * Firebase private key
 */

export const Alp = 'src/utils/parent-cats.json';

process.env.GOOGLE_APPLICATION_CREDENTIALS =
  process.env.GOOGLE_APPLICATION_CREDENTIALS ||
  'src/config/firebase-key-dev.json';
export const GOOGLE_APPLICATION_CREDENTIALS =
  process.env.GOOGLE_APPLICATION_CREDENTIALS;
/**
 * Default API Message
 */

export const DEFAULT_API_WELCOME_MESSAGE =
  process.env.DEFAULT_API_WELCOME_MESSAGE || 'Hiya!';

export const MAPBOX_API_KEY =
  process.env.MAPBOX_API_KEY ||
  'pk.eyJ1IjoianVsaWFubWlyYW5kYXdheXUyIiwiYSI6ImNrYWgyMG1jNTAyb2wyd3FlMTl5dXN0cnoifQ.amDhY-A087EYgGpYiycrSA';

export const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || '';
export const SENDGRID_TEMPL_ID = process.env.SENDGRID_TEMPL_ID || '';

export const AWS_API_VERSION = process.env.AWS_API_VERSION || '';
export const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || '';
export const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || '';
export const AWS_REGION = process.env.AWS_REGION || '';
export const AWS_ARN = process.env.AWS_ARN || '';
