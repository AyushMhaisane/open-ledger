# OpenLedger 🏢

**Open Source Property Management SaaS**

OpenLedger is a modern, full-stack property management solution designed for landlords and property managers. It streamlines the entire rental lifecycle—from tracking buildings and units to managing tenants and automating billing.

## 🚀 Features

- **📊 Smart Dashboard:** Real-time overview of occupancy rates, pending dues, and active properties.
- **🏢 Property Management:** specific hierarchy for Buildings -> Units (Flats/Rooms).
- **👥 Tenant Portal:** Track tenant details, lease dates, and unit assignments.
- **💸 Finance & Billing:**
  - Create invoices with auto-filled rent amounts.
  - Record partial or full payments.
  - Track overdue balances.
- **🔐 Secure Auth:** Powered by Supabase (Email/Password + Magic Links).

## 🛠️ Tech Stack

- **Frontend:** React + TypeScript + Vite
- **Styling:** Tailwind CSS + Lucide Icons
- **Backend:** Supabase (PostgreSQL, Auth, Realtime)
- **Routing:** React Router v6

## ⚡ Getting Started

### Prerequisites

- Node.js (v16 or higher)
- A [Supabase](https://supabase.com) account

### Installation

1. **Clone the repository**
   ```bash
   git clone [https://github.com/yourusername/openledger.git](https://github.com/yourusername/openledger.git)
   cd openledger

    Install dependencies
    Bash

    npm install

    Environment Setup Create a .env file in the root directory:
    Code snippet

    VITE_SUPABASE_URL=your_supabase_project_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

    Database Setup Run the SQL scripts provided in /supabase/schema.sql (or copy from the docs) in your Supabase SQL Editor to create tables and RLS policies.

    Run the App
    Bash

    npm run dev

🛡️ Security

This project uses Row Level Security (RLS).

    Landlords can only see their own properties and tenants.

    Data is isolated by owner_id at the database level.

📄 License

This project is licensed under the MIT License - see the LICENSE file for details.


---


