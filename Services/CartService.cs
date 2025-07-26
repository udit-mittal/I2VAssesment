using E_Commerce.Models;
using Microsoft.EntityFrameworkCore;

namespace E_Commerce.Services;

public class CartService
{
    private readonly ApplicationDbContext _context;
    public CartService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<CartItem>> GetCartItemsAsync()
    {
        return await _context.CartItems.ToListAsync();
    }

    public async Task<CartItem> AddCartItemAsync(CartItem cartItem)
    {
        _context.CartItems.Add(cartItem);
        await _context.SaveChangesAsync();
        return cartItem;
    }

    public async Task<bool> RemoveCartItemAsync(int cartItemId)
    {
        var cartItem = await _context.CartItems.FindAsync(cartItemId);
        if (cartItem == null) return false;
        _context.CartItems.Remove(cartItem);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<CartItem> UpdateCartItemAsync(CartItem cartItem)
    {
        _context.CartItems.Update(cartItem);
        await _context.SaveChangesAsync();
        return cartItem;
    }

    public async Task<decimal> GetCartTotalAsync(string discountCode = null)
    {
        var cartItems = await _context.CartItems.ToListAsync();
        var products = await _context.Products.ToListAsync();
        decimal total = 0;
        foreach (var item in cartItems)
        {
            var product = products.FirstOrDefault(p => p.ProductID == item.ProductID);
            if (product != null)
            {
                total += product.Price * item.Quantity;
            }
        }
        if (!string.IsNullOrEmpty(discountCode))
        {
            var discount = await _context.Discounts.FirstOrDefaultAsync(d => d.DiscountCode == discountCode);
            if (discount != null)
            {
                total = total * (1 - discount.DiscountPercentage);
            }
        }
        return total;
    }
} 