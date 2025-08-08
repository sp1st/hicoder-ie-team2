## Backend

## 実行方法

1. 移動

```
cd backend
```

2. 仮想環境を有効にする

```
python -m venv .venv
source .venv/bin/activate  # (Windowsの場合は .venv\Scripts\activate)
```

3. パッケージのインストール

```
pip install -r requirements.txt
```

4. マイグレーションを適用

```
flask db upgrade
```

5. アプリケーションの起動

```
flask run
```

`http://localhost:5000` で起動します。

## データベースを変更したとき

1. `model.py`を変更
2. マイグレーションを作成

```bash
flask db migrate -m "Add new field"
```
