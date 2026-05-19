from django.db import models


class Rezepte(models.Model):     #Diese Klasse erstellt eine Datenbank mit Namen, Zutaten, Dauer und Zubereitung
    name = models.CharField(max_length=300, default='')
    zutaten = models.TextField(default='')
    dauer = models.CharField(max_length=200, default='')
    zubereitung = models.TextField(default='')

    def __str__(self):  #So wird jedes Objekt mit dem Namen gelabelt
        return self.name

