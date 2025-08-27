from flask import Blueprint, request, jsonify
from ..models import Job, db
from ..utils import token_required

jobs_bp = Blueprint('jobs', __name__)

# Get all jobs (open to everyone)
@jobs_bp.route('/', methods=['GET'])
def get_jobs():
    jobs = Job.query.all()
    return jsonify([{'id': j.id, 'title': j.title, 'description': j.description} for j in jobs])

# Add a new job (admin only)
@jobs_bp.route('/', methods=['POST'])
@token_required
def add_job(data):
    if data['role'] != 'admin':
        return jsonify({'message': 'Admin only'}), 403

    job_data = request.get_json()
    if not job_data.get('title') or not job_data.get('description'):
        return jsonify({'message': 'Title and description required'}), 400

    job = Job(title=job_data['title'], description=job_data['description'])
    db.session.add(job)
    db.session.commit()
    return jsonify({'message': 'Job added', 'job': {'id': job.id, 'title': job.title, 'description': job.description}})

# Update a job (admin only)
@jobs_bp.route('/<int:job_id>', methods=['PUT'])
@token_required
def update_job(data, job_id):
    if data['role'] != 'admin':
        return jsonify({'message': 'Admin only'}), 403

    job = Job.query.get(job_id)
    if not job:
        return jsonify({'message': 'Job not found'}), 404

    job_data = request.get_json()
    job.title = job_data.get('title', job.title)
    job.description = job_data.get('description', job.description)
    db.session.commit()
    return jsonify({'message': 'Job updated', 'job': {'id': job.id, 'title': job.title, 'description': job.description}})

# Delete a job (admin only)
@jobs_bp.route('/<int:job_id>', methods=['DELETE'])
@token_required
def delete_job(data, job_id):
    if data['role'] != 'admin':
        return jsonify({'message': 'Admin only'}), 403

    job = Job.query.get(job_id)
    if not job:
        return jsonify({'message': 'Job not found'}), 404

    db.session.delete(job)
    db.session.commit()
    return jsonify({'message': 'Job deleted'})
