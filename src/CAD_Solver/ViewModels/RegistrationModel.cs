using CAD_Solver.Models;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CAD_Solver.ViewModels
{
    public class RegistrationModel
    {
        [EmailAddress(ErrorMessage = "Некорректный адрес")]
        [Required(ErrorMessage = "Требуются данные")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Требуются данные")]
        [StringLength(100, MinimumLength = 5, ErrorMessage = "Длина пароля должна быть не менее 5 символов")]
        [Display(Name = "Пароль")]
        public string Password { get; set; }

        [Required(ErrorMessage = "Требуются данные")]
        [Compare("Password", ErrorMessage = "Пароли не совпадают")]
        [Display(Name = "Подтвердите пароль")]
        public string PasswordConfirmation { get; set; }

        [Required(ErrorMessage = "Требуются данные")]
        [Display(Name = "Пол")]
        public int GenderID { get; set; }

        [Display(Name = "Имя")]
        public string FirstName { get; set; }
        [Display(Name = "Фамилия")]
        public string LastName { get; set; }

        [RegularExpression(@"(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[012])\.(19|20)\d\d", ErrorMessage = "Некорректная дата")]
        [Display(Name = "Дата рождения")]
        public string BirthDate { get; set; }

        public IEnumerable<Gender> Genders { get; set; }
    }
}
