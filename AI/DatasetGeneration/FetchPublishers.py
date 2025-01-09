import requests
import csv

BASE_URL = "http://openlibrary.org/search.json"


def fetch_books(genre, limit):
    publishers = []
    page = 1

    while len(publishers) < limit:
        # Construct API query with genre and pagination
        params = {
            "subject": genre,
            "page": page,
            "limit": 35,  # Max 100 per request
            "language": "eng"  # Filter for English books
        }


        # Make API request
        response = requests.get(BASE_URL, params=params)
        if response.status_code != 200:
            print(f"Error fetching data: {response.status_code}")
            break

        # Parse JSON response
        data = response.json()
        docs = data.get('docs', [])

        # Collect books

        for doc in docs:
            for pub in doc['publisher']:
                print(pub)
                publishers.append(pub)

        print(len(publishers))

        # Check if more pages are available
        if len(docs) < 100:
            break  # No more data

        page += 1
        print(f"Fetched {len(publishers)} titles so far...")

    # Return unique titles (in case of duplicates)
    return list(set(publishers))

def save_to_csv(publishers, file_path):
    with open(file_path, mode='w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        writer.writerow(["Publisher"])
        for name in publishers:
            writer.writerow([name])  # Label 1 for legit titles

if __name__ == "__main__":
    genres = ["fiction", "mystery", "romance", "thriller", "fantasy"]
    all_books = []

    for genre in genres:
        print(f"Fetching titles for genre: {genre}")
        books = fetch_books(genre, 35)  # Divide 10,000 among genres
        all_books.extend(books)
    print(all_books)
    save_to_csv(all_books, "publishers.csv")