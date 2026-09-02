import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // <--- ADDED ROUTER IMPORTS
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import { 
  FaBriefcase, 
  FaCheckCircle, 
  FaLightbulb, 
  FaEdit, 
  FaTimes, 
  FaSpinner,
  FaImage,
  FaCode,
  FaAlignLeft,
  FaUpload
} from 'react-icons/fa';

export default function UserDashboard() {
  const { user } = useContext(AuthContext);
  const location = useLocation(); // <--- ADDED HOOK
  const navigate = useNavigate(); // <--- ADDED HOOK

  // --- LOCAL STATE FOR DISPLAY ---
  const [displayUser, setDisplayUser] = useState(user);

  // --- EDIT PROFILE STATE ---
  const [isEditing, setIsEditing] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  // Initialize form with existing user data
  const [profileForm, setProfileForm] = useState({
    profession: user?.profession || '',
    skills: user?.skills && Array.isArray(user.skills) ? user.skills.join(', ') : '', 
    description: user?.description || '',
    profileImage: user?.profileImage || ''
  });

  // --- RESUME UPLOAD & AI INSIGHTS STATE ---
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState({ type: '', text: '' });
  const [aiInsights, setAiInsights] = useState(null);

  // --- NEW: LISTEN FOR NAVBAR "EDIT PROFILE" CLICK ---
  useEffect(() => {
    if (location.state?.openEdit) {
      setIsEditing(true); // Open the modal
      
      // Clear the history state so a normal page refresh doesn't trigger the modal again!
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  // --- FETCH LATEST PROFILE ON MOUNT ---
  useEffect(() => {
    const fetchLatestProfile = async () => {
      try {
        const response = await API.get('/user/profile'); 
        
        if (response.data && response.data.profile) {
          const fetchedUser = response.data.profile;
          
          setDisplayUser(fetchedUser);
          
          setProfileForm({
            profession: fetchedUser.profession || '',
            skills: fetchedUser.skills && Array.isArray(fetchedUser.skills) 
                      ? fetchedUser.skills.join(', ') 
                      : (fetchedUser.skills || ''),
            description: fetchedUser.description || '',
            profileImage: fetchedUser.profileImage || ''
          });

          localStorage.setItem('user', JSON.stringify(fetchedUser));
        }
      } catch (error) {
        console.error("Error fetching latest profile:", error);
      }
    };

    fetchLatestProfile();
  }, []);

  const handleProfileChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoadingProfile(true);
    setMsg({ type: '', text: '' });

    try {
      const skillsArray = profileForm.skills.split(',').map(skill => skill.trim()).filter(Boolean);

      const payload = {
        ...profileForm,
        skills: skillsArray
      };

      const response = await API.put('/user/profile', payload);

      setMsg({ type: 'success', text: 'Profile updated successfully!' });

      const updatedUser = { ...displayUser, ...payload, skills: skillsArray };
      setDisplayUser(updatedUser);
      
      localStorage.setItem('user', JSON.stringify(updatedUser));

      setTimeout(() => {
        setIsEditing(false);
      }, 1000);

    } catch (err) {
      console.error("Profile update failed:", err);
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update profile.' });
    } finally {
      setLoadingProfile(false);
    }
  };

  // --- RESUME UPLOAD HANDLERS ---
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setUploadStatus({ type: '', text: '' });
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      setUploadStatus({ type: 'error', text: 'Please select a PDF file first.' });
      return;
    }

    const formData = new FormData();
    formData.append('resume', selectedFile);

    setIsUploading(true);
    setUploadStatus({ type: '', text: '' });
    setAiInsights(null);

    try {
      const response = await API.post('/user/upload-resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setUploadStatus({ type: 'success', text: 'Resume uploaded and analyzed successfully!' });
      
      const resultData = response.data.data;
      
      setAiInsights({
        skills: resultData?.extractedSkills || [],
        jobs: resultData?.aiSuggestedJobs || [],
        atsScore: resultData?.atsScore || 0
      });

    } catch (err) {
      console.error("File upload failed:", err);
      setUploadStatus({ 
        type: 'error', 
        text: err.response?.data?.message || err.response?.data?.error || 'Failed to upload and analyze resume.' 
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header - (Kept the Edit Button Here!) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-6">
            <img 
              src={displayUser?.profileImage || `https://ui-avatars.com/api/?name=${displayUser?.name}&background=2563EB&color=fff`} 
              alt="Profile" 
              className="w-20 h-20 rounded-full object-cover border-4 border-blue-50 shadow-sm"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome back, {displayUser?.name} 👋</h1>
              <p className="text-blue-600 font-semibold mt-1">
                {displayUser?.profession || 'Update your profile to add your profession'}
              </p>
              <p className="text-gray-500 mt-1 text-sm">{displayUser?.description || 'Here is your latest resume analysis and activity.'}</p>
            </div>
          </div>
          {/* THE DASHBOARD EDIT BUTTON IS STILL HERE */}
          <button 
            onClick={() => setIsEditing(true)}
            className="mt-6 md:mt-0 px-6 py-3 bg-blue-50 text-blue-700 font-bold rounded-xl hover:bg-blue-100 transition-colors flex items-center gap-2"
          >
            <FaEdit /> Edit Profile
          </button>
        </div>

        {/* --- EDIT PROFILE MODAL --- */}
        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
              
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h2 className="text-2xl font-bold text-gray-900">Edit Your Profile</h2>
                <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-red-500 transition-colors p-2 bg-white rounded-full shadow-sm">
                  <FaTimes className="text-xl" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto">
                {msg.text && (
                  <div className={`p-4 mb-6 rounded-xl flex items-center gap-3 font-medium border ${msg.type === 'success' ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
                    {msg.type === 'success' && <FaCheckCircle className="text-xl" />}
                    {msg.text}
                  </div>
                )}

                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Profession / Title</label>
                    <div className="relative">
                      <FaBriefcase className="absolute left-4 top-4 text-gray-400" />
                      <input type="text" name="profession" value={profileForm.profession} onChange={handleProfileChange} placeholder="e.g. Frontend Developer" className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Top Skills (Comma Separated)</label>
                    <div className="relative">
                      <FaCode className="absolute left-4 top-4 text-gray-400" />
                      <input type="text" name="skills" value={profileForm.skills} onChange={handleProfileChange} placeholder="e.g. React, JavaScript, HTML" className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">About Me / Description</label>
                    <div className="relative">
                      <FaAlignLeft className="absolute left-4 top-4 text-gray-400" />
                      <textarea name="description" value={profileForm.description} onChange={handleProfileChange} placeholder="Passionate UI developer building modern web apps..." className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl h-24 focus:ring-2 focus:ring-blue-500 outline-none transition"></textarea>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Profile Image URL</label>
                    <div className="relative">
                      <FaImage className="absolute left-4 top-4 text-gray-400" />
                      <input type="url" name="profileImage" value={profileForm.profileImage} onChange={handleProfileChange} placeholder="https://i.postimg.cc/test.jpg" className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" />
                    </div>
                  </div>

                  <button type="submit" disabled={loadingProfile} className="w-full py-4 mt-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg disabled:opacity-70 flex justify-center items-center gap-2 transition-all">
                    {loadingProfile ? <FaSpinner className="animate-spin text-xl" /> : <FaCheckCircle />} Save Profile
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- RESUME UPLOAD CARD --- */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Upload Resume</h2>
            <p className="text-sm text-gray-500 mb-6">Upload your latest PDF resume to get AI extracted insights.</p>
            
            <div className="w-full flex flex-col items-center gap-4">
              <label className="w-full flex flex-col items-center px-4 py-8 bg-gray-50 text-blue-500 rounded-2xl border-2 border-dashed border-blue-200 cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors">
                <FaUpload className="text-3xl mb-3 text-blue-400" />
                <span className="text-sm font-semibold text-gray-600">
                  {selectedFile ? selectedFile.name : 'Click to select PDF file'}
                </span>
                <input 
                  type="file" 
                  accept=".pdf" 
                  className="hidden" 
                  onChange={handleFileChange} 
                />
              </label>

              {uploadStatus.text && (
                <div className={`text-sm font-medium w-full p-3 rounded-lg flex items-center justify-center gap-2 ${uploadStatus.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {uploadStatus.type === 'success' ? <FaCheckCircle /> : <FaTimes />}
                  {uploadStatus.text}
                </div>
              )}

              <button 
                onClick={handleFileUpload} 
                disabled={isUploading || !selectedFile}
                className="w-full py-3 mt-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 transition-all"
              >
                {isUploading ? <FaSpinner className="animate-spin text-xl" /> : <FaCheckCircle />} 
                {isUploading ? 'Analyzing Resume...' : 'Upload & Analyze'}
              </button>
            </div>
          </div>

          {/* --- AI RESUME EVALUATION RESULTS CARD --- */}
          <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <FaLightbulb className="text-yellow-400"/> AI Resume Evaluation Results
              </h2>
              {/* Added a small badge to show the ATS score if available */}
              {aiInsights && aiInsights.atsScore > 0 && (
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-extrabold tracking-wide">
                  ATS Score: {aiInsights.atsScore}
                </span>
              )}
            </div>
            
            {!aiInsights ? (
              // Empty State Before Uploading
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400 py-10">
                <FaLightbulb className="text-5xl mb-4 text-gray-200" />
                <p className="text-center font-medium">Upload your resume on the left to see <br/> AI extracted skills and job matches here.</p>
              </div>
            ) : (
              // Populated State After Uploading
              <div className="animate-fade-in">
                <div className="mb-8">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Extracted Skills</h3>
                  {aiInsights.skills?.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {aiInsights.skills.map((skill, idx) => (
                        <span key={idx} className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium border border-blue-100 shadow-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No specific skills detected.</p>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Recommended Job Roles</h3>
                  {aiInsights.jobs?.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                      {aiInsights.jobs.map((job, idx) => (
                        <div key={idx} className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 text-gray-800 font-medium shadow-sm">
                          <FaBriefcase className="text-purple-400" /> {job}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">Not enough data to suggest jobs.</p>
                  )}
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Application Tracker */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Recent Applications</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 text-sm">
                  <th className="pb-4 font-semibold">Company</th>
                  <th className="pb-4 font-semibold">Role</th>
                  <th className="pb-4 font-semibold">Date Applied</th>
                  <th className="pb-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="text-gray-800">
                <tr className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="py-4 font-medium">Stripe</td>
                  <td className="py-4 text-gray-600">Frontend Developer</td>
                  <td className="py-4 text-gray-500">Oct 24, 2023</td>
                  <td className="py-4"><span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">Pending</span></td>
                </tr>
                <tr className="hover:bg-gray-50 transition">
                  <td className="py-4 font-medium">Google</td>
                  <td className="py-4 text-gray-600">Full Stack Engineer</td>
                  <td className="py-4 text-gray-500">Oct 20, 2023</td>
                  <td className="py-4"><span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">Reviewed</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
}