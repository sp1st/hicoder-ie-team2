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

