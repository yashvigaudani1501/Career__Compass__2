import os
import json
from groq import Groq
from dotenv import load_dotenv

# Load env variables
load_dotenv() 

# Add a debug print to check if the key is loaded!
print(f"--- DEBUG: GROQ_API_KEY loaded: {bool(os.environ.get('GROQ_API_KEY'))} ---")

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

def analyze_resume_with_groq(resume_text):
    prompt = f"""
    You are an expert ATS (Applicant Tracking System). Analyze the following resume text. 
    1. Extract the top 5 technical skills.
    2. Calculate an estimated ATS score out of 100 based on formatting and content.
    3. Suggest 3 job titles that best match this resume.
    
    Return ONLY a valid JSON object in this exact format, nothing else:
    {{
        "ats_score": 85,
        "extracted_skills": ["Skill1", "Skill2", "Skill3"],
        "suggested_jobs": ["Job1", "Job2", "Job3"]
    }}
    
    Resume Text:
    {resume_text}
    """
    
    try:
        chat_completion = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.1-8b-instant", 
            temperature=0.1, 
        )
        
        response_text = chat_completion.choices[0].message.content
        response_text = response_text.replace("```json", "").replace("```", "").strip()
        
        return json.loads(response_text)
        
    except Exception as e:
        # HERE IS THE CHANGE: Print the exact error!
        print(f"--- GROQ AI ERROR: {e} ---") 
        return {
            "ats_score": 0,
            "extracted_skills": [],
            "suggested_jobs": ["Error connecting to AI"]
        }

def summarize_company_with_groq(website_text):
    prompt = f"""
    You are an expert business analyst. Read the following text scraped from a company's website.
    1. Determine their primary industry/category in 2-3 words (e.g., "Software Engineering", "Healthcare AI").
    2. Write a 2-3 sentence professional summary of what the company does.
    
    Return ONLY a valid JSON object in this exact format, nothing else:
    {{
        "work": "Industry Category here",
        "companyInfo": "Professional summary here."
    }}
    
    Website Text:
    {website_text}
    """
    
    try:
        chat_completion = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.1-8b-instant", 
            temperature=0.1, 
        )
        
        response_text = chat_completion.choices[0].message.content
        response_text = response_text.replace("```json", "").replace("```", "").strip()
        
        return json.loads(response_text)
        
    except Exception as e:
        print(f"--- GROQ AI COMPANY SCRAPE ERROR: {e} ---") 
        return {
            "work": "Unknown Industry",
            "companyInfo": "Could not generate summary."
        }