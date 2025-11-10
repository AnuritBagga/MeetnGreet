// WebRTC Configuration
export const ICE_SERVERS = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
        { urls: 'stun:stun3.l.google.com:19302' },
        { urls: 'stun:stun4.l.google.com:19302' },
    ]
};

// Add TURN servers if available in environment
if (process.env.REACT_APP_TURN_SERVER) {
    ICE_SERVERS.iceServers.push({
        urls: process.env.REACT_APP_TURN_SERVER,
        username: process.env.REACT_APP_TURN_USERNAME,
        credential: process.env.REACT_APP_TURN_CREDENTIAL
    });
}

// Media Constraints
export const MEDIA_CONSTRAINTS = {
    video: {
        width: { ideal: 1280, max: 1920 },
        height: { ideal: 720, max: 1080 },
        frameRate: { ideal: 30, max: 30 }
    },
    audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
    }
};

// Check browser WebRTC support
export const checkWebRTCSupport = () => {
    const support = {
        getUserMedia: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
        RTCPeerConnection: !!window.RTCPeerConnection,
        RTCSessionDescription: !!window.RTCSessionDescription,
        RTCIceCandidate: !!window.RTCIceCandidate
    };

    return {
        isSupported: Object.values(support).every(val => val),
        details: support
    };
};

// Get user media with error handling
export const getUserMedia = async (constraints = MEDIA_CONSTRAINTS) => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        return { success: true, stream };
    } catch (error) {
        console.error('getUserMedia error:', error);

        let errorMessage = 'Failed to access camera/microphone';

        if (error.name === 'NotAllowedError') {
            errorMessage = 'Permission denied. Please allow camera and microphone access.';
        } else if (error.name === 'NotFoundError') {
            errorMessage = 'No camera or microphone found on your device.';
        } else if (error.name === 'NotReadableError') {
            errorMessage = 'Camera/microphone is already in use by another application.';
        }

        return { success: false, error: errorMessage };
    }
};

// Get available devices
export const getDevices = async () => {
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        return {
            videoInputs: devices.filter(d => d.kind === 'videoinput'),
            audioInputs: devices.filter(d => d.kind === 'audioinput'),
            audioOutputs: devices.filter(d => d.kind === 'audiooutput')
        };
    } catch (error) {
        console.error('Error enumerating devices:', error);
        return { videoInputs: [], audioInputs: [], audioOutputs: [] };
    }
};

// Monitor connection quality
export const monitorConnectionQuality = async (peerConnection) => {
    try {
        const stats = await peerConnection.getStats();
        const quality = {
            packetsLost: 0,
            jitter: 0,
            roundTripTime: 0,
            bandwidth: 0
        };

        stats.forEach(report => {
            if (report.type === 'inbound-rtp' && report.kind === 'video') {
                quality.packetsLost = report.packetsLost || 0;
                quality.jitter = report.jitter || 0;
            }
            if (report.type === 'candidate-pair' && report.state === 'succeeded') {
                quality.roundTripTime = report.currentRoundTripTime || 0;
            }
            if (report.type === 'outbound-rtp') {
                quality.bandwidth = report.bytesSent || 0;
            }
        });

        return quality;
    } catch (error) {
        console.error('Error monitoring connection:', error);
        return null;
    }
};

// Stop all media tracks
export const stopMediaTracks = (stream) => {
    if (stream) {
        stream.getTracks().forEach(track => {
            track.stop();
        });
    }
};

// Toggle track enabled state
export const toggleTrack = (stream, kind, enabled) => {
    if (!stream) return false;

    const track = kind === 'audio'
        ? stream.getAudioTracks()[0]
        : stream.getVideoTracks()[0];

    if (track) {
        track.enabled = enabled;
        return true;
    }
    return false;
};

// Check if running on HTTPS (required for production)
export const isSecureContext = () => {
    return window.isSecureContext || window.location.hostname === 'localhost';
};

// Format connection state for display
export const formatConnectionState = (state) => {
    const states = {
        'new': '🔵 Initializing...',
        'checking': '🟡 Connecting...',
        'connected': '🟢 Connected',
        'completed': '🟢 Connected',
        'failed': '🔴 Connection Failed',
        'disconnected': '⚪ Disconnected',
        'closed': '⚫ Closed'
    };
    return states[state] || '⚪ Unknown';
};

// Handle connection errors
export const handleConnectionError = (error, peerConnection) => {
    console.error('WebRTC Connection Error:', error);

    // Attempt recovery
    if (peerConnection && peerConnection.iceConnectionState === 'failed') {
        console.log('Attempting ICE restart...');
        peerConnection.restartIce();
    }
};

// Create offer with options
export const createOfferWithOptions = async (peerConnection) => {
    const options = {
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
        iceRestart: false
    };

    return await peerConnection.createOffer(options);
};

// Create answer with options
export const createAnswerWithOptions = async (peerConnection) => {
    const options = {
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
    };

    return await peerConnection.createAnswer(options);
};

export default {
    ICE_SERVERS,
    MEDIA_CONSTRAINTS,
    checkWebRTCSupport,
    getUserMedia,
    getDevices,
    monitorConnectionQuality,
    stopMediaTracks,
    toggleTrack,
    isSecureContext,
    formatConnectionState,
    handleConnectionError,
    createOfferWithOptions,
    createAnswerWithOptions
};