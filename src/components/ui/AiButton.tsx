import React from 'react';

interface AiButtonProps {
  onClick?: () => void;
}

export const AiButton: React.FC<AiButtonProps> = ({ onClick }) => {
    const handleClick = () => {
    window.open("https://upplyinterview.up.railway.app/recruiter", "_blank");
    onClick?.();
  };
  return (
    <button 
      onClick={handleClick}
      className="group relative h-14 w-56 overflow-hidden rounded-xl border border-[#2D236A]/15 bg-white p-3 text-left font-syne text-sm font-bold text-[#2D236A]/90 duration-500 
      hover:border-[#5de8b8]/60 hover:text-teal-500 hover:duration-500

      before:absolute before:right-1 before:top-1 before:z-10 before:h-12 before:w-12 before:bg-[#5de8b8]/20 before:blur-lg before:duration-500 before:content-['']
      hover:before:-bottom-8 hover:before:right-12 hover:before:blur hover:before:[box-shadow:_20px_20px_20px_30px_rgba(93,232,184,0.12)] hover:before:duration-500

      after:absolute after:right-8 after:top-3 after:z-10 after:h-20 after:w-20 after:bg-[#5de8b8]/10 after:blur-lg after:duration-500 after:content-['']
      hover:after:-right-8 hover:after:duration-500"
    >
      <span className="relative z-20 flex items-center gap-2">
        <span>AI Interview</span>
        <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
      </span>
    </button>
  );
};

export default AiButton;