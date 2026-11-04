using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OnlineShoppingApplication.Controllers;
using OnlineShoppingApplication.Data;
using OnlineShoppingApplication.Models;

namespace OnlineShoppingApplication.Tests.Controllers
{
    public class CartControllerTests
    {
        [Fact]
        public async Task GetPurchaseSummary_AppliesOnlyEachProductsDiscountBelow5000()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;
            await using var context = new ApplicationDbContext(options);
            await context.Database.EnsureCreatedAsync();

            var cart = new Cart { UserId = 7 };
            context.Carts.Add(cart);
            context.CartItems.AddRange(
                new CartItem { Cart = cart, ProductId = 2, Quantity = 1, Price = 1500 },
                new CartItem { Cart = cart, ProductId = 3, Quantity = 1, Price = 800 });
            await context.SaveChangesAsync();

            var controller = new CartController(context)
            {
                ControllerContext = new ControllerContext
                {
                    HttpContext = new DefaultHttpContext
                    {
                        User = new ClaimsPrincipal(new ClaimsIdentity(
                            new[] { new Claim("sub", "7") },
                            "test"))
                    }
                }
            };

            var result = await controller.GetPurchaseSummary(cart.Id);

            var summary = Assert.IsType<PurchaseSummary>(
                Assert.IsType<OkObjectResult>(result.Result).Value);
            Assert.Equal(2300, summary.Subtotal);
            Assert.Equal(75, summary.DiscountAmount);
            Assert.Equal(2225, summary.GrandTotal);
        }
    }
}
