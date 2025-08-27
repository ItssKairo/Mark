import { useEffect } from 'react';

const TVPage = ({ state, togglePlay, changeImage }) => {
  const { currentImage, currentGroup, isPlaying, interval, images } = state;
  
  // Handle automatic slideshow
  useEffect(() => {
    // No need for client-side auto-advance logic as it's now handled by the server
  }, []);
  
  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case ' ': // Space bar
          togglePlay(!isPlaying);
          break;
        case 'ArrowRight':
          // Next image logic
          if (Object.keys(images).length > 0) {
            const groups = Object.keys(images);
            let currentGroupIndex = groups.indexOf(currentGroup);
            let currentGroupImages = images[currentGroup] || [];
            let currentImageIndex = currentGroupImages.indexOf(currentImage);
            
            // Move to next image
            currentImageIndex++;
            
            // If we've reached the end of the current group
            if (currentImageIndex >= currentGroupImages.length) {
              currentImageIndex = 0;
              currentGroupIndex = (currentGroupIndex + 1) % groups.length;
            }
            
            const nextGroup = groups[currentGroupIndex];
            const nextImage = images[nextGroup][currentImageIndex];
            
            changeImage(nextImage, nextGroup);
          }
          break;
        case 'ArrowLeft':
          // Previous image logic
          if (Object.keys(images).length > 0) {
            const groups = Object.keys(images);
            let currentGroupIndex = groups.indexOf(currentGroup);
            let currentGroupImages = images[currentGroup] || [];
            let currentImageIndex = currentGroupImages.indexOf(currentImage);
            
            // Move to previous image
            currentImageIndex--;
            
            // If we've reached the beginning of the current group
            if (currentImageIndex < 0) {
              currentGroupIndex = (currentGroupIndex - 1 + groups.length) % groups.length;
              currentGroupImages = images[groups[currentGroupIndex]] || [];
              currentImageIndex = currentGroupImages.length - 1;
            }
            
            const prevGroup = groups[currentGroupIndex];
            const prevImage = images[prevGroup][currentImageIndex];
            
            changeImage(prevImage, prevGroup);
          }
          break;
        default:
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, togglePlay, currentImage, currentGroup, images, changeImage]);
  
  return (
    <div className="w-screen h-screen bg-black flex items-center justify-center overflow-hidden">
      {currentImage ? (
        <img 
          src={currentImage}
          alt="Slideshow Image"
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="text-white text-2xl">No image selected</div>
      )}
    </div>
  );
};

export default TVPage;