#!/usr/bin/env python3

from app import app, db
from models import User, Book, BookBorrow, Category, CategoryBook
from werkzeug.security import generate_password_hash
from faker import Faker
import random
from datetime import datetime, timedelta

faker = Faker()

def seed_users():
    for _ in range(10):
        user = User(
            username=faker.user_name(),
            email=faker.email(),
            is_admin=faker.boolean(chance_of_getting_true=20)  # 20% chance to be admin
        )
        user.set_password('password')
        db.session.add(user)

    db.session.commit()

def seed_books():
    genres = ['Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy', 'Mystery', 'Thriller', 'Romance', 'Biography', 'History', 'Self-help', 'Programming']
    
    for _ in range(20):
        book = Book(
            title=faker.catch_phrase(),
            author=faker.name(),
            genre=random.choice(genres),
            isbn=faker.isbn13(),
            available_copies=random.randint(1, 10)
        )
        db.session.add(book)

    db.session.commit()

def seed_borrows():
    users = User.query.all()
    books = Book.query.all()

    for _ in range(50):
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
    categories_data = ['Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy', 'Mystery', 'Thriller', 'Romance', 'Biography', 'History', 'Self-help', 'Programming']

    for category_name in categories_data:
        category = Category(name=category_name)
        db.session.add(category)

    db.session.commit()

def seed_category_book_associations():
    books = Book.query.all()
    categories = Category.query.all()

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
