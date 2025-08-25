# Backend - Website Remake El Shaddai FM

This directory contains the Node.js backend for the El Shaddai FM website remake project.

## Getting Started

### Prerequisites

- Node.js (LTS version, e.g., 20.x)
- MySQL database server
- A code editor (e.g., VS Code)

### Installation & Setup

1.  **Clone the repository** (if applicable) and navigate into the `be` directory.

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Copy the `.env.example` file to a new file named `.env`.
    ```bash
    copy .env.example .env
    ```
    Update the `.env` file with your database credentials and a secure `JWT_SECRET`.

4.  **Run database migrations:**
    This will create the necessary tables in your database based on the Prisma schema.
    ```bash
    npx prisma migrate dev --name init
    ```

### Running the Application

-   **For development (with auto-reloading):**
    ```bash
    npm run dev
    ```

-   **For production:**
    ```bash
    npm run build
    npm start
    ```

The server will start on the port specified in your `.env` file (default is 3000).
