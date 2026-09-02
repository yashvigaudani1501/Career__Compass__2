from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .utils.pdf_extractor import extract_text_from_pdf
from .utils.groq_service import analyze_resume_with_groq, summarize_company_with_groq
from .utils.scraper import scrape_website_text
from .utils.best_ml_model import evaluate_with_random_forest
from .models import ResumeAnalysisLog, ScrapedCompanyLog
from .serializers import ResumeAnalysisSerializer

@api_view(['POST'])
def process_resume(request):
    if 'resume' not in request.FILES:
        return Response({"error": "No resume file provided"}, status=status.HTTP_400_BAD_REQUEST)
    
    file_obj = request.FILES['resume']
    filename = getattr(file_obj, 'name', 'uploaded_resume.pdf')
    resume_text = extract_text_from_pdf(file_obj)
    
    if not resume_text:
        return Response({"error": "Could not extract text from PDF or PDF is empty"}, status=status.HTTP_400_BAD_REQUEST)
    
    # 1. Groq Generative AI Analysis
    analysis_result = analyze_resume_with_groq(resume_text)
    
    extracted_skills = analysis_result.get('extracted_skills', [])
    ats_score = analysis_result.get('ats_score', 0)
    suggested_jobs = analysis_result.get('suggested_jobs', [])

    # 2. Random Forest Machine Learning Model Evaluation (Best Model)
    rf_eval = evaluate_with_random_forest(resume_text, extracted_skills)

    # 3. Combine Results
    analysis_result['random_forest_evaluation'] = rf_eval

    # 4. Save Log in Django Database (Django ORM Models)
    try:
        ResumeAnalysisLog.objects.create(
            filename=filename,
            ats_score=ats_score,
            rf_predicted_status=rf_eval.get('prediction_status', 'Shortlisted'),
            rf_confidence=rf_eval.get('match_confidence', 0.0),
            word_count=rf_eval.get('total_word_count', 0),
            extracted_skills=", ".join(extracted_skills),
            suggested_jobs=", ".join(suggested_jobs)
        )
    except Exception as db_err:
        print(f"--- Django DB Log Error: {db_err} ---")

    return Response(analysis_result, status=status.HTTP_200_OK)

@api_view(['POST'])
def scrape_company(request):
    url = request.data.get('website')
    if not url:
        return Response({"error": "No website URL provided"}, status=status.HTTP_400_BAD_REQUEST)

    # 1. Scrape the website
    website_text = scrape_website_text(url)
    if not website_text:
         return Response({
            "work": "Unknown Industry",
            "companyInfo": "Failed to scrape website. Please update manually."
         }, status=status.HTTP_200_OK)

    # 2. Let Groq AI summarize it
    ai_summary = summarize_company_with_groq(website_text)
    
    # 3. Save Log in Django Database
    try:
        ScrapedCompanyLog.objects.create(
            website_url=url,
            industry=ai_summary.get('work', 'Unknown Industry'),
            company_info=ai_summary.get('companyInfo', '')
        )
    except Exception as db_err:
        print(f"--- Django DB Company Log Error: {db_err} ---")

    return Response(ai_summary, status=status.HTTP_200_OK) 

@api_view(['GET'])
def get_history(request):
    """Retrieve recent Resume Evaluation Logs from Django DB"""
    logs = ResumeAnalysisLog.objects.all().order_by('-created_at')[:20]
    serializer = ResumeAnalysisSerializer(logs, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
def health_check(request):
    return Response({
        "status": "Active",
        "message": "Django ML Microservice (Random Forest + Groq AI) is up and running! 🧠🌲🚀",
        "environment": "Production"
    }, status=status.HTTP_200_OK)