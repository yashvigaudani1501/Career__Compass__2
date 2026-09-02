from rest_framework import serializers
from .models import ResumeAnalysisLog, ScrapedCompanyLog

class ResumeAnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResumeAnalysisLog
        fields = '__all__'

class ScrapedCompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = ScrapedCompanyLog
        fields = '__all__'
