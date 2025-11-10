import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import RandomConnect from './components/RandomConnect';
import PrivateRoom from './components/PrivateRoom';
import './App.css';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/random" element={<RandomConnect />} />
                    <Route path="/room" element={<PrivateRoom />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;