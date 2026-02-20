# E-Commerce Website (Furniture Shop)

A modern **Next.js** furniture e-commerce website showcasing products, categories, and new arrivals using React, TailwindCSS, and Redux Toolkit.

---

## Features

- Product listing and categories
- New arrivals carousel
- Responsive design (mobile, tablet, desktop)
- Smooth UI interactions with hover effects
- State management using Redux Toolkit
- Notifications using `react-hot-toast`

---

## Tech Stack

- **Framework**: Next.js 16  
- **UI**: React, TailwindCSS  
- **State Management**: Redux Toolkit & React-Redux  
- **Carousel**: react-slick + slick-carousel  
- **Icons**: react-icons  
- **Notifications**: react-hot-toast  

---

## Project Structure

mini-ecommerce/
 ├─ app/
 │   ├─ layout.js
 │   ├─ home/
 │   │   └─ page.jsx
 ├─ components/
 │   ├─ Categories.jsx
 │   ├─ Navbar.jsx
 │   ├─ Footer.jsx
 │   ├─ ReduxProvider.jsx
 │   ├─ SiderComponent.jsx
 │   ├─ TopSellers.jsx
 │   └─ NewArrivals.jsx
 ├─ public/
 │   └─ data/
 │       └─ data.json
 └─ jsconfig.json


- `public/data/data.json` contains all product and category information.
- Components like `Categories` and `NewArrivals` dynamically render UI from this data.
- Pages handle routing for home, products, and other sections.
- Redux manages global state like cart or favorites.

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd e-comarce-website

2. Install dependencies
npm install

3. Run development server
npm run dev


Open http://localhost:3000
 in your browser.

4. Build for production
npm run build
npm run start

