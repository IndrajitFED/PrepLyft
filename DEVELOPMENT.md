# Development Setup Guide

This guide explains how to set up and run the Interview Booking Project in development mode with auto-restart functionality.

## 🚀 Quick Start

### Option 1: Using the Development Scripts (Recommended)

**For macOS/Linux:**
```bash
./dev-start.sh
```

**For Windows:**
```cmd
dev-start.bat
```

### Option 2: Using npm scripts

```bash
# Start both frontend and backend with auto-restart
npm run dev:watch

# Or start them individually
npm run dev:backend    # Backend only
npm run dev:frontend   # Frontend only
```

## 📁 Project Structure

```
interview-booking-project/
├── frontend/          # React + TypeScript + Vite
├── backend/           # Node.js + Express + TypeScript
├── dev-start.sh       # Development startup script (macOS/Linux)
├── dev-start.bat      # Development startup script (Windows)
└── package.json       # Root package.json with scripts
```

## 🔧 Auto-Restart Configuration

### Backend Auto-Restart (nodemon)
- **Watches**: `src/`, `package.json`, `.env`
- **File Types**: `.ts`, `.js`, `.json`, `.env`
- **Restart Delay**: 500ms
- **Manual Restart**: Type `rs` in terminal

### Frontend Auto-Restart (Vite + nodemon)
- **Hot Module Replacement**: Enabled
- **Watches**: `src/`, config files
- **File Types**: `.ts`, `.tsx`, `.js`, `.jsx`, `.css`, `.html`
- **Manual Restart**: Type `rs` in terminal

## 🌐 Development URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **HMR Port**: http://localhost:3001

## 📝 Available Scripts

### Root Level Scripts
```bash
npm run dev:watch      # Start both servers with auto-restart
npm run dev            # Start both servers (no auto-restart)
npm run build          # Build both frontend and backend
npm run clean          # Clean build artifacts
npm run setup          # Install all dependencies
```

### Backend Scripts
```bash
cd backend
npm run dev            # Start with nodemon (auto-restart)
npm run build          # Build TypeScript to JavaScript
npm run start          # Start production server
```

### Frontend Scripts
```bash
cd frontend
npm run dev            # Start Vite dev server
npm run dev:watch      # Start with nodemon (auto-restart)
npm run build          # Build for production
npm run preview        # Preview production build
```

## 🔄 How Auto-Restart Works

### Backend
1. **nodemon** watches for file changes in `src/` directory
2. When a `.ts`, `.js`, or `.json` file is saved, nodemon restarts the server
3. **ts-node** compiles TypeScript on-the-fly
4. Server restarts with new changes in ~500ms

### Frontend
1. **Vite** provides Hot Module Replacement (HMR) for instant updates
2. **nodemon** watches for config file changes and restarts the dev server
3. Most changes are reflected instantly without full page reload
4. Config changes trigger a full server restart

## 🛠️ Troubleshooting

### Common Issues

**Port Already in Use:**
```bash
# Kill processes on ports 3000 and 5000
lsof -ti:3000 | xargs kill -9
lsof -ti:5000 | xargs kill -9
```

**Node Modules Issues:**
```bash
# Clean install all dependencies
npm run clean
npm run setup
```

**TypeScript Compilation Errors:**
```bash
# Check TypeScript config
cd backend && npx tsc --noEmit
cd frontend && npx tsc --noEmit
```

### Manual Restart
- Type `rs` in any terminal running nodemon to manually restart
- Press `Ctrl+C` to stop servers
- Use `npm run dev:watch` to restart both servers

## 📊 Development Features

### Backend Features
- ✅ Auto-restart on file changes
- ✅ TypeScript compilation
- ✅ Environment variable watching
- ✅ Verbose logging
- ✅ Colored output

### Frontend Features
- ✅ Hot Module Replacement
- ✅ Fast refresh for React components
- ✅ TypeScript support
- ✅ Tailwind CSS with auto-reload
- ✅ Proxy to backend API

## 🔍 Monitoring

Both servers provide detailed logging:
- **Backend**: Shows file changes, restart events, and server status
- **Frontend**: Shows HMR updates, build status, and dev server info

## 📚 Additional Resources

- [Vite Documentation](https://vitejs.dev/)
- [nodemon Documentation](https://nodemon.io/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [React Documentation](https://react.dev/)