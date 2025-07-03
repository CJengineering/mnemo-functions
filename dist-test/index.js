"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
// 1. Create Express app
const app = (0, express_1.default)();
exports.app = app;
app.use(express_1.default.json());
app.use((0, cors_1.default)({ origin: "*" }));
// 2. Health Check
app.get("/", (_req, res) => {
    res.send("🚀 Mnemo Cloud Function is up and running - CI/CD Pipeline Active!");
});
// 3. Health endpoint with detailed status
app.get("/health", (_req, res) => {
    res.json({
        status: "OK",
        timestamp: new Date().toISOString(),
        port: process.env.PORT || 8080,
        environment: process.env.NODE_ENV || 'development'
    });
});
// 4. Test route
app.get("/test", (_req, res) => {
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
