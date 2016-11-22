using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using CAD_Solver.Models;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.DependencyInjection;
using CAD_Solver.ViewModels;

namespace CAD_Solver.Controllers
{
    public class HomeController : Controller
    {
        public ILoggerFactory LoggerFactory { get; set; }
        public CadSolverDbContext Db { get; set; }

        public HomeController(ILoggerFactory loggerFactory, IServiceProvider provider)
        {
            LoggerFactory = loggerFactory;
            Db = provider.GetRequiredService<CadSolverDbContext>();
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
        public void Register(UserViewModel uvm)
        {
            if (ModelState.IsValid)
            {

            }
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
