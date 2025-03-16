
# Time Capsule Project

A digital time capsule platform that lets users create and store memories to be revealed at a future date. Built with React, Node.js, AWS DynamoDB, and blockchain technology.

## 📋 Features

- **Email Authentication** - Secure OTP-based login system
- **Time Capsule Creation** - Schedule digital time capsules for future delivery
- **File Storage** - Upload and store files securely on Cloudinary
- **Blockchain Integration** - Immutable storage using smart contracts
- **User Dashboard** - View and manage all your created capsules

## 🏗️ Architecture

### Frontend
- React with JSX
- React Router for navigation
- FormData for file uploads
- Session-based authentication

### Backend
- Node.js with Express
- AWS DynamoDB for database
- JWT authentication
- Cloudinary for file storage
- Blockchain integration for immutable records

## 🚀 Getting Started

### Prerequisites

- Node.js (v14+)
- AWS account with DynamoDB access
- Ethereum wallet and testnet access
- Cloudinary account

### Environment Variables

Create a `.env` file in the backend directory:

```
# Server
PORT=8000
NODE_ENV=development

# AWS DynamoDB
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=your_region

# Authentication
ACCESS_TOKEN_SECRET=your_jwt_access_token_secret
REFRESH_TOKEN_SECRET=your_jwt_refresh_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_EXPIRY=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Blockchain (Ethereum)
ETHEREUM_PRIVATE_KEY=your_private_key
ETHEREUM_RPC_URL=your_rpc_url
ETHEREUM_CONTRACT_ADDRESS=your_contract_address
```

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/time-capsule.git
cd time-capsule
```

2. Install backend dependencies
```bash
cd time-capsule-backend
npm install
```

3. Install frontend dependencies
```bash
cd ../TimeCapsuleFrontend
npm install
```

4. Start the backend server
```bash
cd ../time-capsule-backend
npm run dev
```

5. Start the frontend application
```bash
cd ../TimeCapsuleFrontend
npm run dev
```

## 📁 Project Structure

### Frontend
```
/TimeCapsuleFrontend
├── /src
│   ├── /components           # Reusable UI components
│   │   ├── login-modal.jsx   # Login/OTP authentication
│   │   ├── capsule-form.jsx  # Form for creating capsules
│   │   └── AllCapsules.jsx   # Display all user's capsules
│   ├── /pages
│   │   ├── HomePage.jsx      # Landing page with login
│   │   └── CapsulePage.jsx   # Capsule management page
│   └── App.jsx               # Main app component with routing
```

### Backend
```
/time-capsule-backend
├── /src
│   ├── /controllers          # Request handlers
│   │   ├── auth.controller.js
│   │   ├── capsule.controller.js
│   │   └── blockchain.controller.js
│   ├── /middlewares          # Express middlewares
│   │   ├── auth.middleware.js
│   │   └── multer.middleware.js
│   ├── /models               # Data models
│   │   └── user-capsule.model.js
│   ├── /routes               # API routes
│   │   ├── auth.routes.js
│   │   └── capsule.routes.js
│   └── /utils                # Utility functions
│       ├── cloudinary.js
│       └── ApiResponse.js
```

## 💻 API Endpoints

### Authentication
- `POST /api/v1/auth/send-otp`: Send OTP to user's email
- `POST /api/v1/auth/verify-otp`: Verify OTP and login
- `POST /api/v1/auth/logout`: Logout and clear cookies

### Time Capsules
- `POST /api/v1/capsule/create-capsule`: Create a new time capsule
- `GET /api/v1/capsule/getAll-Capsule`: Retrieve all user's capsules

## 🔒 AWS DynamoDB Schema

The project uses a single table design with the following structure:

- **PK**: Primary Key (USER#userId)
- **SK**: Sort Key (METADATA or CAPSULE#capsuleId)
- **EntityType**: Entity type (USER or CAPSULE)
- **email**: User's email address
- **refreshToken**: JWT for session management
- **contractAddress**: Ethereum contract address
- **fileHash**: Hashed file content
- **fileURL**: Cloudinary file URL
- **emails**: Array of recipient emails
- **deliveryDate**: Scheduled delivery date
- **status**: Capsule status (pending, delivered)
- **createdAt**: Creation timestamp

## 🔗 Blockchain Integration

The project uses Ethereum smart contracts to store capsule metadata. This ensures:

- **Immutability**: Capsule data cannot be altered
- **Scheduled execution**: Smart contracts handle automatic delivery
- **Transparency**: All transactions are publicly verifiable

Smart contracts are deployed on the Ethereum test network for development.

## 📦 Dependencies

### Frontend
- React
- React Router Dom
- Lucide React (icons)
- TailwindCSS (styling)

### Backend
- Express
- Dynamoose (DynamoDB ORM)
- JWT (authentication)
- Multer (file uploads)
- Cloudinary (file storage)
- Web3.js (blockchain interaction)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
EOF
```



