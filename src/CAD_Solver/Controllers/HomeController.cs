using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace CAD_Solver.Controllers
{
    public class HomeController : Controller
    {
        [Route("index")]
        [Route ("")]
        public IActionResult Index()
        {
            return View();
        }

        [Route("about")]
        public IActionResult About()
        {
            return View();
        }

        [Route("dsp")]
        public IActionResult Dsp()
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

        [Route("error")]
        public IActionResult Error()
        {
            return View();
        }
    }
}
