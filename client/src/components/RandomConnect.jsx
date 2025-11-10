import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useSocket from '../hooks/useSocket';
import useWebRTC from '../hooks/useWebRTC';
import VideoCall from './VideoCall';
import AIAssistant from './AIAssistant';
import StarryBackground from './StarryBackground';

const RandomConnect = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const socket = useSocket();

    const [username] = useState(
        location.state?.username || localStorage.getItem('username') || 'Anonymous'
    );
    const [status, setStatus] = useState('idle'); // idle, searching, connected
    const [peerInfo, setPeerInfo] = useState(null);
    const [showAI, setShowAI] = useState(false);

    const {
        localStream,
        remoteStream,
        isAudioEnabled,
        isVideoEnabled,
        toggleAudio,
        toggleVideo,
        initializeMedia,
        createOffer,
        createAnswer,
        addAnswer,
        addIceCandidate
    } = useWebRTC();

    useEffect(() => {
        if (!username) {
            navigate('/');
            return;
        }

        initializeMedia();
    }, [username, navigate]);

    useEffect(() => {
        if (!socket) return;

        socket.on('waiting', () => {
            setStatus('searching');
        });

        socket.on('match-found', async ({ roomId, peerId, peerUsername }) => {
            setStatus('connected');
            setPeerInfo({ id: peerId, username: peerUsername, roomId });

            // Create and send offer
            const offer = await createOffer(peerId);
            socket.emit('offer', { offer, to: peerId, from: socket.id, roomId });
        });

        socket.on('offer', async ({ offer, from, roomId }) => {
            const answer = await createAnswer(from, offer);
            socket.emit('answer', { answer, to: from, from: socket.id, roomId });
        });

        socket.on('answer', async ({ answer, from }) => {
            await addAnswer(from, answer);
        });

        socket.on('ice-candidate', async ({ candidate, from }) => {
            await addIceCandidate(from, candidate);
        });

        socket.on('peer-skipped', () => {
            handleDisconnect();
            setStatus('idle');
        });

        socket.on('user-left', () => {
            handleDisconnect();
            setStatus('idle');
        });

        return () => {
            socket.off('waiting');
            socket.off('match-found');
            socket.off('offer');
            socket.off('answer');
            socket.off('ice-candidate');
            socket.off('peer-skipped');
            socket.off('user-left');
        };
    }, [socket, createOffer, createAnswer, addAnswer, addIceCandidate]);

    const startSearching = () => {
        if (!socket) return;
        setStatus('searching');
        socket.emit('join-random', { userId: socket.id, username });
    };

    const handleSkip = () => {
        if (!socket || !peerInfo) return;
        socket.emit('skip-user', { roomId: peerInfo.roomId, peerId: peerInfo.id });
        handleDisconnect();
        startSearching();
    };

    const handleDisconnect = () => {
        setStatus('idle');
        setPeerInfo(null);
    };

    const handleStop = () => {
        if (socket && status === 'searching') {
            socket.emit('leave-random');
        }
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
        }
        navigate('/');
    };

    return (
        <div className="random-connect-container">
            <StarryBackground />

            <div className="video-interface">
                <div className="header">
                    <h2>Random Connect</h2>
                    <button className="btn-back" onClick={handleStop}>
                        ← Back
                    </button>
                </div>

                {status === 'idle' && (
                    <div className="start-screen">
                        <div className="welcome-card">
                            <h3>Ready to meet someone new?</h3>
                            <p>Click start to connect with a random person</p>
                            <button className="btn-start" onClick={startSearching}>
                                🎲 Start Random Chat
                            </button>
                        </div>
                    </div>
                )}

                {status === 'searching' && (
                    <div className="searching-screen">
                        <div className="spinner"></div>
                        <h3>Finding someone for you...</h3>
                        <p>Please wait while we connect you</p>
                        <button className="btn-secondary" onClick={handleStop}>
                            Cancel
                        </button>
                    </div>
                )}

                {status === 'connected' && (
                    <VideoCall
                        localStream={localStream}
                        remoteStream={remoteStream}
                        peerUsername={peerInfo?.username}
                        isAudioEnabled={isAudioEnabled}
                        isVideoEnabled={isVideoEnabled}
                        onToggleAudio={toggleAudio}
                        onToggleVideo={toggleVideo}
                        onSkip={handleSkip}
                        onStop={handleStop}
                        showSkip={true}
                    />
                )}

                <button
                    className="ai-toggle-btn"
                    onClick={() => setShowAI(!showAI)}
                >
                    {showAI ? '✕' : '🤖'}
                </button>

                {showAI && (
                    <AIAssistant
                        onClose={() => setShowAI(false)}
                        context="random"
                    />
                )}
            </div>
        </div>
    );
};

export default RandomConnect;