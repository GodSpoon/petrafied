import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const VideoPlayerOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  animation: ${fadeIn} 0.3s ease;
`;

const VideoWindow = styled.div`
  width: 80%;
  max-width: 800px;
  background-color: #c0c0c0;
  border: 3px solid;
  border-color: #dfdfdf #000000 #000000 #dfdfdf;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.5);
`;

const WindowHeader = styled.div`
  background: linear-gradient(90deg, #000080, #1084d0);
  color: white;
  font-weight: bold;
  padding: 3px 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CloseButton = styled.button`
  background-color: #c0c0c0;
  border: 2px solid;
  border-color: #dfdfdf #808080 #808080 #dfdfdf;
  color: #000;
  width: 20px;
  height: 20px;
  text-align: center;
  line-height: 16px;
  cursor: pointer;
  font-family: 'ms_sans_serif';
  font-weight: bold;

  &:active {
    border-color: #808080 #dfdfdf #dfdfdf #808080;
  }
`;

const VideoContainer = styled.div`
  padding: 10px;
  background-color: #000;
`;

const Video = styled.video`
  width: 100%;
  display: block;
`;

const VideoControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  background-color: #c0c0c0;
`;

const ActionButton = styled.button`
  background-color: #c0c0c0;
  border: 2px solid;
  border-color: #dfdfdf #808080 #808080 #dfdfdf;
  padding: 4px 8px;
  font-family: 'ms_sans_serif';
  cursor: pointer;

  &:active {
    border-color: #808080 #dfdfdf #dfdfdf #808080;
  }
`;

// Component for playing Instagram reels in a Windows 95 media player style
const ReelPlayer = ({ src, title, onClose }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef(null);

  useEffect(() => {
    // Auto-play video when component mounts
    if (videoRef.current) {
      videoRef.current.play().catch(e => console.error("Video playback failed:", e));
      
      // Update duration once metadata is loaded
      videoRef.current.onloadedmetadata = () => {
        setDuration(videoRef.current.duration);
      };
      
      // Update current time during playback
      videoRef.current.ontimeupdate = () => {
        setCurrentTime(videoRef.current.currentTime);
      };
    }

    // Add listener for keyboard events (Esc to close)
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (!isFullscreen) {
        if (videoRef.current.requestFullscreen) {
          videoRef.current.requestFullscreen();
        } else if (videoRef.current.webkitRequestFullscreen) {
          videoRef.current.webkitRequestFullscreen();
        } else if (videoRef.current.msRequestFullscreen) {
          videoRef.current.msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      }
      setIsFullscreen(!isFullscreen);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };
  
  const handleSeek = (e) => {
    const seekTime = parseFloat(e.target.value);
    setCurrentTime(seekTime);
    if (videoRef.current) {
      videoRef.current.currentTime = seekTime;
    }
  };
  
  // Format time in MM:SS format
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <VideoPlayerOverlay onClick={onClose}>
      <VideoWindow onClick={e => e.stopPropagation()}>
        <WindowHeader>
          <span>{title || "Instagram Reel Player"}</span>
          <CloseButton onClick={onClose}>✕</CloseButton>
        </WindowHeader>
        <VideoContainer>
          <Video 
            ref={videoRef}
            src={src}
            loop
            controls={false}
          />
        </VideoContainer>
        <VideoControls>
          <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <ActionButton 
              onClick={() => videoRef.current?.paused 
                ? videoRef.current.play() 
                : videoRef.current.pause()
              }
              style={{ marginRight: '8px' }}
            >
              {videoRef.current?.paused ? '▶ Play' : '⏸ Pause'}
            </ActionButton>
            
            <div style={{ display: 'flex', alignItems: 'center', flexGrow: 1, margin: '0 8px' }}>
              <span style={{ marginRight: '8px', fontSize: '12px', minWidth: '40px' }}>
                {formatTime(currentTime)}
              </span>
              <input 
                type="range" 
                min="0" 
                max={duration || 100} 
                step="0.01" 
                value={currentTime} 
                onChange={handleSeek}
                style={{ flexGrow: 1 }}
              />
              <span style={{ marginLeft: '8px', fontSize: '12px', minWidth: '40px' }}>
                {formatTime(duration)}
              </span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', marginLeft: '8px' }}>
              <span style={{ marginRight: '4px', fontSize: '12px' }}>Vol:</span>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01" 
                value={volume} 
                onChange={handleVolumeChange}
                style={{ width: '60px' }}
              />
              <ActionButton 
                onClick={toggleFullscreen} 
                style={{ marginLeft: '8px' }}
              >
                {isFullscreen ? '↙' : '↗'}
              </ActionButton>
            </div>
          </div>
        </VideoControls>
      </VideoWindow>
    </VideoPlayerOverlay>
  );
};

export default ReelPlayer;