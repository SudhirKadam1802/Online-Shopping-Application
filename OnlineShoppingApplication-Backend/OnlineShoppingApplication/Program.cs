using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using OnlineShoppingApplication.Data;
using OnlineShoppingApplication.Services;
using System.Text;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add Controllers
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });

// Configure PostgreSQL
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection")));

// Configure CORS
var configuredFrontendOrigins = builder.Configuration
    .GetSection("Cors:AllowedOrigins")
    .Get<string[]>() ?? Array.Empty<string>();
var allowedFrontendOrigins = configuredFrontendOrigins
    .Concat(new[] { "http://localhost:5173", "http://localhost:5174" })
    .Distinct(StringComparer.OrdinalIgnoreCase)
    .ToArray();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins(allowedFrontendOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// ================= JWT Authentication =================

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,

        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],

        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!)),

        ClockSkew = TimeSpan.Zero // <-- Add this line
    };
});

// Authorization
builder.Services.AddAuthorization();

// Register Services
builder.Services.AddScoped<ITokenService, TokenService>();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
Console.WriteLine("JWT Expiry = " + builder.Configuration["Jwt:ExpiryInMinutes"]);
Console.WriteLine("Environment = " + builder.Environment.EnvironmentName);
var app = builder.Build();

if (args.Any(argument => argument.Equals("--promote-admin", StringComparison.OrdinalIgnoreCase)))
{
    if (args.Length != 2 || !args[0].Equals("--promote-admin", StringComparison.OrdinalIgnoreCase))
    {
        Console.Error.WriteLine("Usage: --promote-admin <registered-email>");
        Environment.ExitCode = 1;
        return;
    }

    var email = args[1].Trim();
    if (string.IsNullOrWhiteSpace(email))
    {
        Console.Error.WriteLine("Usage: --promote-admin <registered-email>");
        Environment.ExitCode = 1;
        return;
    }

    await using var scope = app.Services.CreateAsyncScope();
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    var normalizedEmail = email.ToUpperInvariant();
    var user = await dbContext.Users.FirstOrDefaultAsync(
        candidate => candidate.Email.ToUpper() == normalizedEmail);

    if (user is null)
    {
        Console.Error.WriteLine($"No registered user was found with email '{email}'.");
        Environment.ExitCode = 1;
        return;
    }

    user.IsAdmin = true;
    await dbContext.SaveChangesAsync();
    Console.WriteLine($"Admin access granted to '{user.Email}'. Sign in again to refresh the JWT.");
    return;
}

// Configure HTTP Request Pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Enable CORS
app.UseCors("AllowReactApp");

// Enable Authentication
app.UseAuthentication();

// Enable Authorization
app.UseAuthorization();

app.MapControllers();

app.Run();
