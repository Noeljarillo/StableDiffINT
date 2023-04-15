from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import generate


app = Flask(__name__)
CORS(app, resources={r"/generate": {"origins": ["https://your-nextjs-app.example.com", "http://localhost:3000"]}})  # Replace with your Next.js app URL and include the localhost

@app.route('/generate', methods=['POST'])
def generate_image():
    prompt = request.json.get('prompt')

    try:
        generated_image_url = generate.main()
        return jsonify({'imageUrl': generated_image_url})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
