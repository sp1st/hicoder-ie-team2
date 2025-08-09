from app import create_app, db
from app.models import User, WaterRecord, Stamp, UserStamp
from werkzeug.security import generate_password_hash
from datetime import datetime

def init_database():
    app = create_app()
    
    with app.app_context():
        # データベースのテーブルを作成
        print("Creating database tables...")
        db.create_all()
        
        # サンプルユーザーを作成
        print("Creating sample users...")
        user1 = User(
            user_name="test_user1",
            password_hash=generate_password_hash("password123"),
            bio="水分補給を頑張ります！",
            photo_url="https://example.com/avatar1.jpg"
        )
        
        user2 = User(
            user_name="test_user2", 
            password_hash=generate_password_hash("password123"),
            bio="健康第一！",
            photo_url="https://example.com/avatar2.jpg"
        )
        
        db.session.add(user1)
        db.session.add(user2)
        db.session.commit()
        
        # サンプルスタンプを作成
        print("Creating sample stamps...")
        stamp1 = Stamp(
            message="水分補給して！",
            image_url="💧"
        )

        stamp2 = Stamp(
            message="がんばって！",
            image_url="💪"
        )

        stamp3 = Stamp(
            message="おつかれさま！",
            image_url="🎉"
        )
        
        db.session.add(stamp1)
        db.session.add(stamp2)
        db.session.add(stamp3)
        db.session.commit()
        
        # サンプルの水分記録を作成
        print("Creating sample water records...")
        water_record1 = WaterRecord(
            user_id=user1.user_id,
            water_amount=500,
            water_type="水",
            lat=35.6762,
            lon=139.6503,
            comment="朝の水分補給",
            water_date=datetime.now()
        )
        
        water_record2 = WaterRecord(
            user_id=user2.user_id,
            water_amount=300,
            water_type="お茶",
            lat=35.6762,
            lon=139.6503,
            comment="昼食後の水分補給",
            water_date=datetime.now()
        )
        
        db.session.add(water_record1)
        db.session.add(water_record2)
        db.session.commit()
        
        # サンプルのスタンプ送信記録を作成
        print("Creating sample stamp records...")
        user_stamp1 = UserStamp(
            sender_id=user1.user_id,
            receiver_id=user2.user_id,
            stamp_id=stamp1.stamp_id,
            after_stamp=False,
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
        
        db.session.add(user_stamp1)
        db.session.commit()
        
        print("Database initialization completed!")
        print(f"Created users: {user1.user_name}, {user2.user_name}")
        print(f"Created stamps: {stamp1.message}, {stamp2.message}, {stamp3.message}")

if __name__ == "__main__":
    init_database()
