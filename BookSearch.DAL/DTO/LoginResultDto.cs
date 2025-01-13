using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookSearch.DAL.DTO
{
    public class LoginResultDto
    {
        public bool IsSuccess { get; set; }
        public string Token { get; set; }
        public DateTime Expiration { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Message { get; set; }
    }
}
