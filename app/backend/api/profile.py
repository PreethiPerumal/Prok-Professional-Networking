from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user import User
from models.profile import Profile, db
import os
import uuid
from flask import current_app
from werkzeug.utils import secure_filename
from PIL import Image
import json

profile_bp = Blueprint('profile', __name__)

@profile_bp.route('/api/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    profile = user.profile
    if not profile:
        profile = Profile(user_id=user.id, full_name="")
        db.session.add(profile)
    data = request.get_json()
    # Map frontend fields to backend fields
    field_map = {
        'name': 'full_name',
        'bio': 'bio',
        'location': 'location',
        'title': 'headline',
        'experience': 'experience',
        'education': 'education',
        'skills': 'skills',
        'website': 'website'
    }
    updated = False
    for frontend_field, backend_field in field_map.items():
        if frontend_field in data:
            value = data[frontend_field]
            if backend_field == 'full_name' and (not value or not isinstance(value, str)):
                return jsonify({'error': 'Full name is required and must be a string'}), 400
            if backend_field == 'education':
                setattr(profile, backend_field, json.dumps(value))
            elif backend_field == 'skills':
                if isinstance(value, list):
                    setattr(profile, backend_field, ','.join(value))
                else:
                    setattr(profile, backend_field, value)
            else:
                setattr(profile, backend_field, value)
            updated = True
    if not updated:
        return jsonify({'error': 'No valid fields to update'}), 400
    db.session.commit()
    return jsonify({'profile': profile.to_dict()}), 200

def allowed_image(filename):
    ext = filename.rsplit('.', 1)[-1].lower()
    return '.' in filename and ext in current_app.config['ALLOWED_IMAGE_EXTENSIONS']

def save_and_process_image(file, user_id):
    # Secure and unique filename
    ext = file.filename.rsplit('.', 1)[-1].lower()
    filename = f"profile_{user_id}_{uuid.uuid4().hex}.{ext}"
    filename = secure_filename(filename)
    upload_folder = current_app.config['UPLOAD_FOLDER']
    os.makedirs(upload_folder, exist_ok=True)
    filepath = os.path.join(upload_folder, filename)
    # Open and process image
    img = Image.open(file)
    img = img.convert('RGB')
    img.thumbnail(current_app.config['IMAGE_RESIZE_SIZE'])
    img.save(filepath, quality=current_app.config['IMAGE_COMPRESS_QUALITY'], optimize=True)
    # Generate thumbnail
    thumb_name = f"thumb_{filename}"
    thumb_path = os.path.join(upload_folder, thumb_name)
    img.thumbnail(current_app.config['IMAGE_THUMBNAIL_SIZE'])
    img.save(thumb_path, quality=80, optimize=True)
    return filename

@profile_bp.route('/api/profile/image', methods=['POST'])
@jwt_required()
def upload_profile_image():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400
    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if not allowed_image(file.filename):
        return jsonify({'error': 'Invalid file type'}), 400
    if file.content_length and file.content_length > current_app.config['MAX_CONTENT_LENGTH']:
        return jsonify({'error': 'File too large'}), 400
    try:
        filename = save_and_process_image(file, user_id)
    except Exception as e:
        return jsonify({'error': 'Image processing failed', 'details': str(e)}), 400
    # Update profile with image URL
    if not user.profile:
        user.profile = Profile(user_id=user.id, full_name="")
    user.profile.image_url = f"/uploads/{filename}"
    db.session.commit()
    return jsonify({'image_url': user.profile.image_url}), 200