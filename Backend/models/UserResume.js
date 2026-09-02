const mongoose = require('mongoose');

const userResumeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true // One active resume analysis per user
    },
    resumePath: {
        type: String, // Where Multer saved the PDF
        required: true
    },
    atsScore: {
        type: Number,
        default: null // Will be filled by Django ML
    },
    extractedSkills: {
        type: [String],
        default: [] // Will be filled by Django ML
    },
    aiSuggestedJobs: {
        type: Array,
        default: [] // Groq API will return job suggestions here
    }
}, { timestamps: true });

module.exports = mongoose.model('UserResume', userResumeSchema);