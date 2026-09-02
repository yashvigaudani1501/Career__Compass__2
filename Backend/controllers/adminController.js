const User = require('../models/User');
const CompanyProfile = require('../models/CompanyProfile');
const axios = require('axios'); // Needed to talk to Django

const createCompany = async (req, res) => {
    // Notice we accept "website" now, and made work/companyInfo optional fallbacks
    const { name, email, password, location, website, work, companyInfo } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // --- AI SCRAPING LOGIC ---
        let finalWork = work || "";
        let finalCompanyInfo = companyInfo || "";

        if (website) {
            try {
                // Secretly call Django to scrape and summarize the website!
                const djangoRes = await axios.post(`${process.env.ML_URL}/api/scrape-company/`, { website });
                
                finalWork = djangoRes.data.work || finalWork;
                finalCompanyInfo = djangoRes.data.companyInfo || finalCompanyInfo;
            } catch (scrapeError) {
                console.error("AI Scraping failed, proceeding with empty fields:", scrapeError.message);
            }
        }

        // 1. Create the Auth Account
        const user = await User.create({
            name,
            email,
            password,
            role: 'COMPANY'
        });

        // 2. Create the Data in 'companyprofiles' collection with the AI-generated text!
        const companyProfile = await CompanyProfile.create({
            userId: user._id, 
            companyName: name,
            location: location || "",
            work: finalWork,
            companyInfo: finalCompanyInfo
        });

        res.status(201).json({
            message: website ? 'Company created & website analyzed by AI!' : 'Company created successfully',
            authDetails: { id: user._id, name: user.name, email: user.email, role: user.role },
            profileDetails: companyProfile
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { createCompany };