// src/pages/BookSearch.tsx
import { useState } from "react";
import "./styles/BookSearch.css"; // CSS for the search form and results

interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
}

const mockBooks: Book[] = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    genre: "Fiction",
  },
  { id: 2, title: "1984", author: "George Orwell", genre: "Dystopian" },
  {
    id: 3,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    genre: "Classic",
  },
  // Add more mock books here
];

const BookSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Book[]>([]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const filteredBooks = mockBooks.filter(
      (book) =>
        book.title.toLowerCase().includes(query.toLowerCase()) ||
        book.author.toLowerCase().includes(query.toLowerCase()) ||
        book.genre.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filteredBooks);
  };

  return (
    <div className="book-search">
      <h1>Search Books</h1>
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search by title, author, or genre..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>

      <div className="search-results">
        {results.length > 0 ? (
          <ul>
            {results.map((book) => (
              <li key={book.id} className="book-item">
                <strong>{book.title}</strong> by {book.author} (Genre:{" "}
                {book.genre})
              </li>
            ))}
          </ul>
        ) : (
          <p>No books found. Try searching for something else!</p>
        )}
      </div>
    </div>
  );
};

export default BookSearch;
