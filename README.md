# Degader Social Platform V2

> Enterprise-grade social collaboration platform with real-time communication and meeting management

[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38bdf8.svg)](https://tailwindcss.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.x-black.svg)](https://socket.io/)
[![License](https://img.shields.io/badge/License-Proprietary-red.svg)]()

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Recent Updates](#recent-updates)
- [Installation](#installation)
- [Development](#development)
- [Testing](#testing)

---

## 🎯 Overview

Degader Social Platform V2 is a modern, enterprise-ready social collaboration platform designed for organizations seeking secure, real-time communication and meeting management solutions. Built with cutting-edge technologies, it provides seamless user experiences across all devices.

### Mission

To provide organizations with a comprehensive, scalable, and intuitive platform for team collaboration, real-time communication, and efficient meeting management.

---

## ✨ Key Features

### 🎥 Meeting Management System
A comprehensive meeting orchestration platform with real-time synchronization and intelligent state management.

#### Features:
- **Real-time Synchronization**: Instant updates across all participants using Socket.IO
- **Smart Status Management**: Automated state transitions (upcoming → in-progress → completed)
- **Multi-view Interface**:
  - **List View**: Sorted display with in-progress meetings prioritized
  - **Calendar View**: Visual monthly overview with color-coded states
  - **History View**: Archive of past and cancelled meetings
- **Intelligent Notifications**: Push notifications for:
  - Meeting invitations
  - Status changes
  - Reminders (30 minutes before start)
  - Cancellations
- **Meeting States**:
  - `upcoming`: Scheduled meetings
  - `in-progress`: Currently active meetings (auto-detected)
  - `completed`: Finished meetings (auto-archived)
  - `cancelled`: User-cancelled meetings

#### Calendar Color System:
- 🟢 **Green**: Meetings in progress
- 🔵 **Blue**: Upcoming meetings
- ⚫ **Gray/Slate**: Completed meetings
- 🔴 **Red**: Cancelled meetings

#### Technical Highlights:
- **Optimistic UI Updates**: Instant feedback with server reconciliation
- **Smart Filtering**: Dynamic filtering by status with priority sorting
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop
- **Accessibility**: WCAG 2.1 AA compliant
- **Performance**: Virtualized lists for large datasets

### 📬 Real-time Notifications System
Enterprise-grade notification infrastructure with Socket.IO integration.

#### Features:
- Real-time push notifications
- Notification persistence
- Read/unread state management
- Click-to-action navigation
- Deep-linking to specific content

### 👥 User Management
- User search and selection
- Profile management
- Friend connections
- Activity tracking

### 💬 Messaging System
- Real-time chat
- Thread management
- Message history
- Online/offline status

---

## 🏗️ Architecture

### Frontend Architecture

```
src/
├── features/                    # Feature-based architecture
│   ├── reuniones/              # Meeting management module
│   │   ├── components/         # React components
│   │   │   ├── CalendarView.jsx
│   │   │   ├── MeetingCard.jsx
│   │   │   ├── MeetingViewToggle.jsx
│   │   │   └── CreateMeetingModal.jsx
│   │   ├── hooks/              # Custom React hooks
│   │   │   ├── useMeetings.js
│   │   │   └── useUserSearch.js
│   │   ├── pages/              # Page components
│   │   │   └── ReunionesPage.jsx
│   │   └── services/           # API services
│   │       └── meetingService.js
│   ├── notificaciones/         # Notifications module
│   ├── mensajes/               # Messaging module
│   └── amigos/                 # Friends module
├── shared/                     # Shared resources
│   ├── components/            # Reusable components
│   ├── hooks/                 # Shared hooks
│   ├── lib/                   # Utilities
│   │   └── socket.js          # Socket.IO singleton
│   └── styles/                # Global styles
└── context/                   # React Context providers
    └── AuthContext.jsx
```

### State Management Strategy

1. **Local State**: Component-specific state using `useState`
2. **Server State**: React hooks with Socket.IO for real-time sync
3. **Global State**: React Context for authentication and user data
4. **Optimistic Updates**: Immediate UI feedback with background sync

### Real-time Communication Flow

```
Client A                 Socket.IO Server              Client B
   |                           |                         |
   |------- createMeeting ---->|                         |
   |                           |---- meetingUpdate ----->|
   |<---- meetingUpdate -------|                         |
   |                           |                         |
   |<---- notification --------|---- notification ------>|
```

---

## 🛠️ Technology Stack

### Core Technologies
- **React 18.x**: UI framework with concurrent features
- **Tailwind CSS 3.x**: Utility-first CSS framework
- **Socket.IO Client 4.x**: Real-time bidirectional communication
- **React Router 6.x**: Client-side routing
- **Axios**: HTTP client with interceptors

### Development Tools
- **Vite**: Next-generation frontend tooling
- **ESLint**: Code linting and quality
- **Prettier**: Code formatting
- **Lucide React**: Modern icon library

### UI/UX Libraries
- **date-fns**: Date manipulation and formatting
- **clsx**: Conditional className utility
- **Tailwind Forms**: Beautiful form styling

---

## 🚀 Recent Updates

### Version 2.1.0 - Meeting Management System (Latest)

#### 🎉 New Features

**Meeting Management Module**
- ✅ Complete meeting lifecycle management
- ✅ Real-time synchronization across users
- ✅ Three-view system (List, Calendar, History)
- ✅ Automated state transitions based on time
- ✅ Smart notification system with deep-linking
- ✅ Color-coded calendar with state visualization
- ✅ Meeting creation with participant selection
- ✅ Meeting cancellation (creator-only)
- ✅ Responsive design (mobile, tablet, desktop)

**Technical Improvements**
- ✅ Socket.IO integration with room-based subscriptions
- ✅ Optimized React hooks with dependency management
- ✅ Context-aware authentication
- ✅ Custom scrollbar styling
- ✅ Modal z-index layering fixes
- ✅ Notification metadata for meeting events

#### 🔧 Bug Fixes
- Fixed duplicate meeting cards on real-time creation
- Resolved Socket.IO userId availability issues
- Fixed React "Expected static flag" error
- Corrected navigation routing to `/Mis_reuniones`
- Fixed modal overlay positioning issues
- Resolved double-scroll problem in CreateMeetingModal
- Fixed cancel button visibility for meeting creators

#### 📊 Performance Enhancements
- Primitive dependency tracking for React effects
- Debounced user search (500ms)
- Memoized calendar day calculations
- Optimized socket event listeners
- Reduced re-renders with `useCallback`

#### 🎨 UI/UX Improvements
- Professional calendar color scheme
- Smooth scroll-to-meeting from notifications
- Visual highlight effect on navigation
- Hidden scrollbars with maintained functionality
- Fixed modal positioning above navbar
- Responsive breakpoints for all screen sizes

---

## 📦 Installation

### Prerequisites
- Node.js >= 16.x
- npm >= 8.x or yarn >= 1.22.x
- Backend API running on configured port

### Setup

```bash
# Clone the repository
git clone <repository-url>
cd DegaderSocialFrontV2

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Configure environment variables
# Edit .env with your settings:
# VITE_API_URL=http://localhost:5000
# VITE_SOCKET_URL=http://localhost:5000

# Start development server
npm run dev
```

### Environment Variables

```env
VITE_API_URL=<backend-api-url>
VITE_SOCKET_URL=<socket-server-url>
```

---

## 👨‍💻 Development

### Available Scripts

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Format code
npm run format
```

### Code Style Guidelines

This project follows enterprise-level coding standards:

1. **Component Structure**:
   - Functional components with hooks
   - PropTypes or TypeScript for type safety
   - Co-located styles and tests

2. **Naming Conventions**:
   - PascalCase for components
   - camelCase for functions and variables
   - UPPER_CASE for constants

3. **File Organization**:
   - Feature-based folder structure
   - Index files for clean imports
   - Separate concerns (components, hooks, services)

4. **Performance Best Practices**:
   - Use `React.memo` for expensive components
   - Implement code splitting with lazy loading
   - Optimize re-renders with `useMemo` and `useCallback`

---

## 🧪 Testing

### Testing Strategy

```bash
# Run unit tests
npm run test

# Run integration tests
npm run test:integration

# Run e2e tests
npm run test:e2e

# Generate coverage report
npm run test:coverage
```

### Test Coverage Goals
- Unit Tests: > 80%
- Integration Tests: > 70%
- E2E Tests: Critical user flows

---

## 📝 API Integration

### Meeting Endpoints

```javascript
// Get user's meetings
GET /api/meetings/my-meetings

// Create meeting
POST /api/meetings
{
  "title": "Meeting Title",
  "description": "Description",
  "date": "2025-01-20T10:00:00Z",
  "time": "10:00",
  "duration": "1 hora",
  "type": "administrative",
  "meetLink": "https://meet.google.com/xxx",
  "attendees": ["userId1", "userId2"]
}

// Cancel meeting
DELETE /api/meetings/:id

// Join meeting
POST /api/meetings/:id/join
```

### Socket.IO Events

```javascript
// Subscribe to meeting updates
socket.emit('subscribeMeetings', { userId });

// Listen for updates
socket.on('meetingUpdate', ({ type, meeting }) => {
  // type: 'create' | 'update' | 'cancel' | 'statusChange'
});

// Unsubscribe
socket.emit('unsubscribeMeetings', { userId });
```

---

## 🔐 Security

- JWT-based authentication
- HTTP-only cookies for session management
- CORS protection
- Input validation and sanitization
- SQL injection prevention
- XSS protection

---

## 🚢 Deployment

### Production Build

```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

### Environment-specific Builds

```bash
# Staging
npm run build:staging

# Production
npm run build:production
```

---

## 📄 License

Proprietary - All rights reserved

---

## 👥 Contributors

This project is developed and maintained by the Degader development team.

---

## 📞 Support

For technical support or questions:
- Email: support@degader.com
- Documentation: [Internal Wiki]
- Issue Tracker: [Internal JIRA]

---

## 🗺️ Roadmap

### Q1 2025
- [ ] Video conferencing integration
- [ ] Meeting recordings
- [ ] Advanced analytics dashboard
- [ ] Mobile native apps (iOS/Android)

### Q2 2025
- [ ] AI-powered meeting summaries
- [ ] Calendar integrations (Google, Outlook)
- [ ] Automated meeting transcriptions
- [ ] Enhanced security features

---

**Last Updated**: January 2025
**Version**: 2.1.0
**Status**: Production Ready ✅
