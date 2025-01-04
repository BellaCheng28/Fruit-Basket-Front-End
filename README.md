# Fruit Basket Project
  <img src="./public/image/Home.png" alt="HomePage" width="600">

## Overview


The **Fruit Basket** project is an e-commerce web application that allows users to browse, review, and purchase fruits online. The application is built using **React** for the front-end,**Tailwind Css** for the CSS, **Node.js** for the back-end, and **MongoDB** for the database.

## Features
### General Features
* All users can:
  - Access the **Home**, **Products**, and **Product Detail** pages.
  - View product reviews to make informed purchase decisions.
  <img src="./public/image/products.png" alt="Products Page" width="600">
  <img src="./public/image/Review.png" alt="Reviews Page" width="600">
### Customer Features
* Customers have the following functionalities:
  - Add products to their shopping cart and proceed to purchase.
  - Leave reviews for purchased products.
  <img src="./public/image/shoppingcart.png" alt="ShoppingCart" width="600">
  <img src="./public/image/checkoutallitems.png" alt="checkoutAllItems" width="600">
  <img src="./public/image/order1.png" alt="orderDetail" width="600">
  <img src="./public/image/writeReview.png" alt="leave review" width="600"> 
### Admin Features
* Admins have additional permissions, including:
  - Adding new products to the store.
  - Editing and deleting existing products. 
   <img src="./public/image/createProduct.png" alt="creat product" width="600"> 
   <img src="./public/image/Edit and delete product.png" alt="eidt and delete" width="600"> 
 
## Technical Details
### Front-End
 * Framework: React
 * Authentication: JSON Web Tokens (JWT)
 * State Management: React Context/State Hooks
 * CSS:Tailwind Css
### Back-End
 * Server Framework:Express (Node.js)
 * Database: MongoDB
### Deployment
* The application is deployed on
  * [Netlify]()
  * [Heroku](https://fruit-basket-0436f702ecc6.herokuapp.com)

##  Quick Start
 Follow these steps to set up the project locally on your machine.
### Prerequisites
Make sure you have the following installed on your machine:
- **Git**
- **React** (front-end framework)
- **Tailwind CSS** (for styling, configured in the project)
- **Cloudinary** (for media storage and management)
- **Node.js**
- **npm**((Node Package Manager))
- **MongoDB instance**
### Front-End Setup
1. Clone the repository:
   ```
   https://github.com/BellaCheng28/Fruit-Basket-Front-End.git
   cd Fruit-Basket-Front-End
   
2. Install dependencies:
  `npm install`
3. Set up environment variables:
 * Create a .env file with the following content:
   ``` bash
    VITE_EXPRESS_BACKEND_URL="https://fruit-basket-0436f702ecc6.herokuapp.com"  
    JWT_SECRET=your_jwt_secret_here  
    VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
    VITE_CLOUDINARY_UPLOAD_PRESET=your-upload-preset 

 * Replace the placeholder values with your actual **JWT_SECRET**, **VITE_CLOUDINARY_CLOUD_NAME** and **VITE_CLOUDINARY_UPLOAD_PRESET**.
  You can obtain these **Cloudinary** information by signing up on the [Cloudinary website](https://cloudinary.com/home).

4. Start the application:
`npm run dev`

5. Open http://localhost:5173 in your browser to view the project.

### Back-End Setup
1. Clone the repository:
   ```
   https://github.com/kevinsubmit/Fruit-Basket-API
   cd Fruit-Basket-API 
2. Install dependencies:
  `npm install`
3. Set up environment variables:
 * Create a .env file with the following content:
    ```bash
     MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.hulic.mongodb.net/fruit_basket?retryWrites=true&w=majority&appName=Cluster0
     JWT_SECRET=your_jwt_secret_here
     NODE_ENV=developmen
     PORT=3000
 * Replace the placeholders with your actual values:
   *  **PORT**: The port on which the backend server will run (typically 3000 for development).
   *  **MONGODB_URI**: Your MongoDB connection string. Replace your-username and your-password with your actual MongoDB credentials.
   *  **JWT_SECRET**: A secure secret key used to sign your JWT tokens. Make sure it's unique and kept private.
   *  **NODE_ENV**: Set this to development for local development or production for the production environment.
4. Start the application:
`nodemon`
 1. Open http://localhost:3000 in your browser to view the project.
   
## Future Improvements
* Add a payment page that users can proceed to after confirming their order.
* Enable customers to confirm receipt of products, marking the order as "Delivered".
* Implement real-time order status tracking, including delivery progress and estimated arrival time.
* Provide personalized product recommendations based on past purchases or preferences.
* Allow users to add gift wrapping to their orders for special occasions.

## Attributions:
This project used the following resources:
* [Cloudinary](https://cloudinary.com/home) for media storage and management images
* [Figma](https://www.figma.com/) for design our page
* Special thanks to OpenAI's [ChatGPT](https://chatgpt.com/) for providing valuable suggestions and solutions during the development process.