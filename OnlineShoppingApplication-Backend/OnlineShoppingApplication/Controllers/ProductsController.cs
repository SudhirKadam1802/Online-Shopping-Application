using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OnlineShoppingApplication.Data;
using OnlineShoppingApplication.Models;
using Microsoft.AspNetCore.Authorization;
namespace OnlineShoppingApplication.Controllers
{
    /// <summary>
    /// Controller for managing product-related operations.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProductsController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Get all products available in the store.
        /// </summary>
        /// <returns>List of products with details</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            try
            {
                var products = await _context.Products.ToListAsync();
                return Ok(products);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving products", error = ex.Message });
            }
        }



        /// <summary>
        /// Add a new product.
        /// </summary>
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Product>> CreateProduct(Product product)
        {
            var validationError = ValidateProduct(product);
            if (validationError is not null) return BadRequest(new { message = validationError });

            try
            {
                product.Name = product.Name.Trim();
                product.Description = product.Description.Trim();
                product.Category = product.Category.Trim();
                _context.Products.Add(product);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Error creating product",
                    error = ex.Message
                });
            }
        }

        [HttpPut("{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Product>> UpdateProduct(int id, Product updatedProduct)
        {
            var validationError = ValidateProduct(updatedProduct);
            if (validationError is not null) return BadRequest(new { message = validationError });

            var product = await _context.Products.FindAsync(id);
            if (product is null) return NotFound(new { message = $"Product with ID {id} not found" });

            product.Name = updatedProduct.Name.Trim();
            product.Description = updatedProduct.Description.Trim();
            product.Category = updatedProduct.Category.Trim();
            product.Price = updatedProduct.Price;
            product.Discount = updatedProduct.Discount;
            product.StockQuantity = updatedProduct.StockQuantity;

            await _context.SaveChangesAsync();
            return Ok(product);
        }


        /// <summary>
        /// Get a specific product by ID.
        /// </summary>
        /// <param name="id">Product ID</param>
        /// <returns>Product details</returns>
        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            try
            {
                var product = await _context.Products.FindAsync(id);

                if (product == null)
                {
                    return NotFound(new { message = $"Product with ID {id} not found" });
                }

                return Ok(product);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving product", error = ex.Message });
            }
        }

        /// <summary>
        /// Delete a product.
        /// </summary>
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            try
            {
                var product = await _context.Products.FindAsync(id);

                if (product == null)
                {
                    return NotFound(new
                    {
                        message = $"Product with ID {id} not found"
                    });
                }

                if (await _context.CartItems.AnyAsync(item => item.ProductId == id))
                {
                    return Conflict(new
                    {
                        message = "This product is in a customer's cart and cannot be deleted yet."
                    });
                }

                _context.Products.Remove(product);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = "Product deleted successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Error deleting product",
                    error = ex.Message
                });
            }
        }

        private static string? ValidateProduct(Product product)
        {
            if (string.IsNullOrWhiteSpace(product.Name) || product.Name.Length > 200)
                return "Product name is required and must be at most 200 characters.";
            if (product.Description.Length > 1000)
                return "Product description must be at most 1000 characters.";
            if (string.IsNullOrWhiteSpace(product.Category))
                return "Product category is required.";
            if (product.Price <= 0)
                return "Product price must be greater than zero.";
            if (product.StockQuantity < 0)
                return "Stock quantity cannot be negative.";
            if (product.Discount is < 0 or > 100)
                return "Discount must be between 0 and 100.";

            return null;
        }
    }
}
