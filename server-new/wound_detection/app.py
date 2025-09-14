import os
import numpy as np
from PIL import Image
from flask import Flask, request, render_template_string, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
# Create necessary folders
os.makedirs('static/uploads', exist_ok=True)

# Define wound classes
WOUND_CLASSES = ["Abrasion", "Laceration", "Ulcer", "Puncture", "Deep Wound"]

# Input size for model simulation
IMG_SIZE = 128

# Simulated KNN reference feature vectors (e.g., [mean R, mean G])
REFERENCE_FEATURES = {
    "Abrasion": np.array([0.8, 0.7]),
    "Laceration": np.array([0.6, 0.5]),
    "Ulcer": np.array([0.4, 0.4]),
    "Puncture": np.array([0.3, 0.6]),
    "Deep Wound": np.array([0.2, 0.2]),
}

# Inline CSS
STYLE = """
<style>
body {
    font-family: Arial, sans-serif;
    background-color: #f4f4f8;
    text-align: center;
    padding: 40px;
}
h1, h2 {
    color: #333;
}
img {
    max-width: 300px;
    border-radius: 10px;
    border: 1px solid #ccc;
}
button {
    padding: 10px 20px;
    background: #0066cc;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
}
input[type="file"] {
    margin: 20px;
}
</style>
"""

@app.route('/')
def upload_form():
    return render_template_string(f"""
    <html>
    <head><title>Wound Classifier</title>{STYLE}</head>
    <body>
        <h1>Wound Type Classifier</h1>
        <form action="/classify" method="post" enctype="multipart/form-data">
            <input type="file" name="file" accept="image/*" required><br>
            <button type="submit">Upload and Classify</button>
        </form>
    </body>
    </html>
    """)


@app.route('/classify', methods=['POST'])
def classify():
    file = request.files['file']
    filename = file.filename
    input_path = os.path.join("static/uploads", filename)
    file.save(input_path)

    # Load and preprocess image
    image = Image.open(input_path).convert("RGB")
    image = image.resize((IMG_SIZE, IMG_SIZE))
    image_array = np.array(image) / 255.0

    # Extract features
    red_mean = np.mean(image_array[:, :, 0])
    green_mean = np.mean(image_array[:, :, 1])
    features = np.array([red_mean, green_mean])

    # Simulate classification
    distances = {
        cls: np.linalg.norm(features - ref_vec)
        for cls, ref_vec in REFERENCE_FEATURES.items()
    }
    predicted_class = min(distances, key=distances.get)

    return jsonify({
        "predicted_class": predicted_class,
        "filename": filename
    })

if __name__ == '__main__':
    app.run(debug=True, port=5003)
