using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CAD_Solver.Models
{
    public class CadSolverDbContext : IdentityDbContext<User>
    {
        public DbSet<Gender> Genders { get; set; }
        public DbSet<Algorithm> Algorithms { get; set; }
        public DbSet<AlgorithmUsageRecord> AlgorithmJournal { get; set; }

        public CadSolverDbContext(DbContextOptions<CadSolverDbContext> options)
            : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique(true);

            base.OnModelCreating(modelBuilder);
        }
    }
}
