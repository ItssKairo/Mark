import { useState } from 'react';

const Dashboard = ({ state, togglePlay, changeImage, changeInterval, updateQueue }) => {
  const { currentImage, currentGroup, isPlaying, interval, images, queue } = state;
  const [selectedInterval, setSelectedInterval] = useState(interval / 1000); // Convert to seconds for UI
  
  // Handle interval change
  const handleIntervalChange = (e) => {
    const newInterval = parseInt(e.target.value, 10);
    setSelectedInterval(newInterval);
    changeInterval(newInterval * 1000); // Convert back to milliseconds
  };
  
  // Handle image click
  const handleImageClick = (image, group) => {
    changeImage(image, group);
  };
  
  // Handle play/pause
  const handlePlayPause = () => {
    togglePlay(!isPlaying);
  };
  
  return (
    <div className="h-screen bg-gray-100 p-4 flex flex-col">
      <div className="max-w-7xl mx-auto w-full flex flex-col">
        <h1 className="text-3xl font-bold mb-6 text-center">Memorial Slideshow Dashboard</h1>
        
        {/* Controls - Fixed at the top */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6 sticky top-0 z-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <button 
                onClick={handlePlayPause}
                className={`px-4 py-2 rounded-md ${isPlaying ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white font-medium`}
              >
                {isPlaying ? 'Pause' : 'Play'}
              </button>
            </div>
            
            <div className="flex items-center">
              <label htmlFor="interval" className="mr-2 font-medium">Seconds per slide:</label>
              <input 
                type="range" 
                id="interval" 
                min="3" 
                max="20" 
                value={selectedInterval} 
                onChange={handleIntervalChange}
                className="w-32"
              />
              <span className="ml-2">{selectedInterval}s</span>
            </div>
            
            <div>
              <p className="font-medium">
                Current: {currentGroup} / {currentImage?.split('/').pop()}
              </p>
            </div>
          </div>
        </div>
        
        {/* Scrollable content area */}
        <div className="overflow-y-auto flex-grow">
          {/* Image Groups */}
          {Object.keys(images).map((group) => (
            <div key={group} className="mb-8">
              <h2 className="text-xl font-semibold mb-3 bg-gray-200 p-2 rounded">{group}</h2>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {images[group].map((image) => (
                  <div 
                    key={image} 
                    onClick={() => handleImageClick(image, group)}
                    className={`relative cursor-pointer rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow p-2 ${currentImage === image ? 'bg-blue-100 ring-2 ring-blue-500' : 'bg-white'}`}
                  >
                    <div className="text-center py-2">
                      <p className="text-sm font-medium break-words">{image.split('/').pop()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          {/* Queue Section (Optional) */}
          {queue.length > 0 && (
            <div className="mt-8 bg-white rounded-lg shadow-md p-4">
              <h2 className="text-xl font-semibold mb-3">Queued Images</h2>
              <div className="flex overflow-x-auto gap-4 pb-4">
                {queue.map((item, index) => (
                  <div key={index} className="flex-shrink-0">
                    <p className="text-sm mt-1 truncate">{item.image.split('/').pop()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;