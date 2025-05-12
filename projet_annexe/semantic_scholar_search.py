import requests
import csv
import time

print("Script lancé.")

BASE_URL = "https://api.semanticscholar.org/graph/v1/paper/search"
HEADERS = {}

query = "congruence"
FIELDS = "title,abstract,year,authors,citationCount,externalIds"
MAX_PER_PAGE = 100
MAX_ARTICLES = 500
output_csv = "congruence_articles.csv"
output_csv_noabs = "congruence_no_abstract.csv"
output_bib = "congruence_articles.bib"

keywords_politics = ["representation", "policy", "opinion", "government", "public"]

results = []
no_abstract = []
offset = 0

print("Recherche en cours...")

while len(results) < MAX_ARTICLES:
    params = {
        "query": query,
        "limit": MAX_PER_PAGE,
        "fields": FIELDS,
        "offset": offset
    }

    response = requests.get(BASE_URL, headers=HEADERS, params=params)
    print(f"Requête offset {offset} → code : {response.status_code}")
    if response.status_code != 200:
        print("Erreur API :", response.text)
        break

    data = response.json()
    papers = data.get("data", [])
    if not papers:
        break

    for paper in papers:
        title = paper.get("title", "")
        abstract = paper.get("abstract")
        year = paper.get("year", "")
        citations = paper.get("citationCount", 0)
        doi = paper.get("externalIds", {}).get("DOI", "")
        authors_list = paper.get("authors", [])
        authors = ", ".join([a.get("name", "") for a in authors_list])

        # S'il n'y a pas d'abstract
        if not abstract:
            no_abstract.append({
                "Title": title,
                "Year": year,
                "Citations": citations,
                "DOI": doi,
                "Authors": authors
            })
            continue

        # Sinon : traitement classique
        if "congruence" in abstract.lower():
            if any(kw in abstract.lower() for kw in keywords_politics):
                if int(year) >= 2018 and (citations >= 5 or citations == 0):
                    results.append({
                        "Title": title,
                        "Year": year,
                        "Citations": citations,
                        "DOI": doi,
                        "Authors": authors,
                        "Abstract": abstract
                    })

        if len(results) >= MAX_ARTICLES:
            break

    offset += MAX_PER_PAGE
    time.sleep(1)

# Écriture CSV avec abstracts
if results:
    with open(output_csv, mode='w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=results[0].keys())
        writer.writeheader()
        writer.writerows(results)
    print(f"{len(results)} articles enregistrés dans '{output_csv}'")

# Écriture CSV sans abstracts
if no_abstract:
    with open(output_csv_noabs, mode='w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=no_abstract[0].keys())
        writer.writeheader()
        writer.writerows(no_abstract)
    print(f"{len(no_abstract)} articles sans abstract enregistrés dans '{output_csv_noabs}'")

# Export BibTeX
def to_bibtex(entry, idx):
    entry_id = f"congruence{idx}"
    bib = f"@article{{{entry_id},\n"
    bib += f"  title={{ {entry['Title']} }},\n"
    bib += f"  author={{ {entry['Authors']} }},\n"
    bib += f"  year={{ {entry['Year']} }},\n"
    if entry['DOI']:
        bib += f"  doi={{ {entry['DOI']} }},\n"
    bib += f"  abstract={{ {entry['Abstract']} }}\n"
    bib += "}\n"
    return bib

with open(output_bib, 'w', encoding='utf-8') as f:
    for idx, entry in enumerate(results):
        f.write(to_bibtex(entry, idx))

print(f"Fichier BibTeX exporté : '{output_bib}'")
