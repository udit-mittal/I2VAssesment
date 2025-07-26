namespace E_Commerce.Models
{
    public class SalesReport
    {
        
        public DateTime ReportDate { get; set; }
        public decimal TotalRevenue { get; set; }
        public int prodId { get; set; }
        public string ProdName { get; set; }
    }
}
