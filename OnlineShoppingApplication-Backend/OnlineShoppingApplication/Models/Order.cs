namespace OnlineShoppingApplication.Models
{
    public class Order
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public string Status { get; set; } = "Placed";

        public decimal Subtotal { get; set; }

        public decimal DiscountAmount { get; set; }

        public decimal GrandTotal { get; set; }

        public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
    }
}
