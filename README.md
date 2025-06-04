# sinch-hackathon-2025
I share the project folder where is the access to:

- Python script where the random data and the model were generated (are executed consecutively):
-- 001_generate_data.py
-- 002_create_model.py
-- 003_verify_result.py
-- 004_export_model_js.py

- Chrome extension so that it can be used:
-- icon.png
-- manifest.json
-- popup.html
-- prob_table.json (the model exported from python)
-- script.js
-- style.css


---------------

Here you can generate the KEY for use in the project:

https://aistudio.google.com/app/u/1/apikey

-------------------


The steps to follow are:

1. Open Chrome
2. Go to chrome://extensions
3. Activate developer mode
4. Load unpacked extension
5. Select the files in the folder: 
6. The extension will be displayed
7. Ready, you will be able to check the probability of an immediate reading

---------------
Test Key_API

curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=GEMINI_API_KEY" \
-H 'Content-Type: application/json' \
-X POST \
-d '{
  "contents": [{
    "parts":[{"text": "Explain how AI works"}]
    }]
   }'
