from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from models.user import User, db

import sys

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    print("/api/signup received:", data)
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({'message': 'Missing required fields.'}), 400

    # Check uniqueness
    if User.query.filter((User.username == username) | (User.email == email)).first():
        return jsonify({'message': 'Username or email already exists.'}), 400

    user = User(username=username, email=email)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    return jsonify({'message': 'User created successfully.'}), 201

@auth_bp.route('/api/login', methods=['POST'])
def login():
    print("/api/login headers:", dict(request.headers), file=sys.stderr)
    print("/api/login raw data:", request.data, file=sys.stderr)
    data = request.get_json(force=True)
    print("/api/login received:", data, file=sys.stderr)
    # Accept multiple possible field names for the login identifier
    username_or_email = (
        data.get('usernameOrEmail') or
        data.get('username') or
        data.get('email')
    )
    password = data.get('password')

    if not username_or_email or not password:
        return jsonify({'message': 'Missing credentials.'}), 400

    user = User.query.filter(
        (User.username == username_or_email) | (User.email == username_or_email)
    ).first()
    if not user or not user.check_password(password):
        return jsonify({'message': 'Incorrect username/email or password.'}), 401

    # Store user ID as string in JWT token
    access_token = create_access_token(identity=str(user.id))
    return jsonify({
        'token': access_token,
        'user': user.to_dict()
    }), 200