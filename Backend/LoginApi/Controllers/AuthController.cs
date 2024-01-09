using LoginApi.Model;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authorization;

// Controllers/RegistrationController.cs
// [Authorize]
[Route("api/[controller]")]
[ApiController]
public class RegistrationController : ControllerBase
{
    private readonly DataContext _context;

    public RegistrationController(DataContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> Register(User user)
    {
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return Ok("Registration successful");
    }
}

// Controllers/LoginController.cs
[Route("api/[controller]")]
[ApiController]
public class LoginController : ControllerBase
{
    private readonly DataContext _context;

    private readonly IConfiguration _configuration;

    public LoginController(DataContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    [HttpPost]
    public IActionResult Login(User user)
    {
        var existingUser = _context.Users.FirstOrDefault(u => u.Username == user.Username && u.Password == user.Password);

        if (existingUser == null)
        {
            return Unauthorized("Invalid credentials");
        }

        var tokenKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new Claim[]
            {
            new Claim(ClaimTypes.Name, existingUser.Username),
            new Claim(ClaimTypes.Name, existingUser.Password),
                // You can add more claims here as needed
            }),
            Expires = DateTime.UtcNow.AddHours(1), // Token expiration time
            SigningCredentials = new SigningCredentials(tokenKey, SecurityAlgorithms.HmacSha256)
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var securityToken = tokenHandler.CreateToken(tokenDescriptor);
        var token = tokenHandler.WriteToken(securityToken);

        return Ok(new { Token = token, Name = existingUser.Name, username = existingUser.Username });
    }

    [HttpPost("check-password")]
    public IActionResult CheckPassword(User user)
    {
        var existingUser = _context.Users.FirstOrDefault(u => u.Username == user.Username && u.Password == user.Password);

        if (existingUser == null)
        {
            return BadRequest("Password check failed");
        }

        return Ok("Password is correct");
    }

    [HttpPost("update-password")]
    public IActionResult UpdatePassword(User user)
    {
        var existingUser = _context.Users.FirstOrDefault(u => u.Username == user.Username);

        if (existingUser == null)
        {
            return NotFound("User not found");
        }

        // You may want to perform additional validation or security checks before updating the password.

        existingUser.Password = user.Password;
        _context.SaveChanges();

        return Ok("Password updated successfully");
    }

}

