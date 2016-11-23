using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using CAD_Solver.Models;

namespace CAD_Solver.Migrations
{
    [DbContext(typeof(CadSolverDbContext))]
    partial class CadSolverDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
            modelBuilder
                .HasAnnotation("ProductVersion", "1.0.1")
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("CAD_Solver.Models.Algorithm", b =>
                {
                    b.Property<int>("AlgorithmID")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Name")
                        .IsRequired();

                    b.HasKey("AlgorithmID");

                    b.ToTable("Algorithms");
                });

            modelBuilder.Entity("CAD_Solver.Models.AlgorithmUsageRecord", b =>
                {
                    b.Property<Guid>("AlgorithmUsageRecordID")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("AlgorithmID");

                    b.Property<DateTime>("Date");

                    b.Property<string>("InputData")
                        .IsRequired();

                    b.Property<string>("Result");

                    b.Property<Guid?>("UserID");

                    b.HasKey("AlgorithmUsageRecordID");

                    b.HasIndex("AlgorithmID");

                    b.HasIndex("UserID");

                    b.ToTable("AlgorithmJournal");
                });

            modelBuilder.Entity("CAD_Solver.Models.Gender", b =>
                {
                    b.Property<int>("GenderID")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Name")
                        .IsRequired();

                    b.HasKey("GenderID");

                    b.ToTable("Genders");
                });

            modelBuilder.Entity("CAD_Solver.Models.User", b =>
                {
                    b.Property<Guid>("UserID")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime?>("BirthDate");

                    b.Property<string>("Email")
                        .IsRequired();

                    b.Property<bool>("EmailConfirmed");

                    b.Property<string>("FirstName");

                    b.Property<int>("GenderID");

                    b.Property<string>("LastName");

                    b.Property<string>("PasswordHash")
                        .IsRequired();

                    b.Property<string>("Salt")
                        .IsRequired();

                    b.HasKey("UserID");

                    b.HasIndex("Email")
                        .IsUnique();

                    b.HasIndex("GenderID");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("CAD_Solver.Models.AlgorithmUsageRecord", b =>
                {
                    b.HasOne("CAD_Solver.Models.Algorithm", "Algorithm")
                        .WithMany()
                        .HasForeignKey("AlgorithmID")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("CAD_Solver.Models.User", "User")
                        .WithMany()
                        .HasForeignKey("UserID");
                });

            modelBuilder.Entity("CAD_Solver.Models.User", b =>
                {
                    b.HasOne("CAD_Solver.Models.Gender", "Gender")
                        .WithMany()
                        .HasForeignKey("GenderID")
                        .OnDelete(DeleteBehavior.Cascade);
                });
        }
    }
}
