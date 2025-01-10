using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BookSearch.DAL.DTO;
using Microsoft.Extensions.Configuration;
using MongoDB.Bson;
using MongoDB.Driver;


namespace BookSearch.BLL.Logic
{
    public class BookLogic
    {
        private readonly IMongoCollection<BookDto> _bookCollection;

        public BookLogic(IConfiguration configuration)
        {
            // Retrieve the connection string from User Secrets
            var connectionString = configuration["MongoDB:ConnectionString"];

            // Initialize MongoDB client
            var client = new MongoClient(connectionString);

            // Get the database (BookSearchDB)
            var database = client.GetDatabase("BookSearchDB");

            // Get the collection (Books)
            _bookCollection = database.GetCollection<BookDto>("Books");
        }

        /// <summary>
        /// Inserts a new book into the MongoDB 'Books' collection.
        /// </summary>
        /// <param name="book">The book to insert.</param>
        /// <returns></returns>
        public async Task SaveBookAsync(BookDto book)
        {
            await _bookCollection.InsertOneAsync(book);
        }

        /// <summary>
        /// Searches for books that match the non-empty properties of the given criteria.
        /// For string fields, performs a case-insensitive partial match.
        /// For Genres, requires that all specified genres exist in the book's Genres list.
        /// </summary>
        /// <param name="criteria">A BookDto with desired search properties filled in.</param>
        /// <returns>A list of matching BookDto objects.</returns>
        public async Task<List<BookDto>> SearchBooksAsync(BookDto criteria)
        {
            var builder = Builders<BookDto>.Filter;
            var filters = new List<FilterDefinition<BookDto>>();

            // Add filters for non-null or non-empty fields in criteria
            if (!string.IsNullOrWhiteSpace(criteria.Title))
            {
                filters.Add(builder.Regex(x => x.Title, new BsonRegularExpression(criteria.Title, "i"))); // Case-insensitive partial match
            }

            if (!string.IsNullOrWhiteSpace(criteria.Author))
            {
                filters.Add(builder.Regex(x => x.Author, new BsonRegularExpression(criteria.Author, "i")));
            }

            if (!string.IsNullOrWhiteSpace(criteria.ISBN))
            {
                filters.Add(builder.Eq(x => x.ISBN, criteria.ISBN)); // Exact match
            }

            if (!string.IsNullOrWhiteSpace(criteria.PublishYear))
            {
                filters.Add(builder.Eq(x => x.PublishYear, criteria.PublishYear)); // Exact match
            }

            if (!string.IsNullOrWhiteSpace(criteria.Publisher))
            {
                filters.Add(builder.Regex(x => x.Publisher, new BsonRegularExpression(criteria.Publisher, "i")));
            }

            if (!string.IsNullOrWhiteSpace(criteria.Description))
            {
                filters.Add(builder.Regex(x => x.Description, new BsonRegularExpression(criteria.Description, "i")));
            }

            if (criteria.Genres != null && criteria.Genres.Count > 0)
            {
                filters.Add(builder.All(x => x.Genres, criteria.Genres)); // Match all genres
            }

            // Combine filters with AND condition
            var filter = filters.Count > 0 ? builder.And(filters) : builder.Empty;

            // Query the database
            try
            {
                var results = await _bookCollection.Find(filter).Project<BookDto>(Builders<BookDto>.Projection.Exclude("_id")).ToListAsync();
                return results;
            } catch (Exception e)
            {
                await Console.Out.WriteLineAsync("ewew");
                throw;
            }
            
        }
    }
}
