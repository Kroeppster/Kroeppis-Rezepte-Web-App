from django.apps import AppConfig


class DatenbankConfig(AppConfig):                   #diese Klasse definiert die "App" Datenbank, welche nur dem erstellen der Datenbanken dient
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'datenbank'
