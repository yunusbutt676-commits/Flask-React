from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'supersecretkey'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:@localhost/flask'
    db.init_app(app)
    CORS(app)

    from .routes.auth import auth_bp
    from .routes.jobs import jobs_bp
    from .routes.recommendation import rec_bp

    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(jobs_bp, url_prefix='/jobs')
    app.register_blueprint(rec_bp, url_prefix='/recommendation')

    @app.route('/')
    def home():
        return "Flask backend is running!"

    with app.app_context():
        db.create_all()

    return app

