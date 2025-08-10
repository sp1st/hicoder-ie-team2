from flask import Blueprint, jsonify, request
from app.models import User,WaterRecord
from app import db

users_bp = Blueprint('users', __name__)

# GET /api/v1/users/<user_id>
# ユーザー情報を取得
@users_bp.route('/<int:user_id>', methods=['GET'])
def get_user(user_id):
  # user_id を使ってデータベースからユーザーを1人探す
  # もし見つからなければ自動で404エラーを返す
  user = User.query.get_or_404(user_id)
  
  # ユーザー情報をJSON形式で返す
  return jsonify({
      'user_id': user.user_id,
      'user_name': user.user_name,
      'bio': user.bio,
      'X': user.X,
      'photo_url': user.photo_url
  })

# PUT /api/v1/users/<user_id>
# ユーザー情報の更新
@users_bp.route('/<int:user_id>', methods=['PUT'])
def update_user(user_id):

  # Content-Typeの確認
  if not request.is_json:
    return jsonify({'message': 'Content-Type must be application/json'}), 415

  # user_id を使ってデータベースからユーザーを1人探す
  # もし見つからなければ自動で404エラーを返す
  user = User.query.get_or_404(user_id)

  data = request.get_json()

  #値があれば更新(なければ元の値を保持）
  user.user_name = data.get('user_name', user.user_name)
  user.bio = data.get('bio', user.bio)
  user.X = data.get('X', user.X)
  user.photo_url = data.get('photo_url', user.photo_url)

  db.session.commit()

  return jsonify({
    'message' : 'User information updated successfully',
    'user_ID' : user.user_id,
    'user_name' : user.user_name,
    'bio' : user.bio,
    'X' : user.X,
    'photo_url' : user.photo_url
  })

# GET /api/v1/users/nearby/<user_id>
#　近くのユーザーのIDと位置情報を取得
@users_bp.route('/nearby/<int:user_id>', methods=['GET'])
def get_nearby_users(user_id):

  #IDからWaterRecordを取得
  record = WaterRecord.query.filter_by(user_id=user_id).order_by(WaterRecord.water_date.desc()).first()

  if not record:
    return jsonify({'message': 'No water record found for this user', 'user_id': user_id}), 404
  
  # WaterRecordから緯度経度を取得
  lat = record.lat
  lon = record.lon

  # 近くの記録を検索
  nearby_records = WaterRecord.query.filter(
      WaterRecord.lat.between(lat - 0.01, lat + 0.01),
      WaterRecord.lon.between(lon - 0.01, lon + 0.01),
      WaterRecord.user_id != user_id
  ).distinct(WaterRecord.user_id, WaterRecord.water_id).all()

  if not nearby_records:
    return jsonify({'message': 'No nearby water records found', 'user_id': user_id}), 404
  
  # ユーザー情報をJSON形式で返す
  records = []
  for info in nearby_records:
    info_data = {
      'user_id': info.user_id,
      'lat': info.lat,
      'lon': info.lon
    }
    records.append(info_data)

  return jsonify(records)
