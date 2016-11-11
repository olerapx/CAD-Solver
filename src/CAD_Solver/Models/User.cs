using System;
using System.ComponentModel.DataAnnotations;

namespace CAD_Solver.Models
{
    public class User
    {
        public Guid UserID { get; set; }

        [Required]
        public string Email { get; set; }

        [Required]
        public int GenderID { get; set; }

        [Required]
        public string FirstName { get; set; }

        [Required]
        public string LastName { get; set; }
        public DateTime? BirthDate { get; set; }

        [Required]
        public bool EmailConfirmed { get; set; }

        [Required]
        public string PasswordHash { get; set; }

        public Gender Gender { get; set; }
    }
}
