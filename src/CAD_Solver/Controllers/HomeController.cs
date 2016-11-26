using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using CAD_Solver.Models;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.DependencyInjection;
using CAD_Solver.ViewModels;
using CAD_Solver.Utils;
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

        [HttpGet]
        [Route("tdsp")]
        public IActionResult Tdsp()
        {
            return View();
        }

        [HttpGet]
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
            RegistrationViewModel model = new RegistrationViewModel();
            model.Genders = Db.Genders;
            return View(model);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        [Route("register")]        
        public async Task<IActionResult> Register(RegistrationViewModel model)
        {
            if (!ModelState.IsValid)
            {

                return Content("Введенные данные неверны. Пожалуйста, проверьте ввод.");
            }

            if (Db.Users.Any(u => u.Email.Equals(model.Email)))
            {

                return Content("Пользователь с таким именем уже существует.");
            }

            User user = new User {
                Email = model.Email,
                UserName = model.Email,
                GenderID = model.GenderID,
                FirstName = model.FirstName,
                LastName = model.LastName,
                BirthDate = (model.BirthDate == null) ? (DateTime?)null : DateTime.ParseExact(model.BirthDate, "dd.mm.yyyy", System.Globalization.CultureInfo.InvariantCulture)
            };

            await userManager.CreateAsync(user, model.Password);

            var code = await userManager.GenerateEmailConfirmationTokenAsync(user);
            var callbackUrl = Url.Action(
                              "Confirmation",
                              "Home",
                               new { userId = user.Id, code = code },
                               protocol: HttpContext.Request.Scheme);

            await emailService.SendEmailAsync(user.Email, "Подтверждение адреса", 
                                              $"Подтвердите регистрацию на сайте CAD Solver, пройдя по ссылке: <a href='{callbackUrl}'>Подтверждение регистрации</a>");

            return Content("Регистрация почти завершена! Для подтверждения вашей почты пройдите по ссылке из письма, отправленном на указанный адрес.");
        }

        [Route("confirmation")]
        public async Task<IActionResult> Confirmation(string userId, string code)
        {
            if (userId == null || code == null)
                return RedirectToAction("Error", "Home");

            var user = await userManager.FindByIdAsync(userId);

            if (user == null)
                return RedirectToAction("Error", "Home");

            var result = await userManager.ConfirmEmailAsync(user, code);

            if (!result.Succeeded)
                return RedirectToAction("Error", "Home");

            return View();          
        }

        [HttpGet]
        [Route("login")]
        public ActionResult Login()
        {
            LoginViewModel model = new LoginViewModel();
            return PartialView(model);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        [Route("login")]
        public async Task<IActionResult> Login(LoginViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return Json(new { result = "error", error = "Введены некорректные данные" });
            }

            User user = Db.Users.First(u => u.Email == model.Email);
            if (user != null && !user.EmailConfirmed)
            {
                return Json(new { result = "error", error = "Данный аккаунт не подтвержден" });
            }

            var result = await signInManager.PasswordSignInAsync(model.Email, model.Password, true, false); // add remember me

            if (!result.Succeeded)
            {
                return Json(new { result = "error", error = "Неправильный логин и (или) пароль" });
            }

            return Json(new { result = "Redirect", returnUrl = "/" });
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
