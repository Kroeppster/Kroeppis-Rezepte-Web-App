# Kroeppi's Rezepte (Static Web App)

Diese Version ist eine vollständig statische Rezept-Web-App für GitHub Pages.

## Funktionen

- Rezeptliste (alphabetisch sortiert)
- Suche nach Namen (live)
- Suche nach Zutaten (live)
- Detailansicht im Modal
- Dark-/Light-Mode mit Speicherung in `localStorage`
- Mobile-first, responsive UI
- Keine externen Abhängigkeiten
- Offline nutzbar (statische Dateien)

## Projektstruktur

- `index.html` – Startseite
- `recipes.html` – Rezeptverwaltung mit Tabs
- `css/style.css` – Styling inkl. Dark Mode
- `js/app.js` – App-Logik (Daten laden, Suche, Tabs, Modal)
- `data/recipes.json` – Rezeptdaten
- `.nojekyll` – GitHub Pages Konfiguration

## Lokal testen

Da die Rezepte per `fetch` geladen werden, starte lokal einen kleinen HTTP-Server:

```bash
python3 -m http.server 8000
```

Dann öffnen:

- `http://localhost:8000/index.html`
- `http://localhost:8000/recipes.html`

## Deployment auf GitHub Pages

1. Repository auf GitHub öffnen.
2. **Settings → Pages** öffnen.
3. **Deploy from a branch** auswählen.
4. Branch: `main` (oder dein Deploy-Branch), Ordner: `/ (root)`.
5. Speichern.

Die Seite ist danach unter `https://<user>.github.io/<repo>/` erreichbar.

## Neue Rezepte hinzufügen

Einträge in `data/recipes.json` ergänzen:

```json
{
  "id": 7,
  "name": "Neues Rezept",
  "dauer": "30 Minuten",
  "zutaten": "Zutat 1\nZutat 2",
  "zubereitung": "Schritt 1\nSchritt 2"
}
```
