const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    // --- 1. Basic Auth Fields (Required for Registration) ---
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    
    // --- 2. System Role ---
    role: { 
        type: String, 
        enum: ['USER', 'COMPANY', 'ADMIN'], 
        default: 'USER' 
    },

    // --- 3. User Profile Fields (Filled later via Profile Update) ---
    profession: { type: String, default: "" }, 
    skills: { type: [String], default: [] },   
    description: { type: String, default: "" },
    profileImage: { type: String, default: "" }, 

}, { timestamps: true });

// Hash password before saving (FIXED FOR MONGOOSE 8+)
userSchema.pre('save', async function () {
    // If the password was NOT modified (like when updating a profile), just return!
    if (!this.isModified('password')) {
        return; 
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);