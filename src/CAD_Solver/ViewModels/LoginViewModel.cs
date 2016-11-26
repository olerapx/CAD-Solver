using System.ComponentModel.DataAnnotations;

namespace CAD_Solver.ViewModels
{
    public class LoginViewModel
    {
        [EmailAddress(ErrorMessage = "Некорректный адрес")]
        [Required(ErrorMessage = "Требуются данные")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Требуются данные")]
        [StringLength(100, MinimumLength = 5, ErrorMessage = "Длина пароля должна быть не менее 5 символов")]
        [Display(Name = "Пароль")]
        public string Password { get; set; }

        [Required]
        [Display(Name="Запомнить меня")]
        public bool RememberMe { get; set; }
    }
}
