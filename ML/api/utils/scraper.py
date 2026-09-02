import requests
from bs4 import BeautifulSoup

def scrape_website_text(url):
    try:
        # Add headers so websites don't block us thinking we are a bot
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
        response = requests.get(url, headers=headers, timeout=10)
        
        if response.status_code != 200:
            return None
            
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Remove scripts and styles to just get the visible text
        for script in soup(["script", "style"]):
            script.extract()
            
        text = soup.get_text(separator=' ', strip=True)
        
        # Return only the first 3000 characters (enough for the AI to understand the company)
        return text[:3000]
    except Exception as e:
        print(f"Scraping Error: {e}")
        return None