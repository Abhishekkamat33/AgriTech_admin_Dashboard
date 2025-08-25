
# Admin Dashboard

## Overview

This project is an Admin Dashboard application featuring a modern web interface built using **Next.js** as the frontend framework and **Spring Boot** as the backend REST API server. It provides secure user authentication via **JWT (JSON Web Tokens)** and integrates with **Esewa** for payment processing.

The dashboard allows administrators to manage products, orders, users, and payments efficiently through a responsive and user-friendly interface.

---

## Technologies Used

### Frontend:
- Next.js (React framework with SSR/SSG)
- TypeScript / JavaScript
- CSS Framework (e.g., Tailwind CSS, Material UI)
- Axios / Fetch for REST API calls

### Backend:
- Spring Boot (Java) REST API
- Spring Security with JWT token-based authentication
- JPA / Hibernate ORM for database interaction
- PostgreSQL / MySQL (or any supported RDBMS)
- Esewa Payment Gateway integration

---

## Features

- User authentication with JWT tokens (login, signup, logout)
- Role-based access control for admin and normal users
- CRUD operations on Products, Orders, and Users
- Payment processing using Esewa integration
- Responsive admin dashboard UI with dynamic data fetching
- WebSocket support for real-time order updates (optional)
- Comprehensive error handling and validations

---

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- Java 17 or higher
- Maven or Gradle for building Spring Boot backend
- PostgreSQL/MySQL database instance
- Esewa sandbox API credentials (for payment testing)

### Backend Setup
Clone the backend repository and enter the backend folder:  
```
cd backend
```

Configure `application.properties` or `application.yml` with your database credentials, JWT secret, and Esewa keys.

Build and run the Spring Boot backend:  
```
./mvnw spring-boot:run
```

Backend repo is here:  
[https://github.com/Abhishekkamat33/AgriTech-Website](https://github.com/Abhishekkamat33/AgriTech-Website)

---

### Frontend Setup
Navigate to the frontend folder:  
```
cd frontend
```

Install dependencies:  
```
npm install
```

Create a `.env.local` file and specify the backend API URL:  
```
NEXT_PUBLIC_BACKEND_URL=https://agritech-website.onrender.com
```

Run the Next.js development server:  
```
npm run dev
```

Access the admin dashboard at `http://localhost:3000`

---

## Usage

- Register or login as an admin user.
- Navigate through sidebar to manage products, orders, users, and payments.
- Verify payment transactions via Esewa dashboard integration.
- Monitor order statuses and updates in real-time (if WebSocket enabled).

---

## Security

- JWT tokens used for stateless authentication.
- JWT tokens are stored securely in HTTP-only cookies (configurable).
- CSRF protection enabled on backend.
- CORS configured for safe cross-origin resource sharing between frontend and backend.

---

## Payment Gateway Integration (Esewa)

- Integrated Esewa payment API for processing payments.
- Supports Esewa sandbox environment for development/testing.
- Payment verification and status tracking implemented on backend.

---

## Folder Structure (simplified)

```
/backend
# for backend go to this repo
GitHub: https://github.com/Abhishekkamat33/AgriTech-Website

/frontend
├── components/
├── pages/
├── public/
├── styles/
├── .env.local
└── package.json
```

---

## Contributing

If you want to contribute:

1. Fork the repo  
2. Create a new branch for your feature or bug fix  
3. Submit a pull request with detailed description  

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## Contact

For questions or support:

- Project Maintainer: Abhishek Kumar Kamat - abhishekkamat33@gmail.com  
- GitHub: [https://github.com/Abhishekkamat33/AgriTech_admin_Dashboard](https://github.com/Abhishekkamat33/AgriTech_admin_Dashboard)
```


