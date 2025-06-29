import React, { useState, useEffect } from 'react';
import { loadModels, getFullFaceDescription } from '../utils/faceUtils';
import WebcamCapture from './WebcamCapture';
import axios from 'axios';

const Register = () => {
  const [name, setName] = useState('');
  const [msg, setMsg] = useState('');
  const [descriptors, setDescriptors] = useState([]);

  useEffect(() => {
    loadModels();
  }, []);

  const handleCapture = (imageSrc) => {
    const img = new Image();
    img.src = imageSrc;
    img.onload = async () => {
      const descriptor = await getFullFaceDescription(img);
      if (!descriptor) return setMsg('No face detected');
      setDescriptors(prev => [...prev, Array.from(descriptor)]);
      setMsg(`${descriptors.length + 1} face samples captured`);
    };
  };

  const handleRegister = async () => {
    if (descriptors.length < 3) return setMsg('Please capture at least 3 images');
    await axios.post('http://localhost:8000/api/auth/register', { name, descriptors });
    setMsg('Registered successfully!');
    setName('');
    setDescriptors([]);
  };

  return (
    <div>
      <h2>Register</h2>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Enter Name" />
      <WebcamCapture onCapture={handleCapture} />
      <p>{descriptors.length} face samples captured</p>
      <button onClick={handleRegister} disabled={!name || descriptors.length < 3}>
        Register
      </button>
      <p>{msg}</p>
    </div>
  );
};

export default Register;