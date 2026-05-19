from django.shortcuts import render
from django.http import HttpResponse
from datenbank.models import Rezepte


def anleitung_view(request, *args, **kwargs):           #Diese funktion ordnet der antleitung_view die html datei anleitung.html zu
    return render(request, "anleitung.html", {})

def home_view(request, *args, **kwargs):  #Diese funktion ordnet der home_view die html datei home.html zu
    return render(request, "home.html", {})


def rezeptsuche_view(request, *args, **kwargs):  #Diese funktion ordnet der rezeptsuche_view die html datei rezeptsuche.html zu und verarbeitet die Suche
    if request.method == "POST":                                                            #überprüft ob etwas gesucht wurde
        searched = request.POST['searched']                                                 #sucheingabe wird als in der searched variable gespeichert
        rezepte = Rezepte.objects.filter(zutaten__contains=searched)                        #in der rezepte variable werden die rezepte aus der Datenbank gespeichert welche mit der searched variable übereinstimmen
        return render(request, "rezeptsuche.html", {'searched': searched, 'rezepte': rezepte})

    else:
        return render(request, "rezeptsuche.html", {})


def search_view(request, *args, **kwargs):  #Diese funktion ordnet der search_view die html datei search.html zu und verarbeitet die Suche
    if request.method == "POST":                                                                 #überprüft ob etwas gesucht wurde
        searched = request.POST['searched']                                                      #sucheingabe wird als in der searched variable gespeichert
        rezepte = Rezepte.objects.filter(name__contains=searched)                                #in der rezepte variable werden die rezepte aus der Datenbank gespeichert welche mit der searched variable übereinstimmen
        return render(request, "search.html", {'searched': searched, 'rezepte': rezepte})

    else:
        return render(request, "search.html", {})


def rezeptliste_view(request, *args, **kwargs):  #Diese funktion ordnet der rezeptliste_view die html datei rezeptliste.html zu und sortiert die rezepte alphabetisch
    rezepte_liste = Rezepte.objects.order_by('name')        #hier wird eine Liste mit den sortierten Rezepten erstellt

    return render(request, "rezepteListe.html", {'rezepte_liste' : rezepte_liste})


def rezepte_einzeln(request, rezepte_id): # Diese Funktion ordnet der rezepte_einzeln(view) die html datei rezepte.html zu und übergibt das Rezept welches auf die ID übereinstimmt
    Rezept = Rezepte.objects.get(pk=rezepte_id) #in der Variable Rezept wird das rezept abgespeichert welches die passende id hat, welche in der url übergeben wird
    return render(request, "rezepte.html", {'Rezept': Rezept})



