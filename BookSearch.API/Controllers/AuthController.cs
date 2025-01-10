using BookSearch.Server.Data;
using BookSearch.Server.Data.Models;
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
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ApplicationDbContext _dbContext;
        private readonly IConfiguration _configuration;

        public AuthController(UserManager<ApplicationUser> userManager, ApplicationDbContext dbContext, IConfiguration configuration)
        {
            _userManager = userManager;
            _dbContext = dbContext;
            _configuration = configuration;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto model)
        {
            // Check if the user exists
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user != null && await _userManager.CheckPasswordAsync(user, model.Password))
            {
                // Create JWT claims (add more claims if needed)
                var authClaims = new List<Claim>
        {
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Name, user.UserName),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()) // Unique identifier for the token
        };

                // Get the signing key
                var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));

                // Generate the token
                var token = new JwtSecurityToken(
                    issuer: _configuration["Jwt:Issuer"],
                    audience: _configuration["Jwt:Audience"],
                    expires: DateTime.Now.AddHours(1), // Token is valid for 1 hour
                    claims: authClaims,
                    signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
                );

                // Return the token and additional user data
                return Ok(new
                {
                    token = new JwtSecurityTokenHandler().WriteToken(token),
                    expiration = token.ValidTo,
                    userName = user.UserName,
                    email = user.Email
                });
            }

            // Login failed
            return Unauthorized(new { success = false, message = "Invalid credentials." });
        }


        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] LoginDto model)
        {
            if (model == null || string.IsNullOrWhiteSpace(model.Email) || string.IsNullOrWhiteSpace(model.Password))
            {
                return BadRequest("Invalid registration details.");
            }

            // Check if the email is already in use
            var existingUser = await _userManager.FindByEmailAsync(model.Email);
            if (existingUser != null)
            {
                return Conflict("Email is already in use.");
            }

            // Create a new IdentityUser
            var identityUser = new ApplicationUser
            {
                UserName = model.Email,
                Email = model.Email
            };

            var result = await _userManager.CreateAsync(identityUser, model.Password);

            if (!result.Succeeded)
            {
                // Return errors if IdentityUser creation fails
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                return BadRequest($"User registration failed: {errors}");
            }

            // Create a corresponding User record in the database
            var user = new User
            {
                Email = model.Email, // Foreign key to AspNetUsers.Email
                FirstName = null,    // All other fields start as null
                LastName = null,
                PhoneNumber = null,
                Gender = null,
                DateOfBirth = null
            };

            // Save the User entity
            _dbContext.Users.Add(user);
            await _dbContext.SaveChangesAsync();

            return Ok("User registered successfully.");
        }


        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            if (email == null)
            {
                return Unauthorized("Invalid token.");
            }

            var user = await _dbContext.Users
                .SingleOrDefaultAsync(u => u.Email == email);

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

            var user = await _dbContext.Users
                .SingleOrDefaultAsync(u => u.Email == email);

            if (user == null)
            {
                return NotFound("User not found.");
            }

            user.FirstName = updatedData.FirstName;
            user.LastName = updatedData.LastName;
            user.PhoneNumber = updatedData.PhoneNumber;
            user.Gender = updatedData.Gender;

            // If updatedData.DateOfBirth has no value, just set null
            // Otherwise, convert it to a UTC DateTime
            if (updatedData.DateOfBirth.HasValue)
            {
                // Force the DateTimeKind to UTC:
                user.DateOfBirth = DateTime.SpecifyKind(
                    updatedData.DateOfBirth.Value,
                    DateTimeKind.Utc
                );
            }
            else
            {
                user.DateOfBirth = null;
            }

            await _dbContext.SaveChangesAsync();

            return Ok(new
            {
                Message = "Profile updated successfully",
                UpdatedUser = new
                {
                    user.Email,
                    user.FirstName,
                    user.LastName,
                    user.PhoneNumber,
                    user.Gender,
                    user.DateOfBirth
                }
            });
        }
    }
}