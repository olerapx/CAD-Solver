using System.ComponentModel.DataAnnotations;

namespace CAD_Solver.Models
{
    public class Gender
    {
        public int GenderID { get; set; }

        [Required]
        public string Name { get; set; }
    }
}
