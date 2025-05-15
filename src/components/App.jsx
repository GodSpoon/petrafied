import React, { useState, useEffect } from 'react';
import { XWindow, WindowContent, Button, Toolbar, Desktop, TaskBar, WindowHeader, Hourglass } from 'react95';
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import original from 'react95/dist/themes/original';
import ms_sans_serif from 'react95/dist/fonts/ms_sans_serif.woff2';
import ms_sans_serif_bold from 'react95/dist/fonts/ms_sans_serif_bold.woff2';

// Custom theme extending Windows 95 with purple accents
const customTheme = {
  ...original,
  material: '#2e2e2e', // Darker backdrop
  materialDark: '#1a1a1a', // Off-black
  materialText: '#f2f2f2', // Off-white text
  headerText: '#ffffff',
  hoverBackground: '#9966cc', // Purple hover
  checkmarkColor: '#b083d5', // Lighter purple
  focusSecondary: '#b083d5', // Lighter purple
};

// Global styles
const GlobalStyles = createGlobalStyle`
  @font-face {
    font-family: 'ms_sans_serif';
    src: url('${ms_sans_serif}') format('woff2');
    font-weight: 400;
    font-style: normal;
  }
  
  @font-face {
    font-family: 'ms_sans_serif';
    src: url('${ms_sans_serif_bold}') format('woff2');
    font-weight: bold;
    font-style: normal;
  }
  
  body {
    font-family: 'ms_sans_serif';
    background-color: #1a1a1a;
    margin: 0;
    padding: 0;
    overflow: hidden;
    height: 100vh;
  }
  
  .desktop {
    width: 100%;
    height: calc(100vh - 36px);
    position: relative;
    overflow: hidden;
    background-color: #1a1a1a;
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="50" height="50" fill="%232e2e2e"/><rect x="50" y="50" width="50" height="50" fill="%232e2e2e"/><rect x="50" y="0" width="50" height="50" fill="%231a1a1a"/><rect x="0" y="50" width="50" height="50" fill="%231a1a1a"/></svg>');
    background-size: 20px 20px;
  }
  
  .window {
    box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.5);
    position: absolute;
    min-width: 300px;
    max-width: 90vw;
    min-height: 200px;
    max-height: 90vh;
    z-index: 1;
    border-radius: 0;
    animation: windowAppear 0.3s ease;
  }
  
  @keyframes windowAppear {
    from {
      transform: scale(0.8);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }
  
  .window-content {
    padding: 16px;
    height: calc(100% - 35px);
    overflow-y: auto;
  }
  
  .desktop-icon {
    width: 80px;
    height: 90px;
    margin: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    cursor: pointer;
    text-align: center;
    color: white;
    text-shadow: 1px 1px 2px black;
    transition: all 0.2s;
  }
  
  .desktop-icon:hover {
    background-color: rgba(153, 102, 204, 0.3);
  }
  
  .desktop-icon:active {
    background-color: rgba(153, 102, 204, 0.5);
  }
  
  .desktop-icon img {
    width: 48px;
    height: 48px;
    margin-bottom: 8px;
    image-rendering: pixelated;
  }
  
  .desktop-icon-label {
    font-size: 14px;
    max-width: 80px;
    word-wrap: break-word;
  }
  
  .start-menu {
    position: absolute;
    bottom: 36px;
    left: 0;
    width: 280px;
    background-color: #c0c0c0;
    border: 2px solid;
    border-color: #dfdfdf #808080 #808080 #dfdfdf;
    box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.5);
    z-index: 1000;
    animation: startMenuAppear 0.2s ease;
  }
  
  @keyframes startMenuAppear {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  .start-menu-header {
    height: 36px;
    background: linear-gradient(90deg, #9966cc, #6f4b90);
    display: flex;
    align-items: center;
    padding: 0 16px;
    color: white;
    font-weight: bold;
    font-size: 20px;
  }
  
  .start-menu-item {
    padding: 8px 16px;
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: background-color 0.1s;
  }
  
  .start-menu-item:hover {
    background-color: #9966cc;
    color: white;
  }
  
  .start-menu-item img {
    width: 24px;
    height: 24px;
    margin-right: 8px;
    image-rendering: pixelated;
  }
  
  .taskbar-button {
    display: flex;
    align-items: center;
    margin-left: 4px;
    padding: 3px 8px;
    min-width: 120px;
    max-width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .taskbar-button img {
    width: 16px;
    height: 16px;
    margin-right: 4px;
  }

  /* Custom scrollbars to match Windows 95 */
  ::-webkit-scrollbar {
    width: 16px;
    height: 16px;
  }
  
  ::-webkit-scrollbar-track {
    background: #c0c0c0;
    border: 1px solid #808080;
  }
  
  ::-webkit-scrollbar-thumb {
    background: #c0c0c0;
    border: 1px solid;
    border-color: #dfdfdf #808080 #808080 #dfdfdf;
  }
  
  ::-webkit-scrollbar-button {
    background-color: #c0c0c0;
    border: 1px solid;
    border-color: #dfdfdf #808080 #808080 #dfdfdf;
    width: 16px;
    height: 16px;
  }
  
  /* More responsive adjustments for mobile */
  @media (max-width: 768px) {
    .window {
      width: 95vw !important;
      height: 80vh !important;
      top: 5vh !important;
      left: 2.5vw !important;
    }
    
    .desktop-icon {
      width: 70px;
      height: 80px;
      margin: 8px;
    }
    
    .desktop-icon img {
      width: 40px;
      height: 40px;
    }
    
    .desktop-icon-label {
      font-size: 12px;
    }
    
    .start-menu {
      width: 80vw;
    }
  }
`;

