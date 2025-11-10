import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StarryBackground from './StarryBackground';

const Home = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [showUsernameModal, setShowUsernameModal] = useState(false);
    const [selectedMode, setSelectedMode] = useState(null);
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleModeSelect = (mode) => {
        if (!username.trim()) {
            setSelectedMode(mode);
            setShowUsernameModal(true);
            return;
        }
        navigateToMode(mode);
    };

    const navigateToMode = (mode) => {
        localStorage.setItem('username', username);
        navigate(`/${mode}`, { state: { username } });
    };

    const handleUsernameSubmit = (e) => {
        e.preventDefault();
        if (username.trim()) {
            setShowUsernameModal(false);
            navigateToMode(selectedMode);
        }
    };

    return (
        <div className="home-page">
            <StarryBackground />

            {/* Navbar */}
            <nav className="navbar">
                <div className="nav-container">
                    <div className="nav-logo">
                        <span className="logo-icon">🎥</span>
                        <span className="logo-text">Tum Aur Mai</span>
                    </div>
                    <div className="nav-links">
                        <a href="#features" className="nav-link">Features</a>
                        <a href="#how-it-works" className="nav-link">How It Works</a>
                        <a href="#about" className="nav-link">About</a>
                        <button className="nav-btn-contact">Contact</button>
                    </div>
                    <div className="nav-mobile-toggle">☰</div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content" style={{ transform: `translateY(${scrollY * 0.5}px)` }}>
                    <div className="hero-badge">
                        <span className="badge-dot"></span>
                        <span>Now Live - Free Beta</span>
                    </div>
                    <h1 className="hero-title">
                        Connect with Anyone,
                        <br />
                        <span className="gradient-text">Anywhere, Anytime</span>
                    </h1>
                    <p className="hero-description">
                        Experience next-generation video conferencing with AI-powered features.
                        Meet new people randomly or create private rooms for your team.
                    </p>
                    <div className="hero-buttons">
                        <button
                            className="btn-primary-large"
                            onClick={() => handleModeSelect('random')}
                        >
                            <span>Start Random Chat</span>
                            <span className="btn-icon">→</span>
                        </button>
                        <button
                            className="btn-secondary-large"
                            onClick={() => handleModeSelect('room')}
                        >
                            <span>Create Private Room</span>
                        </button>
                    </div>
                    <div className="hero-stats">
                        <div className="stat-item">
                            <div className="stat-number">10K+</div>
                            <div className="stat-label">Active Users</div>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item">
                            <div className="stat-number">50K+</div>
                            <div className="stat-label">Connections Made</div>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item">
                            <div className="stat-number">4.9/5</div>
                            <div className="stat-label">User Rating</div>
                        </div>
                    </div>
                </div>

                {/* Floating Elements */}
                <div className="floating-elements">
                    <div className="float-card float-1">
                        <div className="float-icon">🎭</div>
                        <div className="float-text">Meet New People</div>
                    </div>
                    <div className="float-card float-2">
                        <div className="float-icon">🔒</div>
                        <div className="float-text">100% Secure</div>
                    </div>
                    <div className="float-card float-3">
                        <div className="float-icon">🤖</div>
                        <div className="float-text">AI Powered</div>
                    </div>
                </div>
            </section>

            {/* Mode Cards Section */}
            <section className="modes-section" id="features">
                <div className="section-header">
                    <h2 className="section-title">Choose Your Experience</h2>
                    <p className="section-subtitle">
                        Two powerful ways to connect. Pick what suits you best.
                    </p>
                </div>

                <div className="mode-cards-container">
                    {/* Random Connect Card */}
                    <div className="professional-card random-card">
                        <div className="card-glow-effect"></div>
                        <div className="card-header">
                            <div className="card-icon-wrapper">
                                <span className="card-icon">🎲</span>
                            </div>
                            <div className="card-badge">Popular</div>
                        </div>
                        <h3 className="card-title">Random Connect</h3>
                        <p className="card-description">
                            Meet someone new in seconds. Our smart matching algorithm pairs you
                            with interesting people from around the world instantly.
                        </p>
                        <ul className="card-features">
                            <li><span className="check-icon">✓</span> Instant matching</li>
                            <li><span className="check-icon">✓</span> Skip to next person</li>
                            <li><span className="check-icon">✓</span> AI moderation</li>
                            <li><span className="check-icon">✓</span> HD video & audio</li>
                        </ul>
                        <button
                            className="card-button"
                            onClick={() => handleModeSelect('random')}
                        >
                            Start Random Chat
                            <span className="button-arrow">→</span>
                        </button>
                        <div className="card-footer">
                            <span className="footer-stat">⚡ Average wait: 2 seconds</span>
                        </div>
                    </div>

                    {/* Private Room Card */}
                    <div className="professional-card private-card">
                        <div className="card-glow-effect"></div>
                        <div className="card-header">
                            <div className="card-icon-wrapper">
                                <span className="card-icon">🔐</span>
                            </div>
                            <div className="card-badge premium">Premium</div>
                        </div>
                        <h3 className="card-title">Private Room</h3>
                        <p className="card-description">
                            Create secure, password-protected rooms for your team, friends, or family.
                            Perfect for meetings, study groups, or private conversations.
                        </p>
                        <ul className="card-features">
                            <li><span className="check-icon">✓</span> Password protection</li>
                            <li><span className="check-icon">✓</span> Multi-user support</li>
                            <li><span className="check-icon">✓</span> 24-hour persistence</li>
                            <li><span className="check-icon">✓</span> Screen sharing</li>
                        </ul>
                        <button
                            className="card-button"
                            onClick={() => handleModeSelect('room')}
                        >
                            Create Private Room
                            <span className="button-arrow">→</span>
                        </button>
                        <div className="card-footer">
                            <span className="footer-stat">🔒 Bank-level encryption</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid Section */}
            <section className="features-grid-section">
                <div className="section-header">
                    <h2 className="section-title">Powerful Features</h2>
                    <p className="section-subtitle">
                        Everything you need for seamless video communication
                    </p>
                </div>

                <div className="features-grid">
                    <div className="feature-box">
                        <div className="feature-icon">📹</div>
                        <h4>HD Video Quality</h4>
                        <p>Crystal-clear 1280x720 video with adaptive bitrate</p>
                    </div>
                    <div className="feature-box">
                        <div className="feature-icon">🎙️</div>
                        <h4>Studio Audio</h4>
                        <p>Echo cancellation and noise suppression included</p>
                    </div>
                    <div className="feature-box">
                        <div className="feature-icon">🤖</div>
                        <h4>AI Assistant</h4>
                        <p>Smart ice breakers and real-time moderation</p>
                    </div>
                    <div className="feature-box">
                        <div className="feature-icon">⚡</div>
                        <h4>Lightning Fast</h4>
                        <p>Peer-to-peer connections for minimal latency</p>
                    </div>
                    <div className="feature-box">
                        <div className="feature-icon">🌍</div>
                        <h4>Global Reach</h4>
                        <p>Connect with users from 150+ countries</p>
                    </div>
                    <div className="feature-box">
                        <div className="feature-icon">🔒</div>
                        <h4>100% Secure</h4>
                        <p>End-to-end encryption for all connections</p>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="how-it-works-section" id="how-it-works">
                <div className="section-header">
                    <h2 className="section-title">How It Works</h2>
                    <p className="section-subtitle">Get started in three simple steps</p>
                </div>

                <div className="steps-container">
                    <div className="step-item">
                        <div className="step-number">01</div>
                        <div className="step-content">
                            <h4>Choose Your Mode</h4>
                            <p>Select Random Connect for instant matching or create a Private Room</p>
                        </div>
                        <div className="step-line"></div>
                    </div>
                    <div className="step-item">
                        <div className="step-number">02</div>
                        <div className="step-content">
                            <h4>Grant Permissions</h4>
                            <p>Allow camera and microphone access for video calling</p>
                        </div>
                        <div className="step-line"></div>
                    </div>
                    <div className="step-item">
                        <div className="step-number">03</div>
                        <div className="step-content">
                            <h4>Start Connecting</h4>
                            <p>Begin your conversation with high-quality video and audio</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="cta-content">
                    <h2 className="cta-title">Ready to Connect?</h2>
                    <p className="cta-description">
                        Join thousands of users already making meaningful connections
                    </p>
                    <div className="cta-buttons">
                        <button
                            className="btn-cta-primary"
                            onClick={() => handleModeSelect('random')}
                        >
                            Get Started Free
                        </button>
                        <button className="btn-cta-secondary">
                            Learn More
                        </button>
                    </div>
                </div>
                <div className="cta-decoration">
                    <div className="decoration-circle circle-1"></div>
                    <div className="decoration-circle circle-2"></div>
                    <div className="decoration-circle circle-3"></div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer" id="about">
                <div className="footer-content">
                    <div className="footer-section">
                        <h4>Tum Aur Mai</h4>
                        <p>Next-generation video conferencing platform</p>
                        <div className="social-links">
                            <a href="#" className="social-link">📘</a>
                            <a href="#" className="social-link">🐦</a>
                            <a href="#" className="social-link">📷</a>
                            <a href="#" className="social-link">💼</a>
                        </div>
                    </div>
                    <div className="footer-section">
                        <h5>Product</h5>
                        <a href="#">Features</a>
                        <a href="#">Pricing</a>
                        <a href="#">Security</a>
                        <a href="#">Roadmap</a>
                    </div>
                    <div className="footer-section">
                        <h5>Resources</h5>
                        <a href="#">Documentation</a>
                        <a href="#">API</a>
                        <a href="#">Support</a>
                        <a href="#">Blog</a>
                    </div>
                    <div className="footer-section">
                        <h5>Company</h5>
                        <a href="#">About Us</a>
                        <a href="#">Careers</a>
                        <a href="#">Privacy</a>
                        <a href="#">Terms</a>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2024 Tum Aur Mai. All rights reserved.</p>
                </div>
            </footer>

            {/* Username Modal */}
            {showUsernameModal && (
                <div className="modal-overlay" onClick={() => setShowUsernameModal(false)}>
                    <div className="modal-content modern-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setShowUsernameModal(false)}>×</button>
                        <div className="modal-icon">👤</div>
                        <h2>What's Your Name?</h2>
                        <p>Let others know who they're talking to</p>
                        <form onSubmit={handleUsernameSubmit}>
                            <input
                                type="text"
                                placeholder="Enter your name..."
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                autoFocus
                                className="modern-input"
                                maxLength={20}
                            />
                            <div className="modal-buttons">
                                <button type="submit" className="modal-btn-primary">
                                    Continue
                                    <span className="btn-icon">→</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;