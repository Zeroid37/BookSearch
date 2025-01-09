import requests
import csv

BASE_URL = "http://openlibrary.org/search.json"


def fetch_books(genre, limit=10000):
    books = []
    page = 1

    while len(books) < limit:
        # Construct API query with genre and pagination
        params = {
            "subject": genre,
            "page": page,
            "limit": 100,  # Max 100 per request
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
        fields = ['title', 'author_name', 'isbn', 'first_publish_year', 'publisher']
        for doc in docs:
            book_data = {}
            for field in fields:
                if field in doc:
                    if isinstance(doc[field], list):
                        book_data[field] = doc[field][0]
                    else:
                        book_data[field] = doc[field]
            book_data['genre'] = genre
            books.append(book_data)

        # Check if more pages are available
        if len(docs) < 100:
            break  # No more data

        page += 1
        print(f"Fetched {len(books)} titles so far...")

    # Return unique titles (in case of duplicates)
    return list(books)

def save_to_csv(books, file_path):
    with open(file_path, mode='w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file, delimiter=';')
        writer.writerow(["Title", "Author", "ISBN", "PublishYear", "Publisher", "Genre", "Label"])
        for book in books:
            writer.writerow([book.get('title'), book.get('author_name'), book.get('isbn'), book.get('first_publish_year'), book.get('publisher'), book.get('genre'), 1])  # Label 1 for legit titles

if __name__ == "__main__":
    genres = ["fiction", "mystery", "romance", "thriller", "fantasy"]
    all_books = []

    for genre in genres:
        print(f"Fetching titles for genre: {genre}")
        books = fetch_books(genre, 2000)  # Divide 10,000 among genres
        all_books.extend(books)
    save_to_csv(all_books, "real_book_titles.csv")