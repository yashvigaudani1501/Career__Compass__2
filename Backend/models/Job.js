const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Links this job to the Company that posted it
        required: true
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    requiredSkills: { type: [String], required: true }, // e.g., ["Python", "React", "Node"]
    location: { type: String, required: true },
    salary: { type: String, default: 'Not Disclosed' },
    experienceLevel: { type: String, required: true }, // e.g., "Entry Level", "Mid Level"
    isActive: { type: Boolean, default: true } // Admin or Company can close the job later
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);