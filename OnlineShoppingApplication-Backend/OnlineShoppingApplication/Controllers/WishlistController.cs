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
    public class WishlistController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public WishlistController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetWishlist()
        {
            if (!TryGetUserId(out var userId)) return Unauthorized();

            var products = await _context.WishlistItems
                .Where(item => item.UserId == userId)
                .Include(item => item.Product)
                .Select(item => item.Product!)
                .ToListAsync();

            return Ok(products);
        }

        [HttpPost("{productId:int}")]
        public async Task<IActionResult> Add(int productId)
        {
            if (!TryGetUserId(out var userId)) return Unauthorized();

            if (!await _context.Products.AnyAsync(product => product.Id == productId))
            {
                return NotFound(new { message = "Product not found." });
            }

            if (!await _context.WishlistItems.AnyAsync(item =>
                    item.UserId == userId && item.ProductId == productId))
            {
                _context.WishlistItems.Add(new WishlistItem
                {
                    UserId = userId,
                    ProductId = productId
                });
                await _context.SaveChangesAsync();
            }

            return NoContent();
        }

        [HttpDelete("{productId:int}")]
        public async Task<IActionResult> Remove(int productId)
        {
            if (!TryGetUserId(out var userId)) return Unauthorized();

            var item = await _context.WishlistItems.FirstOrDefaultAsync(item =>
                item.UserId == userId && item.ProductId == productId);

            if (item is null) return NotFound();

            _context.WishlistItems.Remove(item);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private bool TryGetUserId(out int userId)
        {
            var value = User.FindFirstValue(ClaimTypes.NameIdentifier)
                ?? User.FindFirstValue("sub");
            return int.TryParse(value, out userId);
        }
    }
}
