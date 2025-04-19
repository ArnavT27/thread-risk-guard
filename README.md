
# ThreadRiskGuard - Social Engineering Detection System

ThreadRiskGuard is a web-based application that analyzes chat messages to detect potential social engineering threats, phishing attempts, and manipulative behavior. Users can paste text or upload chat logs from platforms like Slack, Discord, or email, and receive an AI-powered analysis highlighting risk levels, suspicious patterns, and security concerns.

## Features

- **Message Analysis**: Paste or upload chat messages for instant security analysis
- **Risk Detection**: Identify high, medium, and low-risk messages with detailed flags
- **Intent Recognition**: Understand the intent behind messages (requests, demands, questions, etc.)
- **Sentiment Analysis**: Detect emotional tone and urgency as potential manipulation indicators
- **Results Dashboard**: Visualize analysis history with charts and statistics
- **Export Functionality**: Download analysis results as CSV for further investigation
- **Security Measures**: Input sanitization, file validation, rate limiting, and anonymized logging

## Technology Stack

- **Frontend**: React with TypeScript
- **UI Framework**: Tailwind CSS with shadcn UI components
- **State Management**: React Hooks and Context API
- **Routing**: React Router
- **Visualization**: Recharts for data visualization
- **Security**: Client-side security utilities for sanitization and validation

## Project Structure

```
src/
├── components/             # React components
│   ├── Dashboard.tsx       # Analysis dashboard with charts
│   ├── FileUploader.tsx    # File upload component with validation
│   ├── MessageAnalyzer.tsx # Message analysis results display
│   └── ui/                 # UI components (shadcn)
├── pages/                  # Application pages
│   ├── Index.tsx           # Main application page
│   └── NotFound.tsx        # 404 page
├── services/               # Service modules
│   └── analyzerService.ts  # Message analysis service
├── types/                  # TypeScript type definitions
│   └── analysis.ts         # Analysis result types
├── utils/                  # Utility functions
│   └── securityUtils.ts    # Security-related utility functions
└── App.tsx                 # Main application component
```

## Local Development Setup

### Prerequisites

- Node.js (v16 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/thread-risk-guard.git
   cd thread-risk-guard
   ```

2. Install dependencies:
   ```
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:8080`

## Deployment Options

### Vercel (Frontend)

1. Fork or push this repository to your GitHub account
2. Connect your GitHub repository to Vercel
3. Configure build settings:
   - Build Command: `npm run build` or `yarn build`
   - Output Directory: `dist`
   - Install Command: `npm install` or `yarn install`
4. Deploy

### Render (Full Stack)

For a full-stack deployment including a backend API:

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure build settings:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start`
4. Add environment variables as needed
5. Deploy

## Production Considerations

### AI Integration

For production use, you should integrate with a real AI service:

1. Create an account with OpenAI, Cohere, or other AI provider
2. Obtain an API key
3. Update the `analyzerService.ts` to use the API instead of the mock implementation
4. Consider implementing a backend service for API key security

### Security Enhancements

For production deployment, consider these additional security measures:

1. Implement server-side validation and rate limiting
2. Use HTTPS for all communications
3. Set up proper CORS configuration
4. Implement authentication if storing analysis history
5. Use a proper database for logging security events
6. Consider Web Application Firewall (WAF) services

## Future Enhancements

- Real-time chat monitoring capabilities
- Integration with messaging platforms via API
- Enhanced AI model with specialized training for cybersecurity threats
- User authentication and saved analysis history
- Team collaboration features for security teams
- API for integration with security information and event management (SIEM) systems

## License

This project is licensed under the MIT License - see the LICENSE file for details.
