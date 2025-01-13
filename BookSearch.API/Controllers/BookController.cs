using BookSearch.DAL.DTO;
using BookSearch.DAL.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using BookSearch.BLL.Logic;
using Microsoft.AspNetCore.Authorization;
using BookSearch.BLL.Interface;

namespace BookSearch.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private readonly IBookLogic _bookLogic;

        public BookController(IBookLogic bookLogic)
        {
            _bookLogic = bookLogic;
        }

        [Authorize]
        [HttpPost("registerBook")]
        public async Task<IActionResult> RegisterBook([FromBody] BookDto book)
        {
            if (book == null)
            {
                return BadRequest("Book object cannot be null.");
            }

            await _bookLogic.SaveBookAsync(book);
            return Ok("Book saved successfully.");
        }

        [HttpPost("searchBooks")]
        public async Task<IActionResult> SearchBooks([FromBody] BookDto criteria)
        {
            if (criteria == null)
            {
                return BadRequest("Search criteria cannot be null.");
            }

            try
            {
                var books = await _bookLogic.SearchBooksAsync(criteria);

                return Ok(books);
            } catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        [HttpGet("searchGoogleAPI")]
        public async Task<IActionResult> Search(string isbn)
        {
            Console.WriteLine($"Received ISBN: {isbn}");

            if (string.IsNullOrWhiteSpace(isbn))
            {
                Console.WriteLine("ISBN is empty or null.");
                return BadRequest("ISBN cannot be empty.");
            }

            var book = await _bookLogic.GetBookByIsbnAsync(isbn);

            if (book == null)
            {
                Console.WriteLine($"No book found for ISBN: {isbn}");
                return NotFound(new { Message = "No book found with the given ISBN." });
            }

            Console.WriteLine($"Returning book: {book.Title}");
            return Ok(book);
        }
    }
}
