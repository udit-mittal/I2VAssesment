using E_Commerce.Models;
using E_Commerce.Services;
using Microsoft.AspNetCore.Mvc;

namespace E_Commerce.Controllers;

[ApiController]
[Route("[controller]")]
public class DiscountController : ControllerBase
{
    private readonly DiscountService _discountService;
    public DiscountController(DiscountService discountService)
    {
        _discountService = discountService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Discount>>> GetDiscounts()
    {
        var discounts = await _discountService.GetDiscountsAsync();
        return Ok(discounts);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Discount>> GetDiscount(int id)
    {
        var discount = await _discountService.GetDiscountByIdAsync(id);
        if (discount == null) return NotFound();
        return Ok(discount);
    }

    [HttpPost]
    public async Task<ActionResult<Discount>> AddDiscount(Discount discount)
    {
        var added = await _discountService.AddDiscountAsync(discount);
        return CreatedAtAction(nameof(GetDiscount), new { id = added.DiscountID }, added);
    }

    [HttpPut]
    public async Task<ActionResult<Discount>> UpdateDiscount(Discount discount)
    {
        var updated = await _discountService.UpdateDiscountAsync(discount);
        return Ok(updated);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteDiscount(int id)
    {
        var result = await _discountService.DeleteDiscountAsync(id);
        if (!result) return NotFound();
        return NoContent();
    }

    [HttpGet("validate/{code}")]
    public async Task<ActionResult<Discount>> ValidateDiscountCode(string code)
    {
        var discount = await _discountService.ValidateDiscountCodeAsync(code);
        if (discount == null) return NotFound();
        return Ok(discount);
    }
} 