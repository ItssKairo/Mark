import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

// Serve static files from the React app
app.use(express.static(join(__dirname, 'dist')));

// Serve photos directory
app.use('/photos', express.static(join(__dirname, 'photos')));

// Slideshow state
const slideshowState = {
  currentImage: null,
  currentGroup: null,
  isPlaying: false,
  interval: 5000, // 5 seconds default
  images: {},
  queue: [],
};

let slideshowInterval = null;

function advanceSlide() {
  const groups = Object.keys(slideshowState.images);
  if (groups.length === 0) return;

  let currentGroupIndex = groups.indexOf(slideshowState.currentGroup);
  if (currentGroupIndex === -1) {
    currentGroupIndex = 0; // Default to the first group
  }

  let currentGroupImages = slideshowState.images[groups[currentGroupIndex]] || [];
  let currentImageIndex = currentGroupImages.indexOf(slideshowState.currentImage);

  // Move to the next image
  currentImageIndex++;

  // If we've reached the end of the current group, move to the next group
  if (currentImageIndex >= currentGroupImages.length) {
    currentImageIndex = 0;
    currentGroupIndex = (currentGroupIndex + 1) % groups.length;
  }

  const nextGroup = groups[currentGroupIndex];
  const nextImage = slideshowState.images[nextGroup][currentImageIndex];

  slideshowState.currentImage = nextImage;
  slideshowState.currentGroup = nextGroup;

  io.emit('state_update', slideshowState);
}

function startSlideshow() {
  if (slideshowInterval) clearInterval(slideshowInterval);
  slideshowInterval = setInterval(advanceSlide, slideshowState.interval);
}

function stopSlideshow() {
  clearInterval(slideshowInterval);
  slideshowInterval = null;
}

// Scan photos directory
async function scanPhotos() {
  try {
    const photosDir = join(__dirname, 'photos');
    
    // Create photos directory if it doesn't exist
    try {
      await fs.access(photosDir);
    } catch (error) {
      await fs.mkdir(photosDir, { recursive: true });
      await fs.mkdir(join(photosDir, 'background'), { recursive: true });
      await fs.mkdir(join(photosDir, 'family'), { recursive: true });
      await fs.mkdir(join(photosDir, 'friends'), { recursive: true });
    }
    
    const groups = await fs.readdir(photosDir);
    const imagePromises = groups.map(async (group) => {
      const groupPath = join(photosDir, group);
      const stats = await fs.stat(groupPath);
      
      if (stats.isDirectory()) {
        const files = await fs.readdir(groupPath);
        const images = files
          .filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file))
          .map(file => `/photos/${group}/${file}`);
        
        if (images.length > 0) {
          slideshowState.images[group] = images;
        }
      }
    });

    await Promise.all(imagePromises);

    // Set initial image if not already set
    if (!slideshowState.currentImage) {
      const firstGroup = Object.keys(slideshowState.images)[0];
      if (firstGroup) {
        slideshowState.currentImage = slideshowState.images[firstGroup][0];
        slideshowState.currentGroup = firstGroup;
      }
    }
    
    console.log('Photos scanned successfully');
  } catch (error) {
    console.error('Error scanning photos:', error);
  }
}

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('Client connected');
  
  // Send current state to new client
  socket.emit('state_update', slideshowState);
  
  // Handle play/pause
  socket.on('toggle_play', (isPlaying) => {
    slideshowState.isPlaying = isPlaying;
    if (slideshowState.isPlaying) {
      startSlideshow();
    } else {
      stopSlideshow();
    }
    io.emit('state_update', slideshowState);
  });
  
  // Handle image change
  socket.on('change_image', (data) => {
    slideshowState.currentImage = data.image;
    slideshowState.currentGroup = data.group;
    if (slideshowState.isPlaying) {
      startSlideshow(); // Restart timer with the new image
    }
    io.emit('state_update', slideshowState);
  });
  
  // Handle interval change
  socket.on('change_interval', (interval) => {
    slideshowState.interval = interval;
    if (slideshowState.isPlaying) {
      startSlideshow(); // Restart slideshow with new interval
    }
    io.emit('state_update', slideshowState);
  });
  
  // Handle queue update
  socket.on('update_queue', (queue) => {
    slideshowState.queue = queue;
    io.emit('state_update', slideshowState);
  });
  
  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Scan photos on startup
scanPhotos().then(() => {
  // Serve index.html for all routes (SPA)
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, 'dist', 'index.html'));
  });
  
  // Start server
  const PORT = process.env.PORT || 3000;
  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`TV page: http://localhost:${PORT}/`);
    console.log(`Dashboard: http://localhost:${PORT}/dashboard`);
  });
});