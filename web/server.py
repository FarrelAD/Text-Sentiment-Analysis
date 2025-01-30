from flask import Flask, render_template, jsonify, request
import joblib
import os

app = Flask(__name__)

app.config['TEMPLATES_FOLDER'] = 'templates'
app.config['STATIC_FOLDER'] = 'static'


pipeline = joblib.load(os.path.join('..', 'model', 'sentiment_analysis_pipeline.pkl'))


@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

@app.route('/check-sentiment', methods=['POST'])
def check_sentiment():
    text = request.form['text']
    
    sentiment = pipeline.predict([text])[0]
    
    return jsonify({'sentiment': "Positive" if sentiment == 1 else "Negative"})


if __name__ == '__main__':
    app.run()