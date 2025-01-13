using BookSearch.DAL.Data;
using BookSearch.DAL.Data.Models;
using BookSearch.DAL.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookSearch.BLL.Interface
{
    public interface IAuthLogic
    {
        Task<User?> GetUserProfileAsync(string email);
        Task<LoginResultDto> LoginAsync(LoginDto model);
        Task<string?> RegisterUserAsync(LoginDto model);
        Task<User?> EditUserProfileAsync(string email, User updatedData);
    }
}
