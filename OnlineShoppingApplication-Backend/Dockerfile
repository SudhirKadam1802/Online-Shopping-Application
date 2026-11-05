
# Stage 1: Build the application
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build

WORKDIR /src

# Copy project file
COPY ["OnlineShoppingApplication/OnlineShoppingApplication.csproj", "OnlineShoppingApplication/"]

# Restore dependencies
RUN dotnet restore "OnlineShoppingApplication/OnlineShoppingApplication.csproj"

# Copy the remaining source code
COPY . .

# Move to project directory
WORKDIR /src/OnlineShoppingApplication

# Publish application
RUN dotnet publish "OnlineShoppingApplication.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Stage 2: Run the application
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final

WORKDIR /app

COPY --from=build /app/publish .

# Render web service port
ENV ASPNETCORE_HTTP_PORTS=10000

EXPOSE 10000

ENTRYPOINT ["dotnet", "OnlineShoppingApplication.dll"]
