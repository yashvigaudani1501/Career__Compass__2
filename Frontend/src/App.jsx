import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Navbar from './components/Navbar';
import Welcome from './pages/Welcome';
import Auth from './pages/Auth';
import UserDashboard from './pages/UserDashboard'; // <-- IMPORT NEW
import Jobs from './pages/Jobs'; // <-- IMPORT NEW
import AtsCheck from './pages/AtsCheck';
import ResumeBuilder from './pages/ResumeBuilder';
import About from './pages/About';
import AdminDashboard from './pages/AdminDashboard';
import CompanyDashboard from './pages/CompanyDashboard';

const Placeholder = ({ title }) => (
  <div className="min-h-[calc(100vh-64px)] flex items-center justify-center text-3xl font-bold text-gray-400">
    {title} Page Coming Soon
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 selection:bg-blue-200 selection:text-blue-900">
          <Navbar />
          
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/register" element={<Auth />} />
            <Route path="/jobs" element={<Jobs />} /> {/* <-- NEW ROUTE */}
            
            <Route path="/user/dashboard" element={<UserDashboard />} /> {/* <-- NEW DASHBOARD */}
             <Route path="/checker" element={<AtsCheck />} /> 
             <Route path="/builder" element={<ResumeBuilder />} />
             <Route path="/about" element={<About />} />
            
            <Route path="/about" element={<Placeholder title="About" />} />
            <Route path="/checker" element={<Placeholder title="ATS Checker" />} />
            <Route path="/builder" element={<Placeholder title="Resume Builder" />} />
            
            <Route path="/company/dashboard" element={<CompanyDashboard />} />

            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;