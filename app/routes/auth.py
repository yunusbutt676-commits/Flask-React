from flask import Blueprint, request, jsonify, current_app
from ..models import User
from .. import db
import jwt

auth_bp = Blueprint('auth', __name__)

# Registration: frontend users only, role fixed to 'user'
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    role = data.get('role', 'user')  # default 'user'

    if not username or not password:
        return jsonify({'message': 'Username and password required'}), 400

    # Check if user already exists
    if User.query.filter_by(username=username).first():
        return jsonify({'message': 'User exists'}), 400

    # Only allow 'user' role for frontend
    if role != 'admin':  
        role = 'user'

    user = User(username=username, role=role)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    return jsonify({'message': f'{role.capitalize()} created'}), 201

# Login: works for both users and admin
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()
    if user and user.check_password(password):
        token = jwt.encode(
            {'username': user.username, 'role': user.role},
            current_app.config['SECRET_KEY'],
            algorithm="HS256"
        )
        # Ensure token is string
        if isinstance(token, bytes):
            token = token.decode('utf-8')

        return jsonify({'token': token})
    
    return jsonify({'message': 'Invalid credentials'}), 401
