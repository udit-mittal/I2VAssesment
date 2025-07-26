using E_Commerce.Models;
using E_Commerce.Services;
using Microsoft.AspNetCore.Mvc;

namespace E_Commerce.Controllers;

[ApiController]
[Route("[controller]")]
public class SalesController : ControllerBase
{
    private readonly SalesService _salesService;
    public SalesController(SalesService salesService)
    {
        _salesService = salesService;
    }

    [HttpGet]
    public async Task<ActionResult<List<Sale>>> GetAllSale()
    {
        var sales = await _salesService.GetAllSales();
        return Ok(sales);
    } 

    [HttpPost]
    public async Task<ActionResult<Sale>> RecordSale(Sale sale)
    {
        var recorded = await _salesService.RecordSaleAsync(sale);
        return CreatedAtAction(nameof(RecordSale), new { id = recorded.SaleID }, recorded);
    }

    [HttpGet("report")]
    public async Task<ActionResult<SalesReport>> GetDailySalesReport([FromQuery] DateTime date)
    {
        var report = await _salesService.GetDailySalesReportAsync(date);
        return Ok(report);
    }
} 