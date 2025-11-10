// API Endpoints
export const API_BASE_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:5000';
export const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

// API Routes
export const API_ROUTES = {
    ROOMS: {
        CREATE: '/api/rooms/create',
        VERIFY: '/api/rooms/verify',
        INFO: (roomName) => `/api/rooms/${roomName}`
    },
    AI: {
        ICEBREAKER: '/api/ai/icebreaker',
        MODERATE: '/api/ai/moderate',
        HELP: '/api/ai/help'
    }
};

// Socket Events
export const SOCKET_EVENTS = {
    // Connection
    CONNECT: 'connect',
    DISCONNECT: 'disconnect',
    CONNECT_ERROR: 'connect_error',

    // Random Connect
    JOIN_RANDOM: 'join-random',
    LEAVE_RANDOM: 'leave-random',
    WAITING: 'waiting',
    MATCH_FOUND: 'match-found',
    SKIP_USER: 'skip-user',
    PEER_SKIPPED: 'peer-skipped',
    READY_FOR_NEXT: 'ready-for-next',

    // Private Room
    JOIN_ROOM: 'join-room',
    ROOM_JOINED: 'room-joined',
    ROOM_ERROR: 'room-error',
    USER_JOINED: 'user-joined',
    USER_LEFT: 'user-left',

    // WebRTC Signaling
    OFFER: 'offer',
    ANSWER: 'answer',
    ICE_CANDIDATE: 'ice-candidate',

    // Chat
    SEND_MESSAGE: 'send-message',
    RECEIVE_MESSAGE: 'receive-message'
};

// Connection States
export const CONNECTION_STATES = {
    IDLE: 'idle',
    SEARCHING: 'searching',
    CONNECTING: 'connecting',
    CONNECTED: 'connected',
    DISCONNECTED: 'disconnected',
    FAILED: 'failed'
};

// UI Messages
export const UI_MESSAGES = {
    WELCOME: 'Welcome to Tum Aur Mai!',
    SEARCHING: 'Searching for someone...',
    CONNECTING: 'Connecting...',
    CONNECTED: 'Connected! Say hi 👋',
    DISCONNECTED: 'User disconnected',
    CONNECTION_FAILED: 'Connection failed. Please try again.',
    PERMISSION_DENIED: 'Please allow camera and microphone access',
    NO_DEVICES: 'No camera or microphone found',
    ROOM_NOT_FOUND: 'Room not found',
    INVALID_PASSWORD: 'Invalid room password',
    ROOM_CREATED: 'Room created successfully!',
    JOINED_ROOM: 'Joined room successfully!'
};

// Error Messages
export const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Network error. Please check your connection.',
    SERVER_ERROR: 'Server error. Please try again later.',
    WEBRTC_NOT_SUPPORTED: 'Your browser does not support video calling.',
    MEDIA_ERROR: 'Could not access camera/microphone.',
    ROOM_ERROR: 'Room error. Please try again.',
    AI_ERROR: 'AI service temporarily unavailable.'
};

// Ice Breaker Questions (Fallback if AI fails)
export const FALLBACK_ICEBREAKERS = [
    "What's the most interesting thing that happened to you this week?",
    "If you could have dinner with anyone, dead or alive, who would it be?",
    "What's a skill you'd love to learn and why?",
    "What's your favorite way to spend a weekend?",
    "If you could travel anywhere right now, where would you go?",
    "What's something you're really passionate about?",
    "What's the best advice you've ever received?",
    "If you could have any superpower, what would it be?",
    "What's a book or movie that changed your perspective?",
    "What's something most people don't know about you?"
];

// Technical Tips
export const TECHNICAL_TIPS = [
    {
        issue: 'poor video quality',
        solution: 'Try moving closer to your WiFi router or switching to a wired connection.'
    },
    {
        issue: 'audio echo',
        solution: 'Use headphones to prevent microphone feedback and echo.'
    },
    {
        issue: 'connection fails',
        solution: 'Disable VPN if you\'re using one, and ensure your firewall allows WebRTC.'
    },
    {
        issue: 'camera not working',
        solution: 'Check browser permissions and ensure no other app is using your camera.'
    },
    {
        issue: 'microphone not working',
        solution: 'Check browser permissions and system sound settings.'
    }
];

// Browser Requirements
export const BROWSER_REQUIREMENTS = {
    chrome: { minVersion: 74, name: 'Google Chrome' },
    firefox: { minVersion: 66, name: 'Mozilla Firefox' },
    safari: { minVersion: 12, name: 'Safari' },
    edge: { minVersion: 79, name: 'Microsoft Edge' },
    opera: { minVersion: 62, name: 'Opera' }
};

// Performance Thresholds
export const PERFORMANCE_THRESHOLDS = {
    GOOD_PACKET_LOSS: 0.01,  // 1%
    FAIR_PACKET_LOSS: 0.05,  // 5%
    GOOD_JITTER: 30,         // ms
    FAIR_JITTER: 100,        // ms
    GOOD_RTT: 100,           // ms
    FAIR_RTT: 300            // ms
};

// Room Settings
export const ROOM_SETTINGS = {
    MAX_ROOM_NAME_LENGTH: 50,
    MIN_PASSWORD_LENGTH: 4,
    MAX_PASSWORD_LENGTH: 50,
    ROOM_EXPIRY_HOURS: 24,
    MAX_PARTICIPANTS: 10
};

// Video Settings
export const VIDEO_SETTINGS = {
    DEFAULT_WIDTH: 1280,
    DEFAULT_HEIGHT: 720,
    DEFAULT_FRAMERATE: 30,
    MIN_WIDTH: 640,
    MIN_HEIGHT: 480,
    MAX_WIDTH: 1920,
    MAX_HEIGHT: 1080
};

// Audio Settings
export const AUDIO_SETTINGS = {
    ECHO_CANCELLATION: true,
    NOISE_SUPPRESSION: true,
    AUTO_GAIN_CONTROL: true,
    SAMPLE_RATE: 48000
};

// Animation Durations (ms)
export const ANIMATION_DURATIONS = {
    FAST: 200,
    NORMAL: 300,
    SLOW: 500,
    VERY_SLOW: 1000
};

// Colors
export const COLORS = {
    PRIMARY: '#00d9ff',
    PRIMARY_DARK: '#0099ff',
    SECONDARY: '#88c0d0',
    BACKGROUND: '#000000',
    BACKGROUND_LIGHT: '#0a0a0f',
    SUCCESS: '#00ff88',
    ERROR: '#ff4444',
    WARNING: '#ffaa00',
    TEXT: '#ffffff',
    TEXT_MUTED: '#88c0d0'
};

// Local Storage Keys
export const STORAGE_KEYS = {
    USERNAME: 'username',
    LAST_ROOM: 'lastRoom',
    SETTINGS: 'userSettings',
    DEVICE_PREFERENCES: 'devicePreferences'
};

export default {
    API_BASE_URL,
    SOCKET_URL,
    API_ROUTES,
    SOCKET_EVENTS,
    CONNECTION_STATES,
    UI_MESSAGES,
    ERROR_MESSAGES,
    FALLBACK_ICEBREAKERS,
    TECHNICAL_TIPS,
    BROWSER_REQUIREMENTS,
    PERFORMANCE_THRESHOLDS,
    ROOM_SETTINGS,
    VIDEO_SETTINGS,
    AUDIO_SETTINGS,
    ANIMATION_DURATIONS,
    COLORS,
    STORAGE_KEYS
};