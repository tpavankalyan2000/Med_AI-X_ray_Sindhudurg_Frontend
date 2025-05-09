from flask import Flask, request, jsonify
import os
import cv2
import numpy as np
from werkzeug.utils import secure_filename
import pydicom

app = Flask(__name__)

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


def is_xray_image(img):
    """
    Determine whether an image is likely an X-ray using heuristics.
    """
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Reject if image is too bright or too dark overall
    mean_intensity = np.mean(gray)
    if mean_intensity < 30 or mean_intensity > 220:
        return False

    # Histogram should have spread (X-rays often have mid-tones)
    hist = cv2.calcHist([gray], [0], None, [256], [0, 256])
    hist_flat = hist.flatten()
    hist_spread = np.count_nonzero(hist_flat > 10)

    if hist_spread < 50:
        return False

    # Optional: Edge structure check (X-rays usually have structured body outlines)
    edges = cv2.Canny(gray, 50, 150)
    edge_pixels = np.sum(edges > 0)

    if edge_pixels < 1000:
        return False

    return True



@app.route('/is_xray', methods=['POST'])
def is_xray():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']
    filename = secure_filename(file.filename)
    ext = os.path.splitext(filename)[1].lower()

    if ext not in ['.jpg', '.jpeg', '.png', '.dcm']:
        return jsonify({"error": "Unsupported file type"}), 400

    filepath = os.path.join(UPLOAD_FOLDER, filename)
    file.save(filepath)

    # Read image
    try:
        if ext == ".dcm":
            dicom_data = pydicom.dcmread(filepath)
            img = dicom_data.pixel_array
            img = cv2.convertScaleAbs(img)
            img = cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)
        else:
            img = cv2.imread(filepath)

        if img is None:
            raise ValueError("Failed to load image.")

        result = is_xray_image(img)
        return jsonify({
            "is_xray": result,
            "message": "X-ray image detected" if result else "Not an X-ray image"
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)



# from flask import Flask, request, jsonify
# import os
# import cv2
# import numpy as np
# from werkzeug.utils import secure_filename
# import pydicom
# import glob

# app = Flask(__name__)
# UPLOAD_FOLDER = './classify_uploads'
# os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# def classify_image_with_cv(img):
#     """
#     Heuristic classification of medical X-ray image using OpenCV features.
#     """
#     gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

#     # -- Cartoon/emoji filter: check contrast --
#     if gray.std() < 10:
#         return "Unclear / Incorrect Image"

#     # -- Edge check: if not enough contours --
#     edges = cv2.Canny(gray, 50, 150)
#     edge_count = np.sum(edges > 0)

#     if edge_count < 500:
#         return "Unclear / Incorrect Image"

#     blur = cv2.GaussianBlur(gray, (5, 5), 0)
#     _, thresh = cv2.threshold(blur, 60, 255, cv2.THRESH_BINARY_INV)
#     contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

#     if len(contours) == 0:
#         return "Unclear / Incorrect Image"

#     largest_contour = max(contours, key=cv2.contourArea)
#     area = cv2.contourArea(largest_contour)
#     x, y, w, h = cv2.boundingRect(largest_contour)
#     aspect_ratio = float(w) / h
#     extent = area / (w * h)

#     print(f"[DEBUG] Area: {area}, AR: {aspect_ratio:.2f}, Extent: {extent:.2f}, Edges: {edge_count}")

#     # --------------------- EXISTING HEURISTIC CLASSIFICATION --------------------- #

#     if area > 10000 and 0.9 <= aspect_ratio <= 1.2 and extent > 0.5:
#         return "Head / Brain"

#     if 8000 < area < 15000 and 0.8 <= aspect_ratio <= 1.2 and extent > 0.5:
#         return "Sinus"

#     if area > 25000 and 0.7 <= aspect_ratio <= 1.5 and extent > 0.4:
#         return "Chest / Thorax"

#     if area > 18000 and 0.9 <= aspect_ratio <= 1.3 and extent > 0.4:
#         return "Abdomen / Pelvis"

#     if area > 10000 and aspect_ratio < 0.4 and extent < 0.5:
#         return "Spine"

#     if 7000 < area < 15000 and 1.2 <= aspect_ratio <= 2.0 and extent > 0.4:
#         return "Shoulder / Clavicle"

#     if area > 5000 and aspect_ratio < 1.0 and extent > 0.3:
#         return "Upper Limb (Arm / Elbow / Hand)"

#     if area > 12000 and (0.6 <= aspect_ratio <= 1.2 or aspect_ratio > 2.0):
#         return "Lower Limb (Leg / Knee / Foot)"

#     if area < 8000 and aspect_ratio > 2.0:
#         return "Dental"

#     if area > 15000 and 1.0 <= aspect_ratio <= 1.4 and extent > 0.45:
#         return "Pelvis / Hip"

#     if area > 10000 and extent < 0.3:
#         return "Contrast / Special Studies"

#     if area > 8000:
#         return "Other Body Region"

#     return "Unclear / Incorrect Image"


#     # ---------------------------- CLASSIFICATION RULES ---------------------------- #

#      # Heuristic rules
#     # if area > 30000 and aspect_ratio > 0.5 and aspect_ratio < 1.5 and extent > 0.5:
#     #     return "Chest X-ray"
#     # elif area > 5000 and aspect_ratio < 0.6:
#     #     return "Hand X-ray"
#     # elif area > 10000 and aspect_ratio > 0.3 and aspect_ratio < 0.9:
#     #     return "Leg or Arm X-ray"
#     # elif area > 15000 and aspect_ratio > 0.2 and aspect_ratio < 0.5 and extent < 0.4:
#     #     return "Spine X-ray"
#     # elif area > 12000 and aspect_ratio > 0.9 and aspect_ratio < 1.1 and extent > 0.5:
#     #     return "Skull X-ray"
#     # elif area > 18000 and aspect_ratio > 1.2 and extent > 0.6:
#     #     return "Abdominal X-ray"
#     # elif area > 25000 and aspect_ratio > 0.8 and aspect_ratio < 1.4 and extent < 0.4:
#     #     return "Pelvis X-ray"
#     # elif area > 10000 and aspect_ratio > 1.5 and extent < 0.3:
#     #     return "Foot X-ray"
#     # else:
#     #     return "Unclear / Unknown Type"
    
   


# @app.route('/analyse_pic', methods=['POST'])
# def analyse_pic():
#     if 'file' not in request.files:
#         return jsonify({"error": "No file provided"}), 400

#     file = request.files['file']
#     filename = secure_filename(file.filename)
#     ext = os.path.splitext(filename)[1].lower()

#     if ext not in ['.jpg', '.jpeg', '.png', '.dcm']:
#         return jsonify({"error": "Unsupported file type"}), 400

#     filepath = os.path.join(UPLOAD_FOLDER, filename)
#     file.save(filepath)

#     if ext == ".dcm":
#         dicom_data = pydicom.dcmread(filepath)
#         img = dicom_data.pixel_array
#         img = cv2.convertScaleAbs(img)
#         img = cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)
#     else:
#         img = cv2.imread(filepath)

#     if img is None:
#         return jsonify({"error": "Failed to read image"}), 500

#     classification = classify_image_with_cv(img)
#     print(f"Classified Image as: {classification}")

#     return jsonify({"classification": classification})


# def analyse_folder_images(folder_path):
#     supported_exts = ['.jpg', '.jpeg', '.png', '.dcm']
#     image_paths = [f for f in glob.glob(os.path.join(folder_path, '*')) if os.path.splitext(f)[1].lower() in supported_exts]

#     if not image_paths:
#         print("[INFO] No supported image files found in the folder.")
#         return

#     print(f"[INFO] Found {len(image_paths)} image(s). Starting analysis...\n")

#     for path in image_paths:
#         filename = os.path.basename(path)
#         ext = os.path.splitext(filename)[1].lower()

#         try:
#             if ext == ".dcm":
#                 dicom_data = pydicom.dcmread(path)
#                 img = dicom_data.pixel_array
#                 img = cv2.convertScaleAbs(img)
#                 img = cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)
#             else:
#                 img = cv2.imread(path)

#             if img is None:
#                 print(f"[ERROR] Cannot read image: {filename}")
#                 continue

#             classification = classify_image_with_cv(img)
#             print(f"[RESULT] {filename}: {classification}")

#         except Exception as e:
#             print(f"[ERROR] Failed to process {filename}: {e}")


# if __name__ == "__main__":
#     import sys
#     if len(sys.argv) > 1:
#         folder_to_analyse = sys.argv[1]
#         analyse_folder_images(folder_to_analyse)
#     else:
#         app.run()
