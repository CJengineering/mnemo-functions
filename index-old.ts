import express, { Request, Response } from "express";
import cors from "cors";

// 1. Create Express app
const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

// 2. Health Check
app.get("/", (_req: Request, res: Response) => {
  res.send("🚀 Mnemo Cloud Function is up and running - CI/CD Pipeline Active!");
});

// 3. Health endpoint with detailed status
app.get("/health", (_req: Request, res: Response) => {
  res.json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    port: process.env.PORT || 8080,
    environment: process.env.NODE_ENV || 'development'
  });
});

// 4. Test route
app.get("/test", (_req: Request, res: Response) => {
  res.json({ msg: "test works" });
});

// 5. Start server
const port = parseInt(process.env.PORT || '8080', 10);

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server running on 0.0.0.0:${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
}).on('error', (err) => {
  console.error('❌ Server failed to start:', err);
  process.exit(1);
});

export { app };
