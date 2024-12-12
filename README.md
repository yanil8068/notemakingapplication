# NOTE MAKING APPLICATION

**Netlify Deployment:**  
[Live Demo](https://notemakingappproject.netlify.app/)

**Backend Deployment**  
[Backend Live](https://notemakingapplication.vercel.app/)

## Tech Stack

- **React.js** - Interactive, component-based UI
- **Bootstrap** - Stying frontend
- **React Router** - Seamless page navigation
- **Git** - Version control and collaboration
- **Node.js** - Runtime environment
- **Express** - Backend framework
- **Mongodb** - Database

## Setup and Access Instructions

### Prerequisites

- **Node.js** installed on your machine
- **npm** for managing dependencies
- **MongoDB** (for local database setup)

### Steps to Access the App:

1. **Clone the repository**:

   ```bash
   git clone https://github.com/yanil8068/notemakingapplication.git
   ```

2. **Navigate to the project directory**:

   ```bash
   cd notemakingapplication
   ```

3. **Install dependencies**:

   ```bash for frontend
   cd frontend
   npm install
   ```

   ```bash for backend
   cd backend
   npm install
   ```

4. **Configure environment variables for backend**:  
   Create a `.env` file in the root directory and add the following:

   ```bash
   PORT=8000
   MONGODB_URI=yourmongodburi
   JWT_SECRET_KEY=jwtsecret
   ```

5. **Configure environment variables for frontend**:  
    Create a `.env` file in the root directory and add the following:

   ```bash
   VITE_BACKEND_URL=backendurl
   ```

6. **Run the application backend**:

   ```bash
   node index.js
   ```

   Open [http://localhost:8000](http://localhost:8000) to view it in your browser.

7. **Run the application frontend**:

   ```bash
   npm run dev
   ```

   Open [http://localhost:5173](http://localhost:5173) to view it in your browser.

## Authors

- [@Anil Yadav](https://github.com/yanil8068)
