using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.Routing;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Razor.TagHelpers;
using System;
using System.Text;

namespace CAD_Solver.TagHelpers
{
    [HtmlTargetElement("menulink", Attributes = "asp-controller, asp-action, menu-text")]
    public class MenuLinkTagHelper : TagHelper
    {
        public string AspController { get; set; }
        public string AspAction { get; set; }
        public string MenuText { get; set; }
        [ViewContext]
        public ViewContext ViewContext { get; set; }

        private IUrlHelperFactory urlHelperFactory;
        private IActionContextAccessor actionAccessor;

        public MenuLinkTagHelper(IUrlHelperFactory urlHelperFactory, IActionContextAccessor actionAccessor)
        {
            this.urlHelperFactory = urlHelperFactory;
            this.actionAccessor = actionAccessor;
        }

        public override void Process(TagHelperContext context, TagHelperOutput output)
        {
            StringBuilder sb = new StringBuilder();
            var urlHelper = this.urlHelperFactory.GetUrlHelper(this.actionAccessor.ActionContext);
            string menuUrl = urlHelper.Action(AspAction, AspController);

            output.TagName = "li";

            var a = new TagBuilder("a");
            a.MergeAttribute("href", $"{menuUrl}");
            a.MergeAttribute("title", MenuText);
            a.InnerHtml.Append(MenuText);

            var routeData = ViewContext.RouteData.Values;
            var currentController = routeData["controller"];
            var currentAction = routeData["action"];

            if (String.Equals(AspAction, currentAction as string, StringComparison.OrdinalIgnoreCase)
                && String.Equals(AspController, currentController as string, StringComparison.OrdinalIgnoreCase))
            {
                output.Attributes.Add("class", "active");
            }
            output.Content.AppendHtml(a);
        }
    }
}
