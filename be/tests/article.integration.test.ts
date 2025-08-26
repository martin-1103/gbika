// [article.integration.test.ts]: Integration tests for article API endpoints
import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import { app } from '../src/app';
import { closeRedisConnection } from '../src/services/auth.service';

const prisma = new PrismaClient();

describe('Article API Integration Tests', () => {
  let accessToken: string;
  let createdArticleIds: string[] = [];

  beforeAll(async () => {
    // Login to get access token for authenticated requests
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'password123'
      });
    
    if (loginResponse.statusCode === 200) {
      accessToken = loginResponse.body.accessToken;
    }

    // Clean up test data
    await prisma.article.deleteMany({
      where: {
        title: {
          startsWith: 'Test Article'
        }
      }
    });
  });

  afterAll(async () => {
    // Clean up test data
    if (createdArticleIds.length > 0) {
      await prisma.article.deleteMany({
        where: {
          id: {
            in: createdArticleIds
          }
        }
      });
    }
    
    await prisma.article.deleteMany({
      where: {
        title: {
          startsWith: 'Test Article'
        }
      }
    });
    
    await prisma.$disconnect();
    await closeRedisConnection();
  });

  beforeEach(async () => {
    // Reset created article IDs for each test
    createdArticleIds = [];
  });

  describe('POST /api/articles', () => {
    it('should create article successfully with valid data', async () => {
      const articleData = {
        title: 'Test Article Integration',
        content: '<p>This is test content for integration test</p>',
        status: 'draft'
      };

      const response = await request(app)
        .post('/api/articles')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(articleData)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('title', articleData.title);
      expect(response.body.data).toHaveProperty('content', articleData.content);
      expect(response.body.data).toHaveProperty('status', articleData.status);
      expect(response.body.data).toHaveProperty('slug');
      expect(response.body.data.slug).toMatch(/^test-article-integration/);
      
      // Store created article ID for cleanup
      createdArticleIds.push(response.body.data.id);
    });

    it('should create article with custom slug', async () => {
      const articleData = {
        title: 'Test Article Custom Slug',
        content: '<p>This is test content with custom slug</p>',
        slug: 'custom-test-slug-integration',
        status: 'published'
      };

      const response = await request(app)
        .post('/api/articles')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(articleData)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('slug', articleData.slug);
      expect(response.body.data).toHaveProperty('status', 'published');
      expect(response.body.data).toHaveProperty('published_at');
      
      // Store created article ID for cleanup
      createdArticleIds.push(response.body.data.id);
    });

    it('should sanitize HTML content', async () => {
      const articleData = {
        title: 'Test Article HTML Sanitization',
        content: '<p>Safe content</p><script>alert("xss")</script><img src="x" onerror="alert(1)">',
        status: 'draft'
      };

      const response = await request(app)
        .post('/api/articles')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(articleData)
        .expect(201);

      expect(response.body.data.content).not.toContain('<script>');
      expect(response.body.data.content).not.toContain('onerror');
      expect(response.body.data.content).toContain('<p>Safe content</p>');
      
      // Store created article ID for cleanup
      createdArticleIds.push(response.body.data.id);
    });

    it('should return 401 when no authentication token provided', async () => {
      const articleData = {
        title: 'Test Article No Auth',
        content: '<p>This should fail without auth</p>'
      };

      const response = await request(app)
        .post('/api/articles')
        .send(articleData)
        .expect(401);

      expect(response.body).toHaveProperty('message', 'Access token required.');
    });

    it('should return 422 when title is missing', async () => {
      const articleData = {
        content: '<p>Content without title</p>'
      };

      const response = await request(app)
        .post('/api/articles')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(articleData)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 422 when content is missing', async () => {
      const articleData = {
        title: 'Title without content'
      };

      const response = await request(app)
        .post('/api/articles')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(articleData)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 422 when title exceeds maximum length', async () => {
      const articleData = {
        title: 'A'.repeat(256), // Exceeds 255 character limit
        content: '<p>Valid content</p>'
      };

      const response = await request(app)
        .post('/api/articles')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(articleData)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 422 when slug format is invalid', async () => {
      const articleData = {
        title: 'Test Article Invalid Slug',
        content: '<p>Content with invalid slug</p>',
        slug: 'Invalid Slug With Spaces!'
      };

      const response = await request(app)
        .post('/api/articles')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(articleData)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 422 when status is invalid', async () => {
      const articleData = {
        title: 'Test Article Invalid Status',
        content: '<p>Content with invalid status</p>',
        status: 'invalid_status'
      };

      const response = await request(app)
        .post('/api/articles')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(articleData)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });

    it('should handle duplicate slug by adding timestamp', async () => {
      const articleData1 = {
        title: 'Test Article Duplicate Slug',
        content: '<p>First article content</p>',
        slug: 'duplicate-slug-test'
      };

      const articleData2 = {
        title: 'Test Article Duplicate Slug 2',
        content: '<p>Second article content</p>',
        slug: 'duplicate-slug-test'
      };

      // Create first article
      const response1 = await request(app)
        .post('/api/articles')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(articleData1)
        .expect(201);

      createdArticleIds.push(response1.body.data.id);
      expect(response1.body.data.slug).toBe('duplicate-slug-test');

      // Create second article with same slug
      const response2 = await request(app)
        .post('/api/articles')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(articleData2)
        .expect(201);

      createdArticleIds.push(response2.body.data.id);
      expect(response2.body.data.slug).toMatch(/^duplicate-slug-test-\d+$/);
      expect(response2.body.data.slug).not.toBe('duplicate-slug-test');
    });
  });

  describe('PUT /api/articles/{slug}', () => {
    let testArticle: any;

    beforeEach(async () => {
      // Create a test article for update tests
      const articleData = {
        title: 'Test Article for Update',
        content: '<p>Original content for update test</p>',
        status: 'draft'
      };

      const response = await request(app)
        .post('/api/articles')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(articleData);

      testArticle = response.body.data;
      createdArticleIds.push(testArticle.id);
    });

    it('should update article successfully with valid data', async () => {
      const updateData = {
        title: 'Updated Test Article',
        content: '<p>Updated content for test</p>',
        status: 'published'
      };

      const response = await request(app)
        .put(`/api/articles/${testArticle.slug}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('title', updateData.title);
      expect(response.body.data).toHaveProperty('content', updateData.content);
      expect(response.body.data).toHaveProperty('status', updateData.status);
      expect(response.body.data).toHaveProperty('slug');
      expect(response.body.data.slug).toMatch(/^updated-test-article/);
      expect(response.body.data).toHaveProperty('published_at');
    });

    it('should update article with custom slug', async () => {
      const customSlug = `custom-updated-slug-integration-${Date.now()}`;
      
      // Clean up any existing article with this slug
      await prisma.article.deleteMany({
        where: { slug: { startsWith: 'custom-updated-slug-integration' } }
      });
      
      const updateData = {
        title: 'Updated Article Custom Slug',
        content: '<p>Updated content with custom slug</p>',
        slug: customSlug
      };

      const response = await request(app)
        .put(`/api/articles/${testArticle.slug}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.data).toHaveProperty('slug', updateData.slug);
      expect(response.body.data).toHaveProperty('title', updateData.title);
      expect(response.body.data).toHaveProperty('content', updateData.content);
    });

    it('should sanitize HTML content on update', async () => {
      const updateData = {
        title: 'Updated Article HTML Sanitization',
        content: '<p>Safe updated content</p><script>alert("xss")</script><img src="x" onerror="alert(1)">'
      };

      const response = await request(app)
        .put(`/api/articles/${testArticle.slug}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.data.content).not.toContain('<script>');
      expect(response.body.data.content).not.toContain('onerror');
      expect(response.body.data.content).toContain('<p>Safe updated content</p>');
    });

    it('should return 404 when article not found', async () => {
      const updateData = {
        title: 'Updated Non-existent Article',
        content: '<p>This should fail</p>'
      };

      const response = await request(app)
        .put('/api/articles/non-existent-slug')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateData)
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Article not found');
    });

    it('should return 401 when no authentication token provided', async () => {
      const updateData = {
        title: 'Updated Article No Auth',
        content: '<p>This should fail without auth</p>'
      };

      const response = await request(app)
        .put(`/api/articles/${testArticle.slug}`)
        .send(updateData)
        .expect(401);

      expect(response.body).toHaveProperty('message', 'Access token required.');
    });

    it('should return 400 when slug already exists', async () => {
      // Create another article to test duplicate slug
      const anotherArticleData = {
        title: 'Another Test Article',
        content: '<p>Another article content</p>',
        slug: 'another-test-article'
      };

      const anotherResponse = await request(app)
        .post('/api/articles')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(anotherArticleData);

      createdArticleIds.push(anotherResponse.body.data.id);

      // Try to update first article with the slug of the second article
      const updateData = {
        title: 'Updated Article Duplicate Slug',
        content: '<p>Updated content</p>',
        slug: 'another-test-article'
      };

      const response = await request(app)
        .put(`/api/articles/${testArticle.slug}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateData)
        .expect(409);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Article with this slug already exists');
    });

    it('should update article with only content provided', async () => {
      const updateData = {
        content: '<p>Content without title</p>'
      };

      const response = await request(app)
        .put(`/api/articles/${testArticle.slug}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('content', updateData.content);
      expect(response.body.data).toHaveProperty('title', 'Test Article for Update'); // Original title should remain
    });

    it('should update article with only title provided', async () => {
      const updateData = {
        title: 'Title without content'
      };

      const response = await request(app)
        .put(`/api/articles/${testArticle.slug}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('title', updateData.title);
      expect(response.body.data).toHaveProperty('content', '<p>Original content for update test</p>'); // Original content should remain
    });

    it('should return 400 when title exceeds maximum length', async () => {
      const updateData = {
        title: 'A'.repeat(256), // Exceeds 255 character limit
        content: '<p>Valid content</p>'
      };

      const response = await request(app)
        .put(`/api/articles/${testArticle.slug}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateData)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 400 when slug format is invalid', async () => {
      const updateData = {
        title: 'Updated Article Invalid Slug',
        content: '<p>Content with invalid slug</p>',
        slug: 'Invalid Slug With Spaces!'
      };

      const response = await request(app)
        .put(`/api/articles/${testArticle.slug}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateData)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 400 when status is invalid', async () => {
      const updateData = {
        title: 'Updated Article Invalid Status',
        content: '<p>Content with invalid status</p>',
        status: 'invalid_status'
      };

      const response = await request(app)
        .put(`/api/articles/${testArticle.slug}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateData)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 400 when no fields are provided for update', async () => {
      const updateData = {};

      const response = await request(app)
        .put(`/api/articles/${testArticle.slug}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateData)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Validation failed');
    });
  });
});