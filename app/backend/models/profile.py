from .user import db, User
import json

class Profile(db.Model):
    __tablename__ = 'profiles'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=True, nullable=False)
    full_name = db.Column(db.String(120), nullable=False)
    bio = db.Column(db.String(500))
    location = db.Column(db.String(120))
    headline = db.Column(db.String(120))
    experience = db.Column(db.String(500))
    education = db.Column(db.Text)  # Store as JSON string
    skills = db.Column(db.String(500))  # Allow longer skill lists
    website = db.Column(db.String(120))
    image_url = db.Column(db.String(256))  # Store profile image URL

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'full_name': self.full_name,
            'bio': self.bio,
            'location': self.location,
            'headline': self.headline,
            'experience': self.experience,
            'education': json.loads(self.education) if self.education else [],
            'skills': self.skills.split(',') if self.skills else [],
            'website': self.website,
            'image_url': self.image_url
        }
