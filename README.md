# Memorial Service Slideshow

A simple web application for displaying a slideshow of photos during a memorial service.

## Features

- **TV Page**: Full-screen slideshow that automatically advances through photos
- **Dashboard**: Control panel to manage the slideshow from your computer or phone
- **Real-time Control**: Changes on the dashboard immediately reflect on the TV page
- **Photo Organization**: Photos organized in groups (background, family, friends)
- **Playback Controls**: Play, pause, and navigate through images

## Setup

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone or download this repository
2. Install dependencies:
   ```
   npm install
   ```

### Adding Photos

Place your photos in the appropriate folders under the `/photos` directory:

```
/photos/
    /background/
       img1.jpg
       img2.jpg
    /family/
       img1.jpg
       img2.jpg
    /friends/
       img1.jpg
       img2.jpg
```

## Usage

### Development Mode

For development with hot reloading:

```
npm run dev
```

Then open:
- TV Page: http://localhost:5173/
- Dashboard: http://localhost:5173/dashboard

### Production Mode

For production use:

```
npm run start
```

This will build the application and start the server. Then open:
- TV Page: http://localhost:3000/
- Dashboard: http://localhost:3000/dashboard

## How to Use

1. Start the application and open both the TV page and dashboard
2. On the dashboard, you can:
   - Click on any thumbnail to immediately display that photo on the TV
   - Use the play/pause button to control the slideshow
   - Adjust the time each slide is displayed
3. The TV page will display the selected photos in full-screen mode

## Technical Details

- Frontend: Vite + React + Tailwind CSS
- Backend: Node.js + Express + Socket.IO
- No database required - all state is kept in memory
- All files are served locally (no cloud storage)
