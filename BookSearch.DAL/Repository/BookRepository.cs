using BookSearch.DAL.DTO;
using BookSearch.DAL.Interface;
using Microsoft.Extensions.Configuration;
using MongoDB.Bson;
using MongoDB.Driver;
using Newtonsoft.Json;

namespace BookSearch.DAL.Repository
{
    public class BookRepository : IBookRepository
    {
        private readonly IMongoCollection<BookDto> _bookCollection;
        private readonly IConfiguration _configuration;
        private readonly string _apiKey;

        public BookRepository(IConfiguration configuration)
        {
            _configuration = configuration;
            var connectionString = _configuration["MongoDB:ConnectionString"];
            var client = new MongoClient(connectionString);
            var database = client.GetDatabase("BookSearchDB");
            _bookCollection = database.GetCollection<BookDto>("Books");
            _apiKey = _configuration["GoogleAPI:KeyAPI"];
        }

        public async Task<Item> GetBookByIsbnAsync(string isbn)
        {
            string url = $"https://www.googleapis.com/books/v1/volumes?q={isbn}&maxResults=1&langRestrict=en";

            using (HttpClient client = new HttpClient())
            {
                HttpResponseMessage response = await client.GetAsync(url);

                if (response.IsSuccessStatusCode)
                {
                    string jsonResponse = await response.Content.ReadAsStringAsync();
                    var googleBooksResponse = JsonConvert.DeserializeObject<Root>(jsonResponse);

                    if (googleBooksResponse?.items != null && googleBooksResponse.items.Count > 0)
                    {
                        return googleBooksResponse.items[0];
                    }
                }
            }
            return null;
        }

        public async Task SaveBookAsync(BookDto book)
        {
            await _bookCollection.InsertOneAsync(book);
        }
        public async Task<List<BookDto>> SearchBooksAsync(BookDto criteria)
        {
            var builder = Builders<BookDto>.Filter;
            var filters = new List<FilterDefinition<BookDto>>();

            if (!string.IsNullOrWhiteSpace(criteria.Title))
            {
                filters.Add(builder.Regex(x => x.Title, new BsonRegularExpression(criteria.Title, "i")));
            }

            if (!string.IsNullOrWhiteSpace(criteria.Author))
            {
                filters.Add(builder.Regex(x => x.Author, new BsonRegularExpression(criteria.Author, "i")));
            }

            if (!string.IsNullOrWhiteSpace(criteria.ISBN))
            {
                filters.Add(builder.Eq(x => x.ISBN, criteria.ISBN));
            }

            if (!string.IsNullOrWhiteSpace(criteria.PublishYear))
            {
                filters.Add(builder.Eq(x => x.PublishYear, criteria.PublishYear));
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
                filters.Add(builder.All(x => x.Genres, criteria.Genres));
            }

            var filter = filters.Count > 0 ? builder.And(filters) : builder.Empty;

            try
            {
                var results = await _bookCollection.Find(filter).Project<BookDto>(Builders<BookDto>.Projection.Exclude("_id")).ToListAsync();
                return results;
            } catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }
    }
}
