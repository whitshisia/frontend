from flask import Flask, request, jsonify
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity,get_jwt
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from datetime import timedelta, datetime
import random,os
from dotenv import load_dotenv, dotenv_values
from models import db, User, Book, Category, BookBorrow
load_dotenv()

postgres_pwd = os.getenv("POSTGRES_PWD") 

app = Flask(__name__)
app.config["SECRET_KEY"] = "jdhfvksdjkgh" + str(random.randint(1, 1000000))
app.config["SQLALCHEMY_DATABASE_URI"] = f"postgresql://majestic_db_mfdl_user:{postgres_pwd}" 
# "sqlite:///library.db"
app.config["JWT_SECRET_KEY"] = "evrfsejhfgvret" + str(random.randint(1, 1000000))
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=1)

jwt = JWTManager(app)

# CORS configuration
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

migrate = Migrate(app, db)
db.init_app(app)

bcrypt = Bcrypt()

@app.route('/')
def index():
    return jsonify({"message": "Welcome to the Library Management System!"})

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

@app.route('/book/<int:id>', methods=['GET'])
def get_book(id):
    book = Book.query.get_or_404(id)
    return jsonify(book.to_dict()), 200

@app.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()

    email = data.get("email", None)
    email_exists = User.query.filter_by(email=email).first()
    if email_exists:
        return jsonify({"error": "Email already exists"}), 400
        
    new_user = User(
        username=data.get("username", None), 
        email=data.get("email", None),
        password=bcrypt.generate_password_hash(data.get("password", None)).decode('utf-8'),
        is_admin=data.get('is_admin', False)
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"success": "User created successfully"}), 201

@app.route('/login', methods=['POST'])
def login():
    email = request.json.get('email')
    password = request.json.get('password')

    # Query the user by email
    user = User.query.filter_by(email=email).first()

    if user and bcrypt.check_password_hash(user.password, password):
        access_token = create_access_token(identity=user.id)
        return jsonify({"access_token": access_token}), 200
    else:
        return jsonify({"error": "Invalid credentials"}), 401

@app.route("/current_user", methods=["GET"])
@jwt_required()
def current_user():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    user_data = {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "is_admin": user.is_admin,
    }
    return jsonify(user_data), 200


# Logout
BLACKLIST = set()
@jwt.token_in_blocklist_loader
def check_if_token_in_blocklist(jwt_header, decrypted_token):
    return decrypted_token['jti'] in BLACKLIST

@app.route("/logout", methods=["DELETE"])
@jwt_required()
def logout():
    jti = get_jwt()["jti"]
    return jsonify({"success": "Successfully logged out"}), 200

@app.route('/users', methods=['GET'])
@jwt_required()
def get_users():
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    
    if not current_user.is_admin:
        return jsonify({"error": "You are not authorized to view this page"}), 401

    users = User.query.all()
    user_list = [{
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "is_admin": user.is_admin,
    } for user in users]
    return jsonify(user_list), 200

@app.route('/users/<int:id>', methods=['GET'])
@jwt_required()
def get_user(id):
    user = User.query.get(id)
    if not user:
        return jsonify({"message": "User not found"}), 404
    return jsonify({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "is_admin": user.is_admin,
    }), 200

@app.route('/update_user/<int:id>', methods=['PUT'])
@jwt_required()
def update_user(id):
    data = request.get_json()

    user = User.query.get(id)
    if not user:
        return jsonify({"message": "User not found"}), 404
    
    # Update user attributes based on the request data
    if 'username' in data:
        user.username = data['username']
    if 'email' in data:
        user.email = data['email']
    if 'password' in data:
        user.password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    if 'is_admin' in data:
        user.is_admin = data['is_admin']

    db.session.commit()
    return jsonify({"success": "User updated successfully"}), 200

