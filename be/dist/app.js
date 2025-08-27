"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
// [app.ts]: Express application setup
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_routes_1 = require("./routes/auth.routes");
const article_routes_1 = require("./routes/article.routes");
const service_routes_1 = require("./routes/service.routes");
const testimonial_routes_1 = __importDefault(require("./routes/testimonial.routes"));
const program_routes_1 = require("./routes/program.routes");
const page_routes_1 = __importDefault(require("./routes/page.routes"));
const livechat_routes_1 = __importDefault(require("./routes/livechat.routes"));
const error_middleware_1 = require("./middlewares/error.middleware");
const app = (0, express_1.default)();
exports.app = app;
// Enable CORS and request parsing
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// Log all incoming requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`, {
        query: req.query,
        params: req.params,
        body: req.body
    });
    next();
});
// Mount routers
app.use('/api/auth', auth_routes_1.authRouter);
app.use('/api/articles', article_routes_1.articleRouter);
app.use('/api/services', service_routes_1.serviceRouter);
app.use('/api/testimonials', testimonial_routes_1.default);
app.use('/api/programs', program_routes_1.programRouter);
app.use('/api/pages', page_routes_1.default);
app.use('/api/livechat', livechat_routes_1.default);
// Error handling
app.use(error_middleware_1.errorMiddleware);
//# sourceMappingURL=app.js.map