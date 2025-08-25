// [app.ts]: Express application setup
import express, { Application } from 'express';
import cors from 'cors';
import { authRouter } from './routes/auth.routes';
import { articleRouter } from './routes/article.routes';
import { errorMiddleware } from './middlewares/error.middleware';

const app: Application = express();

// Enable CORS and request parsing
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Error handling
app.use(errorMiddleware);

export { app };
