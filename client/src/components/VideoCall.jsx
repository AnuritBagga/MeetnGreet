import React, { useRef, useEffect } from 'react';

const VideoCall = ({
                       localStream,
                       remoteStream,
                       peerUsername,
                       isAudioEnabled,
                       isVideoEnabled,
                       onToggleAudio,
                       onToggleVideo,
                       onSkip,
                       onStop,
                       showSkip
                   }) => {
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);

    useEffect(() => {
        if (localVideoRef.current && localStream) {
            localVideoRef.current.srcObject = localStream;
        }
    }, [localStream]);

    useEffect(() => {
        if (remoteVideoRef.current && remoteStream) {
            remoteVideoRef.current.srcObject = remoteStream;
        }
    }, [remoteStream]);

    return (
        <div className="video-call-container">
            <div className="video-grid">
                <div className="video-panel remote-video">
                    {remoteStream ? (
                        <>
                            <video
                                ref={remoteVideoRef}
                                autoPlay
                                playsInline
                            />
                            <div className="video-label">{peerUsername || 'Stranger'}</div>
                        </>
                    ) : (
                        <div className="waiting-peer">
                            <div className="pulse"></div>
                            <p>Waiting for peer...</p>
                        </div>
                    )}
                </div>

                <div className="video-panel local-video">
                    <video
                        ref={localVideoRef}
                        autoPlay
                        playsInline
                        muted
                    />
                    <div className="video-label">You</div>
                </div>
            </div>

            <div className="controls">
                <button
                    className={`control-btn ${!isAudioEnabled ? 'disabled' : ''}`}
                    onClick={onToggleAudio}
                    title={isAudioEnabled ? 'Mute' : 'Unmute'}
                >
                    {isAudioEnabled ? '🎤' : '🔇'}
                </button>

                <button
                    className={`control-btn ${!isVideoEnabled ? 'disabled' : ''}`}
                    onClick={onToggleVideo}
                    title={isVideoEnabled ? 'Turn off camera' : 'Turn on camera'}
                >
                    {isVideoEnabled ? '📹' : '📷'}
                </button>

                {showSkip && (
                    <button
                        className="control-btn skip-btn"
                        onClick={onSkip}
                        title="Skip to next"
                    >
                        ⏭️
                    </button>
                )}

                <button
                    className="control-btn stop-btn"
                    onClick={onStop}
                    title="End call"
                >
                    📞
                </button>
            </div>
        </div>
    );
};

export default VideoCall;