// List of desktop application icons
const desktopIcons = [
  { id: 'portfolio', name: 'Portfolio', icon: 'portfolio.png' },
  { id: 'about', name: 'About Petra', icon: 'about.png' },
  { id: 'booking', name: 'Book Now', icon: 'booking.png' },
  { id: 'gallery', name: 'Gallery', icon: 'gallery.png' },
  { id: 'contact', name: 'Contact', icon: 'contact.png' },
  { id: 'aftercare', name: 'Aftercare', icon: 'help.png' },
];

// Window components
const Window = ({ id, title, icon, isOpen, onClose, position, onFocus, isActive, children }) => {
  const [windowPos, setWindowPos] = useState(position);
  
  if (!isOpen) return null;
  
  return (
    <div 
      className="window" 
      style={{ 
        left: windowPos.x, 
        top: windowPos.y, 
        width: windowPos.width, 
        height: windowPos.height,
        zIndex: isActive ? 10 : 1
      }}
      onClick={onFocus}
    >
      <XWindow>
        <WindowHeader style={{
          background: isActive 
            ? 'linear-gradient(90deg, #9966cc, #6f4b90)' 
            : 'linear-gradient(90deg, #808080, #c0c0c0)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img 
              src={`/images/icons/${icon}`} 
              alt={title}
              style={{ width: 16, height: 16, marginRight: 4 }}
            />
            <span>{title}</span>
          </div>
          <Button onClick={onClose}>
            <span style={{ fontWeight: 'bold' }}>×</span>
          </Button>
        </WindowHeader>
        <WindowContent className="window-content">
          {children}
        </WindowContent>
      </XWindow>
    </div>
  );
};

// Portfolio window content
const PortfolioContent = () => {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const portfolioItems = [
    { id: 1, image: 'tattoo1.jpg', title: 'Neo-Traditional Skull', description: 'Black and grey with purple accents' },
    { id: 2, image: 'tattoo2.jpg', title: 'Blackwork Mandala', description: 'Geometric pattern with dotwork' },
    { id: 3, image: 'tattoo3.jpg', title: 'Cyberpunk Sleeve', description: 'Circuit patterns with glitch aesthetics' },
    { id: 4, image: 'tattoo4.jpg', title: 'Dark Floral Piece', description: 'Nightshade and belladonna design' },
    { id: 5, image: 'tattoo5.jpg', title: 'Gothic Architecture', description: 'Cathedral window with bats' },
    { id: 6, image: 'tattoo6.jpg', title: 'Ornamental Dagger', description: 'Victorian style with gem details' },
  ];
  
  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <Hourglass size={32} />
        <p style={{ marginTop: 16 }}>Loading Portfolio...</p>
      </div>
    );
  }
  
  return (
    <div>
      <h2>Petra's Tattoo Portfolio</h2>
      <p>Specializing in Illustrative, Cybercygilism, and Neo-traditional styles</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginTop: '16px' }}>
        {portfolioItems.map(item => (
          <div key={item.id} style={{ border: '2px solid #9966cc', padding: '8px', textAlign: 'center' }}>
            <img 
              src={`/images/instagramposts/${item.image}`} 
              alt={item.title}
              style={{ width: '100%', height: '160px', objectFit: 'cover' }}
            />
            <h3 style={{ margin: '8px 0', fontSize: '16px' }}>{item.title}</h3>
            <p style={{ fontSize: '14px', color: '#666' }}>{item.description}</p>
          </div>
        ))}
      </div>
      
      <div style={{ marginTop: '16px', textAlign: 'center' }}>
        <Button>View Full Portfolio on Instagram</Button>
      </div>
    </div>
  );
};

