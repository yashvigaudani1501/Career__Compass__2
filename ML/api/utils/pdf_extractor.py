import pdfplumber

def extract_text_from_pdf(file_obj):
    text = ""
    try:
        # Rewind the file pointer
        file_obj.seek(0)
        
        # Open the file using pdfplumber
        with pdfplumber.open(file_obj) as pdf:
            for page in pdf.pages:
                extracted = page.extract_text()
                if extracted:
                    text += extracted + "\n"
                    
        print(f"--- DEBUG: Extracted {len(text)} characters using pdfplumber ---")
        if len(text) < 50:
            print(f"--- DEBUG TEXT PREVIEW: {text} ---")
            
    except Exception as e:
        print(f"--- ERROR reading PDF: {e} ---")
        
    return text.strip()