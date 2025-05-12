import requests
import csv
import time

print("Script lancé.")

# Pas besoin d'API key pour commencer
BASE_URL = "https://api.semanticscholar.org/graph/v1/paper/search"
HEADERS = {}  # Laisse vide pour usage non authentifié

# Paramètres de recherche
keywords = ["congruence", "responsiveness"]
modifiers = ["policy", "representation", "opinion", "spending"]

# Création de l'équation de recherche
query = " OR ".join([f'"{k}"' for k in keywords])
modifier = " OR ".join(modifiers)
full_query = f"({query}) AND ({modifier})"

# Champs à extraire
FIELDS = "title,abstract,year,authors,citationCount,externalIds"

# Nombre maximum d'articles à récupérer (max 1000 sans authentification)
MAX_RESULTS = 100

# Fichier de sortie
output_file = "congruence_articles.csv"

# Appel à l’API
params = {
    "query": full_query,
    "limit": MAX_RESULTS,
    "fields": FIELDS,
    "offset": 0
}

print("Recherche en cours...")

response = requests.get(BASE_URL, headers=HEADERS, params=params)

print("Code de réponse :", response.status_code)
print("Texte brut :", response.text[:1000])  # Affiche les 1000 premiers caractères pour pas noyer le terminal

data = response.json()
print("Nombre de résultats reçus :", len(data.get("data", [])))

if response.status_code != 200:
    print(f"Erreur API : {response.status_code}")
    exit()

data = response.json()
papers = data.get("data", [])

# Traitement des résultats
results = []
for paper in papers:
    title = paper.get("title", "")
    abstract = paper.get("abstract", "")
    year = paper.get("year", "")
    citations = paper.get("citationCount", 0)
    doi = paper.get("externalIds", {}).get("DOI", "")
    authors = ", ".join([a.get("name", "") for a in paper.get("authors", [])])

    # Appliquer le filtre : 5 citations ou +, ou abstract très pertinent (à juger manuellement)
    if citations >= 5 or "responsiveness" in abstract.lower() or "congruence" in abstract.lower():
        results.append({
            "Title": title,
            "Year": year,
            "Citations": citations,
            "DOI": doi,
            "Authors": authors,
            "Abstract": abstract
        })

# Écriture CSV
with open(output_file, mode='w', encoding='utf-8', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=results[0].keys())
    writer.writeheader()
    writer.writerows(results)

print(f"{len(results)} articles enregistrés dans '{output_file}'")
