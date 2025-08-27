from flask import Blueprint, request, jsonify
from ..models import Job
from ..ml_model import JobMatcher

rec_bp = Blueprint('rec', __name__)

@rec_bp.route('/', methods=['POST'])
def recommend_jobs():
    data = request.get_json()
    user_skills = data.get('skills', '').strip()
    
    if not user_skills:
        return jsonify({'message': 'Please provide your skills'}), 400

    jobs = [{'title': j.title, 'description': j.description} for j in Job.query.all()]
    if not jobs:
        return jsonify([])  # no jobs in database

    matcher = JobMatcher(jobs)
    recommended = matcher.recommend(user_skills, top_n=5, min_score=0.2)  # filter by score

    if not recommended:
        return jsonify({'message': 'No jobs match your skills'}), 200

    return jsonify(recommended)
