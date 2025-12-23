/**
 * CORS Configuration
 * Cấu hình Cross-Origin Resource Sharing
 */

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:5173", // Vite
    "http://localhost:4200", // Angular
    'https://e-commerce-platform-pi-one.vercel.app',
  ];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin or origin 'null'
    if (!origin || origin === "null") {
      return callback(null, true);
    }

    const isAllowed =
      allowedOrigins.includes(origin) ||
      origin.includes('vercel.app') || // Allow all Vercel domains
      process.env.NODE_ENV === "development";

    if (isAllowed) {
      callback(null, true);
    } else {
      console.error("❌ CORS blocked origin:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  

  credentials: true, // Allow cookies
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
  ],
  exposedHeaders: ["Content-Range", "X-Content-Range"],
  maxAge: 86400, // 24 hours
};

module.exports = corsOptions;
