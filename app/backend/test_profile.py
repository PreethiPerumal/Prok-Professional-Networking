import unittest
import json
import tempfile
import os
from io import BytesIO
from PIL import Image
from main import create_app
from models.user import db, User
from models.profile import Profile

class ProfileTestCase(unittest.TestCase):
    def setUp(self):
        """Set up test environment"""
        self.app = create_app()
        self.app.config['TESTING'] = True
        self.app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        self.app.config['UPLOAD_FOLDER'] = tempfile.mkdtemp()
        self.client = self.app.test_client()
        
        with self.app.app_context():
            db.create_all()
            
            # Create a test user
            self.test_user = User(username='testuser', email='test@example.com')
            self.test_user.set_password('password123')
            db.session.add(self.test_user)
            db.session.commit()
            
            # Get JWT token for authentication
            response = self.client.post('/api/login', 
                json={'username': 'testuser', 'password': 'password123'})
            self.token = response.json['token']

    def tearDown(self):
        """Clean up after tests"""
        with self.app.app_context():
            db.session.remove()
            db.drop_all()
        
        # Clean up uploaded files
        for file in os.listdir(self.app.config['UPLOAD_FOLDER']):
            os.remove(os.path.join(self.app.config['UPLOAD_FOLDER'], file))
        os.rmdir(self.app.config['UPLOAD_FOLDER'])

    def test_get_profile_new_user(self):
        """Test getting profile for a new user (should create default profile)"""
        headers = {'Authorization': f'Bearer {self.token}'}
        response = self.client.get('/api/profile', headers=headers)
        
        self.assertEqual(response.status_code, 200)
        data = response.json
        
        self.assertIn('profile', data)
        self.assertIn('user', data)
        self.assertEqual(data['user']['username'], 'testuser')
        self.assertEqual(data['profile']['full_name'], 'testuser')

    def test_update_profile(self):
        """Test updating profile data"""
        headers = {'Authorization': f'Bearer {self.token}'}
        
        # First get the profile to ensure it exists
        self.client.get('/api/profile', headers=headers)
        
        # Update profile data
        update_data = {
            'name': 'John Doe',
            'bio': 'Test bio',
            'location': 'Test City',
            'title': 'Software Engineer',
            'skills': ['Python', 'Flask', 'React']
        }
        
        response = self.client.put('/api/profile', 
            json=update_data, headers=headers)
        
        self.assertEqual(response.status_code, 200)
        data = response.json
        
        self.assertEqual(data['profile']['full_name'], 'John Doe')
        self.assertEqual(data['profile']['bio'], 'Test bio')
        self.assertEqual(data['profile']['location'], 'Test City')
        self.assertEqual(data['profile']['headline'], 'Software Engineer')
        self.assertEqual(data['profile']['skills'], ['Python', 'Flask', 'React'])

    def test_update_profile_invalid_data(self):
        """Test updating profile with invalid data"""
        headers = {'Authorization': f'Bearer {self.token}'}
        
        # Test with empty name
        update_data = {'name': ''}
        response = self.client.put('/api/profile', 
            json=update_data, headers=headers)
        
        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.json)

    def test_upload_profile_image(self):
        """Test uploading a profile image"""
        headers = {'Authorization': f'Bearer {self.token}'}
        
        # Create a test image
        img = Image.new('RGB', (100, 100), color='red')
        img_io = BytesIO()
        img.save(img_io, 'JPEG')
        img_io.seek(0)
        
        response = self.client.post('/api/profile/image',
            data={'image': (img_io, 'test.jpg')},
            headers=headers,
            content_type='multipart/form-data')
        
        self.assertEqual(response.status_code, 200)
        data = response.json
        
        self.assertIn('image_url', data)
        self.assertTrue(data['image_url'].startswith('/uploads/'))

    def test_upload_invalid_file(self):
        """Test uploading an invalid file"""
        headers = {'Authorization': f'Bearer {self.token}'}
        
        # Create a text file instead of image
        response = self.client.post('/api/profile/image',
            data={'image': (BytesIO(b'not an image'), 'test.txt')},
            headers=headers,
            content_type='multipart/form-data')
        
        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.json)

    def test_upload_no_file(self):
        """Test uploading without a file"""
        headers = {'Authorization': f'Bearer {self.token}'}
        
        response = self.client.post('/api/profile/image',
            headers=headers,
            content_type='multipart/form-data')
        
        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.json)

    def test_unauthorized_access(self):
        """Test accessing profile endpoints without authentication"""
        # Test GET without token
        response = self.client.get('/api/profile')
        self.assertEqual(response.status_code, 401)
        
        # Test PUT without token
        response = self.client.put('/api/profile', json={'name': 'test'})
        self.assertEqual(response.status_code, 401)
        
        # Test image upload without token
        response = self.client.post('/api/profile/image')
        self.assertEqual(response.status_code, 401)

    def test_education_json_handling(self):
        """Test that education data is properly handled as JSON"""
        headers = {'Authorization': f'Bearer {self.token}'}
        
        education_data = [
            {'school': 'Test University', 'degree': 'BS', 'years': '2020-2024'}
        ]
        
        update_data = {'education': education_data}
        response = self.client.put('/api/profile', 
            json=update_data, headers=headers)
        
        self.assertEqual(response.status_code, 200)
        data = response.json
        
        # Check that education is returned as a list
        self.assertIsInstance(data['profile']['education'], list)
        self.assertEqual(data['profile']['education'][0]['school'], 'Test University')

if __name__ == '__main__':
    unittest.main() 