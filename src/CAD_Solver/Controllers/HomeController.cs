using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using CAD_Solver.Models;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.DependencyInjection;
using CAD_Solver.ViewModels;
using CAD_Solver.Utils;
using System.Security.Claims;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Authorization;

namespace CAD_Solver.Controllers
{
    public class HomeController : Controller
    {
        public AppKeyConfig AppConfigs { get; }
        public ILoggerFactory LoggerFactory { get; set; }
        public CadSolverDbContext Db { get; set; }

        public EmailService emailService { get; set; }

        public HomeController(ILoggerFactory loggerFactory, IServiceProvider provider, IOptions<AppKeyConfig> appkeys)
        {
            LoggerFactory = loggerFactory;
            Db = provider.GetRequiredService<CadSolverDbContext>();

            AppConfigs = appkeys.Value;

            emailService = new EmailService(AppConfigs.SmtpLogin, AppConfigs.SmtpPassword);
        }

        [Route("")]
        public IActionResult Index()
        {
            return View();
        }

        [Route("about")]
        public IActionResult About()
        {
            return View();
        }

        [Route("tdsp")]
        public IActionResult Tdsp()
        {
            return View();
        }

        [Route("otsp")]
        public IActionResult Otsp()
        {
            return View();
        }

        [Authorize]
        [Route("stats")]
        public IActionResult Stats()
        {
            return View();
        }

        [HttpGet]
        [Route("register")]
        public IActionResult Register()
        {
            UserViewModel uvm = new UserViewModel();
            uvm.Genders = Db.Genders;
            return View(uvm);
        }

        [HttpPost]
        [Route("register")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Register(UserViewModel uvm)
        {
            if (!ModelState.IsValid)
            {

                return Content("Введенные данные неверны. Пожалуйста, проверьте ввод.");
            }
            if (Db.Users.Any(u => u.Email.Equals(uvm.Email)))
            {

                return Content("Пользователь с таким именем уже существует.");
            }

            string salt;

            User user = new User { Email = uvm.Email,
                                   EmailConfirmed = false,
                                   PasswordHash = Cryptor.Encrypt(uvm.Password, out salt),
                                   Salt = salt,
                                   GenderID = uvm.GenderID,
                                   FirstName = uvm.FirstName,
                                   LastName = uvm.LastName,
                                   BirthDate = uvm.BirthDate};
            Db.Users.Add(user);
            await Db.SaveChangesAsync();

            await emailService.SendEmailAsync(user.Email, "Подтверждение адреса", "just kidding");

            return Content("That's OK");
        }

        [Route("confirmation")]
        public IActionResult ConfirmEmail()
        {

            return null;
        }

        [NonAction]
        private async Task Authentificate(string email)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimsIdentity.DefaultNameClaimType, email)
            };

            ClaimsIdentity id = new ClaimsIdentity(claims, "ApplicationCookie", ClaimsIdentity.DefaultNameClaimType,
                ClaimsIdentity.DefaultRoleClaimType);

            await HttpContext.Authentication.SignInAsync("Cookies", new ClaimsPrincipal(id));
        }

        public async Task<IActionResult> Logout()
        {
            await HttpContext.Authentication.SignOutAsync("Cookies");

            return RedirectToAction("Index");
        }

        public IActionResult Error()
        {
            return View();
        }

        public IActionResult HttpError(int id)
        {
            ViewBag.Status = id;
            return View();
        }
    }
}
