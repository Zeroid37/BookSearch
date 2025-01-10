using BookSearch.Server.Data;
using BookSearch.DAL.DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using BookSearch.BLL.Logic;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace BookSearch.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly BookLogic _bookLogic;

        public BookController(UserManager<ApplicationUser> userManager, BookLogic bookLogic)
        {
            _userManager = userManager;
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
                // Await the async method
                var books = await _bookLogic.SearchBooksAsync(criteria);

                return Ok(books);
            } catch (Exception ex)
            {
                // Return error response in case of exceptions
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
