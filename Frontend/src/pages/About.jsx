import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FaRobot, 
  FaUserTie, 
  FaBuilding, 
  FaBrain, 
  FaFileAlt, 
  FaSearch, 
  FaArrowRight 
} from 'react-icons/fa';

export default function About() {
  // Framer Motion Animation Variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-hidden font-sans text-gray-900">
      
      {/* 1. Hero Section */}
      <section className="relative pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[500px] bg-blue-400 rounded-full mix-blend-multiply filter blur-[120px] opacity-20 pointer-events-none"></div>
        
        <motion.div 
          className="relative max-w-5xl mx-auto text-center"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 text-blue-700 font-semibold text-sm mb-6 border border-blue-100 shadow-sm">
            <FaBrain className="mr-2" /> REVOLUTIONIZING HIRING
          </motion.div>
          <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
            Bridging the gap between <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-400">
              Talent & Algorithms
            </span>
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            The modern job market is controlled by bots. We built ATS Tracker to give candidates the AI tools they need to beat the filters, while providing companies with highly qualified, perfectly matched talent.
          </motion.p>
        </motion.div>
      </section>

      {/* 2. The Ecosystem (Roles) */}
      <section className="py-24 bg-white border-y border-gray-200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4">One Platform. Three Perspectives.</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">A seamlessly integrated ecosystem designed for efficiency.</p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-10"
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
          >
            {/* User Role */}
            <motion.div variants={fadeInUp} className="bg-gray-50 rounded-3xl p-10 border border-gray-100 relative overflow-hidden group hover:shadow-xl transition-shadow duration-300">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-2xl mb-6">
                <FaUserTie />
              </div>
              <h3 className="text-2xl font-bold mb-3">For Candidates</h3>
              <p className="text-gray-600 leading-relaxed">
                Build professional resumes, analyze them instantly against industry ATS standards, discover missing skills, and 1-click apply to perfectly matched roles.
              </p>
            </motion.div>

            {/* Company Role */}
            <motion.div variants={fadeInUp} className="bg-gray-50 rounded-3xl p-10 border border-gray-100 relative overflow-hidden group hover:shadow-xl transition-shadow duration-300">
              <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center text-2xl mb-6">
                <FaBuilding />
              </div>
              <h3 className="text-2xl font-bold mb-3">For Companies</h3>
              <p className="text-gray-600 leading-relaxed">
                Post active job listings and instantly view applicants sorted by their AI-calculated ATS match score. Stop reading bad resumes and focus on top talent.
              </p>
            </motion.div>

            {/* Admin Role */}
            <motion.div variants={fadeInUp} className="bg-gray-50 rounded-3xl p-10 border border-gray-100 relative overflow-hidden group hover:shadow-xl transition-shadow duration-300">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl mb-6">
                <FaSearch />
              </div>
              <h3 className="text-2xl font-bold mb-3">For Admins</h3>
              <p className="text-gray-600 leading-relaxed">
                Maintain platform integrity. Register new verified companies simply by providing their website URL, while our AI automatically scrapes and builds their profile.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 3. The Tech / ML Brain */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <motion.div 
            className="w-full lg:w-1/2"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gray-800 text-gray-300 font-semibold text-sm mb-6 border border-gray-700">
              <FaRobot className="mr-2 text-sky-400" /> POWERED BY GROQ & LLAMA 3.1
            </div>
            <h2 className="text-4xl font-bold mb-6 leading-tight">
              The "AI Brain" Behind <br/> The Magic
            </h2>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              Our platform doesn't just look for exact keyword matches. We utilize a stateless Django Microservice powered by the blazing-fast Groq AI API.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <FaFileAlt className="text-sky-400 mt-1 text-xl flex-shrink-0" />
                <span className="text-gray-300"><strong className="text-white">Smart PDF Extraction:</strong> Bypasses complex styling to read the true content of your resume.</span>
              </li>
              <li className="flex items-start gap-3">
                <FaSearch className="text-sky-400 mt-1 text-xl flex-shrink-0" />
                <span className="text-gray-300"><strong className="text-white">Web Scraping:</strong> Automatically reads and summarizes company websites during registration.</span>
              </li>
              <li className="flex items-start gap-3">
                <FaBrain className="text-sky-400 mt-1 text-xl flex-shrink-0" />
                <span className="text-gray-300"><strong className="text-white">Contextual Analysis:</strong> Understands the context of your experience, not just buzzwords.</span>
              </li>
            </ul>
          </motion.div>
          
          {/* Abstract Tech Visual */}
          <motion.div 
            className="w-full lg:w-1/2 relative"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-sky-400 rounded-full blur-3xl opacity-30 animate-pulse"></div>
            <div className="relative bg-gray-800 border border-gray-700 rounded-3xl p-8 shadow-2xl">
               <div className="flex gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
               </div>
               <pre className="text-sm text-sky-300 font-mono overflow-x-auto whitespace-pre-wrap">
                 <code>
{`{
  "status": "success",
  "microservice": "Django REST",
  "llm_model": "llama-3.1-8b-instant",
  "task": "analyze_resume",
  "result": {
    "ats_score": 88,
    "skills_extracted": ["React", "Python", "Docker"],
    "verdict": "Highly competitive candidate."
  }
}`}
                 </code>
               </pre>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 text-center bg-gray-50">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Ready to beat the filters?</h2>
          <p className="text-xl text-gray-600 mb-10">
            Join today. Build your resume, check your score, and land your dream job.
          </p>
          <Link to="/register" className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-blue-600 rounded-full hover:bg-blue-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            Create Free Account <FaArrowRight className="ml-2" />
          </Link>
        </motion.div>
      </section>

    </div>
  );
}