const Job = require('../models/Job');
const JobApplication = require('../models/JobApplication');

const postJob = async (req, res) => {
    const { title, description, requiredSkills, location, salary, experienceLevel } = req.body;

    try {
        const job = await Job.create({
            company: req.user._id, 
            title,
            description,
            requiredSkills,
            location,
            salary,
            experienceLevel
        });

        res.status(201).json({ message: 'Job posted successfully', job });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// --- NEW: Fetch only jobs posted by this specific company ---
const getMyJobs = async (req, res) => {
    try {
        // Find jobs where the company ID matches the logged-in user's ID
        const jobs = await Job.find({ company: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json({ jobs });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getApplicants = async (req, res) => {
    const { jobId } = req.params;

    try {
        const job = await Job.findById(jobId);
        if (!job) return res.status(404).json({ message: 'Job not found' });
        
        if (job.company.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to view these applicants' });
        }

        const applications = await JobApplication.find({ job: jobId })
            .populate('applicant', 'name email profession profileImage') 
            .populate('resumeData', 'atsScore extractedSkills resumePath aiSuggestedJobs') 
            .sort({ 'resumeData.atsScore': -1 }); // Sorts by Highest AI Score!

        res.status(200).json({
            jobTitle: job.title,
            totalApplicants: applications.length,
            applications
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Don't forget to export the new getMyJobs function!
module.exports = { postJob, getApplicants, getMyJobs }; 