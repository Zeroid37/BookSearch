using BookSearch.DAL.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookSearch.BLL.Interface
{
    public interface IBookLogic
    {
        Task<bool> SaveBookAsync(BookDto book);
        Task<BookDto> GetBookByIsbnAsync(string isbn);
        Task<List<BookDto>> SearchBooksAsync(BookDto criteria);
    }
}
