// [app.ts]: Express application setup
import express, { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { authRouter } from './routes/auth.routes';
import { articleRouter } from './routes/article.routes';
import { serviceRouter } from './routes/service.routes';
import testimonialRouter from './routes/testimonial.routes';
import { programRouter } from './routes/program.routes';
import { errorMiddleware } from './middlewares/error.middleware';

const app: Application = express();

// Enable CORS and request parsing
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

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
app.use('/api/auth', authRouter);
app.use('/api/articles', articleRouter);
app.use('/api/services', serviceRouter);
app.use('/api/testimonials', testimonialRouter);
app.use('/api/programs', programRouter);
app.use('/api/pages', require('./routes/page.routes.js'));
app.use('/api/livechat', require('./routes/livechat.routes.js'));

// Error handling
app.use(errorMiddleware);

export { app };
