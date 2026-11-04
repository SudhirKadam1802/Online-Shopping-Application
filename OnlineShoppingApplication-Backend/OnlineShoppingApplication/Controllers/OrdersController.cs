using System.Data;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OnlineShoppingApplication.Data;
using OnlineShoppingApplication.Models;

namespace OnlineShoppingApplication.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class OrdersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public OrdersController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("checkout/{cartId:int}")]
        public async Task<ActionResult<Order>> Checkout(int cartId)
        {
            if (!TryGetUserId(out var userId)) return Unauthorized();

            Microsoft.EntityFrameworkCore.Storage.IDbContextTransaction? transaction = null;
            try
            {
                if (_context.Database.IsRelational())
                {
                    transaction = await _context.Database.BeginTransactionAsync(
                        IsolationLevel.Serializable);
                }

                var cart = await _context.Carts
                    .Include(cart => cart.CartItems)
                    .ThenInclude(item => item.Product)
                    .FirstOrDefaultAsync(cart => cart.Id == cartId && cart.UserId == userId);

                if (cart is null) return NotFound(new { message = "Cart not found." });
                if (cart.CartItems.Count == 0)
                    return BadRequest(new { message = "Cannot checkout an empty cart." });

                foreach (var item in cart.CartItems)
                {
                    if (item.Product is null || item.Product.StockQuantity < item.Quantity)
                    {
                        return Conflict(new
                        {
                            message = $"Insufficient stock for {item.Product?.Name ?? "a cart item"}."
                        });
                    }
                }

                var subtotal = cart.CartItems.Sum(item => item.Quantity * item.Price);
                var discountAmount = Math.Round(
                    cart.CartItems.Sum(item =>
                        item.Quantity * item.Price * item.Product!.Discount / 100m),
                    2);

                var order = new Order
                {
                    UserId = userId,
                    CreatedAt = DateTime.UtcNow,
                    Subtotal = subtotal,
                    DiscountAmount = discountAmount,
                    GrandTotal = subtotal - discountAmount,
                    Items = cart.CartItems.Select(item => new OrderItem
                    {
                        ProductId = item.ProductId,
                        ProductName = item.Product!.Name,
                        Quantity = item.Quantity,
                        UnitPrice = item.Price,
                        DiscountPercentage = item.Product.Discount
                    }).ToList()
                };

                foreach (var item in cart.CartItems)
                {
                    item.Product!.StockQuantity -= item.Quantity;
                }

                _context.Orders.Add(order);
                _context.CartItems.RemoveRange(cart.CartItems);
                await _context.SaveChangesAsync();
                if (transaction is not null) await transaction.CommitAsync();

                return Ok(order);
            }
            catch
            {
                if (transaction is not null) await transaction.RollbackAsync();
                throw;
            }
            finally
            {
                if (transaction is not null) await transaction.DisposeAsync();
            }
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Order>>> GetOrders()
        {
            if (!TryGetUserId(out var userId)) return Unauthorized();

            var orders = await _context.Orders
                .Where(order => order.UserId == userId)
                .Include(order => order.Items)
                .OrderByDescending(order => order.CreatedAt)
                .ToListAsync();

            return Ok(orders);
        }

        private bool TryGetUserId(out int userId)
        {
            var value = User.FindFirstValue(ClaimTypes.NameIdentifier)
                ?? User.FindFirstValue("sub");
            return int.TryParse(value, out userId);
        }
    }
}
