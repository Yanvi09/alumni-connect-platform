import { Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { DirectoryPage } from './pages/DirectoryPage'
import { CommunicationPage } from './pages/CommunicationPage'
import { EventsPage } from './pages/EventsPage'
import { MentorshipPage } from './pages/MentorshipPage'
import { AdminPage } from './pages/AdminPage'
import { SecurityPage } from './pages/SecurityPage'
import { ProfilePage } from './pages/ProfilePage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/directory" element={<DirectoryPage />} />
      <Route path="/communication" element={<CommunicationPage />} />
      <Route path="/events" element={<EventsPage />} />
      <Route path="/mentorship" element={<MentorshipPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/security" element={<SecurityPage />} />
      <Route path="/profile/:id" element={<ProfilePage />} />
    </Routes>
  )
}
