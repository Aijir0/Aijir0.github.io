import requests
import csv
import time
import os

print("Script lancé.")

# ----- CONFIG -----
BASE_URL = "https://api.semanticscholar.org/graph/v1/paper/search"
HEADERS = {}

QUERY = "congruence"
FIELDS = "title,abstract,year,authors,citationCount,externalIds"
MAX_PER_PAGE = 100
OFFSET = 0  # ⇦ 💥💥💥 🌸 À MODIFIER ICI À CHAQUE LANCEMENT 🌸 💥💥💥
OUTPUT_CSV = "congruence_articles.csv"
OUTPUT_CSV_NOABS = "congruence_no_abstract.csv"
OUTPUT_BIB = "congruence_articles.bib"
KEYWORDS_POLITICS = ["representation", "policy", "opinion", "government", "public"]

# ----- RESULT STORAGE -----
filtered = []
no_abstract = []

# ----- API REQUEST -----
print(f"Requête offset {OFFSET}...")
params = {
    "query": QUERY,
    "limit": MAX_PER_PAGE,
    "fields": FIELDS,
    "offset": OFFSET
}

response = requests.get(BASE_URL, headers=HEADERS, params=params)
print(f"Code réponse : {response.status_code}")

if response.status_code != 200:
    print("Erreur API :", response.text)
    exit()

data = response.json()
papers = data.get("data", [])
print(f"{len(papers)} articles reçus")

# ----- FILTRAGE -----
for paper in papers:
    title = paper.get("title", "")
    abstract = paper.get("abstract")
    year = paper.get("year", "")
    citations = paper.get("citationCount", 0)
    doi = paper.get("externalIds", {}).get("DOI", "")
    authors = ", ".join([a.get("name", "") for a in paper.get("authors", [])])

    if not abstract:
        no_abstract.append({
            "Title": title,
            "Year": year,
            "Citations": citations,
            "DOI": doi,
            "Authors": authors
        })
        continue

    if "congruence" in abstract.lower():
        if any(kw in abstract.lower() for kw in KEYWORDS_POLITICS):
            if int(year) >= 2018 and (citations >= 5 or citations == 0):
                filtered.append({
                    "Title": title,
                    "Year": year,
                    "Citations": citations,
                    "DOI": doi,
                    "Authors": authors,
                    "Abstract": abstract
                })

# ----- CSV UTILS -----
def append_to_csv(filename, data, headers):
    write_header = not os.path.exists(filename)
    with open(filename, mode='a', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=headers)
        if write_header:
            writer.writeheader()
        writer.writerows(data)

# ----- ÉCRITURE -----
if filtered:
    append_to_csv(OUTPUT_CSV, filtered, filtered[0].keys())
    print(f"{len(filtered)} articles ajoutés à '{OUTPUT_CSV}'")
else:
    print("Aucun article pertinent trouvé.")

if no_abstract:
    append_to_csv(OUTPUT_CSV_NOABS, no_abstract, no_abstract[0].keys())
    print(f"{len(no_abstract)} articles sans abstract ajoutés à '{OUTPUT_CSV_NOABS}'")

# ----- BIBTEX -----
def to_bibtex(entry, idx_start):
    entry_id = f"congruence{idx_start}"
    bib = f"@article{{{entry_id},\n"
    bib += f"  title={{ {entry['Title']} }},\n"
    bib += f"  author={{ {entry['Authors']} }},\n"
    bib += f"  year={{ {entry['Year']} }},\n"
    if entry['DOI']:
        bib += f"  doi={{ {entry['DOI']} }},\n"
    bib += f"  abstract={{ {entry['Abstract']} }}\n"
    bib += "}\n"
    return bib

# Ajout BibTeX sans écraser
if filtered:
    existing = 0
    if os.path.exists(OUTPUT_BIB):
        with open(OUTPUT_BIB, 'r', encoding='utf-8') as f:
            existing = f.read().count("@article")

    with open(OUTPUT_BIB, 'a', encoding='utf-8') as f:
        for i, entry in enumerate(filtered):
            f.write(to_bibtex(entry, existing + i))
    print(f"{len(filtered)} entrées BibTeX ajoutées à '{OUTPUT_BIB}'")

