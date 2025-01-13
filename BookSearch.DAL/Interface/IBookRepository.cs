using BookSearch.DAL.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookSearch.DAL.Interface
{
    public interface IBookRepository
    {
        Task SaveBookAsync(BookDto book);
        Task<List<BookDto>> SearchBooksAsync(BookDto criteria);
        public Task<Item> GetBookByIsbnAsync(string isbn);
    }
}
