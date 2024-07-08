#!/usr/bin/env python3

from app import app, db
from models import User, Book, BookBorrow, Category, CategoryBook
from werkzeug.security import generate_password_hash
import random
from datetime import datetime, timedelta

def seed_users():
    # Define user data
    users_data = [
        {'username': 'user1', 'email': 'user1@example.com', 'password': 'password', 'is_admin': True},
        {'username': 'user2', 'email': 'user2@example.com', 'password': 'password', 'is_admin': True},
        {'username': 'user3', 'email': 'user3@example.com', 'password': 'password', 'is_admin': False},
        {'username': 'user4', 'email': 'user4@example.com', 'password': 'password', 'is_admin': False},
        {'username': 'user5', 'email': 'user5@example.com', 'password': 'password', 'is_admin': False},
        {'username': 'user6', 'email': 'user6@example.com', 'password': 'password', 'is_admin': False},
        {'username': 'user7', 'email': 'user7@example.com', 'password': 'password', 'is_admin': False},
        {'username': 'user8', 'email': 'user8@example.com', 'password': 'password', 'is_admin': False},
        {'username': 'user9', 'email': 'user9@example.com', 'password': 'password', 'is_admin': False},
        {'username': 'user10', 'email': 'user10@example.com', 'password': 'password', 'is_admin': False}
    ]

    # Seed users
    for data in users_data:
        user = User(
            username=data['username'],
            email=data['email'],
            is_admin=data['is_admin']
        )
        user.set_password(data['password'])
        db.session.add(user)

    db.session.commit()

def seed_books():
    # Define book data
    books_data = [
        {'title': 'Book 1 Title', 'author': 'Author A', 'genre': 'Fiction', 'isbn': '1234567890', 'available_copies': 5},
        {'title': 'Book 2 Title', 'author': 'Author B', 'genre': 'Non-Fiction', 'isbn': '0987654321', 'available_copies': 3},
        {'title': 'Book 3 Title', 'author': 'Author C', 'genre': 'Science Fiction', 'isbn': '9876543210', 'available_copies': 7},
        {'title': 'Book 4 Title', 'author': 'Author D', 'genre': 'Fantasy', 'isbn': '5678901234', 'available_copies': 2},
        {'title': 'Book 5 Title', 'author': 'Author E', 'genre': 'Mystery', 'isbn': '4321098765', 'available_copies': 4},
        {'title': 'Book 6 Title', 'author': 'Author F', 'genre': 'Thriller', 'isbn': '8765432109', 'available_copies': 6},
        {'title': 'Book 7 Title', 'author': 'Author G', 'genre': 'Romance', 'isbn': '3456789012', 'available_copies': 1},
        {'title': 'Book 8 Title', 'author': 'Author H', 'genre': 'Biography', 'isbn': '6543210987', 'available_copies': 8},
        {'title': 'Book 9 Title', 'author': 'Author I', 'genre': 'History', 'isbn': '2109876543', 'available_copies': 9},
        {'title': 'Book 10 Title', 'author': 'Author J', 'genre': 'Self-help', 'isbn': '7890123456', 'available_copies': 10},
        {'title': 'Book 11 Title', 'author': 'Author K', 'genre': 'Programming', 'isbn': '9012345678', 'available_copies': 3},
        # Add more books as needed
    ]

    # Seed books
    for data in books_data:
        book = Book(
            title=data['title'],
            author=data['author'],
            genre=data['genre'],
            isbn=data['isbn'],
            available_copies=data['available_copies']
        )
        db.session.add(book)

    db.session.commit()

def seed_borrows():
    users = User.query.all()
    books = Book.query.all()

    # Seed book borrows (randomly)
    for _ in range(50):  # Adjust as needed
        user = random.choice(users)
        book = random.choice(books)

        borrow = BookBorrow(
            user_id=user.id,
            book_id=book.id,
            borrow_date=datetime.utcnow() - timedelta(days=random.randint(1, 30)),
            return_date=None
        )
        db.session.add(borrow)

    db.session.commit()

def seed_categories():
    # Define categories
    categories_data = ['Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy', 'Mystery', 'Thriller', 'Romance', 'Biography', 'History', 'Self-help', 'Programming']

    # Seed categories
    for category_name in categories_data:
        category = Category(name=category_name)
        db.session.add(category)

    db.session.commit()

def seed_category_book_associations():
    books = Book.query.all()
    categories = Category.query.all()

    # Seed category-book associations (randomly)
    for book in books:
        num_categories = random.randint(1, 3)
        chosen_categories = random.sample(categories, num_categories)

        for category in chosen_categories:
            category_book = CategoryBook(category_id=category.id, book_id=book.id)
            db.session.add(category_book)

    db.session.commit()

if __name__ == '__main__':
    with app.app_context():
        seed_users()
        seed_books()
        seed_borrows()
        seed_categories()
        seed_category_book_associations()
        print('Database seeding completed.')