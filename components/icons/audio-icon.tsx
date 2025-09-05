import React from 'react';

interface AudioIconProps {
  muted: boolean;
  onClick: () => void;
  className?: string;
}

const AudioIcon: React.FC<AudioIconProps> = ({ muted, onClick, className = '' }) => {
  return (
    <div 
      className={`cursor-pointer p-2 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-all ${className}`}
      onClick={onClick}
      title={muted ? 'Ativar áudio' : 'Desativar áudio'}
    >
      {muted ? (
        // Ícone de áudio mudo (icons8 style)
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
          <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
          <line x1="23" y1="9" x2="17" y2="15"></line>
          <line x1="17" y1="9" x2="23" y2="15"></line>
        </svg>
      ) : (
        // Ícone de áudio ativo (icons8 style)
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
          <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
        </svg>
      )}
    </div>
  );
};

export default AudioIcon;