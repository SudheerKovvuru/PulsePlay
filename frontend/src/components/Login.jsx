import React, { useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import { loadModels, getFullFaceDescription, createFaceMatcher } from '../utils/faceUtils';
import axios from 'axios';
import '../styles/Login.css';

const Login = () => {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [msg, setMsg] = useState('');
  const [descriptors, setDescriptors] = useState([]);
  const [capturedCount, setCapturedCount] = useState(0);
  const webcamRef = React.useRef();

  useEffect(() => {
    loadModels();
  }, []);

  // Automatically trigger registration after 3 images
  useEffect(() => {
    if (mode === 'register' && descriptors.length === 3 && name) {
      handleRegister();
    }
  // eslint-disable-next-line
  }, [descriptors, name, mode]);

  const handleCapture = async () => {
    if (mode === 'register' && !name) {
      setMsg('Please enter your name and take 3 images');
      return;
    }
    const imageSrc = webcamRef.current.getScreenshot();
    const img = new Image();
    img.src = imageSrc;
    img.onload = async () => {
      const descriptor = await getFullFaceDescription(img);
      if (!descriptor) return setMsg('No face detected');

      if (mode === 'login') {
        const res = await axios.get('http://localhost:8000/api/auth/login');
        const faceMatcher = createFaceMatcher(res.data.users);
        const bestMatch = faceMatcher.findBestMatch(new Float32Array(descriptor));

        if (bestMatch.label !== 'unknown') {
          setMsg(`Welcome, ${bestMatch.label}`);
        } else {
          setMsg('Please enter your name and take 3 images');
          setMode('register');
        }
      } else {
        setDescriptors(prev => [...prev, Array.from(descriptor)]);
        setCapturedCount(prev => prev + 1);
        setMsg(`${capturedCount + 1} face samples captured`);
      }
    };
  };

  const handleRegister = async () => {
    if (descriptors.length < 3 || !name) {
      setMsg('Please enter your name and take 3 images');
      return;
    }
    await axios.post('http://localhost:8000/api/auth/register', { name, descriptors });
    setMsg('Registered successfully!');
    setName('');
    setDescriptors([]);
    setMode('login');
  };

  return (
    <div className="login-container">
      <h1 className='pulseplay-title'>PulsePlay</h1>
      <div>
        <Webcam ref={webcamRef} screenshotFormat="image/jpeg" className='cam'/>
      </div>
      <div>
        {mode === 'register' && (
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Enter your name"
          />
        )}
        <button onClick={handleCapture}>
          Capture
        </button>
      </div>
      <p>{msg}</p>
    </div>
  );
};

export default Login;