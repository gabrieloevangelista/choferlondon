'use client';

import { useState, useEffect } from 'react';
import AudioIcon from './icons/audio-icon';

const AudioToggle = () => {
  const [muted, setMuted] = useState(true);

  const toggleMute = () => {
    const video = document.getElementById('hero-video') as HTMLVideoElement;
    if (video) {
      video.muted = !video.muted;
      setMuted(video.muted);
    }
  };

  useEffect(() => {
    // Garantir que o estado inicial corresponda ao vídeo
    const video = document.getElementById('hero-video') as HTMLVideoElement;
    if (video) {
      setMuted(video.muted);
    }
  }, []);

  return (
    <AudioIcon 
      muted={muted} 
      onClick={toggleMute} 
    />
  );
};

export default AudioToggle;