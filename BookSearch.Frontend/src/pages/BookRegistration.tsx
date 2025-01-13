import React, { useState } from "react";
import "./styles/BookRegistration.css";

// Sample genres. Adjust as needed.
const genreOptions = [
    "Fiction", "Non-Fiction", "Sci-Fi", "Fantasy", "Mystery", "Romance", "Thriller",
    "Self-Help", "Adventure", "Biography", "Horror", "Drama", "History", "Poetry",
    "Classics", "Science", "Travel",
];

const BookRegistration: React.FC = () => {
    const [title, setTitle] = useState<string>("");
    const [author, setAuthor] = useState<string>("");
    const [isbn, setIsbn] = useState<string>("");
    const [publisher, setPublisher] = useState<string>("");
    const [publishYear, setPublishYear] = useState<string>("");
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const [description, setDescription] = useState<string>("");
    const [submitted, setSubmitted] = useState<boolean>(false);

    const currentYear = new Date().getFullYear();
    const years = Array.from(new Array(2000), (_, i) => currentYear - i);

    const handleGenreChange = (genre: string) => {
        if (selectedGenres.includes(genre)) {
            setSelectedGenres(selectedGenres.filter((g) => g !== genre));
        } else {
            setSelectedGenres([...selectedGenres, genre]);
        }
    };

    const handleSearchBook = async () => {
        if (!isbn) {
            alert("Please enter an ISBN to search.");
            return;
        }

        try {
            const token = localStorage.getItem('authToken');
            console.log("JWT Token:", token);
            const response = await fetch(`book/searchGoogleAPI?isbn=${isbn}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const book = await response.json();
                setTitle(book.title || "");
                setAuthor(book.author || "");
                setPublisher(book.publisher || "");
                setPublishYear(book.publishYear || "");
                setDescription(book.description || "");
                setSelectedGenres(book.genres || []);
            } else {
                console.error("Failed to fetch book details.");
            }
        } catch (error) {
            console.error("Error fetching book details:", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title || !author || !isbn || !publishYear || selectedGenres.length === 0) {
            alert("Please fill out Title, Author, ISBN, Publish Year, and select at least one Genre!");
            return;
        }

        const payload = {
            title,
            author,
            isbn,
            publisher,
            publishYear,
            genres: selectedGenres,
            description,
        };

        try {
            const token = localStorage.getItem('authToken');
            console.log("JWT Token:", token);
            const response = await fetch("book/registerBook", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                setSubmitted(true);
            } else {
                console.error("Failed to submit form.");
            }
        } catch (error) {
            console.error("Error submitting the form:", error);
        }
    };

    return (
        <div className="book-registration">
            <h1>Register a New Book</h1>
            {submitted ? (
                <p>Thank you for registering a new book! It will be reviewed by our team.</p>
            ) : (
                <form onSubmit={handleSubmit} className="registration-form">
                    {/* Title */}
                    <div className="form-group">
                        <label htmlFor="title">Title*</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    {/* Author */}
                    <div className="form-group">
                        <label htmlFor="author">Author*</label>
                        <input
                            type="text"
                            id="author"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            required
                        />
                    </div>

                    {/* ISBN */}
                    <div className="form-group">
                        <label htmlFor="isbn">ISBN-13*</label>
                        <div className="isbn-container">
                            <input
                                type="text"
                                id="isbn"
                                value={isbn}
                                onChange={(e) => setIsbn(e.target.value)}
                                required/>
                            <button
                                type="button"
                                className="search-button"
                                onClick={handleSearchBook}>
                                Search
                            </button>
                        </div>
                    </div>

                    {/* Publisher */}
                    <div className="form-group">
                        <label htmlFor="publisher">Publisher (optional)</label>
                        <input
                            type="text"
                            id="publisher"
                            value={publisher}
                            onChange={(e) => setPublisher(e.target.value)}
                        />
                    </div>

                    {/* Publish Year */}
                    <div className="form-group">
                        <label htmlFor="publishYear">Publish Year*</label>
                        <select
                            id="publishYear"
                            value={publishYear}
                            onChange={(e) => setPublishYear(e.target.value)}
                            required
                        >
                            <option value="">Select Year...</option>
                            {years.map((year) => (
                                <option key={year} value={year.toString()}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Genres */}
                    <div className="form-group">
                        <label>Genres*</label>
                        <div className="checkbox-container">
                            <div className="checkbox-scroll">
                                {genreOptions.map((genre) => (
                                    <label key={genre} className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            value={genre}
                                            checked={selectedGenres.includes(genre)}
                                            onChange={() => handleGenreChange(genre)}
                                        />
                                        <span className="custom-checkbox" />
                                        <span className="checkbox-text">{genre}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="form-group">
                        <label htmlFor="description">Description (optional)</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                        />
                    </div>

                    <button type="submit" className="submit-button">
                        Submit Book
                    </button>
                </form>
            )}
        </div>
    );
};

export default BookRegistration;
