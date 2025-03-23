import torch
import cv2
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from deepface import DeepFace
import base64
from io import BytesIO
from PIL import Image
import logging
import os
import datetime

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024  # Increase to 50MB
CORS(app)

# Initialize Logger
logging.basicConfig(level=logging.INFO)

# Load YOLOv5 Model for object detection
logging.info("Loading YOLOv5 Model...")
model = torch.hub.load('ultralytics/yolov5', 'yolov5s')

# Suspicious objects list
SUSPICIOUS_OBJECTS = ["cell phone", "book", "person"]

# Directory to save screenshots
BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # Get current folder path
SCREENSHOT_DIR = os.path.join(BASE_DIR, "screenshots")  # Save screenshots in 'src/components/screenshots/'
os.makedirs(SCREENSHOT_DIR, exist_ok=True)

def decode_image(image_data):
    """Decodes a base64 image string into a NumPy array"""
    try:
        if not image_data or "," not in image_data:
            logging.error("Invalid image data format received.")
            return None

        image_bytes = base64.b64decode(image_data.split(',')[1])  # Extract data after comma
        image = Image.open(BytesIO(image_bytes)).convert('RGB')
        return np.array(image)
    except Exception as e:
        logging.error(f"Image decoding failed: {e}")
        return None


def save_screenshot(image, student_id):
    """Saves the student's screenshot to the server"""
    try:
        timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = os.path.join(SCREENSHOT_DIR, f"{student_id}_{timestamp}.jpg")
        image_pil = Image.fromarray(image)
        image_pil.save(filename, "JPEG", quality=50)  # Compress image to 50% quality
        return filename
    except Exception as e:
        logging.error(f"Error saving screenshot: {e}")
        return None

@app.route('/get-registered-photo', methods=['GET'])
def get_registered_photo():
    username = request.args.get('username')
    if not username:
        return jsonify({"error": "Username is required"}), 400

    # Example: Fetch user photo from a database (Replace with your actual logic)
    user = students.get(username)  # Assuming users_db is your data source

    if user and "photo" in user:
        return jsonify({"photo": user["photo"]})  # Returning base64 string
    else:
        return jsonify({"error": "User not found"}), 404

def detect_suspicious_objects(image):
    """Detects suspicious objects in an image"""
    try:
        img = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
        results = model(img)
        detected_objects = [obj for obj in results.pandas().xyxy[0]['name']]
        for obj in SUSPICIOUS_OBJECTS:
            if obj in detected_objects:
                return True, obj
        return False, None
    except Exception as e:
        logging.error(f"Object detection error: {e}")
        return False, None

def verify_face(registered_img, live_img):
    """Verifies if the live image matches the registered image"""
    try:
        result = DeepFace.verify(registered_img, live_img, model_name='Facenet', enforce_detection=False)
        return result.get("verified", False)
    except Exception as e:
        logging.error(f"Face verification failed: {e}")
        return False

@app.route("/verify", methods=["POST"])
def verify_student():
    """Endpoint for verifying student identity"""
    try:
        data = request.json

        if not data:
            logging.error("Error: No data received in request.")
            return jsonify({"error": "No data received"}), 400

        # Log the incoming image data length (helps debug issues)
        logging.info(f"Received registeredPhoto: {len(data.get('registeredPhoto', ''))} characters")
        logging.info(f"Received liveImage: {len(data.get('liveImage', ''))} characters")

        registered_photo = decode_image(data.get("registeredPhoto"))
        live_photo = decode_image(data.get("liveImage"))
        student_id = data.get("studentId")

        if registered_photo is None or live_photo is None:
            return jsonify({"match": False, "error": "Invalid image data"}), 400

        is_verified = verify_face(registered_photo, live_photo)

        if is_verified:
            save_screenshot(live_photo, student_id)  # ✅ Saves screenshot upon successful verification

        return jsonify({"match": is_verified})
    
    except Exception as e:
        logging.error(f"Error in /verify: {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/detect", methods=["POST"])
def detect():
    """Endpoint for detecting cheating behavior"""
    try:
        data = request.json
        frame = decode_image(data.get("frame"))
        student_id = data.get("studentId")

        if frame is None:
            return jsonify({"alert": False, "error": "Invalid image data"}), 400

        is_suspicious, detected_obj = detect_suspicious_objects(frame)
        if is_suspicious:
            save_screenshot(frame, student_id)

        return jsonify({"alert": is_suspicious, "object": detected_obj})
    
    except Exception as e:
        logging.error(f"Error in /detect: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":  
    app.run(debug=True)
