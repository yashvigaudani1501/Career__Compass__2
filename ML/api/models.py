from django.db import models

class ResumeAnalysisLog(models.Model):
    filename = models.CharField(max_length=255, default="uploaded_resume.pdf")
    ats_score = models.IntegerField(default=0)
    rf_predicted_status = models.CharField(max_length=50, default="Shortlisted")
    rf_confidence = models.FloatField(default=0.0)
    word_count = models.IntegerField(default=0)
    extracted_skills = models.TextField(blank=True, null=True)
    suggested_jobs = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.filename} | Score: {self.ats_score} | RF Status: {self.rf_predicted_status}"

class ScrapedCompanyLog(models.Model):
    website_url = models.URLField()
    industry = models.CharField(max_length=150, default="Unknown Industry")
    company_info = models.TextField(blank=True, null=True)
    scraped_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.website_url} | {self.industry}"
