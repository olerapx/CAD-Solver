using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace CAD_Solver.Controllers
{
    public class HomeController : Controller
    {
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

        public IActionResult Error()
        {
            return View();
        }
    }
}
