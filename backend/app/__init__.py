from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate
from config import Config

db = SQLAlchemy()
migrate = Migrate()

def create_app(config_class=Config):
  app = Flask(__name__)

  # config
  app.config.from_object(config_class)

  # DBの初期化
  db.init_app(app)
  migrate.init_app(app, db)
  CORS(app)

  # Blueprintsの登録
  # Users
  from .routes.users import users_bp
  app.register_blueprint(users_bp, url_prefix='/api/v1/users')

  # Water Record
  from .routes.water_records import water_records_bp
  app.register_blueprint(water_records_bp, url_prefix='/api/v1/water_records')

  # Stamp
  from .routes.stamps import stamps_bp
  app.register_blueprint(stamps_bp, url_prefix='/api/v1/stamps')

  return app