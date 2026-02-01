# OpenLedger 🏢

**Open Source Property Management SaaS**

OpenLedger is a modern, full-stack property management solution designed for landlords and property managers. It streamlines the entire rental lifecycle—from tracking buildings and units to managing tenants and automating billing.

## 🚀 Features

- **📊 Smart Dashboard:** Real-time overview of occupancy rates, pending dues, and active properties.
- **mj🏢 Property Management:** specific hierarchy for Buildings -> Units (Flats/Rooms).
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

### Step 2: Create `CONTRIBUTING.md`

Since you are an open-source enthusiast, this file is crucial. It tells other developers how they can help you build this.

Create a file named `CONTRIBUTING.md` in the root folder:

```markdown
# Contributing to OpenLedger

First off, thanks for taking the time to contribute! 🎉

We want to make creating a property management tool open and accessible. Whether you're fixing a bug, improving documentation, or adding a new feature, your help is welcome.

## ✈️ How to Contribute

1. **Fork the Repository**
   Click the "Fork" button at the top right of the repo.

2. **Clone your Fork**
   ```bash
   git clone [https://github.com/your-username/openledger.git](https://github.com/your-username/openledger.git)

    Create a Branch Always create a new branch for your work. Keep it descriptive.
    Bash

    git checkout -b feature/add-dark-mode
    # or
    git checkout -b fix/invoice-calculation-bug

    Make your Changes

        Keep your code clean and commented where necessary.

        Use the existing project structure (components in /components, pages in /pages).

    Commit your Changes We follow conventional commit messages:
    Bash

    git commit -m "feat: add dark mode toggle to sidebar"

    Push to your Fork
    Bash

    git push origin feature/add-dark-mode

    Submit a Pull Request (PR) Go to the original OpenLedger repository and click "Compare & Pull Request". Describe what you did and why!

💻 Development Guidelines

    Style: We use Tailwind CSS for all styling. Avoid custom CSS files unless necessary.

    Icons: Use lucide-react for all icons.

    Database: If your change requires a database change, please include the SQL command in your PR description.