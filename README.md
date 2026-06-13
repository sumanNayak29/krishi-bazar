# 🌾 Krishi Bazar

> **Next-Generation B2B Sourcing Hub & Digital Mandi**  
> Empowering local farmers, eliminating middlemen, and providing merchants with direct-to-farm crop procurement.

---

## 📖 Table of Contents

- [Core Mission](#-core-mission)
- [✨ Key Features](#-key-features)
- [🛠️ Technology Stack](#%EF%B8%8F-technology-stack)
- [📁 Project Directory Structure](#-project-directory-structure)
- [⚙️ Setup & Configuration](#%EF%B8%8F-setup--configuration)
- [🚀 Quick Start Guide](#-quick-start-guide)

---

## 🎯 Core Mission

Traditional agricultural trading in India is plagued by inefficient distribution networks, multiple layers of intermediaries, and a lack of price transparency. **Krishi Bazar** is a modern, transparent web application that directly connects agricultural producers (farmers) with corporate buyers and wholesale merchants. By bypassing middlemen, farmers retain up to 25% higher profit margins, and merchants receive high-grade organic produce at competitive spot rates.

---

## ✨ Key Features

### 👨🏽‍🌾 Farmer Workspace
* **Crop Catalog Listing:** Seamlessly list crops, specifying price, category, quantity, moisture content, and APMC/Mandi source.
* **Direct Bid Manager:** Review corporate sourcing bids, accepting or declining contracts in real-time.
* **Escrow Safeguards:** Secure financial payouts with escrow-locked guarantees until load dispatch is verified.

### 🏢 Merchant & Buyer Portal
* **APMC Sourcing Hub:** Browse verified active farm listings across major mandi hubs (Indore, Karnal, Agra, Guntur, etc.).
* **Mandate Broadcasting:** Target specific agricultural regions by broadcasting buying mandates directly to local farmers.
* **Shipment & Logistics Tracker:** Live tracing of active procurements through "Dispatching", "In-Transit", and "Arrived" statuses.

### 🔐 Auth & Verification System
* **Google OAuth Sign-in:** Instant passwordless authentication powered by `@react-oauth/google`.
* **Profile Verification Progress:** Earn the **Verified** badge by linking your bank account (name, account number, IFSC verification) and selecting an avatar profile.

---

## 🛠️ Technology Stack

* **Framework:** [Next.js](https://nextjs.org/) (App Router, React 19)
* **Language:** TypeScript
* **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/) (`@reduxjs/toolkit` & `react-redux`)
* **UI & Styling:** [Tailwind CSS v4](https://tailwindcss.com/) & [Material UI v9 (MUI)](https://mui.com/)
* **Authentication:** Google One Tap & Login integration via `@react-oauth/google`

---


## ⚙️ Setup & Configuration

To enable Google Authentication, you must set up your Google OAuth client:

1. Go to the [Google Cloud Console](https://console.cloud.google.com).
2. Create or select a project.
3. Navigate to **APIs & Services** → **Credentials**.
4. Create an **OAuth 2.0 Client ID** (select **Web Application**).
5. Add `http://localhost:3000` (or `http://localhost:5173`) to **Authorized JavaScript origins**.
6. Create a `.env` file in the root of the project with the following keys:

```env
# Google OAuth Configuration
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

---

## 🚀 Quick Start Guide

Follow these steps to run the project locally.

### 1. Install Dependencies
```bash
yarn install
# or
npm install
```

### 2. Run the Development Server
```bash
yarn dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or the port shown in terminal) in your browser to view the application.

### 3. Build for Production
```bash
yarn build
yarn start
# or
npm run build
npm run start
```
