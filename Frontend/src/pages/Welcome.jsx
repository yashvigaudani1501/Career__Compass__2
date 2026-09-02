import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaQuoteLeft, FaFilePdf, FaRobot, FaCheckCircle } from 'react-icons/fa';

// --- Components for FAQ Accordion ---
const AccordionIcon = ({ isOpen }) => (
  <svg className={`w-6 h-6 text-gray-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const AccordionItem = ({ item, isOpen, onClick }) => (
  <div className="border-b border-gray-200 last:border-b-0">
    <button className="w-full flex justify-between items-center text-left py-5 px-6 focus:outline-none hover:bg-gray-50 transition-colors duration-200" onClick={onClick}>
      <span className="text-lg font-medium text-gray-900">{item.question}</span>
      <AccordionIcon isOpen={isOpen} />
    </button>
    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-screen" : "max-h-0"}`}>
      <div className="p-6 pt-0 text-gray-600 leading-relaxed">
        <p>{item.answer}</p>
      </div>
    </div>
  </div>
);

// --- Main Welcome Page Component ---
export default function Welcome() {
  const [isVisible, setIsVisible] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const faqs = [
    { question: "How does the ATS score work?", answer: "Our system uses Groq AI (Llama 3.1) to deeply analyze your resume against industry standards, looking for keywords, formatting clarity, and essential skills to calculate a precise 0-100 score." },
    { question: "Can I build a resume from scratch?", answer: "Yes! We offer a built-in Resume Builder with 5 professional, ATS-friendly templates. You can edit every section and instantly download it as a PDF." },
    { question: "Is my resume data safe?", answer: "Absolutely. We only use your resume data to calculate your score and match you with relevant job postings. We do not sell your personal data." },
    { question: "Can companies post jobs here?", answer: "Yes! Verified companies can create profiles, post jobs, and easily filter through applicants based on our AI-generated ATS scores." }
  ];

  const reviews = [
    { name: "Sarah Jenkins", role: "Software Engineer", text: "This tool changed everything. My ATS score was initially a 45. After using the suggestions, I bumped it to 88 and landed 3 interviews in a week!", rating: 5 },
    { name: "Michael Chang", role: "Product Manager", text: "The Resume Builder templates are clean and professional. The AI job suggestions actually matched my exact skill set.", rating: 5 },
    { name: "Emily Davis", role: "UX Designer", text: "I love how it analyzes the company before I apply. The insights feature saved me hours of research.", rating: 4 },
  ];

  return (
    <div className="font-sans min-h-screen bg-gray-50 overflow-hidden">
      
      {/* 1. Hero Section */}
      <section className="py-12 sm:py-20 px-4 transition-colors duration-300 relative">
        <div className="max-w-7xl mx-auto">
          {/* Text Content */}
          <div className={`text-center mb-12 transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold tracking-wide mb-6 shadow-sm border border-blue-200">
              <FaRobot className="mr-2" /> POWERED BY GROQ AI
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 mt-2 mb-6 leading-tight tracking-tight">
              Beat the algorithms with <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-400">CareerCompass</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              Upload your resume, uncover missing keywords, get instant AI feedback, and match seamlessly with top company job postings.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/register" className="px-8 py-4 bg-gray-900 text-white rounded-xl font-medium text-lg hover:bg-gray-800 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                Start Tracking Free
              </Link>
              <Link to="/builder" className="px-8 py-4 bg-white text-gray-900 border-2 border-gray-200 rounded-xl font-medium text-lg hover:border-gray-300 hover:bg-gray-50 transition-all duration-300">
                Build a Resume
              </Link>
            </div>
          </div>

          {/* Floating Dashboard Preview (Hero Image Alternative) */}
          <div className={`relative max-w-5xl mx-auto px-4 transition-all duration-1000 delay-300 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}>
            {/* Background Glowing Aura */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-200 via-sky-200 to-indigo-300 rounded-3xl transform -rotate-2 scale-105 opacity-50 blur-lg"></div>
            
            {/* UI Mockup Window */}
            <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
              {/* Window Header */}
              <div className="flex items-center px-4 py-3 bg-gray-50 border-b border-gray-200">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="mx-auto bg-white px-4 py-1 rounded-md text-xs font-medium text-gray-500 shadow-sm border border-gray-100">
                  ATS Score Dashboard
                </div>
              </div>
              {/* Dashboard Content Mockup */}
              <div className="p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 bg-gray-50/50">
                <div className="flex-1 space-y-6">
                  <div className="h-8 bg-gray-200 rounded-md w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded-md w-full animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded-md w-5/6 animate-pulse"></div>
                  <div className="flex gap-2 pt-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">React</span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">Node.js</span>
                    <span className="px-3 py-1 bg-gray-200 text-gray-500 rounded-full text-xs font-bold">Python (Missing)</span>
                  </div>
                </div>
                {/* Score Circle Mockup */}
                <div className="relative w-40 h-40 flex items-center justify-center rounded-full border-8 border-gray-100 shadow-inner">
                   <div className="absolute inset-0 rounded-full border-8 border-green-500 border-t-transparent border-r-transparent transform rotate-45"></div>
                   <div className="text-center">
                     <span className="text-4xl font-extrabold text-gray-900">85</span>
                     <p className="text-xs text-gray-500 font-medium">ATS SCORE</p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Testimonials Section */}
      <section className="py-20 bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Loved by Job Seekers</h2>
            <p className="text-gray-600">See how our AI is helping candidates secure their dream roles.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review, idx) => (
              <div key={idx} className="bg-gray-50 p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-1 text-yellow-400 mb-4">
                  {[...Array(review.rating)].map((_, i) => <FaStar key={i} />)}
                </div>
                <FaQuoteLeft className="text-gray-300 text-3xl mb-4" />
                <p className="text-gray-700 mb-6 italic">"{review.text}"</p>
                <div>
                  <h4 className="font-bold text-gray-900">{review.name}</h4>
                  <p className="text-sm text-gray-500">{review.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="flex items-center justify-center p-4">
          <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="p-8 bg-gray-900 text-center">
              <h2 className="text-3xl font-bold text-white mb-2">Frequently Asked Questions</h2>
              <p className="text-gray-400">Everything you need to know about the ATS Tracker.</p>
            </div>
            <div className="divide-y divide-gray-200">
              {faqs.map((item, index) => (
                <AccordionItem 
                  key={index} 
                  item={item} 
                  isOpen={openFaqIndex === index} 
                  onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)} 
                />
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}