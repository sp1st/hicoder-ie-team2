from flask import Blueprint, jsonify, request
from app.models import Stamp

stamps_bp = Blueprint('stamps', __name__)

# GET /api/v1/stamps
# 利用可能なスタンプ一覧を取得
@stamps_bp.route('/', methods=['GET'])
def get_stamps():
    stamps = Stamp.query.all()
    
    stamps_list = []
    for stamp in stamps:
        stamps_list.append({
            'stamp_id': stamp.stamp_id,
            'message': stamp.message,
            'image_url': stamp.image_url
        })
    
    return jsonify(stamps_list)

# GET /api/v1/stamps/send/<stamp_id>
# 指定されたstamp_idのスタンプの情報を取得
@stamps_bp.route('/<int:stamp_id>', methods=['GET'])
def get_stamp(stamp_id):
    stamp = Stamp.query.get_or_404(stamp_id)

    return jsonify({
        'stamp_id': stamp.stamp_id,
        'message': stamp.message,
        'image_url': stamp.image_url
    })
