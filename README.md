# Yona - Women's Fashion E-commerce

A full-stack e-commerce application built with React, Express, and PostgreSQL, featuring product browsing, shopping cart functionality, and a checkout process.

## Features

- **Product Browsing:** Browse products by category, with filtering and sorting options
- **Product Details:** View detailed information about each product
- **Shopping Cart:** Add items to cart, adjust quantities, and remove items
- **User Authentication:** Register, login, and manage account details
- **Checkout Process:** Complete purchases with a mock checkout flow
- **Admin Panel:** Manage products, categories, and orders (for admin users)

## Technologies Used

- **Frontend:** React, TailwindCSS, Shadcn UI components
- **Backend:** Node.js, Express
- **Database:** PostgreSQL with Drizzle ORM
- **Authentication:** Custom authentication system
- **State Management:** React Context API & TanStack Query

## Getting Started

1. The application should be running automatically when you open this Replit project
2. Browse the store at the default URL
3. Create an account to use cart and checkout features
4. Admin credentials:
   - Email: admin@example.com
   - Role: admin

## Project Structure

- `/client` - Frontend React application
- `/server` - Backend Express application
- `/shared` - Shared types and schemas used by both frontend and backend

## Database Schema

The application uses several tables to store data:
- `users` - User accounts and profiles
- `categories` - Product categories
- `products` - Product information
- `orders` - Order details
- `order_items` - Items within orders
- `cart_items` - Items in user shopping carts
- `sessions` - Authentication sessions

## Development

To run the application in development mode:
- Use the "Run" button in the Replit interface
- This starts both the frontend and backend servers