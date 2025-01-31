// Default settings for the application
const settings = {
    appName: "MyApp",
    version: "1.0.0",
    apiEndpoint: "https://api.example.com",
    theme: {
        color: "light", // Options: 'light', 'dark'
        primaryColor: "#007BFF",
        secondaryColor: "#6C757D",
    },
    authentication: {
        enabled: true,
        tokenKey: "auth_token",
    },
    logging: {
        level: "info", // Options: 'debug', 'info', 'warn', 'error'
        enableConsole: true,
    },
};

// Export settings object for use in other parts of the application
module.exports = settings;
