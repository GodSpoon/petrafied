import React, { useState, useEffect } from 'react';
import { Window, WindowContent, Button, Toolbar, Desktop, TaskBar, WindowHeader, Hourglass } from 'react95';
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
const AppWindow = ({ id, title, icon, isOpen, onClose, position, onFocus, isActive, children }) => {
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
      <Window>
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
      </Window>
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
const ContactContent = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('email');
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <Hourglass size={32} />
        <p style={{ marginTop: 16 }}>Loading Contact Information...</p>
      </div>
    );
  }
  
  return (
    <div>
      <h2>Contact Petra</h2>
      
      <Toolbar style={{ marginBottom: '16px' }}>
        <Button 
          onClick={() => setActiveTab('email')}
          active={activeTab === 'email'}
          style={{ marginRight: '4px' }}
        >
          Email
        </Button>
        <Button 
          onClick={() => setActiveTab('social')}
          active={activeTab === 'social'}
          style={{ marginRight: '4px' }}
        >
          Social Media
        </Button>
        <Button 
          onClick={() => setActiveTab('studio')}
          active={activeTab === 'studio'}
        >
          Studio Info
        </Button>
      </Toolbar>
      
      {activeTab === 'email' && (
        <div>
          <div style={{ border: '2px inset #c0c0c0', padding: '8px', marginBottom: '16px' }}>
            <h3>Email Contact</h3>
            <p><strong>Email:</strong> petrafied@thepaintedladyfw.com</p>
            <p>This is the preferred method of contact for booking inquiries.</p>
            <p>Please include details about the tattoo you're interested in!</p>
          </div>
          
          <div style={{ border: '2px inset #c0c0c0', padding: '8px' }}>
            <h3>Quick Message</h3>
            <div style={{ marginBottom: '8px' }}>
              <label style={{ display: 'block', marginBottom: '4px' }}>Your Name:</label>
              <input type="text" style={{ width: '100%', padding: '4px' }} />
            </div>
            
            <div style={{ marginBottom: '8px' }}>
              <label style={{ display: 'block', marginBottom: '4px' }}>Your Email:</label>
              <input type="email" style={{ width: '100%', padding: '4px' }} />
            </div>
            
            <div style={{ marginBottom: '8px' }}>
              <label style={{ display: 'block', marginBottom: '4px' }}>Message:</label>
              <textarea style={{ width: '100%', height: '80px', padding: '4px' }}></textarea>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <Button>Send Message</Button>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'social' && (
        <div>
          <h3>Social Media</h3>
          <p>Follow Petra's work on these platforms:</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '16px' }}>
            <Button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src="/images/icons/instagram.svg" alt="Instagram" style={{ width: '24px', height: '24px', marginRight: '8px' }} />
              Instagram
            </Button>
            
            <Button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src="/images/icons/tiktok.svg" alt="TikTok" style={{ width: '24px', height: '24px', marginRight: '8px' }} />
              TikTok
            </Button>
            
            <Button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src="/images/icons/facebook.svg" alt="Facebook" style={{ width: '24px', height: '24px', marginRight: '8px' }} />
              Facebook
            </Button>
            
            <Button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src="/images/icons/spotify.svg" alt="Spotify" style={{ width: '24px', height: '24px', marginRight: '8px' }} />
              Spotify
            </Button>
          </div>
          
          <div style={{ marginTop: '16px', border: '2px inset #c0c0c0', padding: '8px' }}>
            <h3>Latest Posts</h3>
            <div style={{ maxHeight: '200px', overflowY: 'auto', marginTop: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', padding: '4px', border: '1px solid #808080' }}>
                <img src="/images/instagramposts/tattoo1.jpg" alt="Post" style={{ width: '40px', height: '40px', marginRight: '8px' }} />
                <div>
                  <p style={{ margin: '0', fontSize: '14px' }}>New piece completed yesterday! #tattoo</p>
                  <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>2 days ago</p>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', padding: '4px', border: '1px solid #808080' }}>
                <img src="/images/instagramposts/tattoo2.jpg" alt="Post" style={{ width: '40px', height: '40px', marginRight: '8px' }} />
                <div>
                  <p style={{ margin: '0', fontSize: '14px' }}>Flash day coming next month! #flashtattoo</p>
                  <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>1 week ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'studio' && (
        <div>
          <div style={{ border: '2px inset #c0c0c0', padding: '8px', marginBottom: '16px' }}>
            <h3>Studio Information</h3>
            <p><strong>The Painted Lady Tattoo Studio</strong></p>
            <p>123 Main Street</p>
            <p>Fort Wayne, IN 46802</p>
            <p>Phone: (555) 123-4567</p>
          </div>
          
          <div style={{ border: '2px inset #c0c0c0', padding: '8px' }}>
            <h3>Hours</h3>
            <p>Wednesday - Saturday: 12pm - 8pm</p>
            <p>Sunday - Tuesday: Closed</p>
            <p>By appointment only</p>
          </div>
          
          <div style={{ marginTop: '16px', textAlign: 'center' }}>
            <Button>Get Directions</Button>
          </div>
        </div>
      )}
    </div>
  );
};

// Aftercare window content
const AftercareContent = () => {
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
        <p style={{ marginTop: 16 }}>Loading Aftercare Instructions...</p>
      </div>
    );
  }
  
  return (
    <div>
      <h2>Tattoo Aftercare Guide</h2>
      
      <div style={{ border: '2px inset #c0c0c0', padding: '8px', marginBottom: '16px' }}>
        <h3>First 24 Hours</h3>
        <ul style={{ paddingLeft: '20px' }}>
          <li>Leave the bandage on for 2-4 hours after getting tattooed.</li>
          <li>Wash gently with antibacterial soap and lukewarm water.</li>
          <li>Pat dry with a clean paper towel or let air dry.</li>
          <li>Apply a thin layer of aftercare ointment.</li>
          <li>Do not re-bandage.</li>
        </ul>
      </div>
      
      <div style={{ border: '2px inset #c0c0c0', padding: '8px', marginBottom: '16px' }}>
        <h3>Days 2-7</h3>
        <ul style={{ paddingLeft: '20px' }}>
          <li>Wash your tattoo 2-3 times daily.</li>
          <li>Apply aftercare ointment for the first 3 days.</li>
          <li>Switch to fragrance-free lotion after day 3.</li>
          <li>Avoid direct sunlight, swimming, and soaking.</li>
          <li>Wear loose clothing that won't stick to your tattoo.</li>
        </ul>
      </div>
      
      <div style={{ border: '2px inset #c0c0c0', padding: '8px' }}>
        <h3>Weeks 2-4</h3>
        <ul style={{ paddingLeft: '20px' }}>
          <li>Continue moisturizing daily.</li>
          <li>Avoid sun exposure or use SPF 50+ if necessary.</li>
          <li>Do not pick or scratch at peeling skin.</li>
          <li>Avoid swimming pools, hot tubs, and saunas.</li>
          <li>Contact me if you have any concerns about healing!</li>
        </ul>
      </div>
      
      <div style={{ marginTop: '16px', textAlign: 'center' }}>
        <Button>Download Aftercare Guide (PDF)</Button>
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  const [openWindows, setOpenWindows] = useState([]);
  const [activeWindow, setActiveWindow] = useState(null);
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Window positions
  const windowPositions = {
    portfolio: { x: 50, y: 50, width: 600, height: 500 },
    about: { x: 100, y: 100, width: 500, height: 400 },
    booking: { x: 150, y: 150, width: 550, height: 450 },
    gallery: { x: 200, y: 80, width: 650, height: 500 },
    contact: { x: 250, y: 120, width: 500, height: 450 },
    aftercare: { x: 300, y: 150, width: 500, height: 400 },
  };
  
  // Open a window
  const openWindow = (id) => {
    if (!openWindows.includes(id)) {
      setOpenWindows([...openWindows, id]);
    }
    setActiveWindow(id);
    setStartMenuOpen(false);
  };
  
  // Close a window
  const closeWindow = (id) => {
    setOpenWindows(openWindows.filter(windowId => windowId !== id));
    if (activeWindow === id) {
      setActiveWindow(openWindows.length > 1 ? openWindows[0] : null);
    }
  };
  
  // Toggle the start menu
  const toggleStartMenu = () => {
    setStartMenuOpen(!startMenuOpen);
  };
  
  // Format time for taskbar
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <ThemeProvider theme={customTheme}>
      <GlobalStyles />
      
      {/* Desktop */}
      <div className="desktop">
        {/* Desktop Icons */}
        {desktopIcons.map(icon => (
          <div 
            key={icon.id}
            className="desktop-icon"
            onClick={() => openWindow(icon.id)}
          >
            <img src={`/images/icons/${icon.icon}`} alt={icon.name} />
            <div className="desktop-icon-label">{icon.name}</div>
          </div>
        ))}
        
        {/* Windows */}
        <AppWindow
          id="portfolio"
          title="Portfolio"
          icon="portfolio.png"
          isOpen={openWindows.includes('portfolio')}
          onClose={() => closeWindow('portfolio')}
          position={windowPositions.portfolio}
          onFocus={() => setActiveWindow('portfolio')}
          isActive={activeWindow === 'portfolio'}
        >
          <PortfolioContent />
        </AppWindow>
        
        <AppWindow
          id="about"
          title="About Petra"
          icon="about.png"
          isOpen={openWindows.includes('about')}
          onClose={() => closeWindow('about')}
          position={windowPositions.about}
          onFocus={() => setActiveWindow('about')}
          isActive={activeWindow === 'about'}
        >
          <AboutContent />
        </AppWindow>
        
        <AppWindow
          id="booking"
          title="Book Now"
          icon="booking.png"
          isOpen={openWindows.includes('booking')}
          onClose={() => closeWindow('booking')}
          position={windowPositions.booking}
          onFocus={() => setActiveWindow('booking')}
          isActive={activeWindow === 'booking'}
        >
          <BookingContent />
        </AppWindow>
        
        <AppWindow
          id="gallery"
          title="Gallery"
          icon="gallery.png"
          isOpen={openWindows.includes('gallery')}
          onClose={() => closeWindow('gallery')}
          position={windowPositions.gallery}
          onFocus={() => setActiveWindow('gallery')}
          isActive={activeWindow === 'gallery'}
        >
          <GalleryContent />
        </AppWindow>
        
        <AppWindow
          id="contact"
          title="Contact"
          icon="contact.png"
          isOpen={openWindows.includes('contact')}
          onClose={() => closeWindow('contact')}
          position={windowPositions.contact}
          onFocus={() => setActiveWindow('contact')}
          isActive={activeWindow === 'contact'}
        >
          <ContactContent />
        </AppWindow>
        
        <AppWindow
          id="aftercare"
          title="Aftercare"
          icon="help.png"
          isOpen={openWindows.includes('aftercare')}
          onClose={() => closeWindow('aftercare')}
          position={windowPositions.aftercare}
          onFocus={() => setActiveWindow('aftercare')}
          isActive={activeWindow === 'aftercare'}
        >
          <AftercareContent />
        </AppWindow>
        
        {/* Start Menu */}
        {startMenuOpen && (
          <div className="start-menu" onClick={e => e.stopPropagation()}>
            <div className="start-menu-header">
              <span>Petrafied.ink</span>
            </div>
            
            {desktopIcons.map(icon => (
              <div 
                key={icon.id}
                className="start-menu-item"
                onClick={() => openWindow(icon.id)}
              >
                <img src={`/images/icons/${icon.icon}`} alt={icon.name} />
                <span>{icon.name}</span>
              </div>
            ))}
            
            <div className="start-menu-item" style={{ borderTop: '1px solid #808080', marginTop: '8px' }}>
              <img src="/images/icons/shutDown.png" alt="About" />
              <span>About This Site</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Taskbar */}
      <TaskBar
        onClick={() => setStartMenuOpen(false)}
        style={{ position: 'relative', zIndex: 1000 }}
      >
        <Button 
          onClick={(e) => { 
            e.stopPropagation();
            toggleStartMenu();
          }}
          active={startMenuOpen}
          style={{ fontWeight: 'bold', marginRight: '4px', padding: '0 8px' }}
        >
          <img 
            src="/images/icons/start.png" 
            alt="Start"
            style={{ width: '20px', height: '20px', marginRight: '4px' }}
          />
          Start
        </Button>
        
        {/* Open window buttons */}
        {openWindows.map(windowId => {
          const icon = desktopIcons.find(icon => icon.id === windowId);
          return (
            <Button 
              key={windowId}
              onClick={() => setActiveWindow(windowId)}
              active={activeWindow === windowId}
              className="taskbar-button"
            >
              <img src={`/images/icons/${icon.icon}`} alt={icon.name} />
              <span>{icon.name}</span>
            </Button>
          );
        })}
        
        {/* Spacer to push time to the right */}
        <div style={{ flexGrow: 1 }}></div>
        
        {/* Clock */}
        <div style={{ 
          padding: '0 8px', 
          borderLeft: '1px solid #808080', 
          display: 'flex', 
          alignItems: 'center', 
          height: '100%'
        }}>
          {formatTime(currentTime)}
        </div>
      </TaskBar>
    </ThemeProvider>
  );
};

export default App;
