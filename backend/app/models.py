from . import db
from datetime import datetime

# User
class User(db.Model):
  __tablename__ = 'users'

  user_id = db.Column(db.Integer, primary_key=True)
  user_name = db.Column(db.String(80), nullable=False)
  bio = db.Column(db.String(200), nullable=True)
  X = db.Column(db.String(50), nullable=True)
  photo_url = db.Column(db.String(255), nullable=True)
  password_hash = db.Column(db.String(255), nullable=False)
  
  # 1人のユーザーは0以上の水分記録を持つ
  water_records = db.relationship('WaterRecord', backref='user', lazy=True)
  # 1人のユーザーは0以上のスタンプを送信できる
  sent_stamps = db.relationship('UserStamp', foreign_keys='UserStamp.sender_id', backref='sender', lazy=True)
  # 1人のユーザーは0以上のスタンプを受信できる
  received_stamps = db.relationship('UserStamp', foreign_keys='UserStamp.receiver_id', backref='receiver', lazy=True)

class WaterRecord(db.Model):
    __tablename__ = 'water_record'
    
    water_id = db.Column(db.Integer, primary_key=True)
    water_date = db.Column(db.DateTime, nullable=False, default=datetime.now)
    water_type = db.Column(db.String(50))
    water_amount = db.Column(db.Integer)
    lat = db.Column(db.Float, nullable=False)
    lon = db.Column(db.Float, nullable=False)
    comment = db.Column(db.String(200))
    
    # 外部キー
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)

class Stamp(db.Model):
  __tablename__ = 'stamp'
  
  stamp_id = db.Column(db.Integer, primary_key=True)
  message = db.Column(db.String(100))
  image_url = db.Column(db.String(255), nullable=False)
  
  # 1つのスタンプは複数のuser_stampレコードで使用される
  user_stamps = db.relationship('UserStamp', backref='stamp_info', lazy=True)

# ユーザー間のスタンプ送受信記録モデル
class UserStamp(db.Model):
  __tablename__ = 'user_stamp'
  
  user_stamp_id = db.Column(db.Integer, primary_key=True)
  after_stamp = db.Column(db.Boolean, default=False)
  created_at = db.Column(db.DateTime, nullable=False, default=datetime.now)
  updated_at = db.Column(db.DateTime, nullable=False, default=datetime.now)
  
  # 外部キー
  sender_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
  receiver_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
  stamp_id = db.Column(db.Integer, db.ForeignKey('stamp.stamp_id'), nullable=False)
