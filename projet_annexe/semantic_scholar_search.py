import requests
import csv
import time

print("Script lancé.")

BASE_URL = "https://api.semanticscholar.org/graph/v1/paper/search"
HEADERS = {}

# Recherche uniquement du mot "congruence"
query = "congruence"

FIELDS = "title,abstract,year,authors,citationCount,externalIds"
MAX_RESULTS = 100
output_file = "congruence_articles.csv"

params = {
    "query": query,
    "limit": MAX_RESULTS,
    "fields": FIELDS,
    "offset": 0
}

print("Recherche en cours...")

response = requests.get(BASE_URL, headers=HEADERS, params=params)
print("Code de réponse :", response.status_code)
print("Texte brut :", response.text[:1000])

data = response.json()
papers = data.get("data", [])
print("Nombre de résultats reçus :", len(papers))

# Traitement
results = []
for paper in papers:
    title = paper.get("title", "")
    abstract = paper.get("abstract", "")
    year = paper.get("year", "")
    citations = paper.get("citationCount", 0)
    doi = paper.get("externalIds", {}).get("DOI", "")
    authors = ", ".join([a.get("name", "") for a in paper.get("authors", [])])

    if citations >= 5 or "congruence" in abstract.lower():
        results.append({
            "Title": title,
            "Year": year,
            "Citations": citations,
            "DOI": doi,
            "Authors": authors,
            "Abstract": abstract
        })

# Sauvegarde si au moins un article
if results:
    with open(output_file, mode='w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=results[0].keys())
        writer.writeheader()
        writer.writerows(results)
    print(f"{len(results)} articles enregistrés dans '{output_file}'")
else:
    print("Aucun article pertinent trouvé.")
