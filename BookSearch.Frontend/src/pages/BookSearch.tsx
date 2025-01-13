import React, { useState } from "react";
import "./styles/BookSearch.css";

const genreOptions = [
    "Fiction",
    "Non-Fiction",
    "Sci-Fi",
    "Fantasy",
    "Mystery",
    "Romance",
    "Thriller",
    "Self-Help",
    "Adventure",
    "Biography",
    "Horror",
    "Drama",
    "History",
    "Poetry",
    "Classics",
    "Science",
    "Travel",
];

const BookSearch: React.FC = () => {
    const [title, setTitle] = useState<string>("");
    const [author, setAuthor] = useState<string>("");
    const [isbn, setIsbn] = useState<string>("");
    const [publisher, setPublisher] = useState<string>("");
    const [publishYear, setPublishYear] = useState<string>("");
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const [results, setResults] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    const currentYear = new Date().getFullYear();
    const years = Array.from(new Array(200), (_, i) => currentYear - i);

    const handleGenreChange = (genre: string) => {
        if (selectedGenres.includes(genre)) {
            setSelectedGenres(selectedGenres.filter((g) => g !== genre));
        } else {
            setSelectedGenres([...selectedGenres, genre]);
        }
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            title: title || "",
            author: author || "",
            isbn: isbn || "",
            publisher: publisher || "",
            publishYear: publishYear || "",
            genres: selectedGenres,
            description: "",
        };

        try {
            const response = await fetch("/book/searchBooks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const data = await response.json();
                setResults(data);
                setError(null);
            } else {
                setError("Failed to fetch results. Please try again.");
            }
        } catch (err) {
            console.error(err);
            setError("An error occurred while searching for books.");
        }
    };

    return (
        <div className="book-search">
            <form className="search-form" onSubmit={handleSearch}>
                <h1>Search for Books</h1>

                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}/>
                </div>

                <div className="form-group">
                    <label htmlFor="author">Author</label>
                    <input
                        type="text"
                        id="author"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}/>
                </div>

                <div className="form-group">
                    <label htmlFor="isbn">ISBN</label>
                    <input
                        type="text"
                        id="isbn"
                        value={isbn}
                        onChange={(e) => setIsbn(e.target.value)}/>
                </div>

                <div className="form-group">
                    <label htmlFor="publisher">Publisher</label>
                    <input
                        type="text"
                        id="publisher"
                        value={publisher}
                        onChange={(e) => setPublisher(e.target.value)}/>
                </div>

                <div className="form-group">
                    <label htmlFor="publishYear">Publish Year</label>
                    <select
                        id="publishYear"
                        value={publishYear}
                        onChange={(e) => setPublishYear(e.target.value)}>
                        <option value="">Select Year...</option>
                        {years.map((year) => (
                            <option key={year} value={year.toString()}>
                                {year}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Genres</label>
                    <div className="checkbox-container">
                        {genreOptions.map((genre) => (
                            <label key={genre} className="checkbox-label">
                                <input
                                    type="checkbox"
                                    value={genre}
                                    checked={selectedGenres.includes(genre)}
                                    onChange={() => handleGenreChange(genre)}/>
                                <span className="custom-checkbox"></span>
                                {genre}
                            </label>
                        ))}
                    </div>
                </div>
                <button type="submit" className="submit-button">
                    Search
                </button>
            </form>

            {error && <p className="error-message">{error}</p>}
            {results.length > 0 && (
                <div className="results">
                    <h2>Search Results</h2>
                    <table className="results-table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Year</th>
                                <th>Author</th>
                                <th>Genres</th>
                                <th>Publisher</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map((book, index) => (
                                <tr key={index}>
                                    <td>{book.title}</td>
                                    <td>{book.publishYear}</td>
                                    <td>{book.author}</td>
                                    <td>{book.genres?.join(", ")}</td>
                                    <td>{book.publisher}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default BookSearch;