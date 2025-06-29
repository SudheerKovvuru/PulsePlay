import React, { useEffect, useState } from 'react';
import { loadModels, getFullFaceDescription, createFaceMatcher } from '../utils/faceUtils';
import WebcamCapture from './WebcamCapture';
import axios from 'axios';

const Login = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadModels();
  }, []);

  const handleCapture = async (imageSrc) => {
    const img = new Image();
    img.src = imageSrc;
    img.onload = async () => {
      const descriptor = await getFullFaceDescription(img);
      if (!descriptor) return setMessage('No face detected');

      const res = await axios.get('http://localhost:8000/api/auth/login');
      const users = res.data.users;

      const faceMatcher = createFaceMatcher(users);
      const bestMatch = faceMatcher.findBestMatch(new Float32Array(descriptor));

      if (bestMatch.label !== 'unknown') {
        setMessage(`Welcome, ${bestMatch.label}`);
      } else {
        setMessage('Face not recognized. Please Register.');
      }
    };
  };

  return (
    <div>
      <h2>Face Login</h2>
      <WebcamCapture onCapture={handleCapture} />
      <p>{message}</p>
    </div>
  );
};

export default Login;