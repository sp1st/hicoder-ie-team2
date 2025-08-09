from datetime import datetime, date
from flask import Blueprint, jsonify, request
from app.models import WaterRecord, User
from app import db

water_records_bp = Blueprint('water_records', __name__)

# GET /api/v1/water_records/<user_id>
# ユーザーの水分補給記録一覧を取得
@water_records_bp.route('/<int:user_id>', methods=['GET'])
def get_water_records(user_id):
    water_records = WaterRecord.query.filter_by(user_id=user_id).order_by(WaterRecord.water_date.desc()).all()
    
    records = []
    for record in water_records:
        records.append({
            'water_id': record.water_id,
            'water_date': record.water_date.isoformat(),
            'water_type': record.water_type,
            'water_amount': record.water_amount,
            'lat': record.lat,
            'lon': record.lon,
            'comment': record.comment,
            'user_id': record.user_id
        })
    
    return jsonify(records)

# GET /api/v1/water_records/today/<user_id>
# 指定されたuser_idのユーザーの今日の水分補給量の取得
@water_records_bp.route('/today/<int:user_id>', methods=['GET'])
def get_today_water_records(user_id):
    today = date.today()
    water_records = WaterRecord.query.filter(
        WaterRecord.user_id == user_id,
        db.func.date(WaterRecord.water_date) == today
    ).all()
    
    records = []
    for record in water_records:
        record_data = {
            'water_id': record.water_id,
            'water_date': record.water_date.isoformat(),
            'water_type': record.water_type,
            'water_amount': record.water_amount,
            'lat': record.lat,
            'lon': record.lon,
            'comment': record.comment,
            'user_id': record.user_id
        }
        records.append(record_data)
    
    return jsonify(records)

# GET /api/v1/water_records/now/<user_id>
# 指定されたuser_idのユーザーの最新の水分補給量の取得
@water_records_bp.route('/now/<int:user_id>', methods=['GET'])
def get_now_water_records(user_id):
    latest_record = WaterRecord.query.filter_by(user_id=user_id).order_by(WaterRecord.water_date.desc()).first()
    
    if not latest_record:
        return jsonify({'message': 'No water records found', 'user_id': user_id}), 404
    
    return jsonify({
        'water_id': latest_record.water_id,
        'water_date': latest_record.water_date.isoformat(),
        'water_type': latest_record.water_type,
        'water_amount': latest_record.water_amount,
        'lat': latest_record.lat,
        'lon': latest_record.lon,
        'comment': latest_record.comment,
        'user_id': latest_record.user_id
    })

# POST /api/v1/water_records/<user_id>
# 新規水分補給記録の作成
@water_records_bp.route('/<int:user_id>', methods=['POST'])
def create_water_record(user_id):
    data = request.get_json()
    
    # 必須フィールドのチェック
    required_fields = ['water_amount', 'lat', 'lon']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Missing required field: {field}'}), 400
    
    # ユーザーの存在確認
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    # 新しい水分記録を作成
    new_record = WaterRecord(
        user_id=user_id,
        water_amount=data['water_amount'],
        lat=data['lat'],
        lon=data['lon'],
        water_type=data.get('water_type'),
        comment=data.get('comment'),
        water_date=datetime.now()
    )
    
    try:
        db.session.add(new_record)
        db.session.commit()
        
        return jsonify({
            'water_id': new_record.water_id,
            'water_date': new_record.water_date.isoformat(),
            'water_type': new_record.water_type,
            'water_amount': new_record.water_amount,
            'lat': new_record.lat,
            'lon': new_record.lon,
            'comment': new_record.comment,
            'user_id': new_record.user_id
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to create water record'}), 500

# PUT /api/v1/water_records/<water_id>
#　水分補給記録の更新
@water_records_bp.route('/<int:water_id>', methods=['PUT'])
def update_water_record(water_id):

    # Content-Typeの確認
    if not request.is_json:
        return jsonify({'message': 'Content-Type must be application/json'}), 415
    
    record = WaterRecord.query.get(water_id)

    #　水分補給記録の存在確認
    if not record:
        return jsonify({'message': 'Water record not found','water_id': water_id}), 404

    data = request.get_json()

    # 値があれば更新（なければ元の値を保持）
    record.water_id = data.get('water_id', record.water_id)
    record.water_date = data.get('water_date', record.water_date)
    record.water_type = data.get('water_type', record.water_type)
    record.water_amount = data.get('water_amount', record.water_amount)
    record.lat = data.get('lat', record.lat)
    record.lon = data.get('lon', record.lon)
    record.comment = data.get('comment', record.comment)
    record.user_id = data.get('user_id', record.user_id)

    db.session.commit()

    return jsonify({
        'message' : 'Water record updated successfully',
        'water_id': record.water_id,
        'water_date': record.water_date.isoformat() if record.water_date else None,
        'water_type': record.water_type,
        'water_amount': record.water_amount,
        'lat': record.lat,
        'lon': record.lon,
        'comment': record.comment,
        'user_id': record.user_id
    })