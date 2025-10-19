# AI EDM Track Generator & Deconstructor

## Project Overview

This project is an AI-powered music tool designed for EDM producers, DJs, and music enthusiasts. It provides two core functionalities: generating original EDM tracks from text prompts and deconstructing existing tracks into their fundamental components.

The application serves as a creative assistant, allowing users to quickly prototype musical ideas or analyze the structure of professional tracks for learning purposes. The user interface is designed to be clean, simple, and intuitive.

## Core Technologies

*   **Frontend Framework:** Nuxt.js
*   **Track Generation:** Loudly API
*   **Track Deconstruction:** Lalai.ai API

## Features

### 1. AI Track Generator

The Generator page allows you to create new EDM loops and tracks using text-based prompts.

*   **Genre Selection:** Choose from a list of EDM genres (e.g., House, Techno, Ambient) to guide the AI's output.
*   **Text-Based Prompts:** Describe the track you want to create. For example, "create an energetic trance track with a euphoric melody."
*   **Generate Track:** The AI processes your prompt and generates a unique music track.
*   **Surprise Me:** For moments of creative block, this button generates a random, interesting prompt for you to use.

### 2. AI Track Deconstructor

The Deconstructor page is a learning tool that separates an existing audio file into its individual instrumental layers (stems).

*   **Local File Upload:** Select any audio file from your computer.
*   **Deconstruct Audio:** The tool uploads the file and uses the Lalai.ai API to isolate the different components of the track.
*   **View Components:** Once processed, the track's stems—such as Vocals, Drums, Bass, and other instruments—are displayed and can be listened to individually.

## Important: API Key Configuration

**Please be aware that the live, deployed version of this prototype does not have active API keys configured.**

Both the Loudly and Lalai.ai APIs are paid services. To prevent unauthorized use and associated costs, my personal API keys have been removed from the production build.

**As a result, some features, particularly the Deconstructor, will not be functional on the live demo link.**

To experience the full functionality of the application, please follow the setup instructions below to run the project on your local machine with your own API keys.

## Local Setup and Installation

Follow these steps to run the project locally with full features enabled.

### Prerequisites

*   Node.js (v16 or later recommended)
*   npm or yarn package manager

### 1. Clone the Repository

Clone this project's code to your local machine.

```bash
git clone https://github.com/JianHengHin0831/AI_For_EDM.git
cd AI_For_EDM
```

### 2. Install Dependencies

Install the necessary project dependencies using your preferred package manager.

```bash
# Using npm
npm install

# Using yarn
yarn install
```

### 3. Configure API Keys

You will need to sign up for accounts on both [Loudly](https://loudly.com/) and [Lalai.ai](https://lalal.ai/) to get your personal API keys.

1.  Create a file named `.env` in the root directory of the project.
2.  Add your API keys to the `.env` file in the following format:

    ```
    LOUDY_API_KEY=your_loudly_api_key_here
    LALAL_LICENSE_KEY=your_lalai_api_key_here
    ```

    Replace `your_loudly_api_key_here` and `your_lalai_api_key_here` with your actual keys. The application is configured to read these variables automatically.

### 4. Run the Development Server

Start the Nuxt.js development server.

```bash
# Using npm
npm run dev

# Using yarn
yarn dev
```

The application should now be running locally, typically at `http://localhost:3000`, with all API-dependent features fully functional.

## Usage

*   **To Generate Music:** Navigate to the "Generator" page, select a genre, enter a text prompt, and click "Generate My Track".
*   **To Deconstruct Music:** Navigate to the "Deconstructor" page, select an audio file from your computer, and click "Upload and Deconstruct". The separated stems will appear once processing is complete.
