import React, { useRef } from 'react';
import Webcam from 'react-webcam';

const WebcamCapture = ({ onCapture }) => {
  const webcamRef = useRef();

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    onCapture(imageSrc);
  };

  return (
    <>
      <Webcam ref={webcamRef} screenshotFormat="image/jpeg" />
      <button onClick={capture}>Capture</button>
    </>
  );
};

export default WebcamCapture;
