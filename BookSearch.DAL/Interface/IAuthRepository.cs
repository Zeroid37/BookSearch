using BookSearch.DAL.Data;
using BookSearch.DAL.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookSearch.DAL.Interface
{
    public interface IAuthRepository
    {
        Task<ApplicationUser> FindByEmailAsync(string email);
        Task<User?> GetUserByEmailAsync(string email);
        Task<bool> CheckPasswordAsync(ApplicationUser user, string password);
        Task<bool> CreateIdentityUserAsync(ApplicationUser user, string password);
        Task AddApplicationUserAsync(User user);
        Task UpdateUserAsync(User user);
    }
}
