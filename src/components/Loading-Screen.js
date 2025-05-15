// Create a Michaelsoft Binbows loading screen component
import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const LoadingContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #000033;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  transition: opacity 0.5s ease-out;
  opacity: ${props => props.fading ? 0 : 1};
`;

const LogoImage = styled.img`
  width: 200px;
  height: 200px;
  animation: ${spin} 3s infinite linear;
`;

const LoadingText = styled.div`
  margin-top: 20px;
  font-family: 'ms_sans_serif';
  color: white;
  font-size: 24px;
  text-shadow: 0 0 10px #00ffff;
`;

const ProgressBar = styled.div`
  width: 300px;
  height: 20px;
  background-color: #444;
  border: 2px solid #999;
  margin-top: 20px;
  position: relative;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background-color: #00AAEE;
  width: ${props => props.progress}%;
  transition: width 0.2s ease;
`;

const LoadingScreen = ({ onLoadComplete }) => {
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('Starting Binbows...');
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Simulate random loading progress
    const interval = setInterval(() => {
      setProgress(prev => {
        const increment = Math.random() * 10;
        const newProgress = Math.min(prev + increment, 100);
        
        // Update loading message based on progress
        if (newProgress > 25 && newProgress <= 50) {
          setMessage('Loading Binbows 95...');
        } else if (newProgress > 50 && newProgress <= 75) {
          setMessage('Building Desktop...');
        } else if (newProgress > 75 && newProgress < 100) {
          setMessage('Preparing Tattoo Studio...');
        } else if (newProgress >= 100) {
          setMessage('Welcome to Petrafied.ink!');
          clearInterval(interval);
          
          // Start fading out
          setFading(true);
          
          // Complete loading after fade
          setTimeout(() => {
            onLoadComplete();
          }, 500);
        }
        
        return newProgress;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [onLoadComplete]);

  return (
    <LoadingContainer fading={fading}>
      <LogoImage src="/images/W95/michaelsoft.png" alt="Michaelsoft Binbows" />
      <LoadingText>{message}</LoadingText>
      <ProgressBar>
        <ProgressFill progress={progress} />
      </ProgressBar>
    </LoadingContainer>
  );
};

export default LoadingScreen;