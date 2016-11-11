using System.ComponentModel.DataAnnotations;

namespace CAD_Solver.Models
{
    public class Algorithm
    {
        public int AlgorithmID { get; set; }

        [Required]
        public string Name { get; set; }
    }
}
