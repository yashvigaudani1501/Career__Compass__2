const User = require('../models/User');
const Job = require('../models/Job');
const UserResume = require('../models/UserResume');
const JobApplication = require('../models/JobApplication');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

// --- NEW: Get User Profile ---
const getUserProfile = async (req, res) => {
    try {
        // Fetch user by ID (exclude the password from the response)
        const user = await User.findById(req.user._id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json({ profile: user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const updateProfile = async (req, res) => {
    const { profession, skills, description, profileImage } = req.body;
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.profession = profession || user.profession;
        user.skills = skills || user.skills;
        user.description = description || user.description;
        user.profileImage = profileImage || user.profileImage;

        const updatedUser = await user.save();
        res.json({ message: "Profile updated successfully", profile: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ isActive: true }).populate('company', 'name email');
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const uploadResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a resume (PDF)' });
        }

        let userResume = await UserResume.findOne({ userId: req.user._id });
        if (!userResume) {
            userResume = new UserResume({ userId: req.user._id });
        }
        userResume.resumePath = req.file.path;
        await userResume.save();

        const formData = new FormData();
        formData.append('resume', fs.createReadStream(req.file.path));

        try {
            const djangoResponse = await axios.post(`${process.env.ML_URL}/api/process-resume/`, formData, {
                headers: { ...formData.getHeaders() },
            });

            const aiData = djangoResponse.data;
            userResume.atsScore = aiData.ats_score;
            userResume.extractedSkills = aiData.extracted_skills;
            userResume.aiSuggestedJobs = aiData.suggested_jobs;
            
            await userResume.save();

            res.status(200).json({
                message: 'Resume analyzed successfully by AI!',
                data: userResume
            });

        } catch (mlError) {
            console.error("Django ML Error:", mlError.message);
            return res.status(500).json({ 
                message: 'Resume saved, but AI analysis failed. Is Django running?',
                error: mlError.message 
            });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const applyForJob = async (req, res) => {
    const { jobId } = req.params;

    try {
        const job = await Job.findById(jobId);
        if (!job) return res.status(404).json({ message: 'Job not found' });

        const userResume = await UserResume.findOne({ userId: req.user._id });
        if (!userResume || !userResume.atsScore) {
            return res.status(400).json({ message: 'Please upload and analyze your resume before applying.' });
        }

        const existingApplication = await JobApplication.findOne({ job: jobId, applicant: req.user._id });
        if (existingApplication) {
            return res.status(400).json({ message: 'You have already applied for this job.' });
        }

        const application = await JobApplication.create({
            job: jobId,
            applicant: req.user._id,
            resumeData: userResume._id
        });

        res.status(201).json({
            message: 'Successfully applied for the job!',
            application
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Export the new getUserProfile function alongside the others
module.exports = { getUserProfile, updateProfile, getJobs, uploadResume, applyForJob };