using BookSearch.BLL.Interface;
using BookSearch.DAL.DTO;
using BookSearch.DAL.Interface;
using Microsoft.Extensions.Configuration;
using MongoDB.Bson;
using MongoDB.Driver;


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

        public Task<BookFromGoogleDTO> GetBookByIsbnAsync(string isbn)
        {
            throw new NotImplementedException();
        }

        public async Task SaveBookAsync(BookDto book)
        {
            await _bookRepository.SaveBookAsync(book);
        }

        public async Task<List<BookDto>> SearchBooksAsync(BookDto criteria)
        {
           List<BookDto> res = await _bookRepository.SearchBooksAsync(criteria);
           return res;
        }
    }
}
