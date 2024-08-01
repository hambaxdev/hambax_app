

# Hambax App

Welcome to the Hambax App repository. This mobile application is designed to facilitate event management and QR code scanning. Below, you'll find detailed information on setting up, running, and contributing to the project.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Running the App](#running-the-app)
- [Folder Structure](#folder-structure)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

## Features

- User authentication and registration
- Event creation and management
- QR code scanning for event check-ins
- User profile management
- Multi-language support (English, Russian)

## Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/hambaxdev/hambax_app.git
    cd hambax_app
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Set up environment variables:**

    Create a `.env` file in the root directory and add your environment variables:

    ```plaintext
    API_URL=https://yourapiurl.com
    ```

## Running the App

To run the app on an emulator or a physical device, use the following commands:

- **Start the development server:**

    ```bash
    npm start
    ```

- **Run on Android:**

    ```bash
    npm run android
    ```

- **Run on iOS:**

    ```bash
    npm run ios
    ```

## Folder Structure

- **assets/**: Contains images and icons used in the app.
- **src/**: Main source folder containing all the code.
  - **components/**: Reusable components.
  - **navigation/**: Navigation setup for the app.
  - **screens/**: Different screens/views of the app.
  - **utils/**: Utility functions and helpers.
  - **localization/**: Localization setup and translation files.
  - **data/**: Data files like country lists.
- **App.js**: Entry point of the application.
- **app.json**: Configuration file for the app.
- **babel.config.js**: Babel configuration file.
- **package.json**: Contains scripts and dependencies.

## Environment Variables

The app uses environment variables to manage configurations. These are defined in a `.env` file located at the root of the project. Ensure the following variables are set:

- `API_URL`: Base URL for the backend API.

## Contributing

We welcome contributions! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a pull request.

Please ensure your code follows the project's coding standards and includes tests for any new functionality.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
