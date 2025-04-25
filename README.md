# Concert Affiliate Service

This is an affiliate service for concert events. Users (affiliators) can register, log in, and view concert statistics. The system uses **Keycloak** for authentication and **PostgreSQL** for storing data.

## Setup Guide

### 1. Database Setup

In the project directory, you can build:

### `docker-compose up -d`

### Keycloak Setup

1. **Create Realm:**
   - Create a new realm called `concert-affiliate`.

2. **Create Client:**
   - **Client ID:** `concert-backend`
   - **Name:** `concert-backend`
   - **Valid redirect URIs:** `*`
   - **Web Origins:** `*`

3. **Configure Realm:**
   - Enable **User registration**, **Forgot password**, **Email as username**, and **Login with email**. in Login tab
   - Copy the **Public Key (RS256)** for backend configuration.

### 2. Backend Setup

1. **Configure `.env`:**
   - Set the `DB_HOST` to your PostgreSQL server IP address.

2. **Keycloak Configuration:**
   - Add the copied **Public Key (RS256)** to `internal/config/keycloak.go`.

In the project directory after setup, you can build:

### `docker-compose up -d`

### 3. Frontend Setup

In the project directory, you can run:

### `npm start`

1. **Register an Account:**
   - Go to the registration page and create an account.
