using BookSearch.BLL.Interface;
using BookSearch.DAL.Data.Models;
using BookSearch.DAL.Data;
using BookSearch.DAL.DTO;
using BookSearch.DAL.Interface;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace BookSearch.BLL.Logic
{
    public class AuthLogic : IAuthLogic
    {
        private readonly IAuthRepository _authRepository;
        private readonly IConfiguration _configuration;

        public AuthLogic(IAuthRepository authRepository, IConfiguration configuration)
        {
            _authRepository = authRepository;
            _configuration = configuration;
        }

        public async Task<User?> EditUserProfileAsync(string email, User updatedData)
        {
            var user = await _authRepository.GetUserByEmailAsync(email);

            if (user == null)
            {
                return null;
            }

            user.FirstName = updatedData.FirstName;
            user.LastName = updatedData.LastName;
            user.PhoneNumber = updatedData.PhoneNumber;
            user.Gender = updatedData.Gender;

            if (updatedData.DateOfBirth.HasValue)
            {
                user.DateOfBirth = DateTime.SpecifyKind(
                    updatedData.DateOfBirth.Value,
                    DateTimeKind.Utc
                );
            }
            else
            {
                user.DateOfBirth = null;
            }

            await _authRepository.UpdateUserAsync(user);

            return user;
        }

        public async Task<User?> GetUserProfileAsync(string email)
        {
            return await _authRepository.GetUserByEmailAsync(email);
        }

        public async Task<LoginResultDto> LoginAsync(LoginDto model)
        {
            var user = await _authRepository.FindByEmailAsync(model.Email);

            if (user != null && await _authRepository.CheckPasswordAsync(user, model.Password))
            {
                var authClaims = new List<Claim>
            {
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

                var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));

                var token = new JwtSecurityToken(
                    issuer: _configuration["Jwt:Issuer"],
                    audience: _configuration["Jwt:Audience"],
                    expires: DateTime.Now.AddHours(1),
                    claims: authClaims,
                    signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
                );

                return new LoginResultDto
                {
                    IsSuccess = true,
                    Token = new JwtSecurityTokenHandler().WriteToken(token),
                    Expiration = token.ValidTo,
                    UserName = user.UserName,
                    Email = user.Email
                };
            }
            return new LoginResultDto { IsSuccess = false, Message = "Invalid credentials." };
        }

        public async Task<string?> RegisterUserAsync(LoginDto model)
        {
            if (model == null || string.IsNullOrWhiteSpace(model.Email) || string.IsNullOrWhiteSpace(model.Password))
            {
                return null;
            }

            var existingUser = await _authRepository.FindByEmailAsync(model.Email);
            if (existingUser != null)
            {
                return "Email is already in use.";
            }

            var identityUser = new ApplicationUser
            {
                UserName = model.Email,
                Email = model.Email
            };

            var creationSucceeded = await _authRepository.CreateIdentityUserAsync(identityUser, model.Password);

            if (!creationSucceeded)
            {
                return "User registration failed.";
            }

            var user = new User
            {
                Email = model.Email,
                FirstName = null,
                LastName = null,
                PhoneNumber = null,
                Gender = null,
                DateOfBirth = null
            };

            await _authRepository.AddApplicationUserAsync(user);

            return "User registered successfully.";
        }
    }
}
