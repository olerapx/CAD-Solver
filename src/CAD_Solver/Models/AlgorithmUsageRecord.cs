using System;
using System.ComponentModel.DataAnnotations;

namespace CAD_Solver.Models
{
    public class AlgorithmUsageRecord
    {
        public Guid AlgorithmUsageRecordID { get; set; }

        public Guid UserID { get; set; }
        public int AlgorithmID { get; set; }

        [Required]
        public string InputData { get; set; }
        public string Result { get; set; }

        [Required]
        public DateTime Date { get; set; }

        public User User { get; set; }
        public Algorithm Algorithm { get; set; }
    }
}
