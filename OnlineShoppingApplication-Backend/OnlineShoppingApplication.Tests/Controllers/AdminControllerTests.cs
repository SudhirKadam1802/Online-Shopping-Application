using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using OnlineShoppingApplication.Controllers;
using OnlineShoppingApplication.Data;
using OnlineShoppingApplication.Models;

namespace OnlineShoppingApplication.Tests.Controllers
{
    public class AdminControllerTests
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

        [Fact]
        public async Task GetDashboard_CountsOnlyUnfulfilledOrdersAsActiveAndExcludesCancelledSales()
        {
            await using var context = await CreateDbContext();
            context.Users.AddRange(
                new User { Name = "Customer", Email = "customer@example.com" },
                new User { Name = "Admin", Email = "admin@example.com", IsAdmin = true });
            context.Orders.AddRange(
                new Order { UserId = 1, GrandTotal = 100, Status = "Placed" },
                new Order { UserId = 1, GrandTotal = 25, Status = "Processing" },
                new Order { UserId = 1, GrandTotal = 50, Status = "Shipped" },
                new Order { UserId = 1, GrandTotal = 30, Status = "Delivered" },
                new Order { UserId = 1, GrandTotal = 50, Status = "Cancelled" });
            await context.SaveChangesAsync();

            var result = await new AdminController(context).GetDashboard();

            var response = Assert.IsType<OkObjectResult>(result);
            var dashboard = response.Value!;
            Assert.Equal(2, dashboard.GetType().GetProperty("totalUsers")!.GetValue(dashboard));
            Assert.Equal(5, dashboard.GetType().GetProperty("totalOrders")!.GetValue(dashboard));
            Assert.Equal(3, dashboard.GetType().GetProperty("activeOrders")!.GetValue(dashboard));
            Assert.Equal(205m, dashboard.GetType().GetProperty("totalSales")!.GetValue(dashboard));
        }

        [Fact]
        public async Task GetOrders_ReturnsCustomerDetailsAndItems()
        {
            await using var context = await CreateDbContext();
            context.Users.Add(new User { Name = "Customer", Email = "customer@example.com" });
            context.Orders.Add(new Order
            {
                UserId = 1,
                Items = new List<OrderItem>
                {
                    new() { ProductId = 1, ProductName = "Laptop", Quantity = 1, UnitPrice = 100 }
                }
            });
            await context.SaveChangesAsync();

            var result = await new AdminController(context).GetOrders();

            var response = Assert.IsType<OkObjectResult>(result);
            var orders = Assert.IsAssignableFrom<IEnumerable<object>>(response.Value);
            var order = Assert.Single(orders);
            Assert.Equal("Customer", order.GetType().GetProperty("customerName")!.GetValue(order));
            Assert.Single((IEnumerable<OrderItem>)order.GetType().GetProperty("items")!.GetValue(order)!);
        }

        [Fact]
        public async Task GetUsers_DoesNotReturnPasswordHashes()
        {
            await using var context = await CreateDbContext();
            context.Users.Add(new User
            {
                Name = "Customer",
                Email = "customer@example.com",
                PasswordHash = "never return this"
            });
            await context.SaveChangesAsync();

            var result = await new AdminController(context).GetUsers();

            var response = Assert.IsType<OkObjectResult>(result);
            var user = Assert.Single(Assert.IsAssignableFrom<IEnumerable<object>>(response.Value));
            Assert.Null(user.GetType().GetProperty("PasswordHash"));
        }

        [Fact]
        public async Task UpdateOrderStatus_CancellingPlacedOrderRestocksProducts()
        {
            await using var context = await CreateDbContext();
            var product = await context.Products.FindAsync(1);
            var originalStock = product!.StockQuantity;
            product.StockQuantity -= 2;
            var order = new Order
            {
                UserId = 1,
                Items = new List<OrderItem>
                {
                    new() { ProductId = product.Id, ProductName = product.Name, Quantity = 2, UnitPrice = product.Price }
                }
            };
            context.Orders.Add(order);
            await context.SaveChangesAsync();

            var result = await new AdminController(context).UpdateOrderStatus(
                order.Id,
                new UpdateOrderStatusRequest { Status = "Cancelled" });

            Assert.IsType<OkObjectResult>(result);
            Assert.Equal("Cancelled", order.Status);
            Assert.Equal(originalStock, product.StockQuantity);
        }

        [Fact]
        public async Task UpdateOrderStatus_RejectsMovingShippedOrderBackToProcessing()
        {
            await using var context = await CreateDbContext();
            var order = new Order { UserId = 1, Status = "Shipped" };
            context.Orders.Add(order);
            await context.SaveChangesAsync();

            var result = await new AdminController(context).UpdateOrderStatus(
                order.Id,
                new UpdateOrderStatusRequest { Status = "Processing" });

            Assert.IsType<ConflictObjectResult>(result);
            Assert.Equal("Shipped", order.Status);
        }

        [Fact]
        public async Task UpdateUserRole_CannotRevokeLastAdministrator()
        {
            await using var context = await CreateDbContext();
            var admin = new User
            {
                Name = "Admin",
                Email = "admin@example.com",
                IsAdmin = true
            };
            var currentUser = new User
            {
                Name = "Current admin",
                Email = "current@example.com"
            };
            context.Users.AddRange(admin, currentUser);
            await context.SaveChangesAsync();

            var controller = new AdminController(context)
            {
                ControllerContext = new ControllerContext
                {
                    HttpContext = new DefaultHttpContext
                    {
                        User = new ClaimsPrincipal(new ClaimsIdentity(
                            new[] { new Claim("sub", currentUser.Id.ToString()) },
                            "test"))
                    }
                }
            };

            var result = await controller.UpdateUserRole(
                admin.Id,
                new UpdateUserRoleRequest { IsAdmin = false });

            Assert.IsType<ConflictObjectResult>(result);
            Assert.True(admin.IsAdmin);
        }
    }
}
