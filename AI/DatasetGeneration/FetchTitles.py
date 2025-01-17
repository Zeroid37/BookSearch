import requests
import csv

BASE_URL = "http://openlibrary.org/search.json"


def fetch_books(genre, limit=10000):
    books = []
    page = 1

    while len(books) < limit:
        params = {
            "subject": genre,
            "page": page,
            "limit": 100,
            "language": "eng"
        }

        response = requests.get(BASE_URL, params=params)
        if response.status_code != 200:
            print(f"Error fetching data: {response.status_code}")
            break

        data = response.json()
        docs = data.get('docs', [])

        fields = ['title']
        for doc in docs:
            book_data = {}
            for field in fields:
                if field in doc:
                    if isinstance(doc[field], list):
                        book_data[field] = doc[field][0]
                    else:
                        book_data[field] = doc[field]
            books.append(book_data)

        if len(docs) < 100:
            break

        page += 1
        print(f"Fetched {len(books)} titles so far...")

    return list(books)

def save_to_csv(books, file_path):
    with open(file_path, mode='w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file, delimiter=';')
        writer.writerow(["Title", "Label"])
        for book in books:
            writer.writerow([book.get('title'), 1])  # Label 1 for real titles

if __name__ == "__main__":
    genres = ["fiction", "mystery", "romance", "thriller", "fantasy"]
    all_books = []

    for genre in genres:
        print(f"Fetching titles for genre: {genre}")
        books = fetch_books(genre, 2000)
        all_books.extend(books)
    save_to_csv(all_books, "real_book_titles.csv")