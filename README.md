# Integration Audit Automation Workflow

A comprehensive React-based application designed to streamline the integration audit process for merchants. This tool facilitates a structured workflow for auditing various products, managing Merchant IDs (MIDs), and generating compliance checklists, ensuring a smooth and compliant integration experience.

## 🚀 Features

- **Role-Based Access Control**: tailored views and functionalities for both Admin and Merchant users.
- **Hierarchical MID Management**: Seamless selection and management of Parent and Child Merchant IDs.
- **Interactive Dashboard**: A centralized hub displaying merchant data, available features, and product integration status.
- **Product Audit Wizard**: A guided, step-by-step wizard for auditing specific products, ensuring all integration requirements are met.
- **Automated Checklist Generation**: Generates dynamic checklists based on the selected product and integration scope.
- **Modern & Responsive UI**: Built with Radix UI and Tailwind CSS, providing a polished, accessible, and responsive user interface.
- **Data Visualization**: Integrated charts using Recharts for visual representation of audit data.

## 🛠️ Tech Stack

- **Frontend Framework**: [React](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) (Primitives), [Lucide React](https://lucide.dev/) (Icons)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Utilities**: `clsx`, `tailwind-merge`

## 🏁 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- **Node.js**: Version 18 or higher is recommended.
- **npm** or **yarn**: Package manager.

### Installation

1.  **Clone the repository** (if applicable) or navigate to the project directory.

2.  **Install dependencies**:
    ```bash
    npm install
    # or
    yarn install
    ```

### Running the Application

Start the development server:

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173` (or the port shown in your terminal).

### Building for Production

To create a production-ready build:

```bash
npm run build
# or
yarn build
```

The build artifacts will be generated in the `dist` directory.

## 📂 Project Structure

```
src/
├── components/        # Reusable UI components and feature-specific views
│   ├── ui/            # Generic UI components (buttons, inputs, etc.)
│   ├── Dashboard.tsx  # Main dashboard component
│   ├── LoginForm.tsx  # Login screen component
│   └── ...
├── data/              # Mock data and static resources
├── types/             # TypeScript type definitions
├── App.tsx            # Main application entry point and routing logic
├── main.tsx           # React DOM rendering
└── index.css          # Global styles and Tailwind directives
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
