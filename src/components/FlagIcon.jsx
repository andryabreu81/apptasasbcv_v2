import React from 'react';

/**
 * Self-contained Vector SVG Flags
 * 100% offline, requires no internet connection or external fonts
 */
export const FlagIcon = ({ code, size = 24, className = '', style = {} }) => {
  const upperCode = (code || '').toUpperCase().trim();

  const baseStyle = {
    width: size,
    height: Math.round(size * 0.75),
    borderRadius: 3,
    display: 'inline-block',
    verticalAlign: 'middle',
    boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
    flexShrink: 0,
    ...style,
  };

  switch (upperCode) {
    case 'USD':
    case 'USA':
    case 'E.U.A.':
      // United States Flag SVG
      return (
        <svg viewBox="0 0 640 480" style={baseStyle} className={className}>
          <g fillRule="evenodd">
            <path fill="#bd3d44" d="M0 0h640v480H0z"/>
            <path stroke="#fff" strokeWidth="37" d="M0 55.5h640M0 129.5h640M0 203.5h640M0 277.5h640M0 351.5h640M0 425.5h640"/>
            <path fill="#192f5d" d="M0 0h260v260H0z"/>
            {/* Stars grid representation */}
            <g fill="#fff">
              <circle cx="30" cy="30" r="10"/>
              <circle cx="70" cy="30" r="10"/>
              <circle cx="110" cy="30" r="10"/>
              <circle cx="150" cy="30" r="10"/>
              <circle cx="190" cy="30" r="10"/>
              <circle cx="230" cy="30" r="10"/>
              <circle cx="50" cy="65" r="10"/>
              <circle cx="90" cy="65" r="10"/>
              <circle cx="130" cy="65" r="10"/>
              <circle cx="170" cy="65" r="10"/>
              <circle cx="210" cy="65" r="10"/>
              <circle cx="30" cy="100" r="10"/>
              <circle cx="70" cy="100" r="10"/>
              <circle cx="110" cy="100" r="10"/>
              <circle cx="150" cy="100" r="10"/>
              <circle cx="190" cy="100" r="10"/>
              <circle cx="230" cy="100" r="10"/>
              <circle cx="50" cy="135" r="10"/>
              <circle cx="90" cy="135" r="10"/>
              <circle cx="130" cy="135" r="10"/>
              <circle cx="170" cy="135" r="10"/>
              <circle cx="210" cy="135" r="10"/>
              <circle cx="30" cy="170" r="10"/>
              <circle cx="70" cy="170" r="10"/>
              <circle cx="110" cy="170" r="10"/>
              <circle cx="150" cy="170" r="10"/>
              <circle cx="190" cy="170" r="10"/>
              <circle cx="230" cy="170" r="10"/>
              <circle cx="50" cy="205" r="10"/>
              <circle cx="90" cy="205" r="10"/>
              <circle cx="130" cy="205" r="10"/>
              <circle cx="170" cy="205" r="10"/>
              <circle cx="210" cy="205" r="10"/>
              <circle cx="30" cy="240" r="10"/>
              <circle cx="70" cy="240" r="10"/>
              <circle cx="110" cy="240" r="10"/>
              <circle cx="150" cy="240" r="10"/>
              <circle cx="190" cy="240" r="10"/>
              <circle cx="230" cy="240" r="10"/>
            </g>
          </g>
        </svg>
      );

    case 'EUR':
    case 'EURO':
    case 'ZONA EURO':
      // European Union Flag SVG
      return (
        <svg viewBox="0 0 640 480" style={baseStyle} className={className}>
          <path fill="#003399" d="M0 0h640v480H0z"/>
          <g fill="#ffcc00">
            <circle cx="320" cy="80" r="16"/>
            <circle cx="400" cy="100" r="16"/>
            <circle cx="460" cy="160" r="16"/>
            <circle cx="480" cy="240" r="16"/>
            <circle cx="460" cy="320" r="16"/>
            <circle cx="400" cy="380" r="16"/>
            <circle cx="320" cy="400" r="16"/>
            <circle cx="240" cy="380" r="16"/>
            <circle cx="180" cy="320" r="16"/>
            <circle cx="160" cy="240" r="16"/>
            <circle cx="180" cy="160" r="16"/>
            <circle cx="240" cy="100" r="16"/>
          </g>
        </svg>
      );

    case 'RUB':
    case 'RUSIA':
      // Russia Flag SVG
      return (
        <svg viewBox="0 0 640 480" style={baseStyle} className={className}>
          <path fill="#fff" d="M0 0h640v160H0z"/>
          <path fill="#0039a6" d="M0 160h640v160H0z"/>
          <path fill="#d52b1e" d="M0 320h640v160H0z"/>
        </svg>
      );

    case 'COP':
    case 'COLOMBIA':
      // Colombia Flag SVG
      return (
        <svg viewBox="0 0 640 480" style={baseStyle} className={className}>
          <path fill="#fcd116" d="M0 0h640v240H0z"/>
          <path fill="#003893" d="M0 240h640v120H0z"/>
          <path fill="#ce1126" d="M0 360h640v120H0z"/>
        </svg>
      );

    case 'CNY':
    case 'CHINA':
      // China Flag SVG
      return (
        <svg viewBox="0 0 640 480" style={baseStyle} className={className}>
          <path fill="#de2910" d="M0 0h640v480H0z"/>
          <g fill="#ffde00">
            <polygon points="120,60 145,135 75,90 165,90 95,135"/>
            <circle cx="200" cy="50" r="12"/>
            <circle cx="240" cy="90" r="12"/>
            <circle cx="240" cy="150" r="12"/>
            <circle cx="200" cy="190" r="12"/>
          </g>
        </svg>
      );

    case 'TRY':
    case 'TURQUÍA':
    case 'TURQUIA':
      // Turkey Flag SVG
      return (
        <svg viewBox="0 0 640 480" style={baseStyle} className={className}>
          <path fill="#e30a17" d="M0 0h640v480H0z"/>
          <circle cx="260" cy="240" r="120" fill="#fff"/>
          <circle cx="290" cy="240" r="96" fill="#e30a17"/>
          <polygon fill="#fff" points="370,240 410,255 395,215 410,180 370,195 340,165 345,210 310,230 350,245 355,290"/>
        </svg>
      );

    case 'VES':
    case 'VENEZUELA':
      // Venezuela Flag SVG
      return (
        <svg viewBox="0 0 640 480" style={baseStyle} className={className}>
          <path fill="#fc1" d="M0 0h640v160H0z"/>
          <path fill="#00247d" d="M0 160h640v160H0z"/>
          <path fill="#cf142b" d="M0 320h640v160H0z"/>
          {/* 8 Stars arc in center */}
          <g fill="#fff">
            <circle cx="230" cy="250" r="10"/>
            <circle cx="255" cy="225" r="10"/>
            <circle cx="290" cy="210" r="10"/>
            <circle cx="325" cy="205" r="10"/>
            <circle cx="360" cy="210" r="10"/>
            <circle cx="395" cy="225" r="10"/>
            <circle cx="420" cy="250" r="10"/>
            <circle cx="325" cy="235" r="10"/>
          </g>
        </svg>
      );

    default:
      // Global Globe icon
      return (
        <svg viewBox="0 0 24 24" style={baseStyle} className={className} fill="none" stroke="#696cff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" fill="var(--bs-primary-light)"/>
          <line x1="2" y1="12" x2="22" y2="12"/>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
      );
  }
};
