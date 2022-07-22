
#No need to run this file if the database is already created. Use the already created 'database.db' database

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False 

db = SQLAlchemy(app)


# Creation of health table

class health(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement = True)
    created = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    heart_rate = db.Column(db.Integer, nullable = False)
    spo2 = db.Column(db.Integer, nullable = False)
    run_id = db.Column(db.Integer, nullable = False)
    activity= db.Column(db.String, nullable = False)
    user_name = db.Column(db.String)
    
    def __init__(self, created, heart_rate, spo2, run_id, activity, user_name):
        self.created = created
        self.heart_rate = heart_rate
        self.spo2 = spo2
        self.run_id = run_id
        self.activity = activity
        self.user_name = user_name


# Creation of users table

class users(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_name = db.Column(db.String, nullable=False)

    def __init__(self, user_name):
        self.user_name = user_name


