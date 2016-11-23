using System;
using System.Linq;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.EntityFrameworkCore;
using CAD_Solver.Models;

namespace CAD_Solver
{
    public class Startup
    {
        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddEnvironmentVariables();

            if (env.IsDevelopment())
            {
                // This will push telemetry data through Application Insights pipeline faster, allowing you to view results immediately.
                builder.AddApplicationInsightsSettings(developerMode: true);
                builder.AddUserSecrets();
            }
            Configuration = builder.Build();
        }

        public IConfigurationRoot Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.Configure<AppKeyConfig>(Configuration.GetSection("AppKeys"));
            // Add framework services.
            services.AddApplicationInsightsTelemetry(Configuration);

            string connection = Configuration.GetConnectionString("DefaultConnection");
            services.AddDbContext<CadSolverDbContext>(options => options.UseSqlServer(connection));

            services.AddMvc();

            services.AddSingleton<IActionContextAccessor, ActionContextAccessor>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            loggerFactory.AddConsole(Configuration.GetSection("Logging"));
            loggerFactory.AddDebug();

            app.UseApplicationInsightsRequestTelemetry();

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseBrowserLink(); 
            }
            else
            {
                app.UseExceptionHandler("/Home/Error/");
            }

            app.UseApplicationInsightsExceptionTelemetry();

            app.UseStaticFiles();
            app.UseStatusCodePagesWithReExecute("/Home/HttpError/{0}");

            app.UseCookieAuthentication(new CookieAuthenticationOptions
            {
                AuthenticationScheme = "Cookies",
                LoginPath = new Microsoft.AspNetCore.Http.PathString("/register"),
                AutomaticAuthenticate = true,
                AutomaticChallenge = true
            });

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");
            });

            InitializeDatabase(app.ApplicationServices);
        }

        public void InitializeDatabase(IServiceProvider provider)
        {
            using (CadSolverDbContext db = provider.GetRequiredService<CadSolverDbContext>())
            {
                if (db.Genders.Count() == 0)
                {
                    db.Genders.Add(new Gender { Name = "Не указано" });
                    db.Genders.Add(new Gender { Name = "Мужской" });
                    db.Genders.Add(new Gender { Name = "Женский" });
                }

                if (db.Algorithms.Count() == 0)
                {
                    db.Algorithms.Add(new Algorithm { Name = "Задача коммивояжера"});
                    db.Algorithms.Add(new Algorithm { Name = "Задача двумерной упаковки" });
                    db.Algorithms.Add(new Algorithm { Name = "Задача о клике" });
                }

                db.SaveChanges();
            }
        }
    }
}
