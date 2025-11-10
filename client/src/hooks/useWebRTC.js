import { useState, useRef, useCallback } from 'react';

const ICE_SERVERS = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
    ]
};

const useWebRTC = () => {
    const [localStream, setLocalStream] = useState(null);
    const [remoteStreams, setRemoteStreams] = useState([]);
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);

    const peerConnections = useRef({});
    const pendingCandidates = useRef({});

    // Initialize local media
    const initializeMedia = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                },
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                }
            });

            setLocalStream(stream);
            return stream;
        } catch (error) {
            console.error('Error accessing media devices:', error);
            alert('Please allow camera and microphone access to continue');
            throw error;
        }
    }, []);

    // Create peer connection
    const createPeerConnection = useCallback((peerId) => {
        if (peerConnections.current[peerId]) {
            return peerConnections.current[peerId];
        }

        const pc = new RTCPeerConnection(ICE_SERVERS);

        // Add local tracks to peer connection
        if (localStream) {
            localStream.getTracks().forEach(track => {
                pc.addTrack(track, localStream);
            });
        }

        // Handle incoming remote stream
        pc.ontrack = (event) => {
            console.log('📥 Received remote track from:', peerId);
            setRemoteStreams(prev => {
                const existing = prev.find(s => s.peerId === peerId);
                if (!existing) {
                    return [...prev, { peerId, stream: event.streams[0] }];
                }
                return prev;
            });
        };

        // Handle ICE candidates
        pc.onicecandidate = (event) => {
            if (event.candidate) {
                console.log('🧊 ICE candidate generated');
                // ICE candidate will be sent via socket in the component
                if (window.socket) {
                    window.socket.emit('ice-candidate', {
                        candidate: event.candidate,
                        to: peerId,
                        from: window.socket.id
                    });
                }
            }
        };

        // Handle connection state changes
        pc.onconnectionstatechange = () => {
            console.log(`🔗 Connection state: ${pc.connectionState}`);

            if (pc.connectionState === 'disconnected' ||
                pc.connectionState === 'failed' ||
                pc.connectionState === 'closed') {
                closePeerConnection(peerId);
            }
        };

        // Handle ICE connection state
        pc.oniceconnectionstatechange = () => {
            console.log(`🧊 ICE connection state: ${pc.iceConnectionState}`);
        };

        peerConnections.current[peerId] = pc;
        pendingCandidates.current[peerId] = [];

        return pc;
    }, [localStream]);

    // Create offer
    const createOffer = useCallback(async (peerId) => {
        const pc = createPeerConnection(peerId);

        try {
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            console.log('📤 Created offer for:', peerId);
            return offer;
        } catch (error) {
            console.error('Error creating offer:', error);
            throw error;
        }
    }, [createPeerConnection]);

    // Create answer
    const createAnswer = useCallback(async (peerId, offer) => {
        const pc = createPeerConnection(peerId);

        try {
            await pc.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            console.log('📥 Created answer for:', peerId);

            // Process pending ICE candidates
            if (pendingCandidates.current[peerId]) {
                pendingCandidates.current[peerId].forEach(async (candidate) => {
                    await pc.addIceCandidate(new RTCIceCandidate(candidate));
                });
                pendingCandidates.current[peerId] = [];
            }

            return answer;
        } catch (error) {
            console.error('Error creating answer:', error);
            throw error;
        }
    }, [createPeerConnection]);

    // Add answer
    const addAnswer = useCallback(async (peerId, answer) => {
        const pc = peerConnections.current[peerId];

        if (!pc) {
            console.error('No peer connection found for:', peerId);
            return;
        }

        try {
            await pc.setRemoteDescription(new RTCSessionDescription(answer));
            console.log('✅ Added answer from:', peerId);

            // Process pending ICE candidates
            if (pendingCandidates.current[peerId]) {
                pendingCandidates.current[peerId].forEach(async (candidate) => {
                    await pc.addIceCandidate(new RTCIceCandidate(candidate));
                });
                pendingCandidates.current[peerId] = [];
            }
        } catch (error) {
            console.error('Error adding answer:', error);
        }
    }, []);

    // Add ICE candidate
    const addIceCandidate = useCallback(async (peerId, candidate) => {
        const pc = peerConnections.current[peerId];

        if (!pc) {
            console.warn('Peer connection not ready, queuing candidate');
            if (!pendingCandidates.current[peerId]) {
                pendingCandidates.current[peerId] = [];
            }
            pendingCandidates.current[peerId].push(candidate);
            return;
        }

        if (!pc.remoteDescription) {
            pendingCandidates.current[peerId].push(candidate);
            return;
        }

        try {
            await pc.addIceCandidate(new RTCIceCandidate(candidate));
            console.log('✅ Added ICE candidate from:', peerId);
        } catch (error) {
            console.error('Error adding ICE candidate:', error);
        }
    }, []);

    // Close peer connection
    const closePeerConnection = useCallback((peerId) => {
        const pc = peerConnections.current[peerId];
        if (pc) {
            pc.close();
            delete peerConnections.current[peerId];
            setRemoteStreams(prev => prev.filter(s => s.peerId !== peerId));
            console.log('🔌 Closed connection to:', peerId);
        }
    }, []);

    // Toggle audio
    const toggleAudio = useCallback(() => {
        if (localStream) {
            const audioTrack = localStream.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setIsAudioEnabled(audioTrack.enabled);
            }
        }
    }, [localStream]);

    // Toggle video
    const toggleVideo = useCallback(() => {
        if (localStream) {
            const videoTrack = localStream.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                setIsVideoEnabled(videoTrack.enabled);
            }
        }
    }, [localStream]);

    return {
        localStream,
        remoteStream: remoteStreams[0]?.stream || null,
        remoteStreams: remoteStreams.map(s => s.stream),
        isAudioEnabled,
        isVideoEnabled,
        initializeMedia,
        createOffer,
        createAnswer,
        addAnswer,
        addIceCandidate,
        toggleAudio,
        toggleVideo,
        closePeerConnection
    };
};

export default useWebRTC;