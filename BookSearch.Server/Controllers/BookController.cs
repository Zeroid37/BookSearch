using BookSearch.Server.Data;
using BookSearch.Server.DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace BookSearch.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;

        public BookController(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        [HttpPost("registerBook")]
        public async Task<IActionResult> Login([FromBody] BookDto book)
        {
            await Console.Out.WriteLineAsync("book");
            return Ok(book);
        }
    }

}
