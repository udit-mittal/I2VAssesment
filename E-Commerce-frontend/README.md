# E-Commerce Platform

A modern, full-featured E-commerce platform built with Angular 17 and .NET Web API, featuring shopping cart management, discount code application, and comprehensive sales reporting.

## 🚀 Features

### Shopping Cart Management
- Add products to cart with quantity selection
- Real-time cart total calculation
- Update quantities and remove items
- Apply discount codes for savings
- Responsive design for all devices

### Product Management
- Add new products with name and price
- Edit existing product details
- Delete products with confirmation
- Clean, intuitive admin interface

### Sales Reporting
- Daily sales reports with revenue analytics
- Most sold products tracking
- Export reports to CSV format
- Date-based filtering and analysis

### Discount System
- Apply discount codes to cart
- Real-time discount calculation
- Validation of discount codes
- Percentage-based discount application

## 🛠️ Technology Stack

### Frontend
- **Angular 17** - Modern frontend framework
- **Angular Material** - UI component library
- **TypeScript** - Type-safe JavaScript
- **RxJS** - Reactive programming

### Backend
- **.NET Web API** - RESTful API backend
- **SQLite** - Lightweight database
- **Entity Framework** - ORM for data access

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- .NET 7 SDK
- Angular CLI

### Frontend Setup
```bash
# Navigate to the frontend directory
cd E-Commerce-frontend

# Install dependencies
npm install

# Start the development server
ng serve
```

The application will be available at `http://localhost:4200/`

### Backend Setup
```bash
# Navigate to the backend directory (where Program.cs is located)
cd ../backend

# Run the API
dotnet run
```

The API will be available at `http://localhost:5182/`

## 🎯 Usage

### Shopping Cart
1. Navigate to "Shopping Cart" from the main menu
2. Browse available products
3. Select quantity and add to cart
4. Apply discount codes if available
5. View real-time total calculations

### Product Management
1. Go to "Products" section
2. Click "Add Product" to create new items
3. Use edit/delete buttons for existing products
4. All changes are saved automatically

### Sales Reports
1. Access "Sales Report" from the navigation
2. Select a date for the report
3. View revenue and product analytics
4. Export data to CSV if needed

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- Desktop computers
- Tablets
- Mobile phones

## 🔧 API Endpoints

### Products
- `GET /Product` - Get all products
- `POST /Product` - Add new product
- `PUT /Product/{id}` - Update product
- `DELETE /Product/{id}` - Delete product

### Cart
- `GET /Cart` - Get cart items
- `POST /Cart` - Add item to cart
- `PUT /Cart` - Update cart item
- `DELETE /Cart/{id}` - Remove item from cart
- `GET /Cart/total` - Get cart total with optional discount

### Discounts
- `GET /Discount` - Get all discounts
- `GET /Discount/validate/{code}` - Validate discount code
- `POST /Discount` - Add new discount
- `PUT /Discount` - Update discount
- `DELETE /Discount/{id}` - Delete discount

### Sales
- `GET /Sales` - Get all sales
- `POST /Sales` - Create new sale
- `GET /Sales/report` - Get sales report

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface using Material Design
- **Intuitive Navigation**: Easy-to-use navigation with clear icons
- **Real-time Updates**: Live cart calculations and updates
- **Responsive Layout**: Works perfectly on all screen sizes
- **Loading States**: Smooth loading indicators for better UX
- **Error Handling**: User-friendly error messages and notifications

## 📊 Database Schema

The application uses SQLite with the following tables:
- **Products**: Product information (ID, Name, Price)
- **CartItems**: Shopping cart items (ID, ProductID, Quantity)
- **Discounts**: Discount codes (ID, Code, Percentage)
- **Sales**: Sales records (ID, TotalAmount, Date)
- **SalesItems**: Individual sale items (ID, SaleID, ProductID, Quantity)

## 🔒 Security Features

- Input validation on all forms
- API endpoint protection
- CORS configuration
- Error handling and logging

## 🚀 Performance Optimizations

- Lazy loading of components
- Efficient API calls with RxJS
- Optimized database queries
- Responsive image handling

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is created for educational purposes and assignment completion.

## 🆘 Support

For any issues or questions, please refer to the project documentation or contact the development team.

---

**Built with ❤️ using Angular 17 and .NET Web API**