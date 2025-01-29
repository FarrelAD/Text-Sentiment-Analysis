from flask import Flask, render_template, jsonify
import joblib

app = Flask(__name__)

app.config['TEMPLATES_FOLDER'] = 'templates'


# model = joblib.load('model/sentiment_model.pkl')


@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

@app.route('/check-sentiment', methods=['POST'])
def check_sentiment():
    sentiment = model.predict('I am good')
    
    return jsonify({'sentiment': sentiment})


if __name__ == '__main__':
    app.run()