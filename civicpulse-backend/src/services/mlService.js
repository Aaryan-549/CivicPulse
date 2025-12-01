import axios from 'axios';
import FormData from 'form-data';

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

export const validatePlate = async (imageBuffer) => {
  try {
    const formData = new FormData();
    formData.append('image', imageBuffer, { filename: 'plate.jpg' });

    const response = await axios.post(`${ML_SERVICE_URL}/api/ocr/plate`, formData, {
      headers: formData.getHeaders(),
      timeout: 30000
    });

    return response.data;
  } catch (error) {
    console.error('ML Service Error:', error.message);
    return {
      detected: false,
      plate_number: null,
      confidence: 0,
      error: error.message
    };
  }
};

export const validateImage = async (imageBuffer) => {
  try {
    const formData = new FormData();
    formData.append('image', imageBuffer, { filename: 'image.jpg' });

    const response = await axios.post(`${ML_SERVICE_URL}/api/validate/image`, formData, {
      headers: formData.getHeaders(),
      timeout: 30000
    });

    return response.data;
  } catch (error) {
    console.error('ML Service Error:', error.message);
    return {
      valid: true,
      error: error.message
    };
  }
};

export const checkMLHealth = async () => {
  try {
    const response = await axios.get(`${ML_SERVICE_URL}/health`, { timeout: 5000 });
    return response.data;
  } catch (error) {
    return { status: 'unavailable', error: error.message };
  }
};

export default { validatePlate, validateImage, checkMLHealth };
