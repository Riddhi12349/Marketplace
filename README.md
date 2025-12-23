# Marketplace Product Mapping Tool

A full-stack application that enables sellers to map their product catalog to different marketplace templates (like Myntra, Flipkart, Amazon) for seamless product listing across multiple platforms.

## 🐳 Docker Deployment

<img width="1593" height="859" alt="image" src="https://github.com/user-attachments/assets/65892c21-46f3-4912-9ccf-082bb0c6d307" />

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Database Design](#database-design)
- [Installation & Setup](#installation--setup)
- [Usage Guide](#usage-guide)
- [API Documentation](#api-documentation)
- [Running Tests](#running-tests)
- [Docker Deployment](#docker-deployment)
- [Project Structure](#project-structure)
- [Contributing](#contributing)

## 🎯 Overview

This tool solves the challenge of mapping product data from a seller's format to various marketplace-specific templates. 

## ✨ Features

- ✅ Upload and manage marketplace templates
- ✅ Upload seller product files (CSV/Excel)
- ✅ Interactive drag-and-drop mapping interface
- ✅ One-to-one attribute mapping with validation
- ✅ Save and retrieve mapping configurations
- ✅ View all saved mappings with timestamps
- ✅ Support for multiple file formats
- ✅ Extensible architecture for adding new marketplaces
- ✅ Responsive UI design

## 🛠 Tech Stack

### Frontend
- **React.js** - UI framework
- **CSS3** - Styling
- **Axios** - HTTP client
- **React Router** - Navigation

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **pg (node-postgres)** - PostgreSQL client
- **CORS** - Cross-origin resource sharing

### Database
- **PostgreSQL** - Relational database
- **pg Pool** - Connection pooling

## 🏗 Architecture

```
┌─────────────┐         ┌─────────────┐         ┌──────────────┐
│   Frontend  │ ──HTTP──> │   Backend   │ ──SQL──> │   Database   │
│   (React)   │ <───────  │  (Express)  │ <──────  │ (SQLite/PG)  │
└─────────────┘           └─────────────┘          └──────────────┘
     │                           │
     │                           │
     ├─ Upload UI               ├─ Structured
     ├─ Mapping UI              ├─ Validation
     └─ List View               └─ API Endpoints
```

### Design Patterns

- **MVC Architecture**: Separation of concerns between routes, controllers, and models
- **Repository Pattern**: Database access abstraction
- **Service Layer**: Business logic encapsulation
- **RESTful API**: Standard HTTP methods and status codes

## 💾 Database Design

### Tables

#### 1. `Templates`
Stores marketplace template information.

```sql
CREATE TABLE public."Templates" (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  attributes JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Columns:**
- `id`: Auto-incrementing unique identifier
- `name`: Marketplace name (e.g., "Myntra", "Flipkart")
- `attributes`: JSONB array of required attributes with their validation rules
- `created_at`: Template creation timestamp

**Example `attributes` structure:**
```json
[
  {
    "name": "productName",
    "type": "string",
    "required": true,
    "maxLength": 150
  },
  {
    "name": "brand",
    "type": "string",
    "required": true
  },
  {
    "name": "price",
    "type": "number",
    "required": true,
    "min": 0
  }
]
```

#### 2. `Mappings`
Stores the column-to-attribute mapping configurations along with file metadata.

```sql
CREATE TABLE public."Mappings" (
  id SERIAL PRIMARY KEY,
  file_name VARCHAR(255) NOT NULL,
  template_name VARCHAR(100) NOT NULL,
  mapping_count INTEGER NOT NULL,
  product_count INTEGER NOT NULL,
  mappings JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Columns:**
- `id`: Auto-incrementing unique identifier
- `file_name`: Original seller file name
- `template_name`: Target marketplace template name
- `mapping_count`: Number of attributes mapped
- `product_count`: Number of products in the seller file
- `mappings`: JSONB object containing the column-to-attribute mappings
- `created_at`: Mapping creation timestamp

**Example `mappings` structure:**
```json
{
  "Name": "productName",
  "BrandName": "brand",
  "Price": "price",
  "MRP": "mrp",
  "Image1": "images",
  "Gender": "gender",
  "Category": "category"
}
```

## 🚀 Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Git

### Clone Repository

```bash
git clone https://github.com/Riddhi12349/Marketplace.git
cd Marketplace
```

### Backend Setup

```bash
cd backend
npm install

# Install dependencies
npm install express pg cors

# Configure PostgreSQL database
# Make sure PostgreSQL is installed and running

# Create database
psql -U postgres
CREATE DATABASE marketplaceDB;
\q

# Update database credentials in db.js if needed
# Default configuration:
# - host: localhost
# - user: postgres
# - password: postgres123
# - database: marketplaceDB
# - port: 5432

# Create tables (run these SQL commands in PostgreSQL)
psql -U postgres -d marketplaceDB

CREATE TABLE public."Templates" (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  attributes JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public."Mappings" (
  id SERIAL PRIMARY KEY,
  file_name VARCHAR(255) NOT NULL,
  template_name VARCHAR(100) NOT NULL,
  mapping_count INTEGER NOT NULL,
  product_count INTEGER NOT NULL,
  mappings JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

\q

# Start server
node server.js
```

The backend will run on `http://localhost:8000`

### Frontend Setup

```bash
cd frontend
npm install

# Create .env file
echo "REACT_APP_API_URL=http://localhost:8000" > .env

# Start development server
npm start
```

The frontend will run on `http://localhost:3000`

### Environment Variables

#### Backend (db.js)
```javascript
// Database configuration in db.js
const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "postgres123",
  database: "marketplaceDB",
  port: 5432,
});
```

**Note:** Update these values in `backend/db.js` according to your PostgreSQL setup.

#### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:8000
```

## 📖 Usage Guide

### 1. Upload Marketplace Template

1. Navigate to **"Create Template"** page
2. Define your marketplace template with attributes:
   - Attribute name (e.g., "productName", "brand")
   - Data type (string, number, boolean)
   - Required flag
   - Validation rules (optional)
3. Click **"Create Template"**
4. Template is saved and available for mapping

**Example Template Creation:**
```json
{
  "name": "Myntra",
  "attributes": [
    {
      "name": "productName",
      "type": "string",
      "required": true,
      "maxLength": 150
    },
    {
      "name": "brand",
      "type": "string",
      "required": true
    },
    {
      "name": "price",
      "type": "number",
      "required": true,
      "min": 0
    }
  ]
}
```

### 2. Upload Seller Product File

1. Navigate to **"Upload Products"** page
2. Prepare your product catalog CSV/Excel
3. Click **"Choose File"** and select your file
4. System parses and displays column preview
5. File is ready for mapping

**Example Seller CSV:**
```csv
SKU,Name,BrandName,Gender,Category,Color,Size,MRP,Price,Image1
TS001,Cotton T-Shirt,Nike,Men,T-Shirts,Blue,L,1999,1499,http://...
```

### 3. Create Mapping

1. Navigate to **"Create Mapping"** page
2. Select a **Template** from dropdown
3. Upload or select your **Seller File** 
4. Map columns using the interface:
   - Left side: Seller file columns
   - Right side: Template attributes
   - Create one-to-one mappings
5. System shows:
   - Number of mappings created
   - Number of products in file
6. Click **"Save Mapping"**

### 4. View Mappings

1. Navigate to **"View Mappings"** page
2. See all saved mappings with:
   - Template name
   - Seller file name
   - Mapping count (number of mapped attributes)
   - Product count (number of products)
   - Creation date
   - Mapping details (JSON view)
3. Delete unwanted mappings using the delete button

## 📚 API Documentation

### Base URL
```
http://localhost:8000/api
```

### Endpoints

#### Template Management

##### POST `/template/create`
Create a new marketplace template.

**Request Body:**
```json
{
  "name": "Myntra",
  "attributes": [
    {
      "name": "productName",
      "type": "string",
      "required": true,
      "maxLength": 150
    },
    {
      "name": "brand",
      "type": "string",
      "required": true
    },
    {
      "name": "price",
      "type": "number",
      "required": true,
      "min": 0
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Myntra",
    "attributes": [...],
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

##### GET `/template/list/all`
Get all marketplace templates.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Myntra",
      "attributes": [...],
      "created_at": "2024-01-15T10:30:00Z"
    },
    {
      "id": 2,
      "name": "Flipkart",
      "attributes": [...],
      "created_at": "2024-01-15T11:00:00Z"
    }
  ]
}
```

##### GET `/template/:id`
Get a specific marketplace template by ID.

**Response:**
```json
{
  "id": 1,
  "name": "Myntra",
  "attributes": [...],
  "created_at": "2024-01-15T10:30:00Z"
}
```

##### DELETE `/template/delete/:id`
Delete a marketplace template.

**Response:**
```json
{
  "message": "Deleted successfully"
}
```

#### Mapping Management

##### POST `/mappings/send`
Create a new mapping configuration.

**Request Body:**
```json
{
  "fileName": "products.csv",
  "templateName": "Myntra",
  "mappingCount": 7,
  "productCount": 150,
  "mappings": {
    "Name": "productName",
    "BrandName": "brand",
    "Price": "price",
    "MRP": "mrp",
    "Gender": "gender",
    "Category": "category",
    "Image1": "images"
  }
}
```

**Response:**
```json
{
  "id": 1,
  "file_name": "products.csv",
  "template_name": "Myntra",
  "mapping_count": 7,
  "product_count": 150,
  "mappings": {...},
  "created_at": "2024-01-15T10:30:00Z"
}
```

##### GET `/mappings/get`
Get all saved mappings ordered by creation date (newest first).

**Response:**
```json
[
  {
    "id": 1,
    "file_name": "products.csv",
    "template_name": "Myntra",
    "mapping_count": 7,
    "product_count": 150,
    "mappings": {...},
    "created_at": "2024-01-15T10:30:00Z"
  },
  {
    "id": 2,
    "file_name": "inventory.xlsx",
    "template_name": "Flipkart",
    "mapping_count": 8,
    "product_count": 200,
    "mappings": {...},
    "created_at": "2024-01-15T09:00:00Z"
  }
]
```

##### DELETE `/mappings/delete/:id`
Delete a mapping configuration.

**Response:**
```json
{
  "message": "Deleted successfully"
}
```

### Error Responses

All endpoints return errors in this format:
```json
{
  "error": "Error message description"
}
```

**HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `404` - Not Found
- `500` - Internal Server Error

## 🧪 Running Tests

### Backend Tests

```bash
cd backend
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- marketplace.test.js
```

### Frontend Tests

```bash
cd frontend
npm test

# Run with coverage
npm test -- --coverage

# Run in watch mode
npm test -- --watch
```

### Test Structure

```
backend/
  tests/
    unit/
      - marketplace.test.js
      - sellerFile.test.js
      - mapping.test.js
    integration/
      - api.test.js
frontend/
  src/
    __tests__/
      - Upload.test.js
      - Mapping.test.js
```



## 📁 Project Structure

```
Marketplace/
├── backend/
│   ├── controllers/
│   │   ├── mapping.js          # Mapping CRUD operations
│   │   └── template.js         # Template CRUD operations
│   ├── routes/
│   │   ├── mappingsRoutes.js   # Mapping endpoints
│   │   └── templateRoutes.js   # Template endpoints
│   ├── db.js                   # PostgreSQL connection pool
│   ├── server.js               # Express app & server setup
│   ├── package.json
│   └── node_modules/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CreateTemplate.js     # Template creation UI
│   │   │   ├── UploadProducts.js     # File upload UI
│   │   │   ├── CreateMapping.js      # Mapping interface
│   │   │   └── ViewMappings.js       # List all mappings
│   │   ├── services/
│   │   │   └── api.js                # API service layer
│   │   ├── styles/
│   │   │   └── App.css
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── .env
│
├── .gitignore
└── README.md
```

## 🎨 Sample Test Data

### Creating Myntra Template

Use the `/api/template/create` endpoint with this payload:

```json
{
  "name": "Myntra",
  "attributes": [
    {
      "name": "productName",
      "type": "string",
      "required": true,
      "maxLength": 150
    },
    {
      "name": "brand",
      "type": "string",
      "required": true
    },
    {
      "name": "gender",
      "type": "enum",
      "required": true,
      "values": ["Men", "Women", "Boys", "Girls", "Unisex"]
    },
    {
      "name": "category",
      "type": "enum",
      "required": true,
      "values": ["T-Shirts", "Jeans", "Dresses", "Sarees", "Shoes", "Bags"]
    },
    {
      "name": "color",
      "type": "string",
      "required": true
    },
    {
      "name": "size",
      "type": "string",
      "required": true
    },
    {
      "name": "mrp",
      "type": "number",
      "required": true,
      "min": 0
    },
    {
      "name": "price",
      "type": "number",
      "required": true,
      "min": 0
    },
    {
      "name": "sku",
      "type": "string",
      "required": true,
      "unique": true
    },
    {
      "name": "images",
      "type": "array",
      "required": true
    },
    {
      "name": "description",
      "type": "string",
      "required": false
    },
    {
      "name": "material",
      "type": "string",
      "required": false
    }
  ]
}
```

### Creating Flipkart Template

```json
{
  "name": "Flipkart",
  "attributes": [
    {
      "name": "title",
      "type": "string",
      "required": true,
      "maxLength": 200
    },
    {
      "name": "brand",
      "type": "string",
      "required": true
    },
    {
      "name": "sellerSku",
      "type": "string",
      "required": true
    },
    {
      "name": "categoryPath",
      "type": "string",
      "required": true
    },
    {
      "name": "listingPrice",
      "type": "number",
      "required": true,
      "min": 0
    },
    {
      "name": "mrp",
      "type": "number",
      "required": true,
      "min": 0
    },
    {
      "name": "color",
      "type": "string",
      "required": true
    },
    {
      "name": "image1",
      "type": "string",
      "required": true,
      "format": "url"
    },
    {
      "name": "quantity",
      "type": "number",
      "required": true,
      "min": 0
    },
    {
      "name": "size",
      "type": "string",
      "required": true
    },
    {
      "name": "gender",
      "type": "enum",
      "required": true,
      "values": ["Men", "Women", "Boys", "Girls", "Unisex"]
    }
  ]
}
```

### Seller Products CSV (seller_products.csv)

```csv
SKU,Name,BrandName,Gender,Category,Color,Size,MRP,Price,Material,Image1,Image2,Quantity,Description
TS001,Cotton T-Shirt,Nike,Men,T-Shirts,Blue,L,1999,1499,Cotton,http://img1.jpg,http://img2.jpg,50,Comfortable cotton t-shirt
JS001,Slim Fit Jeans,Levi's,Men,Jeans,Black,32,3999,2999,Denim,http://img3.jpg,http://img4.jpg,30,Classic slim fit jeans
DR001,Summer Dress,Zara,Women,Dresses,Red,M,2499,1999,Polyester,http://img5.jpg,http://img6.jpg,25,Beautiful summer dress
TS002,V-Neck T-Shirt,Adidas,Women,T-Shirts,White,S,1499,999,Cotton,http://img7.jpg,http://img8.jpg,40,Casual v-neck tee
SH001,Running Shoes,Puma,Unisex,Shoes,Black,9,4999,3999,Synthetic,http://img9.jpg,http://img10.jpg,20,Comfortable running shoes
```

### Example Mapping Creation

After uploading the seller CSV, create a mapping with:

```json
{
  "fileName": "seller_products.csv",
  "templateName": "Myntra",
  "mappingCount": 12,
  "productCount": 5,
  "mappings": {
    "SKU": "sku",
    "Name": "productName",
    "BrandName": "brand",
    "Gender": "gender",
    "Category": "category",
    "Color": "color",
    "Size": "size",
    "MRP": "mrp",
    "Price": "price",
    "Material": "material",
    "Image1": "images",
    "Description": "description"
  }
}
```

```

