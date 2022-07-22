# Setup for database creation
pip install flask

pip install flask_sqlalchemy

# Command lines to create db
python

from database_creation import db

db.create_all()
