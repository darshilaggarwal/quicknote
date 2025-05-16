# QuickNote

A simple note-taking application built with Node.js, Express, and MongoDB.

## Local Development

1. Clone the repository
2. Install dependencies
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   JWT_SECRET=your_secure_jwt_secret
   MONGODB_URI=mongodb+srv://darshilaggarwal55:abcdefgh@cluster0.tfvjenr.mongodb.net/quicknote?retryWrites=true&w=majority&appName=Cluster0
   NODE_ENV=development
   ```
4. Start the development server
   ```bash
   npm run dev
   ```

## Deployment on Render

1. Push your code to a GitHub repository
2. Log in to [Render](https://render.com) and create a new Web Service
3. Connect your GitHub repository
4. Use the following settings:
   - **Name**: quicknote (or any name you prefer)
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add the following environment variables:
   - `NODE_ENV`: production
   - `JWT_SECRET`: (generate a secure random string)
   - `MONGODB_URI`: mongodb+srv://darshilaggarwal55:abcdefgh@cluster0.tfvjenr.mongodb.net/quicknote?retryWrites=true&w=majority&appName=Cluster0
6. Click "Create Web Service"

## Features

- User authentication (register/login)
- Create, read, update, and delete notes
- Profile management
- File upload functionality

## Technologies Used

- Node.js
- Express.js
- MongoDB (MongoDB Atlas for production)
- EJS templates
- JWT for authentication 