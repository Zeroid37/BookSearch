using BookSearch.BLL.Interface;
using BookSearch.DAL.Data;
using BookSearch.DAL.Data.Models;
using BookSearch.DAL.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace BookSearch.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthLogic _authLogic;

        public AuthController(IAuthLogic authLogic)
        {
            _authLogic = authLogic;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto model)
        {
            var result = await _authLogic.LoginAsync(model);

            if (result.IsSuccess)
            {
                return Ok(new
                {
                    token = result.Token,
                    expiration = result.Expiration,
                    userName = result.UserName,
                    email = result.Email
                });
            }

            return Unauthorized(new { success = false, message = result.Message });
        }


        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] LoginDto model)
        {
            var result = await _authLogic.RegisterUserAsync(model);

            if (string.IsNullOrEmpty(result))
            {
                return Conflict(result);
            }
            if (result.Equals("User registered successfully."))
            {
                return Ok(result);
            }
            return Conflict(result);
        }


        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            if (email == null)
            {
                return Unauthorized("Invalid token.");
            }

            var user = await _authLogic.GetUserProfileAsync(email);

            if (user == null)
            {
                return NotFound("User not found.");
            }

            return Ok(new
            {
                user.Email,
                user.FirstName,
                user.LastName,
                user.PhoneNumber,
                user.Gender,
                user.DateOfBirth
            });
        }

        [HttpPost("profileEdit")]
        public async Task<IActionResult> EditProfile([FromBody] User updatedData)
        {
            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            if (email == null)
            {
                return Unauthorized("Invalid token.");
            }

            var result = await _authLogic.EditUserProfileAsync(email, updatedData);

            if (result == null)
            {
                return NotFound("User not found.");
            }

            return Ok(new
            {
                Message = "Profile updated successfully",
                UpdatedUser = new
                {
                    result.Email,
                    result.FirstName,
                    result.LastName,
                    result.PhoneNumber,
                    result.Gender,
                    result.DateOfBirth
                }
            });
        }
    }
}