from django.apps import AppConfig


class HomeConfig(AppConfig):            #diese Klasse definiert die "App" home, welche alle views definiert
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'home'
