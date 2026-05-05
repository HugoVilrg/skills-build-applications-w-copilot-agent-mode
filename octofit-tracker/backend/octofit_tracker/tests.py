from django.test import TestCase
from .models import User, Team, Activity, Workout, Leaderboard

class ModelSmokeTest(TestCase):
    def test_team_create(self):
        t = Team.objects.create(id=99, name='Test Team')
        self.assertEqual(str(t), 'Test Team')
    def test_user_create(self):
        team = Team.objects.create(id=100, name='Test Team2')
        u = User.objects.create(id=99, email='test@x.com', name='Test User', team=team)
        self.assertEqual(str(u), 'test@x.com')
