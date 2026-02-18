# The Velvet Vault: A Luxurious Web Experience

**Immersive wealth, Luxurious Entertainment, Versatile Navigation, High Class - Antique.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## Overview

The Velvet Vault is a Next.js project that provides a visually rich and engaging user experience, designed to evoke a sense of luxury and exclusivity. This repository serves as the front-end foundation for a high-class entertainment platform, featuring a sophisticated design, interactive elements, and a clear path for future expansion.

### Key Features

- **Elegant User Interface:** A dark, opulent theme with gold accents, creating a premium feel.
- **Interactive Elements:** Engaging UI components, including a simulated slot machine experience.
- **Responsive Design:** A layout that adapts to various screen sizes for a seamless experience on desktop and mobile devices.
- **Component-Based Architecture:** Built with React and Next.js for a modular and maintainable codebase.
- **Clear Project Structure:** A well-organized file system that separates concerns and simplifies development.

---

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/patersonseanmichael-The13Horror/grand-golden-vault.git
    cd grand-golden-vault
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

### Running the Development Server

To start the development server, run the following command:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Production Build

To create a production-ready build, run:

```bash
npm run build
npm run start
```

---

## Project Structure

The project follows a standard Next.js structure, with some additional directories for project-specific assets and components.

-   `/app`: Contains the core application logic, including pages and layouts.
-   `/components`: Reusable React components used throughout the application.
-   `/engine`: Core game logic and functionality.
-   `/lib`: Utility functions and helper scripts.
-   `/public`: Static assets, including images and fonts.
-   `/slots`: JSON data for the slot machines.
-   `/legacy_from_zip`: Original HTML/CSS and Firebase artifacts for reference.

---

## Important Note on Wagering

This repository is a **visual and user experience foundation only**. The slot machine demo uses client-side Random Number Generation (RNG) for UI demonstration purposes and is not suitable for real-money or regulated wagering. For any production wagering application, you must implement:

-   Server-side RNG with tamper-proof validation and logs.
-   Jurisdiction and age verification.
-   Responsible gambling controls (e.g., limits, cooldowns, self-exclusion).
-   Audited and secure deposit and withdrawal logic.

---

## Contributing

Contributions are welcome! Please see the `CONTRIBUTING.md` file for details on how to contribute to this project.

---

## License

This project is licensed under the MIT License - see the `LICENSE` file for details.
