// [article.test.ts]: Article integration tests
import request from 'supertest';
import { app } from '../src/app';
import { PrismaClient } from '@prisma/client';
import { closeRedisConnection } from '../src/services/auth.service';

const prisma = new PrismaClient();

describe('DELETE /api/articles/:slug', () => {
  let adminToken: string;
  let nonAdminToken: string;
  let testArticleSlug: string;

  beforeAll(async () => {
    // Login as admin to get token
    const adminRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'password123',
      });
    adminToken = adminRes.body.accessToken;

    // Login as non-admin to get token
    const nonAdminRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'editor@example.com',
        password: 'password123',
      });
    nonAdminToken = nonAdminRes.body.accessToken;

    // Add a small delay to ensure tokens are properly set
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Create a test article
    const article = await prisma.article.create({
      data: {
        title: 'Test Article for Deletion',
        slug: 'test-article-deletion',
        content: 'This article will be deleted in tests.',
        status: 'published',
        published_at: new Date(),
      },
    });
    testArticleSlug = article.slug;

    // Verify article was created
    const createdArticle = await prisma.article.findUnique({
      where: { slug: testArticleSlug },
    });
    if (!createdArticle) {
      throw new Error('Failed to create test article');
    }
  });

  afterAll(async () => {
    // Clean up test data
    await prisma.article.deleteMany({
      where: {
        slug: testArticleSlug,
      },
    });
    await prisma.$disconnect();
    await closeRedisConnection();
  });

  it('should allow admin to soft delete an article', async () => {
    // Verify article exists before deletion
    const articleBeforeDelete = await prisma.article.findUnique({
      where: { slug: testArticleSlug },
    });
    expect(articleBeforeDelete).not.toBeNull();
    expect(articleBeforeDelete?.deleted_at).toBeNull();

    const res = await request(app)
      .delete(`/api/articles/${testArticleSlug}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toEqual(204);

    // Verify article is soft deleted
    const articleAfterDelete = await prisma.article.findUnique({
      where: { slug: testArticleSlug },
    });
    expect(articleAfterDelete?.deleted_at).not.toBeNull();
  });

  it('should return 404 when trying to delete non-existent article', async () => {
    const res = await request(app)
      .delete('/api/articles/non-existent-article')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toEqual(404);
  });

  it('should return 401 when no token provided', async () => {
    const res = await request(app)
      .delete(`/api/articles/${testArticleSlug}`);

    expect(res.statusCode).toEqual(401);
  });

  it('should return 403 when user is not admin', async () => {
    const res = await request(app)
      .delete(`/api/articles/${testArticleSlug}`)
      .set('Authorization', `Bearer ${nonAdminToken}`);

    expect(res.statusCode).toEqual(403);
  });
});