const mongoose = require('mongoose');

const companyProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Links exactly to their login account in the Users collection
        required: true
    },
    companyName: { type: String, required: true },
    work: { type: String, default: "" },
    location: { type: String, default: "" },
    companyInfo: { type: String, default: "" },
}, { timestamps: true });

module.exports = mongoose.model('CompanyProfile', companyProfileSchema);