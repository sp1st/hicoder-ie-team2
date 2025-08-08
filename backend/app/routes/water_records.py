from flask import Blueprint, jsonify, request
from app.models import WaterRecord, User

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