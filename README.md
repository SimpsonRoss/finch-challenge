# Finch Connect Demo

A Next.js 13 application that demonstrates how to integrate [Finch Connect](https://tryfinch.com) in a sandbox environment.  
It lets your user:

1. Enter a **Customer ID** & **Customer Name**  
2. Click **Connect** to start the Finch Connect OAuth flow  
3. View **Company**, **Directory**, **Individual** & **Employment** data  

---

### Prerequisites

- **Node.js** ≥ 18  
- **npm** 
- A **Finch Developer** sandbox account with a **Client ID** & **Client Secret**  
  - Sign up: https://dashboard.tryfinch.com/signup  


---

### Getting Started

1. **Clone the repo**

2. **Install dependencies**
    - `npm install`    

3. **Create your .env.local**
    - In the project root, create .env.local with:

```bash
NEXT_PUBLIC_FINCH_REDIRECT_URI=http://localhost:3000/callback
FINCH_CLIENT_ID=your-finch-client-id
FINCH_CLIENT_SECRET=your-finch-client-secret
```

4. **Add your redirect URI via the Finch dashboard**
    - *Note: NEXT_PUBLIC_FINCH_REDIRECT_URI must exactly match the redirect URI you’ve configured in your Finch Dashboard*

5. **Run the development server**
    - `npm run dev`

6. **Navigate to http://localhost:3000**

7. **Fill in Customer ID & Customer Name, click Connect**
    - For the sake of this example you can make up these credentials
    - *Note: If the same customer ID and customer name is used for a second time, you will instead see the rauthentication flow, instead of trying to form a new finch connection*

8. **Authorize in the Finch sandbox**
    - You’ll be redirected back to `http://localhost:3000/dashboard` and able to browse your company & employees

--- 
### Scripts

-  Start the local development server on port 3000
    - `npm run dev`

- Build and run production mode locally
    - `npm run build && npm start`

- Run ESLint
    - `npm run lint`

---

### What’s Implemented

- Finch Connect Redirect Flow via /api/createLinkToken → /connect/sessions

- Token exchange at /api/token, stored in an HTTP-only cookie

- Company, Directory, Individual & Employment endpoints

- Graceful handling of missing endpoints (501) and null fields

- Simple, responsive UI with Tailwind CSS

---

### Security Notes

- Access token stored in a secure, HTTP-only cookie

- Sanitize user-provided customerName with DOMPurify before sending to Finch

- Prevent XSS by stripping < & > on the client
