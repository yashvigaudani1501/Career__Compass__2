from django.contrib import admin
from .models import ResumeAnalysisLog, ScrapedCompanyLog

@admin.register(ResumeAnalysisLog)
class ResumeAnalysisAdmin(admin.ModelAdmin):
    list_display = ('filename', 'ats_score', 'rf_predicted_status', 'rf_confidence', 'created_at')
    search_fields = ('filename', 'rf_predicted_status')
    list_filter = ('rf_predicted_status', 'created_at')

@admin.register(ScrapedCompanyLog)
class ScrapedCompanyAdmin(admin.ModelAdmin):
    list_display = ('website_url', 'industry', 'scraped_at')
    search_fields = ('website_url', 'industry')
