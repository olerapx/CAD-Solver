using Microsoft.AspNetCore.Razor.TagHelpers;

namespace CAD_Solver.TagHelpers
{
    [HtmlTargetElement("bgimage", Attributes = "src")]
    public class BackgroundImageTagHelper : TagHelper
    {
        public string Src { get; set; }

        public BackgroundImageTagHelper()
        {

        }

        public override void Process(TagHelperContext context, TagHelperOutput output)
        {
            output.TagName = "div";
            output.Attributes.SetAttribute("id", "full-page-bg");

            string style = $"background-image: url({Src})";
            output.Attributes.SetAttribute("style", style);           
        }
    }
}
