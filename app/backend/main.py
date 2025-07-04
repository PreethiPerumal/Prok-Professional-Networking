from flask import Flask, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from config import Config
from dotenv import load_dotenv
from flask_jwt_extended import JWTManager
from api.auth import auth_bp
from api.profile import profile_bp
import os

# Load environment variables
load_dotenv()

# Import models
from models.user import db, User
from models.profile import Profile

# Create Flask app
app = Flask(__name__)
app.config.from_object(Config)

# Initialize extensions
CORS(app)

db.init_app(app)

# Initialize JWT with proper configuration
jwt = JWTManager(app)

# Register blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(profile_bp)

# Serve uploaded files
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    """Serve uploaded files"""
    upload_folder = app.config['UPLOAD_FOLDER']
    return send_from_directory(upload_folder, filename)

def setup_database():
    """Setup database tables"""
    with app.app_context():
        # Create uploads directory if it doesn't exist
        upload_folder = app.config['UPLOAD_FOLDER']
        os.makedirs(upload_folder, exist_ok=True)
        
        # Create database tables
        db.create_all()
        print("✅ Database tables created successfully!")
        print(f"✅ Upload folder created: {upload_folder}")
        print(f"✅ JWT Secret Key: {app.config.get('JWT_SECRET_KEY', 'Not set')}")

# Create a function to initialize the app
def create_app():
    """Application factory function"""
    return app

if __name__ == '__main__':
    # Setup database tables
    setup_database()
    
    # Run the app
    app.run(debug=True)