from datetime import datetime
from flask import Blueprint, jsonify, request
from app.models import Stamp, User, UserStamp
from app import db

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

# GET /api/v1/stamps/<stamp_id>
# 指定されたstamp_idのスタンプの情報を取得
@stamps_bp.route('/<int:stamp_id>', methods=['GET'])
def get_stamp(stamp_id):
    stamp = Stamp.query.get_or_404(stamp_id)

    return jsonify({
        'stamp_id': stamp.stamp_id,
        'message': stamp.message,
        'image_url': stamp.image_url
    })

# GET api/v1/stamps/send/<user_id>
# 指定されたuser_idのユーザーに送られたスタンプの一覧を取得
@stamps_bp.route('/send/<int:user_id>', methods=['GET'])
def get_send_stamps(user_id):
    # ユーザーの存在確認
    user = User.query.get_or_404(user_id)
    
    # そのユーザーが受信したスタンプを取得
    received_stamps = UserStamp.query.filter_by(receiver_id=user_id).order_by(UserStamp.created_at.desc()).all()
    
    stamps_list = []
    for user_stamp in received_stamps:
        stamps_list.append({
            'user_stamp_id': user_stamp.user_stamp_id,
            'sender_id': user_stamp.sender_id,
            'receiver_id': user_stamp.receiver_id,
            'stamp_id': user_stamp.stamp_id,
            'stamp_message': user_stamp.stamp_info.message,
            'stamp_image_url': user_stamp.stamp_info.image_url,
            'after_stamp': user_stamp.after_stamp,
            'created_at': user_stamp.created_at.isoformat(),
            'updated_at': user_stamp.updated_at.isoformat(),
            'sender_name': user_stamp.sender.user_name
        })
    
    return jsonify(stamps_list)

# POST /api/v1/stamps/send
# スタンプを送信
# 送信するデータの例：{ "sender_id": 1, "receiver_id": 2, "stamp_id": 1 }
@stamps_bp.route('/send', methods=['POST'])
def send_stamp():
    # JSONデータを取得
    try:
        data = request.get_json(force=True)
        if data is None:
            return jsonify({'error': 'No JSON data provided'}), 400
    except Exception as e:
        return jsonify({'error': f'Failed to parse JSON: {str(e)}'}), 400
    
    # 必須フィールドの取得
    sender_id = data.get('sender_id')
    receiver_id = data.get('receiver_id')
    stamp_id = data.get('stamp_id')
    
    if not all([sender_id, receiver_id, stamp_id]):
        return jsonify({'error': 'Missing required fields'}), 400

    # 送信者と受信者の存在確認
    sender = User.query.get(sender_id)
    receiver = User.query.get(receiver_id)
    if not sender or not receiver:
        return jsonify({'error': 'Sender or receiver not found'}), 404

    # スタンプの存在確認
    stamp = Stamp.query.get(stamp_id)
    if not stamp:
      return jsonify({'error': 'Stamp not found'}), 404

    # スタンプの送信
    new_stamp = UserStamp(
      sender_id=sender_id,
      receiver_id=receiver_id,
      stamp_id=stamp_id,
      created_at=datetime.now(),
      updated_at=datetime.now()
    )

    try:
      db.session.add(new_stamp)
      db.session.commit()
      return jsonify({
        'user_stamp_id': new_stamp.user_stamp_id,
        'sender_id': new_stamp.sender_id,
        'receiver_id': new_stamp.receiver_id,
        'stamp_id': new_stamp.stamp_id,
        'created_at': new_stamp.created_at.isoformat(),
        'updated_at': new_stamp.updated_at.isoformat()
      }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to send stamp'}), 500
  
# PUT api/v1/stamps/reply/<user_stamp_id>
# 指定されたuser_stamp_idのスタンプに返信する(after_stampフラグを更新)
@stamps_bp.route('/reply/<int:user_stamp_id>', methods=['PUT'])
def reply_stamp(user_stamp_id):
    # スタンプが本当に送信されたか確認
    user_stamp = UserStamp.query.get_or_404(user_stamp_id)

    # スタンプの返信
    if user_stamp.after_stamp:
      return jsonify({'error': 'Stamp already replied'}), 400
    else:
      user_stamp.after_stamp = True
      user_stamp.updated_at = datetime.now()

    try:
      db.session.commit()
      return jsonify({
        'user_stamp_id': user_stamp.user_stamp_id,
        'sender_id': user_stamp.sender_id,
        'receiver_id': user_stamp.receiver_id,
        'after_stamp': user_stamp.after_stamp,
        'stamp_id': user_stamp.stamp_id,
        'created_at': user_stamp.created_at.isoformat(),
        'updated_at': user_stamp.updated_at.isoformat()
      }), 200
    except Exception as e:
      db.session.rollback()
      return jsonify({'error': 'Failed to reply stamp'}), 500