@app.route('/users/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_user(id):
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    if not current_user.is_admin:
        return jsonify({"error": "Only admins can delete users"}), 403

    user = User.query.get_or_404(id)
    db.session.delete(user)
    db.session.commit()

    return jsonify({"message": "User deleted successfully"}), 200

@app.route('/books/search', methods=['GET'])
def search_books():
    query = request.args.get('query', '')

    books_by_title = Book.query.filter(Book.title.ilike(f'%{query}%')).all()
    books_by_author = Book.query.filter(Book.author.ilike(f'%{query}%')).all()

    category = Category.query.filter(Category.name.ilike(f'%{query}%')).first()
    books_by_category = []
    if category:
        books_by_category = category.books

    search_results = list(set(books_by_title + books_by_author + books_by_category))

    if not search_results:
        return jsonify({"message": "No books found matching the search criteria."}), 404

    serialized_books = [book.to_dict() for book in search_results]
    return jsonify(serialized_books), 200

@app.route('/create_book', methods=['POST'])
@jwt_required()
def create_book():
    data = request.get_json()

    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    if not current_user.is_admin:
        return jsonify({"error": "Only admins can create books"}), 403

    new_book = Book(
        title=data['title'],
        author=data['author'],
        genre=data['genre'],
        isbn=data['isbn'],
        available_copies=data['available_copies']
    )

    try:
        db.session.add(new_book)
        db.session.commit()
        return jsonify({"success": "Book created successfully", "book": new_book.to_dict()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

@app.route('/books', methods=['GET'])
def get_books():
    books = Book.query.all()
    book_list = [{
        "id": book.id,
        "title": book.title,
        "author": book.author,
        "genre": book.genre,
        "isbn": book.isbn,
        "available_copies": book.available_copies
    } for book in books]
    return jsonify(book_list), 200

@app.route('/update_book/<int:id>', methods=['PUT'])
@jwt_required()
def update_book(id):
    data = request.get_json()

    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    if not current_user.is_admin:
        return jsonify({"error": "Only admins can update books"}), 403

    book = Book.query.get_or_404(id)
    book.title = data.get('title', book.title)
    book.author = data.get('author', book.author)
    book.genre = data.get('genre', book.genre)
    book.isbn = data.get('isbn', book.isbn)
    book.available_copies = data.get('available_copies', book.available_copies)

    try:
        db.session.commit()
        return jsonify({"success": "Book updated successfully", "book": book.to_dict()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

@app.route('/delete_book/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_book(id):
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    if not current_user.is_admin:
        return jsonify({"error": "Only admins can delete books"}), 403

    book = Book.query.get(id)
    if not book:
        return jsonify({"message": "Book not found"}), 404

    try:
        db.session.delete(book)
        db.session.commit()
        return jsonify({"message": "Book deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

@app.route('/bookborrows', methods=['GET'])
def borrowed_books():
    borrowed_books = Book.query.all()
    borrowed_books_list = []
    for book in borrowed_books:
        borrowed_books_list.append({
            'title': book.title,
            'author': book.author
        })
    return jsonify(borrowed_books_list)
    

@app.route('/book/borrow', methods=['POST'])
@jwt_required()
def borrow_book():
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    book_id = request.json.get('book_id')
    book = Book.query.get_or_404(book_id)

    if book.available_copies < 1:
        return jsonify({"error": "No copies available"}), 400

    new_borrow = BookBorrow(user_id=current_user.id, book_id=book.id)
    book.available_copies -= 1

    try:
        db.session.add(new_borrow)
        db.session.commit()
        return jsonify({"success": "Book borrowed successfully", "borrow": new_borrow.to_dict()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

@app.route('/book/return', methods=['POST'])
@jwt_required()
def return_book():
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    borrow_id = request.json.get('borrow_id')
    borrow = BookBorrow.query.get_or_404(borrow_id)

    if borrow.user_id != current_user.id:
        return jsonify({"error": "Unauthorized"}), 403

    borrow.return_date = datetime.utcnow()
    borrow.book.available_copies += 1

    try:
        db.session.commit()
        return jsonify({"message": "Book returned successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True)
