using E_Commerce.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic;

namespace E_Commerce.Services;

public class SalesService
{
    private readonly ApplicationDbContext _context;
    public SalesService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<Sale>> GetAllSales()
    {
        var sales = await _context.Sales
            .Include(s => s.SalesItems)
            .ToListAsync();
        return sales;
    }

    public async Task<Sale> RecordSaleAsync(Sale sale)
    {
        _context.Sales.Add(sale);
        await _context.SaveChangesAsync();
        return sale;
    }

    public async Task<IEnumerable<Sale>> GetSalesByDateAsync(DateTime date)
    {
        return await _context.Sales.Include(s => s.SalesItems)
            .Where(s => s.SaleDate.Date == date.Date)
            .ToListAsync();
    }

    public async Task<object> GetDailySalesReportAsync(DateTime date)
    {
        var startDate = date.Date;
        var endDate = startDate.AddDays(1);

        var sales = await _context.Sales
            .Include(s => s.SalesItems)
            .Where(s => s.SaleDate >= startDate && s.SaleDate < endDate)
            .ToListAsync();

        var totalRevenue = sales.Sum(s => s.TotalAmount);

        Dictionary<int, int> report = new Dictionary<int, int>();
        foreach(var sale in sales)
        {
            foreach(var item in sale.SalesItems)
            {
                if(report.ContainsKey(item.ProductID))
                {
                    report[item.ProductID] += item.Quantity;
                }
                else
                {
                    report[item.ProductID] = item.Quantity;
                }
            }
        }

        int max = 0;
        foreach(int id in report.Keys)
        {
            if (report[id] > max)
            {
                max = id;
            }
        }

        var salesReport = new SalesReport
        {
            ReportDate = date,
            TotalRevenue = totalRevenue,
            prodId = max,
            ProdName = _context.Products.FirstOrDefault(p => p.ProductID == max)?.ProductName
        };

        return salesReport;
    }
}