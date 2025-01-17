using BookSearch.BLL.Interface;
using BookSearch.DAL.DTO;
using BookSearch.DAL.Interface;
using Microsoft.Extensions.Configuration;

namespace BookSearch.BLL.Logic
{
    public class BookLogic : IBookLogic
    {
        private readonly IConfiguration _configuration;
        private readonly IBookRepository _bookRepository;

        public BookLogic(IConfiguration configuration, IBookRepository bookRepository)
        {
            _configuration = configuration;
            _bookRepository = bookRepository;
        }

        public async Task<BookDto> GetBookByIsbnAsync(string isbn)
        {
            var googleBook = await _bookRepository.GetBookByIsbnAsync(isbn);

            if (googleBook == null)
            {
                return null;
            }

            return new BookDto
            {
                Title = googleBook.volumeInfo.title,
                Author = googleBook.volumeInfo.authors.FirstOrDefault(),
                ISBN = googleBook.volumeInfo.industryIdentifiers.FirstOrDefault(i => i.type == "ISBN_13").identifier,
                PublishYear = googleBook.volumeInfo.publishedDate.Split('-')[0],
                Publisher = googleBook.volumeInfo.publisher,
                Genres = new List<string>(),
                Description = googleBook.volumeInfo.description
            };
        }

        public async Task<bool> SaveBookAsync(BookDto book)
        {
            await _bookRepository.SaveBookAsync(book);
            return true;
        }

        public async Task<List<BookDto>> SearchBooksAsync(BookDto criteria)
        {
           List<BookDto> res = await _bookRepository.SearchBooksAsync(criteria);
           return res;
        }
    }
}