// About window content
const AboutContent = () => {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <Hourglass size={32} />
        <p style={{ marginTop: 16 }}>Loading About Information...</p>
      </div>
    );
  }
  
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
        <img 
          src="/images/shmegl.jpg" 
          alt="Petra" 
          style={{ 
            width: '100px', 
            height: '100px', 
            objectFit: 'cover',
            border: '2px solid #9966cc',
            marginRight: '16px'
          }} 
        />
        <div>
          <h2 style={{ margin: '0 0 8px 0' }}>Petra</h2>
          <p style={{ margin: '0' }}>Alternative Tattoo Artist</p>
          <p style={{ margin: '4px 0' }}>Pronouns: They/Them</p>
          <p style={{ margin: '4px 0' }}>Location: Fort Wayne, Indiana</p>
        </div>
      </div>
      
      <div style={{ border: '2px inset #c0c0c0', padding: '8px', marginBottom: '16px' }}>
        <h3>About Me</h3>
        <p>Specializing in illustrative and neo-traditional tattoo styles with a dark aesthetic. Drawing inspiration from gothic, metal, and cyberpunk influences.</p>
        <p>Currently working at The Painted Lady Tattoo Studio in Fort Wayne, Indiana.</p>
      </div>
      
      <div style={{ border: '2px inset #c0c0c0', padding: '8px' }}>
        <h3>Bio</h3>
        <p>• Studio: <a href="https://www.instagram.com/thepaintedladyfw/" target="_blank" rel="noopener noreferrer">The Painted Lady</a></p>
        <p>• Specialties: Illustrative, Cybercygilism, Neo-traditional</p>
        <p>• Sign: ♓ Pisces</p>
        <p>• Also: Spiritually old, mentally unwell</p>
        <p>• BOOKS OPEN: NO DMS - EMAIL ONLY •</p>
      </div>
    </div>
  );
};

