import React, { useState, useEffect } from 'react';
import { loadModels, getFullFaceDescription } from '../utils/faceUtils';
import WebcamCapture from './WebcamCapture';
import axios from 'axios';

const Register = () => {
  const [name, setName] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    loadModels();
  }, []);

  const handleCapture = (imageSrc) => {
    const img = new Image();
    img.src = imageSrc;
    img.onload = async () => {
      const descriptor = await getFullFaceDescription(img);
      if (!descriptor) return setMsg('No face detected');

      await axios.post('http://localhost:8000/api/auth/register', {
        name,
        descriptors: [Array.from(descriptor)],
      });

      setMsg('Registered successfully!');
    };
  };

  return (
    <div>
      <h2>Register</h2>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Enter Name" />
      <WebcamCapture onCapture={handleCapture} />
      <p>{msg}</p>
    </div>
  );
};

export default Register;
