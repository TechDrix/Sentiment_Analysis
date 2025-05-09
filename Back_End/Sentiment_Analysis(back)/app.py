# app.py
from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
import re
import nltk
from nltk.corpus import stopwords
from nltk.tokenize.toktok import ToktokTokenizer
import spacy
from textblob import TextBlob
import pickle
import os

# Download required NLTK data
nltk.download('stopwords')

class SentimentPreprocessor:
    def __init__(self):
        # Initialize required components
        self.tokenizer = ToktokTokenizer()
        self.nlp = spacy.load('en_core_web_sm', disable=['ner'])
        self.stopword_list = nltk.corpus.stopwords.words('english')
        # Remove 'no' and 'not' from stopwords as they're important for sentiment
        self.stopword_list.remove('no')
        self.stopword_list.remove('not')

    def preprocess_text(self, text):
        """Complete preprocessing pipeline for a single text input"""
        # Basic cleaning
        text = str(text)
        text = self.remove_html(text)
        text = self.remove_URL(text)
        text = text.encode('ascii', 'ignore').decode('ascii')
        text = self.remove_punctuations(text)
        text = self.remove_special_characters(text)
        text = self.remove_numbers(text)
        text = self.remove_alphanumeric(text)
        text = self.custom_remove_stopwords(text)
        text = self.lemmatize_text(text)
        return text

    def remove_html(self, text):
        html_pattern = re.compile('<.*?>')
        return html_pattern.sub(r'', text)

    def remove_URL(self, text):
        url = re.compile(r'https?://\s+|www\.\s+')
        return url.sub(r'', text)

    def remove_punctuations(self, text):
        import string
        for punctuation in string.punctuation:
            text = text.replace(punctuation, '')
        return text

    def remove_special_characters(self, text):
        return re.sub('[^a-zA-z0-9\s]', '', text)

    def remove_numbers(self, text):
        return ''.join([i for i in text if not i.isdigit()])

    def cleanse(self, word):
        rx = re.compile(r'\D*\d')
        if rx.match(word):
            return ''
        return word

    def remove_alphanumeric(self, strings):
        nstrings = [" ".join(filter(None, (self.cleanse(word) for word in string.split())))
                   for string in strings.split()]
        return ' '.join(nstrings)

    def custom_remove_stopwords(self, text, is_lower_case=False):
        tokens = self.tokenizer.tokenize(text)
        tokens = [token.strip() for token in tokens]
        if is_lower_case:
            filtered_tokens = [token for token in tokens if token not in self.stopword_list]
        else:
            filtered_tokens = [token for token in tokens if token.lower() not in self.stopword_list]
        return ' '.join(filtered_tokens)

    def lemmatize_text(self, text):
        text = self.nlp(text)
        text = ' '.join([word.lemma_ if word.lemma_ != '-PRON-' else word.text for word in text])
        return text

    def get_sentiment(self, text):
        
        sentiment = TextBlob(text).sentiment
        
        # Determine sentiment category based on polarity ranges
        if sentiment.polarity > 0.3:
            sentiment_category = 'Positive'
        elif sentiment.polarity < -0.0:
            sentiment_category = 'Negative'
        else:
            sentiment_category = 'Neutral'
            
        # Get sentiment strength
        if abs(sentiment.polarity) > 0.6:
            strength = 'Strong'
        elif abs(sentiment.polarity) > 0.3:
            strength = 'Moderate'
        else:
            strength = 'Mild'
            
        return {
            'polarity': sentiment.polarity,
            'subjectivity': sentiment.subjectivity,
            'sentiment': sentiment_category,
            'sentiment_details': {
                'category': sentiment_category,
                'strength': strength,
                'confidence': abs(sentiment.polarity),
                'is_subjective': sentiment.subjectivity > 0.5,
                'numeric_ranges': {
                    'highly_positive': sentiment.polarity > 0.6,
                    'moderately_positive': 0.2 < sentiment.polarity <= 0.6,
                    'neutral': -0.2 <= sentiment.polarity <= 0.2,
                    'moderately_negative': -0.6 <= sentiment.polarity < -0.2,
                    'highly_negative': sentiment.polarity < -0.6
                }
            }
        }

    def analyze_text_sentiment(self, text):
        """Get sentiment scores for processed text"""
        sentiment = TextBlob(text).sentiment
        return {
            'polarity': sentiment.polarity,
            'subjectivity': sentiment.subjectivity,
            'sentiment': 'Positive' if sentiment.polarity >= 0.3 else 'Negative'
        }

# Initialize Flask app
app = Flask(__name__)

# Create or load preprocessor
PICKLE_FILE = 'sentiment_preprocessor.pkl'

if os.path.exists(PICKLE_FILE):
    with open(PICKLE_FILE, 'rb') as f:
        preprocessor = pickle.load(f)
else:
    preprocessor = SentimentPreprocessor()
    with open(PICKLE_FILE, 'wb') as f:
        pickle.dump(preprocessor, f)
@app.route('/predict/text', methods=['POST'])
def predict_text():
    try:
        text = request.form.get('text', '')
        if not text:
            return jsonify({'error': 'No text provided'}), 400
        
        # Preprocess the text
        processed_text = preprocessor.preprocess_text(text)
        
        # Get sentiment
        result = preprocessor.get_sentiment(processed_text)
        
        return jsonify({
            'original_text': text,
            'processed_text': processed_text,
            'sentiment': result['sentiment'],
            'polarity': result['polarity'],
            'subjectivity': result['subjectivity']
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/predict/file', methods=['POST'])
def predict_file():
    try: 
        # Access the uploaded file
        file = request.files.get('file')
        if not file:
            return jsonify({'error': 'No file provided'}), 400
        
        # Read the file as a DataFrame
        try:
            df = pd.read_csv(file)
        except Exception as e:
            return jsonify({'error': f'Failed to read CSV file: {str(e)}'}), 400
        
        if 'text' not in df.columns:
            return jsonify({'error': 'No "text" column found in CSV'}), 400
            
        # Process each text and get sentiments
        results = []
        for text in df['text']:
            processed_text = preprocessor.preprocess_text(text)
            sentiment = preprocessor.get_sentiment(processed_text)
            results.append({
                'original_text': text,
                'processed_text': processed_text,
                'sentiment': sentiment['sentiment'],
                'polarity': sentiment['polarity'],
                'subjectivity': sentiment['subjectivity']
            })
            
        return jsonify({'results': results})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

    try: 
        file = request.form.get('file', '')
        if not file:
            return jsonify({'error': 'No text provided'}), 400
            
        # Read CSV file
        df = pd.read_csv(file)
        
        if 'text' not in df.columns:
            return jsonify({'error': 'No "text" column found in CSV'}), 400
            
        # Process each text and get sentiments
        results = []
        for text in df['text']:
            processed_text = preprocessor.preprocess_text(text)
            sentiment = preprocessor.get_sentiment(processed_text)
            results.append({
                'original_text': text,
                'processed_text': processed_text,
                'sentiment': sentiment['sentiment'],
                'polarity': sentiment['polarity'],
                'subjectivity': sentiment['subjectivity']
            })
            
        return jsonify({'results': results})
    except Exception as e:
        return jsonify({'error': str(e)}), 400
        
from flask_cors import CORS
CORS(app)


if __name__ == '__main__':
    app.run(debug=True)