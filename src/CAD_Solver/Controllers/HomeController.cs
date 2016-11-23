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
using Microsoft.AspNetCore.Identity;

namespace CAD_Solver.Controllers
{
    public class HomeController : Controller
    {
        public AppKeyConfig AppConfigs { get; }
        public ILoggerFactory LoggerFactory { get; set; }
        public CadSolverDbContext Db { get; set; }

        public EmailService emailService { get; set; }

        private readonly UserManager<User> userManager;
        private readonly SignInManager<User> signInManager;

        public HomeController(ILoggerFactory loggerFactory, IServiceProvider provider, IOptions<AppKeyConfig> appkeys, 
                              UserManager<User> userManager, SignInManager<User> signInManager)
        {
            LoggerFactory = loggerFactory;
            Db = provider.GetRequiredService<CadSolverDbContext>();

            AppConfigs = appkeys.Value;

            emailService = new EmailService(AppConfigs.SmtpLogin, AppConfigs.SmtpPassword);

            this.userManager = userManager;
            this.signInManager = signInManager;
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

            User user = new User { Email = uvm.Email,
                UserName = uvm.Email,
                GenderID = uvm.GenderID,
                FirstName = uvm.FirstName,
                LastName = uvm.LastName,
                BirthDate = DateTime.ParseExact(uvm.BirthDate, "dd.mm.yyyy", System.Globalization.CultureInfo.InvariantCulture)
            };

            await userManager.CreateAsync(user, uvm.Password);

            var code = await userManager.GenerateEmailConfirmationTokenAsync(user);
            var callbackUrl = Url.Action(
                              "ConfirmEmail",
                              "Home",
                               new { userId = user.Id, code = code },
                               protocol: HttpContext.Request.Scheme);

            await emailService.SendEmailAsync(user.Email, "Подтверждение адреса", 
                                              $"Подтвердите регистрацию на сайте CAD Solver, пройдя по ссылке: <a href='{callbackUrl}'>Подтверждение регистарации</a>");

            return Content("Регистрация почти завершена! Для подтверждения вашей почты пройдите по ссылке в письме, отправленном на указанный адрес.");
        }

        [Route("confirmation")]
        public async Task<IActionResult> ConfirmEmail(string userId, string code)
        {
            if (userId == null || code == null)
                return RedirectToAction("Error", "Home");

            var user = await userManager.FindByIdAsync(userId);

            if (user == null)
                return RedirectToAction("Error", "Home");

            var result = await userManager.ConfirmEmailAsync(user, code);

            if (!result.Succeeded)
                return RedirectToAction("Error", "Home");

            return RedirectToAction("Index", "Home");            
        }

        public async Task<IActionResult> Login()
        {
            return null;
        }

        public async Task<IActionResult> Logout()
        {
            await signInManager.SignOutAsync();
            return RedirectToAction("Index", "Home");
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
