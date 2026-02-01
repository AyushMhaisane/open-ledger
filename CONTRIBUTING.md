# Contributing to OpenLedger 🚀

First off, thank you for considering contributing to OpenLedger! It's people like you that make the open-source community such an amazing place to learn, inspire, and create.

## 📂 Project Structure

Here is a quick overview of how the codebase is organized to help you navigate:

```text
openledger/
├── src/
│   ├── components/      # Reusable UI components (Layouts, Cards, Modals)
│   ├── context/         # Global state providers (specifically AuthContext)
│   ├── lib/             # Configuration files (Supabase client setup)
│   ├── pages/           # Main application views (Dashboard, Properties, Finance)
│   ├── App.tsx          # Main entry point and Routing logic
│   └── main.tsx         # React DOM rendering
├── supabase/
│   └── schema.sql       # The complete database structure (Tables, RLS Policies)
├── .env                 # Environment variables (API Keys)
└── package.json         # Dependencies and scripts

🛠️ Setting Up Your Development Environment

To contribute, you will need to run the app locally linked to your own development database.

    Fork and Clone
    Bash

    git clone [https://github.com/your-username/openledger.git](https://github.com/AyushMhaisane/open-ledger.git)

    cd openledger

    Install Dependencies
    Bash

    npm install

    Setup Supabase (Database)

        Go to Supabase and create a New Project (Free Tier is fine).

        Go to the SQL Editor in your new project.

        Copy the contents of supabase/schema.sql from this repository.

        Run the SQL to generate all tables (Properties, Units, Tenants, Invoices) and Security Policies.

    Environment Variables Create a .env file in the root directory:
    Code snippet

    VITE_SUPABASE_URL=your_new_project_url
    VITE_SUPABASE_ANON_KEY=your_new_project_anon_key

    (You can find these in your Supabase Project Settings -> API)

    Run Locally
    Bash

    npm run dev

    Open http://localhost:5173 to see the app.

🗄️ Making Database Changes

Since this project relies on a database schema, please follow these rules if your feature requires a database change (e.g., adding a column or a new table):

    Test Locally: Make the change in your own Supabase SQL Editor first to ensure it works.

    Document the Change:

        Do not overwrite the main schema.sql unless you are refactoring the whole DB.

        Instead, include the SQL command needed to run your change in your Pull Request Description.

        Example PR Description:

            "This feature adds a 'pet_friendly' column to units. Please run this SQL: ALTER TABLE units ADD COLUMN pet_friendly boolean DEFAULT false;"

💻 Code Guidelines

    Styling: We use Tailwind CSS. Please avoid writing custom CSS in .css files unless absolutely necessary.

    Icons: Use lucide-react for all icons to maintain consistency.

    Commits: Please write clear commit messages (e.g., feat: add filter to tenant list rather than update code).

Thank you for building with us!