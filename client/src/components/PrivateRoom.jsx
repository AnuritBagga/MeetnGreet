import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import useSocket from '../hooks/useSocket';
import useWebRTC from '../hooks/useWebRTC';
import VideoCall from './VideoCall';
import AIAssistant from './AIAssistant';
import StarryBackground from './StarryBackground';

const API_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:5000';

const PrivateRoom = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const socket = useSocket();

    const [username] = useState(
        location.state?.username || localStorage.getItem('username') || 'Anonymous'
    );
    const [mode, setMode] = useState('join'); // join or create
    const [roomName, setRoomName] = useState('');
    const [roomPassword, setRoomPassword] = useState('');
    const [error, setError] = useState('');
    const [isInRoom, setIsInRoom] = useState(false);
    const [roomUsers, setRoomUsers] = useState([]);
    const [showAI, setShowAI] = useState(false);

    const {
        localStream,
        remoteStreams,
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
        if (!socket || !isInRoom) return;

        socket.on('user-joined', async ({ userId, username: newUsername }) => {
            setRoomUsers(prev => [...prev, { id: userId, username: newUsername }]);

            // Send offer to new user
            const offer = await createOffer(userId);
            socket.emit('offer', { offer, to: userId, from: socket.id, roomId: roomName });
        });

        socket.on('offer', async ({ offer, from }) => {
            const answer = await createAnswer(from, offer);
            socket.emit('answer', { answer, to: from, from: socket.id, roomId: roomName });
        });

        socket.on('answer', async ({ answer, from }) => {
            await addAnswer(from, answer);
        });

        socket.on('ice-candidate', async ({ candidate, from }) => {
            await addIceCandidate(from, candidate);
        });

        socket.on('user-left', ({ userId }) => {
            setRoomUsers(prev => prev.filter(user => user.id !== userId));
        });

        socket.on('room-error', ({ message }) => {
            setError(message);
            setIsInRoom(false);
        });

        return () => {
            socket.off('user-joined');
            socket.off('offer');
            socket.off('answer');
            socket.off('ice-candidate');
            socket.off('user-left');
            socket.off('room-error');
        };
    }, [socket, isInRoom, roomName, createOffer, createAnswer, addAnswer, addIceCandidate]);

    const handleCreateRoom = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post(`${API_URL}/api/rooms/create`, {
                roomName,
                password: roomPassword,
                username
            });

            if (response.data.success) {
                joinRoom();
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create room');
        }
    };

    const handleJoinRoom = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post(`${API_URL}/api/rooms/verify`, {
                roomName,
                password: roomPassword
            });

            if (response.data.success) {
                joinRoom();
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to join room');
        }
    };

    const joinRoom = () => {
        if (!socket) return;

        socket.emit('join-room', {
            roomName,
            roomPassword,
            username
        });

        socket.once('room-joined', ({ users }) => {
            setIsInRoom(true);
            setRoomUsers(users.map(id => ({ id, username: 'User' })));
        });
    };

    const handleLeave = () => {
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
        }
        navigate('/');
    };

    if (isInRoom) {
        return (
            <div className="private-room-container">
                <StarryBackground />

                <div className="video-interface">
                    <div className="header">
                        <h2>Room: {roomName}</h2>
                        <button className="btn-back" onClick={handleLeave}>
                            Leave Room
                        </button>
                    </div>

                    <VideoCall
                        localStream={localStream}
                        remoteStream={remoteStreams[0]}
                        peerUsername={roomUsers[0]?.username}
                        isAudioEnabled={isAudioEnabled}
                        isVideoEnabled={isVideoEnabled}
                        onToggleAudio={toggleAudio}
                        onToggleVideo={toggleVideo}
                        onStop={handleLeave}
                        showSkip={false}
                    />

                    <button
                        className="ai-toggle-btn"
                        onClick={() => setShowAI(!showAI)}
                    >
                        {showAI ? '✕' : '🤖'}
                    </button>

                    {showAI && (
                        <AIAssistant
                            onClose={() => setShowAI(false)}
                            context="room"
                        />
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="private-room-container">
            <StarryBackground />

            <div className="room-setup">
                <div className="setup-card">
                    <h2>Private Room</h2>

                    <div className="mode-toggle">
                        <button
                            className={mode === 'join' ? 'active' : ''}
                            onClick={() => setMode('join')}
                        >
                            Join Room
                        </button>
                        <button
                            className={mode === 'create' ? 'active' : ''}
                            onClick={() => setMode('create')}
                        >
                            Create Room
                        </button>
                    </div>

                    <form onSubmit={mode === 'create' ? handleCreateRoom : handleJoinRoom}>
                        <div className="form-group">
                            <label>Room Name</label>
                            <input
                                type="text"
                                placeholder="Enter room name..."
                                value={roomName}
                                onChange={(e) => setRoomName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Room Password</label>
                            <input
                                type="password"
                                placeholder="Enter password..."
                                value={roomPassword}
                                onChange={(e) => setRoomPassword(e.target.value)}
                                required
                            />
                        </div>

                        {error && <div className="error-message">{error}</div>}

                        <button type="submit" className="btn-primary">
                            {mode === 'create' ? '🔐 Create Room' : '🚪 Join Room'}
                        </button>
                    </form>

                    <button className="btn-secondary" onClick={() => navigate('/')}>
                        ← Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PrivateRoom;