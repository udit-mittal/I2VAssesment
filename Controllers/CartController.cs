using E_Commerce.Models;
using E_Commerce.Services;
using Microsoft.AspNetCore.Mvc;

namespace E_Commerce.Controllers;

[ApiController]
[Route("[controller]")]
public class CartController : ControllerBase
{
    private readonly CartService _cartService;
    public CartController(CartService cartService)
    {
        _cartService = cartService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CartItem>>> GetCartItems()
    {
        var items = await _cartService.GetCartItemsAsync();
        return Ok(items);
    }

    [HttpPost]
    public async Task<ActionResult<CartItem>> AddCartItem(CartItem cartItem)
    {
        var added = await _cartService.AddCartItemAsync(cartItem);
        return CreatedAtAction(nameof(GetCartItems), new { id = added.CartItemID }, added);
    }

    [HttpPut]
    public async Task<ActionResult<CartItem>> UpdateCartItem(CartItem cartItem)
    {
        var updated = await _cartService.UpdateCartItemAsync(cartItem);
        return Ok(updated);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> RemoveCartItem(int id)
    {
        var result = await _cartService.RemoveCartItemAsync(id);
        if (!result) return NotFound();
        return NoContent();
    }

    [HttpGet("total")]
    public async Task<ActionResult<decimal>> GetCartTotal([FromQuery] string? discountCode)
    {
        var total = await _cartService.GetCartTotalAsync(discountCode);
        return Ok(total);
    }
} 