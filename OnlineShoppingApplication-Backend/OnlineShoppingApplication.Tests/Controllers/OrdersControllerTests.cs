using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OnlineShoppingApplication.Controllers;
using OnlineShoppingApplication.Data;
using OnlineShoppingApplication.Models;

namespace OnlineShoppingApplication.Tests.Controllers
{
    public class OrdersControllerTests
    {
        private static async Task<ApplicationDbContext> CreateDbContext()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;
            var context = new ApplicationDbContext(options);
            await context.Database.EnsureCreatedAsync();
            return context;
        }

        private static OrdersController CreateController(ApplicationDbContext context, int userId)
        {
            var controller = new OrdersController(context)
            {
                ControllerContext = new ControllerContext
                {
                    HttpContext = new DefaultHttpContext
                    {
                        User = new ClaimsPrincipal(new ClaimsIdentity(
                            new[] { new Claim("sub", userId.ToString()) },
                            "test"))
                    }
                }
            };

            return controller;
        }

        [Fact]
        public async Task Checkout_ValidCartCreatesOrderDeductsStockAndClearsCart()
        {
            await using var context = await CreateDbContext();
            var cart = new Cart { UserId = 7 };
            context.Carts.Add(cart);
            context.CartItems.Add(new CartItem
            {
                Cart = cart,
                ProductId = 1,
                Quantity = 2,
                Price = 75000
            });
            await context.SaveChangesAsync();
            var originalStock = await context.Products
                .Where(product => product.Id == 1)
                .Select(product => product.StockQuantity)
                .SingleAsync();

            var result = await CreateController(context, 7).Checkout(cart.Id);

            var order = Assert.IsType<Order>(Assert.IsType<OkObjectResult>(result.Result).Value);
            Assert.Equal(150000, order.Subtotal);
            Assert.Equal(15000, order.DiscountAmount);
            Assert.Equal(135000, order.GrandTotal);
            Assert.Single(order.Items);
            Assert.Equal(originalStock - 2, (await context.Products.FindAsync(1))!.StockQuantity);
            Assert.Empty(context.CartItems);
        }

        [Fact]
        public async Task Checkout_AppliesEachProductDiscountIndependentlyBelow5000()
        {
            await using var context = await CreateDbContext();
            var cart = new Cart { UserId = 7 };
            context.Carts.Add(cart);
            context.CartItems.AddRange(
                new CartItem
                {
                    Cart = cart,
                    ProductId = 2,
                    Quantity = 1,
                    Price = 1500
                },
                new CartItem
                {
                    Cart = cart,
                    ProductId = 3,
                    Quantity = 1,
                    Price = 800
                });
            await context.SaveChangesAsync();

            var result = await CreateController(context, 7).Checkout(cart.Id);

            var order = Assert.IsType<Order>(Assert.IsType<OkObjectResult>(result.Result).Value);
            Assert.Equal(2300, order.Subtotal);
            Assert.Equal(75, order.DiscountAmount);
            Assert.Equal(2225, order.GrandTotal);
        }

        [Fact]
        public async Task Checkout_CannotCheckoutAnotherUsersCart()
        {
            await using var context = await CreateDbContext();
            var cart = new Cart { UserId = 8 };
            context.Carts.Add(cart);
            await context.SaveChangesAsync();

            var result = await CreateController(context, 7).Checkout(cart.Id);

            Assert.IsType<NotFoundObjectResult>(result.Result);
        }

        [Fact]
        public async Task GetOrders_ReturnsOnlyCurrentUsersOrders()
        {
            await using var context = await CreateDbContext();
            context.Orders.AddRange(
                new Order { UserId = 7, GrandTotal = 10 },
                new Order { UserId = 8, GrandTotal = 20 });
            await context.SaveChangesAsync();

            var result = await CreateController(context, 7).GetOrders();

            var orders = Assert.IsAssignableFrom<IEnumerable<Order>>(
                Assert.IsType<OkObjectResult>(result.Result).Value);
            Assert.Single(orders);
            Assert.All(orders, order => Assert.Equal(7, order.UserId));
        }
    }
}
