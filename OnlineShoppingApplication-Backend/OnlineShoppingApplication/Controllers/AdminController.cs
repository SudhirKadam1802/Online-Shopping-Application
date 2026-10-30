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
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private static readonly HashSet<string> OrderStatuses = new(StringComparer.OrdinalIgnoreCase)
        {
            "Placed",
            "Processing",
            "Shipped",
            "Delivered",
            "Cancelled"
        };

        private readonly ApplicationDbContext _context;

        public AdminController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("dashboard")]
        public async Task<IActionResult> GetDashboard()
        {
            var totalOrders = await _context.Orders.CountAsync();
            var activeOrders = await _context.Orders
                .CountAsync(order => order.Status == "Placed"
                    || order.Status == "Processing"
                    || order.Status == "Shipped");

            return Ok(new
            {
                totalProducts = await _context.Products.CountAsync(),
                totalUsers = await _context.Users.CountAsync(),
                totalOrders,
                activeOrders,
                totalSales = await _context.Orders
                    .Where(order => order.Status != "Cancelled")
                    .SumAsync(order => (decimal?)order.GrandTotal) ?? 0m
            });
        }

        [HttpGet("orders")]
        public async Task<IActionResult> GetOrders()
        {
            var orders = await _context.Orders
                .Include(order => order.Items)
                .OrderByDescending(order => order.CreatedAt)
                .Select(order => new
                {
                    order.Id,
                    order.UserId,
                    customerName = _context.Users
                        .Where(user => user.Id == order.UserId)
                        .Select(user => user.Name)
                        .FirstOrDefault(),
                    order.CreatedAt,
                    order.Status,
                    order.Subtotal,
                    order.DiscountAmount,
                    order.GrandTotal,
                    items = order.Items
                })
                .ToListAsync();

            return Ok(orders);
        }

        [HttpPut("orders/{orderId:int}/status")]
        public async Task<IActionResult> UpdateOrderStatus(
            int orderId,
            UpdateOrderStatusRequest request)
        {
            var status = request.Status.Trim();
            if (!OrderStatuses.Contains(status))
            {
                return BadRequest(new
                {
                    message = "Status must be Placed, Processing, Shipped, Delivered, or Cancelled."
                });
            }

            var order = await _context.Orders
                .Include(order => order.Items)
                .FirstOrDefaultAsync(order => order.Id == orderId);

            if (order is null) return NotFound(new { message = "Order not found." });
            var normalizedStatus = OrderStatuses.Single(
                allowed => allowed.Equals(status, StringComparison.OrdinalIgnoreCase));

            if (order.Status.Equals(normalizedStatus, StringComparison.OrdinalIgnoreCase))
            {
                return Ok(new { order.Id, order.Status });
            }

            var isAllowedTransition = order.Status switch
            {
                "Placed" => normalizedStatus is "Processing" or "Cancelled",
                "Processing" => normalizedStatus is "Shipped" or "Cancelled",
                "Shipped" => normalizedStatus == "Delivered",
                _ => false
            };

            if (!isAllowedTransition)
            {
                return Conflict(new { message = $"Order status cannot change from {order.Status} to {normalizedStatus}." });
            }

            if (normalizedStatus == "Cancelled")
            {
                foreach (var item in order.Items)
                {
                    var product = await _context.Products.FindAsync(item.ProductId);
                    if (product is not null) product.StockQuantity += item.Quantity;
                }

                order.Status = "Cancelled";
            }
            else
            {
                order.Status = normalizedStatus;
            }

            await _context.SaveChangesAsync();
            return Ok(new { order.Id, order.Status });
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _context.Users
                .OrderBy(user => user.Name)
                .Select(user => new
                {
                    user.Id,
                    user.Name,
                    user.Email,
                    user.IsAdmin
                })
                .ToListAsync();

            return Ok(users);
        }

        [HttpPut("users/{userId:int}/role")]
        public async Task<IActionResult> UpdateUserRole(int userId, UpdateUserRoleRequest request)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user is null) return NotFound(new { message = "User not found." });

            if (!request.IsAdmin && user.IsAdmin)
            {
                var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier)
                    ?? User.FindFirstValue("sub");

                if (int.TryParse(currentUserId, out var actorId) && actorId == user.Id)
                {
                    return Conflict(new { message = "You cannot revoke your own admin access." });
                }

                var otherAdminsExist = await _context.Users
                    .AnyAsync(candidate => candidate.IsAdmin && candidate.Id != user.Id);
                if (!otherAdminsExist)
                {
                    return Conflict(new { message = "The last administrator cannot be removed." });
                }
            }

            user.IsAdmin = request.IsAdmin;
            await _context.SaveChangesAsync();
            return Ok(new { user.Id, user.Name, user.Email, user.IsAdmin });
        }
    }
}
