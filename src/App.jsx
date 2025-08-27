import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import TVPage from './components/TVPage';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const [socket, setSocket] = useState(null);
  const [state, setState] = useState({
    currentImage: null,
    currentGroup: null,
    isPlaying: false,
    interval: 5000,
    images: {},
    queue: [],
  });

  useEffect(() => {
    // Connect to Socket.IO server
    const newSocket = io(window.location.origin);
    setSocket(newSocket);

    // Listen for state updates
    newSocket.on('state_update', (newState) => {
      setState(newState);
    });

    // Clean up on unmount
    return () => newSocket.disconnect();
  }, []);

  // Socket event handlers
  const togglePlay = (isPlaying) => {
    if (socket) socket.emit('toggle_play', isPlaying);
  };

  const changeImage = (image, group) => {
    if (socket) socket.emit('change_image', { image, group });
  };

  const changeInterval = (interval) => {
    if (socket) socket.emit('change_interval', interval);
  };

  const updateQueue = (queue) => {
    if (socket) socket.emit('update_queue', queue);
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            <TVPage 
              state={state} 
              togglePlay={togglePlay} 
              changeImage={changeImage}
            />
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <Dashboard 
              state={state} 
              togglePlay={togglePlay} 
              changeImage={changeImage} 
              changeInterval={changeInterval} 
              updateQueue={updateQueue} 
            />
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
