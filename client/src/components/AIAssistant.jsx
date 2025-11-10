import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:5000';

const AIAssistant = ({ onClose, context }) => {
    const [icebreaker, setIcebreaker] = useState('');
    const [loading, setLoading] = useState(false);
    const [helpIssue, setHelpIssue] = useState('');
    const [helpResponse, setHelpResponse] = useState('');

    const getIcebreaker = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/api/ai/icebreaker`);
            setIcebreaker(response.data.suggestion);
        } catch (error) {
            setIcebreaker('What\'s the most interesting thing you\'ve learned recently?');
        } finally {
            setLoading(false);
        }
    };

    const getHelp = async () => {
        if (!helpIssue.trim()) return;

        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/api/ai/help`, {
                issue: helpIssue
            });
            setHelpResponse(response.data.help);
        } catch (error) {
            setHelpResponse('Try refreshing the page and checking your browser permissions.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ai-assistant">
            <div className="ai-header">
                <h3>🤖 AI Assistant</h3>
                <button className="close-btn" onClick={onClose}>✕</button>
            </div>

            <div className="ai-content">
                <div className="ai-section">
                    <h4>Need a Conversation Starter?</h4>
                    <button
                        className="btn-ai"
                        onClick={getIcebreaker}
                        disabled={loading}
                    >
                        {loading ? 'Generating...' : '✨ Get Ice Breaker'}
                    </button>
                    {icebreaker && (
                        <div className="ai-suggestion">
                            <p>{icebreaker}</p>
                        </div>
                    )}
                </div>

                <div className="ai-section">
                    <h4>Having Technical Issues?</h4>
                    <textarea
                        placeholder="Describe your issue..."
                        value={helpIssue}
                        onChange={(e) => setHelpIssue(e.target.value)}
                        rows="3"
                    />
                    <button
                        className="btn-ai"
                        onClick={getHelp}
                        disabled={loading || !helpIssue.trim()}
                    >
                        {loading ? 'Getting Help...' : '🔧 Get Help'}
                    </button>
                    {helpResponse && (
                        <div className="ai-response">
                            <p>{helpResponse}</p>
                        </div>
                    )}
                </div>

                <div className="ai-tips">
                    <h4>💡 Tips</h4>
                    <ul>
                        <li>Allow camera and microphone permissions</li>
                        <li>Use Chrome or Firefox for best experience</li>
                        <li>Check your internet connection</li>
                        <li>Be respectful to others</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AIAssistant;