using System.ComponentModel.DataAnnotations;

namespace OnlineShoppingApplication.Models
{
    public class UpdateOrderStatusRequest
    {
        [Required]
        public string Status { get; set; } = string.Empty;
    }
}
