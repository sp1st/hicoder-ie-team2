from flask import Blueprint, jsonify, request
from app.models import User
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