// Booking window content
const BookingContent = () => {
  const [loading, setLoading] = useState(true);
  const [bookingStep, setBookingStep] = useState('info');
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <Hourglass size={32} />
        <p style={{ marginTop: 16 }}>Loading Booking Information...</p>
      </div>
    );
  }
  
  return (
    <div>
      <h2>Booking Information</h2>
      
      <Toolbar style={{ marginBottom: '16px' }}>
        <Button 
          onClick={() => setBookingStep('info')}
          active={bookingStep === 'info'}
          style={{ marginRight: '4px' }}
        >
          Information
        </Button>
        <Button 
          onClick={() => setBookingStep('form')}
          active={bookingStep === 'form'}
          style={{ marginRight: '4px' }}
        >
          Request Form
        </Button>
        <Button 
          onClick={() => setBookingStep('calendar')}
          active={bookingStep === 'calendar'}
        >
          Calendar
        </Button>
      </Toolbar>
      
      {bookingStep === 'info' && (
        <div>
          <div style={{ border: '2px inset #c0c0c0', padding: '8px', marginBottom: '16px' }}>
            <h3>Booking Policy</h3>
            <p>⚡ Consultation required first</p>
            <p>⚡ Deposit for all bookings</p>
            <p>⚡ 48hr cancellation policy</p>
            <p>⚡ No copying other artists!</p>
            <p>⚡ Open Wed-Sat 12-8pm</p>
          </div>
          
          <div style={{ border: '2px inset #c0c0c0', padding: '8px' }}>
            <h3>Pricing Information</h3>
            <p>• Minimum charge: $150</p>
            <p>• Hourly rate: $150-200 depending on complexity</p>
            <p>• Deposit: 25% of estimated cost (non-refundable)</p>
            <p>• Consultations are free!</p>
          </div>
          
          <div style={{ marginTop: '16px', textAlign: 'center' }}>
            <Button onClick={() => setBookingStep('form')}>Request Consultation</Button>
          </div>
        </div>
      )}
      
      {bookingStep === 'form' && (
        <div>
          <h3>Tattoo Request Form</h3>
          <p>Fill out this form to request a consultation or appointment.</p>
          
          <div style={{ marginBottom: '8px' }}>
            <label style={{ display: 'block', marginBottom: '4px' }}>Name:</label>
            <input type="text" style={{ width: '100%', padding: '4px' }} />
          </div>
          
          <div style={{ marginBottom: '8px' }}>
            <label style={{ display: 'block', marginBottom: '4px' }}>Email:</label>
            <input type="email" style={{ width: '100%', padding: '4px' }} />
          </div>
          
          <div style={{ marginBottom: '8px' }}>
            <label style={{ display: 'block', marginBottom: '4px' }}>Tattoo Description:</label>
            <textarea style={{ width: '100%', height: '80px', padding: '4px' }}></textarea>
          </div>
          
          <div style={{ marginBottom: '8px' }}>
            <label style={{ display: 'block', marginBottom: '4px' }}>Placement:</label>
            <input type="text" style={{ width: '100%', padding: '4px' }} />
          </div>
          
          <div style={{ marginBottom: '8px' }}>
            <label style={{ display: 'block', marginBottom: '4px' }}>Size (approximate):</label>
            <input type="text" style={{ width: '100%', padding: '4px' }} />
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <Button>Submit Request</Button>
          </div>
        </div>
      )}
      
      {bookingStep === 'calendar' && (
        <div>
          <h3>Availability Calendar</h3>
          <p>Connect to my Calendly to see available consultation slots.</p>
          
          <div style={{ border: '2px inset #c0c0c0', padding: '8px', marginBottom: '16px', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p>Calendly widget would be embedded here</p>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <Button>Open Calendly in New Window</Button>
          </div>
        </div>
      )}
    </div>
  );
};

// Gallery window content
const GalleryContent = () => {
  const [loading, setLoading] = useState(true);
  const [viewingImage, setViewingImage] = useState(null);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1800);
    
    return () => clearTimeout(timer);
  }, []);
  
  const galleryImages = [
    { id: 1, image: 'tattoo1.jpg', title: 'Neo-Traditional Skull', date: '03/15/2025' },
    { id: 2, image: 'tattoo2.jpg', title: 'Blackwork Mandala', date: '02/22/2025' },
    { id: 3, image: 'tattoo3.jpg', title: 'Cyberpunk Sleeve', date: '01/17/2025' },
    { id: 4, image: 'tattoo4.jpg', title: 'Dark Floral Piece', date: '12/05/2024' },
    { id: 5, image: 'tattoo5.jpg', title: 'Gothic Architecture', date: '11/28/2024' },
    { id: 6, image: 'tattoo6.jpg', title: 'Ornamental Dagger', date: '10/31/2024' },
    { id: 7, image: 'tattoo7.jpg', title: 'Cybernetic Eye', date: '10/15/2024' },
    { id: 8, image: 'tattoo8.jpg', title: 'Cosmic Horror', date: '09/22/2024' },
    { id: 9, image: 'tattoo9.jpg', title: 'Glitch Art', date: '09/01/2024' },
  ];
  
  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <Hourglass size={32} />
        <p style={{ marginTop: 16 }}>Loading Gallery...</p>
      </div>
    );
  }
  
  // If viewing a single image
  if (viewingImage) {
    return (
      <div>
        <Toolbar>
          <Button onClick={() => setViewingImage(null)}>Back to Gallery</Button>
          <Button disabled>Print</Button>
          <Button disabled>Share</Button>
        </Toolbar>
        
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <img 
            src={`/images/instagramposts/${viewingImage.image}`} 
            alt={viewingImage.title}
            style={{ 
              maxWidth: '100%', 
              maxHeight: '400px', 
              border: '2px inset #c0c0c0',
              padding: '8px',
              background: '#000'
            }}
          />
          
          <div style={{ marginTop: '8px', textAlign: 'left', padding: '8px', border: '2px inset #c0c0c0' }}>
            <p><strong>Title:</strong> {viewingImage.title}</p>
            <p><strong>Date:</strong> {viewingImage.date}</p>
            <p><strong>File:</strong> {viewingImage.image}</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <h2>Tattoo Gallery</h2>
      <p>Browse through my recent work. Click any image to view details.</p>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', 
        gap: '8px', 
        marginTop: '16px',
        border: '2px inset #c0c0c0',
        padding: '8px',
        background: '#000'
      }}>
        {galleryImages.map(item => (
          <div 
            key={item.id} 
            style={{ 
              padding: '4px', 
              background: '#c0c0c0',
              cursor: 'pointer',
              borderRadius: 0,
              transition: 'all 0.2s'
            }}
            onClick={() => setViewingImage(item)}
            onMouseOver={(e) => e.currentTarget.style.background = '#9966cc'}
            onMouseOut={(e) => e.currentTarget.style.background = '#c0c0c0'}
          >
            <img 
              src={`/images/instagramposts/${item.image}`} 
              alt={item.title}
              style={{ width: '100%', height: '100px', objectFit: 'cover' }}
            />
            <div style={{ fontSize: '12px', marginTop: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {item.title}
            </div>
          </div>
        ))}
      </div>
      
      <div style={{ marginTop: '8px', textAlign: 'right' }}>
        <span style={{ fontSize: '12px' }}>9 items • 256 KB</span>
      </div>
    </div>
  );
};

// Contact window content
      
