using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BookSearch.DAL.DTO;
using Microsoft.Extensions.Configuration;
using MongoDB.Driver;


namespace BookSearch.Logic.Logic
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
    }
}
