import React, { useState } from "react";
import "./styles/BookRegistration.css";

// Sample genres. Adjust as needed.
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

    // Handle genre selection with a custom checkbox approach
    const handleGenreChange = (genre: string) => {
        if (selectedGenres.includes(genre)) {
            setSelectedGenres(selectedGenres.filter((g) => g !== genre));
        } else {
            setSelectedGenres([...selectedGenres, genre]);
        }
    };

    // Handle the form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation
        if (!title || !author || !isbn || !publishYear || selectedGenres.length === 0) {
            alert("Please fill out Title, Author, ISBN, Publish Year, and select at least one Genre!");
            return;
        }

        const payload = {
            title,
            author,
            isbn,
            publisher,     // optional
            publishYear,   // stored as string
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
                        <label htmlFor="isbn">ISBN (optional)</label>
                        <input
                            type="text"
                            id="isbn"
                            value={isbn}
                            onChange={(e) => setIsbn(e.target.value)}
                            required
                        />
                    </div>

                    {/* Publisher (optional) */}
                    <div className="form-group">
                        <label htmlFor="publisher">Publisher (optional)</label>
                        <input
                            type="text"
                            id="publisher"
                            value={publisher}
                            onChange={(e) => setPublisher(e.target.value)}
                        />
                    </div>

                    {/* Publish Year (dropdown) */}
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

                    {/* Genres (custom checkboxes) */}
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
                            required
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
