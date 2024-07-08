from flask import Flask, request, jsonify
from  flask_migrate import Migrate
from flask_jwt_extended import JWTManager, jwt_required, create_access_token
from flask_cors import CORS
import random
from datetime import timedelta, datetime

app = Flask(__name__)
app.config["SECRET_KEY"] = "jdhfvksdjkgh" + str(random.randint(1, 1000000))
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///library.db"
app.config["JWT_SECRET_KEY"] = "evrfsejhfgvret" + str(random.randint(1, 1000000))
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=1)

jwt = JWTManager(app)
CORS(app)
from models import db, User, Book, Category, BookBorrow, CategoryBook

migrate = Migrate(app, db)
db.init_app(app)

@app.route('/')
def index():
    return jsonify({"message": "Welcome to the Library Management System!"})

@app.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    return jsonify(user.to_dict()), 200

@app.route('/borrowing-history', methods=['GET'])
@jwt_required()
def borrowing_history():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    borrows = user.borrows
    return jsonify([borrow.to_dict() for borrow in borrows]), 200

@app.route('/register', methods=['POST'])
def register():
    username = request.json.get('username')
    email = request.json.get('email')
    password = request.json.get('password')

    if User.query.filter_by(username=username).first() or User.query.filter_by(email=email).first():
        return jsonify({"error": "User already exists"}), 400

    new_user = User(username=username, email=email)
    new_user.set_password(password)

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201

@app.route('/login', methods=['POST'])
def login():
    email = request.json.get('email')
    password = request.json.get('password')

    user = User.query.filter_by(email=email).first()

    if user is None or not user.check_password(password):
        return jsonify({"error": "Invalid credentials"}), 401

    access_token = create_access_token(identity=user.id)
    return jsonify({"access_token": access_token}), 200

@app.route('/reset_password', methods=['POST'])
@jwt_required()
def reset_password():
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    old_password = request.json.get('old_password')
    new_password = request.json.get('new_password')

    if not current_user.check_password(old_password):
        return jsonify({"error": "Old password is incorrect"}), 400

    current_user.set_password(new_password)
    db.session.commit()

    return jsonify({"message": "Password updated successfully"}), 200

@app.route('/books', methods=['GET'])
def get_books():
    books = Book.query.all()
    return jsonify([book.to_dict() for book in books]), 200

@app.route('/book/<int:id>', methods=['GET'])
def get_book(id):
    book = Book.query.get_or_404(id)
    return jsonify(book.to_dict()), 200

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
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    if not current_user.is_admin:
        return jsonify({"error": "Only admins can create books"}), 403

    data = request.json
    new_book = Book(
        title=data['title'],
        author=data['author'],
        genre=data['genre'],
        isbn=data['isbn'],
        available_copies=data['available_copies']
    )
    db.session.add(new_book)
    db.session.commit()

    return jsonify(new_book.to_dict()), 201

@app.route('/update_book/<int:id>', methods=['PUT'])
@jwt_required()
def update_book(id):
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    if not current_user.is_admin:
        return jsonify({"error": "Only admins can update books"}), 403

    book = Book.query.get_or_404(id)
    data = request.json
    book.title = data.get('title', book.title)
    book.author = data.get('author', book.author)
    book.genre = data.get('genre', book.genre)
    book.isbn = data.get('isbn', book.isbn)
    book.available_copies = data.get('available_copies', book.available_copies)

    db.session.commit()

    return jsonify(book.to_dict()), 200

@app.route('/delete_book/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_book(id):
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    if not current_user.is_admin:
        return jsonify({"error": "Only admins can delete books"}), 403

    book = Book.query.get_or_404(id)
    db.session.delete(book)
    db.session.commit()

    return jsonify({"message": "Book deleted"}), 200

@app.route('/borrow_book/borrow', methods=['POST'])
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

    db.session.add(new_borrow)
    db.session.commit()

    return jsonify(new_borrow.to_dict()), 201

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

    db.session.commit()

    return jsonify({"message": "Book returned"}), 200

if __name__ == '__main__':
    app.run(debug=True)