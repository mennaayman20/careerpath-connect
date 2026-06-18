import { Link } from "react-router-dom";
import myLogo from '../assets/Copy_of_Green_Modern_Marketing_Logo__2_-removebg-preview.svg';

const Footer = () => {
  // مصفوفة أعضاء الفريق مع الروابط الخاصة بهم
  const teamMembers = [
    { name: 'Mohamed Hanafy', url: 'https://github.com/Mohamed-hanfy' },
    { name: 'Kareem Mostafa', url: 'https://github.com/Kareem74x' },
    { name: 'Mohamed Ibrahim', url: 'https://github.com/mohamedibrahim1001' },
    { name: 'Mennatullah Ayman', url: 'https://www.linkedin.com/in/menna-ayman-35459a267/' },
    { name: 'Aliaa Ali Mohamed', url: 'https://www.linkedin.com/in/aliaa-ali-472b372b6/' }
  ];

  return (
    <footer style={{ background: '#f5f5f5', borderTop: '2px solid #e0e0e0', padding: '3rem 2rem 1.5rem', fontFamily: 'inherit' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>

        {/* Main Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr', gap: '2.5rem', marginBottom: '2.5rem' }}>

          {/* Branding */}
          <div>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
              <img src={myLogo} alt="Upply Logo" style={{ height: '40px', width: 'auto' }} />
            </Link>
            <p style={{ fontSize: '13px', color: '#444', fontStyle: 'italic', margin: '6px 0 10px' }}>
              "Where talent meets opportunity<br />through AI-driven job matching."
            </p>
          </div>

          {/* For Candidates */}
          <div>
            <p style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#aaa', margin: '0 0 14px' }}>
              For Candidates
            </p>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '9px' }}>
              {[
                { icon: 'ti-search', label: 'Explore Jobs', to: '/jobs' },
                { icon: 'ti-sparkles', label: 'AI Match Feed', to: '/matched-jobs' },
                { icon: 'ti-file-cv', label: 'Resume Analysis', to: '/jobs?id=301' },
                { icon: 'ti-timeline', label: 'Application Tracker', to: '/applications' },
                { icon: 'ti-id-badge', label: 'Digital Passport', to: '/profile' },
              ].map(({ icon, label, to }) => (
                <li key={to}>
                  <Link to={to} style={{ fontSize: '13px', color: '#555', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '7px' }}>
                    <i className={`ti ${icon}`} style={{ fontSize: '14px', color: '#aaa' }} />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <p style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#aaa', margin: '0 0 14px' }}>
              For Employers
            </p>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '9px' }}>
              {[
                { icon: 'ti-layout-dashboard', label: 'Recruiter Dashboard', to: '/recruiter-dashboard' },
                { icon: 'ti-plus', label: 'Post a Job', to: '/recruiter/jobs' },
                { icon: 'ti-video', label: 'AI Interview Room', to: '/interview' },
                { icon: 'ti-robot', label: 'AI Assistant', to: '/recruiter/jobs/190/chat' },
              ].map(({ icon, label, to }) => (
                <li key={to}>
                  <Link to={to} style={{ fontSize: '13px', color: '#555', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '7px' }}>
                    <i className={`ti ${icon}`} style={{ fontSize: '14px', color: '#aaa' }} />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact & Team */}
        <div style={{ borderTop: '1px solid #e0e0e0', paddingTop: '1.5rem', marginBottom: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '1.5rem' }}>
          <div>
            <p style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#aaa', margin: '0 0 8px' }}>Academic Institution</p>
            <p style={{ fontSize: '12px', color: '#666', margin: '0 0 4px', lineHeight: '1.6' }}>Nahda University in Beni Suef (NUB)</p>
            <p style={{ fontSize: '12px', color: '#666', margin: '0 0 4px', lineHeight: '1.6' }}>Faculty of Computer Science</p>
          </div>
          
          {/* قسم أسماء التيم - السطر الثاني سيتوسط تلقائياً */}
          <div>
            <p style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#aaa', margin: '0 0 10px' }}>Team Upply</p>
            {/* تم إضافة justify-content: center هنا لجعل أي سطر يفيض يتوسط تلقائياً */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 10px', justifyContent: 'center' }}>
              {teamMembers.map(({ name, url }) => (
                <a 
                  key={name} 
                  href={url}
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ 
                    fontSize: '11.5px', 
                    fontWeight: '500',
                    color: '#4a4a4a', 
                    background: '#e9ecef', 
                    borderRadius: '20px', 
                    padding: '6px 14px',
                    textDecoration: 'none', 
                    display: 'inline-flex', 
                    alignItems: 'center',
                    gap: '0px',
                    border: '1px solid transparent',
                    transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.background = '#ffffff';
                    e.currentTarget.style.color = '#000000';
                    e.currentTarget.style.borderColor = '#cbd5e1';
                    e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.08)';
                    e.currentTarget.style.gap = '6px';
                    
                    const arrow = e.currentTarget.querySelector('.badge-arrow') as HTMLElement;
                    if (arrow) {
                      arrow.style.opacity = '1';
                      arrow.style.transform = 'scale(1) translateX(0)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.background = '#e9ecef';
                    e.currentTarget.style.color = '#4a4a4a';
                    e.currentTarget.style.borderColor = 'transparent';
                    e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
                    e.currentTarget.style.gap = '0px';
                    
                    const arrow = e.currentTarget.querySelector('.badge-arrow') as HTMLElement;
                    if (arrow) {
                      arrow.style.opacity = '0';
                      arrow.style.transform = 'scale(0) translateX(-6px)';
                    }
                  }}
                >
                  <span>{name}</span>
                  <span 
                    className="badge-arrow" 
                    style={{ 
                      display: 'inline-block', 
                      transition: 'all 0.25s ease', 
                      opacity: '0', 
                      transform: 'scale(0) translateX(-6px)',
                      fontSize: '11px',
                      color: '#059669',
                      fontWeight: 'bold'
                    }}
                  >
                    →
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{ borderTop: '1px solid #e0e0e0', paddingTop: '1.25rem', textAlign: 'center' }}>
          <p style={{ fontSize: '11px', color: "black" , margin: 0 }}>
            A Graduation Project developed by Team Upply · Faculty of Computers & Artificial Intelligence © 2026
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;