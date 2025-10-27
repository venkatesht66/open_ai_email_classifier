# OpenAI Gmail Email Classifier

## 🧠 Tech Stack

### Frontend
- **React.js**
- **LocalStorage** for OpenAI key and user session

### Backend
- **Node.js** + **Express.js**
- **Google OAuth 2.0** (`googleapis`)
- **Express-Session** for secure login sessions
- **CORS** for cross-origin access

---

##  Environment Variables

Create a `.env` file in the **backend** folder with the following:

- GOOGLE_CLIENT_ID=your_google_client_id
- GOOGLE_CLIENT_SECRET=your_google_client_secret
- GOOGLE_REDIRECT_URI=http://localhost:4000/auth/google/callback
- SESSION_SECRET=your_secret_key
- FRONTEND_URL=http://localhost:3000
- PORT=4000

##  Backend Setup

- cd backend
- npm install

Create a .env file as shown above.
Then run:

- npm start / node server.js

## Frontend Setup

In new terminal

cd /frontend
npm install
npm start

For testing use theindianappguy@gmail.com to google login and check the mails upto 15 and we can classify before that we have to provide OPEN AI key.
