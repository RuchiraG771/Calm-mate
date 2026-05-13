from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# ======================
# DATABASE MODEL
# ======================

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    age = db.Column(db.Integer)
    mobile = db.Column(db.String(20))
    password = db.Column(db.String(200), nullable=False)

# ======================
# ROUTES
# ======================

@app.route("/")
def home():
    return "Backend is running 🚀"

@app.route("/api/signup", methods=["POST"])
def signup():
    data = request.json
    username = data.get("username")
    password = data.get("password")
    age = data.get("age")
    mobile = data.get("mobile")

    if User.query.filter_by(username=username).first():
        return jsonify({"message": "User already exists"}), 400

    hashed_password = generate_password_hash(password)

    new_user = User(
        username=username,
        age=age,
        mobile=mobile,
        password=hashed_password
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User created successfully"})

@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    user = User.query.filter_by(username=username).first()

    if user and check_password_hash(user.password, password):
        return jsonify({
            "message": "Login successful",
            "username": user.username
        })
    else:
        return jsonify({"message": "Invalid credentials"}), 401

# ======================

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)