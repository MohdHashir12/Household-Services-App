from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

# Initialize SQLAlchemy
db = SQLAlchemy()

# User model (Base for Admin, Customer, and Service Professional)
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # 'admin', 'customer', 'professional'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# Service Professional model
class ServiceProfessional(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    experience = db.Column(db.Integer, nullable=False)
    service_type = db.Column(db.String(50), nullable=False)
    approved = db.Column(db.Boolean, default=False)  # Admin approval status
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', backref=db.backref('professional', uselist=False))

# Customer model
class Customer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', backref=db.backref('customer', uselist=False))

# Service model
class Service(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    price = db.Column(db.Float, nullable=False)
    time_required = db.Column(db.Integer, nullable=False)  # Time in minutes
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# Service Request model
class ServiceRequest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    service_id = db.Column(db.Integer, db.ForeignKey('service.id'), nullable=False)
    customer_id = db.Column(db.Integer, db.ForeignKey('customer.id'), nullable=False)
    professional_id = db.Column(db.Integer, db.ForeignKey('service_professional.id'), nullable=True)
    date_of_request = db.Column(db.DateTime, default=datetime.utcnow)
    date_of_completion = db.Column(db.DateTime, nullable=True)
    status = db.Column(db.String(20), default='requested')  # requested, assigned, closed
    remarks = db.Column(db.Text, nullable=True)

    service = db.relationship('Service', backref=db.backref('requests', lazy=True))
    customer = db.relationship('Customer', backref=db.backref('requests', lazy=True))
    professional = db.relationship('ServiceProfessional', backref=db.backref('requests', lazy=True))

# Admin model (Single predefined admin, no registration)
class Admin(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), unique=True, nullable=False)
    
    user = db.relationship('User', backref=db.backref('admin', uselist=False))
