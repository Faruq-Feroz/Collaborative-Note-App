import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import pages
import Home from '../pages/Home';
import Room from '../pages/Room';

// Import context providers
import { SocketProvider } from '../context/SocketContext';

function App() {
  return (
    <Router>
      <SocketProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/room/:roomId" element={<Room />} />
        </Routes>
        <ToastContainer position="bottom-right" />
      </SocketProvider>
    </Router>
  );
}

export default App;