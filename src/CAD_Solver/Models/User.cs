using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using System;
using System.ComponentModel.DataAnnotations;

namespace CAD_Solver.Models
{
    public class User: IdentityUser
    {
        [Required]
        public int GenderID { get; set; }

        public string FirstName { get; set; }
        public string LastName { get; set; }

        public DateTime? BirthDate { get; set; }

        public Gender Gender { get; set; }
    }
}
