import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { FaDownload, FaPlus, FaTrash, FaPalette } from 'react-icons/fa';

export default function ResumeBuilder() {
  const resumeRef = useRef();
  const [isExporting, setIsExporting] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState('modern');

  // --- RESUME DATA STATE ---
  const [data, setData] = useState({
    personal: {
      name: 'Het Patel',
      role: 'Full Stack Developer',
      email: 'het@example.com',
      phone: '+1 234 567 8900',
      linkedin: 'linkedin.com/in/hetpatel',
      summary: 'Passionate software engineer with expertise in React, Node.js, and AI integrations. Proven track record of building scalable web applications.'
    },
    experience: [
      { id: 1, company: 'Tech Innovators Inc', role: 'Software Engineer', duration: 'Jan 2021 - Present', desc: 'Developed and maintained scalable microservices. Improved frontend performance by 40% using React and Vite.' }
    ],
    education: [
      { id: 1, school: 'University of Technology', degree: 'B.S. Computer Science', year: '2016 - 2020' }
    ],
    // NEW: Certifications State
    certifications: [
      { id: 1, name: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', year: '2022' }
    ],
    skills: 'JavaScript, React, Node.js, Express, MongoDB, Tailwind CSS, Python'
  });

  // --- FORM HANDLERS ---
  const handlePersonalChange = (e) => setData({ ...data, personal: { ...data.personal, [e.target.name]: e.target.value } });
  
  const handleExpChange = (id, field, value) => {
    setData({ ...data, experience: data.experience.map(exp => exp.id === id ? { ...exp, [field]: value } : exp) });
  };
  const addExp = () => setData({ ...data, experience: [...data.experience, { id: Date.now(), company: '', role: '', duration: '', desc: '' }] });
  const removeExp = (id) => setData({ ...data, experience: data.experience.filter(exp => exp.id !== id) });

  const handleEduChange = (id, field, value) => {
    setData({ ...data, education: data.education.map(edu => edu.id === id ? { ...edu, [field]: value } : edu) });
  };
  const addEdu = () => setData({ ...data, education: [...data.education, { id: Date.now(), school: '', degree: '', year: '' }] });
  const removeEdu = (id) => setData({ ...data, education: data.education.filter(edu => edu.id !== id) });

  // NEW: Certifications Handlers
  const handleCertChange = (id, field, value) => {
    setData({ ...data, certifications: data.certifications.map(cert => cert.id === id ? { ...cert, [field]: value } : cert) });
  };
  const addCert = () => setData({ ...data, certifications: [...data.certifications, { id: Date.now(), name: '', issuer: '', year: '' }] });
  const removeCert = (id) => setData({ ...data, certifications: data.certifications.filter(cert => cert.id !== id) });

  const handleSkillsChange = (e) => setData({ ...data, skills: e.target.value });

  // --- PDF EXPORT ---
  const downloadPDF = () => {
    setIsExporting(true);
    const input = resumeRef.current;
    
    setTimeout(() => {
      html2canvas(input, { scale: 2, useCORS: true }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${data.personal.name.replace(/\s+/g, '_')}_Resume.pdf`);
        setIsExporting(false);
      });
    }, 100);
  };

  // --- TEMPLATES ---
  const renderTemplate = () => {
    const { personal, experience, education, certifications, skills } = data;

    switch (activeTemplate) {
      case 'minimal':
        return (
          <div className="p-10 font-sans text-gray-800 bg-white min-h-[1123px] w-[794px]">
            <div className="border-b-2 border-gray-900 pb-4 mb-6 text-center">
              <h1 className="text-4xl font-light tracking-widest text-gray-900 uppercase mb-1">{personal.name}</h1>
              <p className="text-sm tracking-widest text-gray-500 uppercase">{personal.role}</p>
              <div className="flex justify-center gap-4 text-xs mt-3 text-gray-600">
                <span>{personal.email}</span> | <span>{personal.phone}</span> | <span>{personal.linkedin}</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-6">{personal.summary}</p>
            <div className="mb-6">
              <h2 className="text-lg font-semibold uppercase tracking-widest border-b border-gray-300 pb-1 mb-3">Experience</h2>
              {experience.map(exp => (
                <div key={exp.id} className="mb-4">
                  <div className="flex justify-between font-semibold text-gray-900">
                    <span>{exp.role}</span><span>{exp.duration}</span>
                  </div>
                  <div className="text-sm italic text-gray-600 mb-1">{exp.company}</div>
                  <p className="text-sm text-gray-700">{exp.desc}</p>
                </div>
              ))}
            </div>
            <div className="mb-6">
              <h2 className="text-lg font-semibold uppercase tracking-widest border-b border-gray-300 pb-1 mb-3">Education</h2>
              {education.map(edu => (
                <div key={edu.id} className="mb-2 flex justify-between">
                  <div>
                    <span className="font-semibold text-gray-900">{edu.degree}</span>
                    <span className="text-sm text-gray-600 ml-2">| {edu.school}</span>
                  </div>
                  <span className="text-sm text-gray-600">{edu.year}</span>
                </div>
              ))}
            </div>
            {/* MINIMAL - Certifications */}
            {certifications.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold uppercase tracking-widest border-b border-gray-300 pb-1 mb-3">Certifications</h2>
                {certifications.map(cert => (
                  <div key={cert.id} className="mb-2 flex justify-between">
                    <div>
                      <span className="font-semibold text-gray-900">{cert.name}</span>
                      <span className="text-sm text-gray-600 ml-2">| {cert.issuer}</span>
                    </div>
                    <span className="text-sm text-gray-600">{cert.year}</span>
                  </div>
                ))}
              </div>
            )}
            <div>
              <h2 className="text-lg font-semibold uppercase tracking-widest border-b border-gray-300 pb-1 mb-3">Skills</h2>
              <p className="text-sm leading-relaxed text-gray-700">{skills}</p>
            </div>
          </div>
        );

      case 'modern':
        return (
          <div className="font-sans bg-white min-h-[1123px] w-[794px] flex flex-col">
            <div className="bg-blue-600 text-white p-10">
              <h1 className="text-4xl font-bold mb-2">{personal.name}</h1>
              <p className="text-xl text-blue-100">{personal.role}</p>
            </div>
            <div className="flex p-10 gap-8">
              <div className="w-2/3">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile</h2>
                  <p className="text-sm text-gray-600 leading-relaxed">{personal.summary}</p>
                </div>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Experience</h2>
                  {experience.map(exp => (
                    <div key={exp.id} className="mb-5">
                      <h3 className="text-lg font-bold text-gray-800">{exp.role}</h3>
                      <p className="text-sm text-blue-600 font-semibold mb-2">{exp.company} • {exp.duration}</p>
                      <p className="text-sm text-gray-600">{exp.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-1/3">
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-3 border-b-2 border-blue-600 pb-1">Contact</h2>
                  <div className="text-sm text-gray-600 space-y-2">
                    <p>{personal.email}</p>
                    <p>{personal.phone}</p>
                    <p>{personal.linkedin}</p>
                  </div>
                </div>
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-3 border-b-2 border-blue-600 pb-1">Education</h2>
                  {education.map(edu => (
                    <div key={edu.id} className="mb-3 text-sm text-gray-600">
                      <p className="font-bold text-gray-800">{edu.degree}</p>
                      <p>{edu.school}</p>
                      <p className="text-blue-600">{edu.year}</p>
                    </div>
                  ))}
                </div>
                {/* MODERN - Certifications */}
                {certifications.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-3 border-b-2 border-blue-600 pb-1">Certifications</h2>
                    {certifications.map(cert => (
                      <div key={cert.id} className="mb-3 text-sm text-gray-600">
                        <p className="font-bold text-gray-800">{cert.name}</p>
                        <p>{cert.issuer}</p>
                        <p className="text-blue-600">{cert.year}</p>
                      </div>
                    ))}
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-3 border-b-2 border-blue-600 pb-1">Skills</h2>
                  <p className="text-sm text-gray-600 leading-relaxed">{skills}</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'executive':
        return (
          <div className="p-10 font-serif text-gray-900 bg-white min-h-[1123px] w-[794px]">
            <div className="border-b-4 border-gray-900 pb-4 mb-6">
              <h1 className="text-4xl font-bold text-center mb-2">{personal.name}</h1>
              <div className="text-center text-sm font-semibold">
                {personal.email} | {personal.phone} | {personal.linkedin}
              </div>
            </div>
            <div className="mb-6">
              <h2 className="text-xl font-bold uppercase border-b border-gray-400 mb-2">Executive Summary</h2>
              <p className="text-sm leading-relaxed">{personal.summary}</p>
            </div>
            <div className="mb-6">
              <h2 className="text-xl font-bold uppercase border-b border-gray-400 mb-4">Professional Experience</h2>
              {experience.map(exp => (
                <div key={exp.id} className="mb-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>{exp.company}</span><span>{exp.duration}</span>
                  </div>
                  <div className="italic text-gray-700 mb-1">{exp.role}</div>
                  <p className="text-sm">{exp.desc}</p>
                </div>
              ))}
            </div>
            <div className="mb-6 flex gap-6">
              <div className="w-1/2">
                <h2 className="text-xl font-bold uppercase border-b border-gray-400 mb-2">Education</h2>
                {education.map(edu => (
                  <div key={edu.id} className="mb-2 text-sm">
                    <span className="font-bold">{edu.degree}</span> - {edu.school} ({edu.year})
                  </div>
                ))}
                {/* EXECUTIVE - Certifications */}
                {certifications.length > 0 && (
                  <div className="mt-6">
                    <h2 className="text-xl font-bold uppercase border-b border-gray-400 mb-2">Certifications</h2>
                    {certifications.map(cert => (
                      <div key={cert.id} className="mb-2 text-sm">
                        <span className="font-bold">{cert.name}</span> <br/>
                        <span className="italic">{cert.issuer}</span> ({cert.year})
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="w-1/2">
                <h2 className="text-xl font-bold uppercase border-b border-gray-400 mb-2">Core Competencies</h2>
                <p className="text-sm">{skills}</p>
              </div>
            </div>
          </div>
        );

      case 'creative':
        return (
          <div className="bg-white min-h-[1123px] w-[794px] flex">
            <div className="w-1/3 bg-gray-900 text-white p-8">
              <div className="w-32 h-32 rounded-full border-4 border-white mb-6 mx-auto bg-gray-700 flex items-center justify-center text-4xl font-bold">
                {personal.name.charAt(0)}
              </div>
              <h1 className="text-2xl font-bold text-center mb-1">{personal.name}</h1>
              <p className="text-sm text-center text-gray-400 mb-8">{personal.role}</p>
              
              <h2 className="text-lg font-bold border-b border-gray-600 pb-1 mb-3">Contact</h2>
              <div className="text-xs text-gray-300 space-y-2 mb-8">
                <p>{personal.email}</p>
                <p>{personal.phone}</p>
                <p>{personal.linkedin}</p>
              </div>

              <h2 className="text-lg font-bold border-b border-gray-600 pb-1 mb-3">Skills</h2>
              <div className="flex flex-wrap gap-2 text-xs mb-8">
                {skills.split(',').map((skill, idx) => (
                  <span key={idx} className="bg-gray-800 px-2 py-1 rounded">{skill.trim()}</span>
                ))}
              </div>

              {/* CREATIVE - Certifications */}
              {certifications.length > 0 && (
                <>
                  <h2 className="text-lg font-bold border-b border-gray-600 pb-1 mb-3">Certifications</h2>
                  <div className="text-xs text-gray-300 space-y-3">
                    {certifications.map(cert => (
                      <div key={cert.id}>
                        <p className="font-bold text-white">{cert.name}</p>
                        <p>{cert.issuer} • {cert.year}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="w-2/3 p-10 font-sans text-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">About Me</h2>
              <p className="text-sm text-gray-600 mb-8 leading-relaxed">{personal.summary}</p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">Experience</h2>
              {experience.map(exp => (
                <div key={exp.id} className="mb-6 relative border-l-2 border-gray-300 pl-4 ml-2">
                  <div className="absolute w-3 h-3 bg-gray-900 rounded-full -left-[7px] top-1"></div>
                  <h3 className="font-bold text-lg">{exp.role}</h3>
                  <p className="text-xs font-bold text-gray-500 mb-2">{exp.company} | {exp.duration}</p>
                  <p className="text-sm text-gray-600">{exp.desc}</p>
                </div>
              ))}

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Education</h2>
              {education.map(edu => (
                <div key={edu.id} className="mb-4">
                  <h3 className="font-bold">{edu.degree}</h3>
                  <p className="text-sm text-gray-600">{edu.school}</p>
                  <p className="text-xs text-gray-500 font-bold">{edu.year}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'tech':
        return (
          <div className="p-10 font-mono text-gray-900 bg-white min-h-[1123px] w-[794px] border-t-8 border-green-500">
            <h1 className="text-3xl font-bold mb-1">&gt; {personal.name}</h1>
            <p className="text-green-600 font-bold mb-4">/* {personal.role} */</p>
            <div className="text-xs text-gray-600 mb-6 flex gap-4">
              <span>email: "{personal.email}"</span>
              <span>phone: "{personal.phone}"</span>
            </div>
            <div className="mb-6 border border-gray-200 p-4 bg-gray-50">
              <h2 className="text-lg font-bold text-gray-800 mb-2"># summary</h2>
              <p className="text-sm text-gray-700">{personal.summary}</p>
            </div>
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4 border-b-2 border-green-500 inline-block"># experience</h2>
              {experience.map(exp => (
                <div key={exp.id} className="mb-4">
                  <h3 className="font-bold">{exp.role} <span className="text-green-600">@ {exp.company}</span></h3>
                  <p className="text-xs text-gray-500 mb-1">[{exp.duration}]</p>
                  <p className="text-sm">- {exp.desc}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-6">
              <div className="w-1/2">
                <h2 className="text-lg font-bold text-gray-800 mb-4 border-b-2 border-green-500 inline-block"># education</h2>
                {education.map(edu => (
                  <div key={edu.id} className="mb-2">
                    <p className="font-bold text-sm">{edu.degree}</p>
                    <p className="text-xs text-gray-600">{edu.school} [{edu.year}]</p>
                  </div>
                ))}

                {/* TECH - Certifications */}
                {certifications.length > 0 && (
                  <div className="mt-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4 border-b-2 border-green-500 inline-block"># certifications</h2>
                    {certifications.map(cert => (
                      <div key={cert.id} className="mb-2">
                        <p className="font-bold text-sm">{cert.name}</p>
                        <p className="text-xs text-gray-600">{cert.issuer} [{cert.year}]</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="w-1/2">
                <h2 className="text-lg font-bold text-gray-800 mb-4 border-b-2 border-green-500 inline-block"># skills</h2>
                <p className="text-sm">{skills}</p>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col lg:flex-row">
      
      {/* LEFT PANEL: Editor */}
      <div className="w-full lg:w-1/3 bg-white border-r border-gray-200 p-6 overflow-y-auto h-screen sticky top-0 shadow-lg z-10">
        <div className="mb-8">
          <h2 className="text-2xl font-extrabold text-gray-900">Resume Builder</h2>
          <p className="text-sm text-gray-500">Edit details and instantly view changes.</p>
        </div>

        {/* Personal Info */}
        <div className="mb-8 bg-gray-50 p-4 rounded-2xl border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">Personal Details</h3>
          <div className="space-y-3">
            <input type="text" name="name" value={data.personal.name} onChange={handlePersonalChange} placeholder="Full Name" className="w-full p-2 text-sm border rounded-lg" />
            <input type="text" name="role" value={data.personal.role} onChange={handlePersonalChange} placeholder="Professional Title" className="w-full p-2 text-sm border rounded-lg" />
            <input type="email" name="email" value={data.personal.email} onChange={handlePersonalChange} placeholder="Email" className="w-full p-2 text-sm border rounded-lg" />
            <input type="text" name="phone" value={data.personal.phone} onChange={handlePersonalChange} placeholder="Phone" className="w-full p-2 text-sm border rounded-lg" />
            <input type="text" name="linkedin" value={data.personal.linkedin} onChange={handlePersonalChange} placeholder="LinkedIn/Website URL" className="w-full p-2 text-sm border rounded-lg" />
            <textarea name="summary" value={data.personal.summary} onChange={handlePersonalChange} placeholder="Professional Summary" className="w-full p-2 text-sm border rounded-lg h-24"></textarea>
          </div>
        </div>

        {/* Experience */}
        <div className="mb-8 bg-gray-50 p-4 rounded-2xl border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">Experience</h3>
          {data.experience.map((exp, index) => (
            <div key={exp.id} className="mb-4 bg-white p-3 rounded-lg border shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-gray-400 uppercase">Job {index + 1}</span>
                <button onClick={() => removeExp(exp.id)} className="text-red-500 hover:text-red-700"><FaTrash size={12} /></button>
              </div>
              <input type="text" value={exp.company} onChange={(e) => handleExpChange(exp.id, 'company', e.target.value)} placeholder="Company Name" className="w-full p-2 text-sm border rounded mb-2" />
              <input type="text" value={exp.role} onChange={(e) => handleExpChange(exp.id, 'role', e.target.value)} placeholder="Job Title" className="w-full p-2 text-sm border rounded mb-2" />
              <input type="text" value={exp.duration} onChange={(e) => handleExpChange(exp.id, 'duration', e.target.value)} placeholder="e.g. Jan 2021 - Present" className="w-full p-2 text-sm border rounded mb-2" />
              <textarea value={exp.desc} onChange={(e) => handleExpChange(exp.id, 'desc', e.target.value)} placeholder="Describe your achievements..." className="w-full p-2 text-sm border rounded h-20"></textarea>
            </div>
          ))}
          <button onClick={addExp} className="w-full py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-bold flex justify-center items-center gap-2 hover:bg-blue-200"><FaPlus /> Add Experience</button>
        </div>

        {/* Education */}
        <div className="mb-8 bg-gray-50 p-4 rounded-2xl border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">Education</h3>
          {data.education.map((edu, index) => (
            <div key={edu.id} className="mb-4 bg-white p-3 rounded-lg border shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-gray-400 uppercase">Degree {index + 1}</span>
                <button onClick={() => removeEdu(edu.id)} className="text-red-500 hover:text-red-700"><FaTrash size={12} /></button>
              </div>
              <input type="text" value={edu.degree} onChange={(e) => handleEduChange(edu.id, 'degree', e.target.value)} placeholder="Degree (e.g. B.S. Computer Science)" className="w-full p-2 text-sm border rounded mb-2" />
              <input type="text" value={edu.school} onChange={(e) => handleEduChange(edu.id, 'school', e.target.value)} placeholder="School/University" className="w-full p-2 text-sm border rounded mb-2" />
              <input type="text" value={edu.year} onChange={(e) => handleEduChange(edu.id, 'year', e.target.value)} placeholder="e.g. 2016 - 2020" className="w-full p-2 text-sm border rounded" />
            </div>
          ))}
          <button onClick={addEdu} className="w-full py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-bold flex justify-center items-center gap-2 hover:bg-blue-200"><FaPlus /> Add Education</button>
        </div>

        {/* NEW: Certifications */}
        <div className="mb-8 bg-gray-50 p-4 rounded-2xl border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">Certifications</h3>
          {data.certifications.map((cert, index) => (
            <div key={cert.id} className="mb-4 bg-white p-3 rounded-lg border shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-gray-400 uppercase">Certification {index + 1}</span>
                <button onClick={() => removeCert(cert.id)} className="text-red-500 hover:text-red-700"><FaTrash size={12} /></button>
              </div>
              <input type="text" value={cert.name} onChange={(e) => handleCertChange(cert.id, 'name', e.target.value)} placeholder="Certification Name (e.g. AWS Certified...)" className="w-full p-2 text-sm border rounded mb-2" />
              <input type="text" value={cert.issuer} onChange={(e) => handleCertChange(cert.id, 'issuer', e.target.value)} placeholder="Issuer (e.g. Amazon, Coursera)" className="w-full p-2 text-sm border rounded mb-2" />
              <input type="text" value={cert.year} onChange={(e) => handleCertChange(cert.id, 'year', e.target.value)} placeholder="Year (e.g. 2022)" className="w-full p-2 text-sm border rounded" />
            </div>
          ))}
          <button onClick={addCert} className="w-full py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-bold flex justify-center items-center gap-2 hover:bg-blue-200"><FaPlus /> Add Certification</button>
        </div>

        {/* Skills */}
        <div className="mb-8 bg-gray-50 p-4 rounded-2xl border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">Skills</h3>
          <textarea value={data.skills} onChange={handleSkillsChange} placeholder="React, Node.js, Python..." className="w-full p-2 text-sm border rounded h-24"></textarea>
          <p className="text-xs text-gray-400 mt-1">Separate skills with commas.</p>
        </div>
      </div>

      {/* RIGHT PANEL: Live Preview & Toolbar */}
      <div className="w-full lg:w-2/3 bg-gray-200 flex flex-col h-screen">
        
        {/* Toolbar */}
        <div className="bg-white border-b border-gray-300 p-4 flex flex-wrap justify-between items-center z-10 shadow-sm gap-4">
          <div className="flex items-center gap-2">
            <FaPalette className="text-gray-400" />
            <select 
              value={activeTemplate} 
              onChange={(e) => setActiveTemplate(e.target.value)}
              className="bg-gray-100 border border-gray-200 text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
            >
              <option value="minimal">Minimalist (ATS Friendly)</option>
              <option value="modern">Modern Professional</option>
              <option value="executive">Executive Classic</option>
              <option value="creative">Creative Portfolio</option>
              <option value="tech">Tech & Code</option>
            </select>
          </div>
          <button 
            onClick={downloadPDF}
            disabled={isExporting}
            className="bg-green-600 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 shadow-md hover:bg-green-700 disabled:opacity-50 transition"
          >
            {isExporting ? 'Generating PDF...' : <><FaDownload /> Download PDF</>}
          </button>
        </div>

        {/* Live Preview Area */}
        <div className="flex-1 overflow-y-auto p-8 flex justify-center">
          {/* We wrap the resume in a fixed-size container styled like an A4 paper for accurate scaling */}
          <div className="shadow-2xl bg-white overflow-hidden" style={{ width: '794px', minHeight: '1123px' }}>
            <div ref={resumeRef}>
              {renderTemplate()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}