
from django.core.management.base import BaseCommand
from octofit_tracker.models import Team, User, Activity, Workout, Leaderboard
from datetime import date
from pymongo import MongoClient

class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'



    def handle(self, *args, **kwargs):
        # Drop collections directly using pymongo for a clean state
        client = MongoClient('localhost', 27017)
        db = client['octofit_db']
        for coll in ['activities', 'workouts', 'leaderboard', 'users', 'teams']:
            db[coll].drop()
        client.close()


        # Create teams with explicit integer IDs
        marvel = Team.objects.create(id=1, name='Marvel')
        dc = Team.objects.create(id=2, name='DC')


        # Create users with explicit integer IDs
        users = [
            User.objects.create(id=1, email='tony@marvel.com', name='Tony Stark', team=marvel),
            User.objects.create(id=2, email='steve@marvel.com', name='Steve Rogers', team=marvel),
            User.objects.create(id=3, email='bruce@dc.com', name='Bruce Wayne', team=dc),
            User.objects.create(id=4, email='clark@dc.com', name='Clark Kent', team=dc),
        ]


        # Create activities with explicit integer IDs
        Activity.objects.create(id=1, user=users[0], type='Run', duration=30, date=date.today())
        Activity.objects.create(id=2, user=users[1], type='Swim', duration=45, date=date.today())
        Activity.objects.create(id=3, user=users[2], type='Bike', duration=60, date=date.today())
        Activity.objects.create(id=4, user=users[3], type='Yoga', duration=50, date=date.today())


        # Create workouts with explicit integer IDs
        w1 = Workout.objects.create(id=1, name='Super Strength', description='Strength training for heroes')
        w2 = Workout.objects.create(id=2, name='Flight School', description='Aerobic workout for flyers')
        w1.suggested_for.add(marvel, dc)
        w2.suggested_for.add(dc)


        # Create leaderboards with explicit integer IDs
        Leaderboard.objects.create(id=1, team=marvel, points=100)
        Leaderboard.objects.create(id=2, team=dc, points=80)

        self.stdout.write(self.style.SUCCESS('octofit_db database populated with test data'))
