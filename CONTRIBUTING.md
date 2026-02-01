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