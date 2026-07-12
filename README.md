# 🧾 Eco-Snap — AI Receipt Scanner

Eco-Snap is a full-stack expense tracking tool that automates the tedious part of budgeting — manually entering receipt data. Upload a photo of a receipt, and Eco-Snap extracts the text via OCR, structures it into clean expense data, and categorizes it automatically for instant financial insights.

## ✨ Features

- 📸 **Receipt Upload** — Scan or upload receipt images directly from the app
- 🔍 **OCR Text Extraction** — Automatically reads item names, prices, dates, and totals from receipt images
- 🔄 **ETL Pipeline** — Extracts, transforms, and loads receipt data into a structured, queryable format
- 🏷️ **Automated Categorization** — Classifies expenses (groceries, dining, utilities, etc.) without manual tagging
- 📊 **Insight Generation** — Summarizes spending patterns and highlights trends over time
- ⚡ **REST API Backend** — Clean, documented endpoints connecting the OCR pipeline to the frontend

## 🛠️ Tech Stack

**Frontend:** React
**Backend:** REST API (Node.js/Express)
**OCR Engine:** Tesseract / OCR API *(update with the specific library you used)*
**Data Pipeline:** Custom ETL for receipt parsing and normalization

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/smariaj/Eco-Snap-AI-Receipt-Scanner-.git
cd Eco-Snap-AI-Receipt-Scanner-

# Install dependencies
npm install

# Start the development server
npm start
```

The app will run at [http://localhost:3000](http://localhost:3000).

## 📖 How It Works

1. **Capture** — User uploads or snaps a photo of a receipt
2. **Extract** — OCR engine reads raw text from the image
3. **Transform** — Backend parses raw text into structured fields (merchant, items, amount, date)
4. **Load** — Structured data is stored and categorized automatically
5. **Visualize** — User sees categorized expenses and spending insights on the dashboard

## 📌 Project Status

This project was built as a full-stack + OCR/ETL learning project, demonstrating end-to-end pipeline design from image input to actionable financial insight.

## 🤝 Contributing

This is currently a solo/academic project, but suggestions and feedback are welcome via Issues.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## Development Reference (Create React App)

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Available Scripts

In the project directory, you can run:

#### `npm start`

Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.
The page will reload when you make changes.
You may also see any lint errors in the console.

#### `npm test`

Launches the test runner in the interactive watch mode.
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### `npm run build`

Builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.
The build is minified and the filenames include the hashes.
Your app is ready to be deployed!
See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

#### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.
Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.
You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

### Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).
To learn React, check out the [React documentation](https://reactjs.org/).

#### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

#### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

#### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

#### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

#### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

#### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
