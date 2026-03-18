import axios from 'axios';

// Create a configured axios instance for the Problem Service
export const problemServiceApi = axios.create({
  baseURL: 'http://localhost:3003/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Create a configured axios instance for the Submission Service
export const submissionServiceApi = axios.create({
  baseURL: 'http://localhost:3002/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
});
