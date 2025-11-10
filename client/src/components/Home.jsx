import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StarryBackground from './StarryBackground';

const Home = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [showUsernameModal, setShowUsernameModal] = useState(false);
    const [selectedMode, setSelectedMode] = useState(null);

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
        <div className="home-container">
            <StarryBackground />

            <div className="home-content">
                <div className="logo-section">
                    <h1 className="app-title">
                        <span className="title-hindi">तुम और मैं</span>
                        <span className="title-english">Tum Aur Mai</span>
                    </h1>
                    <p className="tagline">Connect. Chat. Explore.</p>
                </div>

                <div className="mode-cards">
                    <div className="mode-card" onClick={() => handleModeSelect('random')}>
                        <div className="card-icon">🎲</div>
                        <h2>Random Connect</h2>
                        <p>Meet someone new instantly</p>
                        <div className="card-glow"></div>
                    </div>

                    <div className="mode-card" onClick={() => handleModeSelect('room')}>
                        <div className="card-icon">🔐</div>
                        <h2>Private Room</h2>
                        <p>Join with room name and key</p>
                        <div className="card-glow"></div>
                    </div>
                </div>

                <div className="features">
                    <div className="feature">
                        <span>✨</span>
                        <p>HD Video & Audio</p>
                    </div>
                    <div className="feature">
                        <span>🤖</span>
                        <p>AI Assistant</p>
                    </div>
                    <div className="feature">
                        <span>🔒</span>
                        <p>Secure & Private</p>
                    </div>
                </div>
            </div>

            {showUsernameModal && (
                <div className="modal-overlay" onClick={() => setShowUsernameModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>Enter Your Name</h2>
                        <form onSubmit={handleUsernameSubmit}>
                            <input
                                type="text"
                                placeholder="Your name..."
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                autoFocus
                                className="username-input"
                            />
                            <div className="modal-buttons">
                                <button type="submit" className="btn-primary">Continue</button>
                                <button
                                    type="button"
                                    className="btn-secondary"
                                    onClick={() => setShowUsernameModal(false)}
                                >
                                    Cancel
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