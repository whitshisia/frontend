from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    contact_info = db.Column(db.String(200), nullable=True)
    is_admin = db.Column(db.Boolean, default=False)
    borrows = db.relationship('BookBorrow', backref='user', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'contact_info': self.contact_info,
            'is_admin': self.is_admin,
        }

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Book(db.Model):
    __tablename__ = "books"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    author = db.Column(db.String(200), nullable=False)
    genre = db.Column(db.String(100), nullable=False)
    isbn = db.Column(db.String(20), nullable=False)
    available_copies = db.Column(db.Integer, nullable=False)
    
    categories = db.relationship('Category', secondary='category_book', backref=db.backref('books', lazy=True))
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'author': self.author,
            'genre': self.genre,
            'isbn': self.isbn,
            'available_copies': self.available_copies,
            'categories': [category.name for category in self.categories]
        }

class Category(db.Model):
    __tablename__ = 'categories'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name
        }

class BookBorrow(db.Model):
    __tablename__ = 'book_borrows'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)  
    book_id = db.Column(db.Integer, db.ForeignKey('books.id'), nullable=False)  
    borrow_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    return_date = db.Column(db.DateTime, nullable=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'book_id': self.book_id,
            'borrow_date': self.borrow_date.isoformat(),
            'return_date': self.return_date.isoformat() if self.return_date else None
        }

class CategoryBook(db.Model):
    __tablename__ = 'category_book'
    
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), primary_key=True)
    book_id = db.Column(db.Integer, db.ForeignKey('books.id'), primary_key=True)
    
    def to_dict(self):
        return {
            'category_id': self.category_id,
            'book_id': self.book_id
        }
       