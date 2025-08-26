// [article.test.ts]: Article integration tests
import request from 'supertest';
import { app } from '../src/app';
import { PrismaClient } from '@prisma/client';
import { closeRedisConnection } from '../src/services/auth.service';
import * as articleService from '../src/services/article.service';

const prisma = new PrismaClient();

describe('GET /api/articles/:slug', () => {
  let publishedArticleSlug: string;
  let draftArticleSlug: string;

  beforeAll(async () => {
    // Clean up any existing test data
    await prisma.article.deleteMany({
      where: {
        slug: {
          in: ['test-published-article-detail', 'test-draft-article-detail']
        }
      }
    });

    // Create a published article for testing
    const publishedArticle = await prisma.article.create({
      data: {
        title: 'Test Published Article Detail',
        slug: 'test-published-article-detail',
        content: 'This is a published article for detail testing.',
        status: 'published',
        published_at: new Date('2024-01-15')
      }
    });
    publishedArticleSlug = publishedArticle.slug;

    // Create a draft article for testing
    const draftArticle = await prisma.article.create({
      data: {
        title: 'Test Draft Article Detail',
        slug: 'test-draft-article-detail',
        content: 'This is a draft article for detail testing.',
        status: 'draft',
        published_at: null
      }
    });
    draftArticleSlug = draftArticle.slug;
  });

  afterAll(async () => {
    // Clean up test data
    await prisma.article.deleteMany({
      where: {
        slug: {
          in: [publishedArticleSlug, draftArticleSlug]
        }
      }
    });
  });

  it('should return published article details when slug exists', async () => {
    const response = await request(app)
      .get(`/api/articles/${publishedArticleSlug}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('id');
    expect(response.body.data).toHaveProperty('title', 'Test Published Article Detail');
    expect(response.body.data).toHaveProperty('slug', publishedArticleSlug);
    expect(response.body.data).toHaveProperty('content', 'This is a published article for detail testing.');
    expect(response.body.data).toHaveProperty('status', 'published');
    expect(response.body.data).toHaveProperty('published_at');
    expect(response.body.data).toHaveProperty('createdAt');
    expect(response.body.data).toHaveProperty('updatedAt');
    expect(response.body.data.published_at).not.toBeNull();
  });

  it('should return 404 when trying to access draft article', async () => {
    const response = await request(app)
      .get(`/api/articles/${draftArticleSlug}`)
      .expect(404);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Article not found.');
  });

  it('should return 404 when article slug does not exist', async () => {
    const response = await request(app)
      .get('/api/articles/non-existent-article-slug')
      .expect(404);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Article not found.');
  });

  it('should return 404 when slug parameter is invalid', async () => {
    const response = await request(app)
      .get('/api/articles/invalid-slug-that-does-not-exist')
      .expect(404);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Article not found.');
  });

  it('should handle special characters in slug gracefully', async () => {
    const response = await request(app)
      .get('/api/articles/article-with-special-chars-@#$%')
      .expect(404);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Article not found.');
  });
});

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

describe('Article Service Unit Tests', () => {
  const { findOneBySlug } = require('../src/services/article.service');
  let testArticleSlug: string;

  beforeAll(async () => {
    // Clean up any existing test data
    await prisma.article.deleteMany({
      where: {
        OR: [
          { slug: 'test-service-unit-article' },
          { slug: 'deleted-article-unit-test' }
        ]
      }
    });

    // Create a test article for service unit tests
    const testArticle = await prisma.article.create({
      data: {
        title: 'Test Service Unit Article',
        slug: 'test-service-unit-article',
        content: 'This is a test article for service unit testing.',
        status: 'published',
        published_at: new Date('2024-01-20')
      }
    });
    testArticleSlug = testArticle.slug;
  });

  afterAll(async () => {
    // Clean up test data
    await prisma.article.deleteMany({
      where: {
        OR: [
          { slug: testArticleSlug },
          { slug: 'deleted-article-unit-test' }
        ]
      }
    });
  });

  describe('findOneBySlug', () => {
    it('should return published article when slug exists', async () => {
      const article = await findOneBySlug(testArticleSlug);
      
      expect(article).not.toBeNull();
      expect(article).toHaveProperty('id');
      expect(article).toHaveProperty('title', 'Test Service Unit Article');
      expect(article).toHaveProperty('slug', testArticleSlug);
      expect(article).toHaveProperty('content', 'This is a test article for service unit testing.');
      expect(article).toHaveProperty('status', 'published');
      expect(article).toHaveProperty('published_at');
      expect(article).toHaveProperty('createdAt');
      expect(article).toHaveProperty('updatedAt');
      expect(article.published_at).not.toBeNull();
    });

    it('should return null when article slug does not exist', async () => {
      const article = await findOneBySlug('non-existent-slug');
      expect(article).toBeNull();
    });

    it('should return null when article exists but is draft', async () => {
      // Create a draft article for this test
      const draftArticle = await prisma.article.create({
        data: {
          title: 'Draft Article for Unit Test',
          slug: 'draft-article-unit-test',
          content: 'This is a draft article.',
          status: 'draft',
          published_at: null
        }
      });

      const article = await findOneBySlug(draftArticle.slug);
      expect(article).toBeNull();

      // Clean up
      await prisma.article.delete({
        where: { slug: draftArticle.slug }
      });
    });

    it('should return null when article exists but is soft deleted', async () => {
      // Create a soft deleted article for this test
      const deletedArticle = await prisma.article.create({
        data: {
          title: 'Deleted Article for Unit Test',
          slug: 'deleted-article-unit-test',
          content: 'This is a deleted article.',
          status: 'published',
          published_at: new Date(),
          deleted_at: new Date()
        }
      });

      const article = await findOneBySlug(deletedArticle.slug);
      expect(article).toBeNull();

      // Clean up
      await prisma.article.delete({
        where: { slug: deletedArticle.slug }
      });
    });

    it('should handle empty string slug gracefully', async () => {
      const article = await findOneBySlug('');
      expect(article).toBeNull();
    });

    it('should handle special characters in slug', async () => {
       const article = await findOneBySlug('article-with-special-chars-@#$%');
       expect(article).toBeNull();
     });
   });
 });

describe('Update Article Service Unit Tests', () => {
  let testArticleSlug: string;
  let testArticleId: string;

  beforeAll(async () => {
    // Clean up any existing test data
    await prisma.article.deleteMany({
      where: {
        slug: {
          in: ['test-update-article', 'updated-slug-test', 'existing-slug-for-update']
        }
      }
    });

    // Create a test article for update tests
    const testArticle = await prisma.article.create({
      data: {
        title: 'Test Update Article',
        slug: 'test-update-article',
        content: '<p>Original content</p>',
        status: 'draft',
        published_at: null
      }
    });
    testArticleSlug = testArticle.slug;
    testArticleId = testArticle.id;
  });

  afterAll(async () => {
    // Clean up test data
    await prisma.article.deleteMany({
      where: {
        slug: {
          in: ['test-update-article', 'updated-slug-test', 'existing-slug-for-update']
        }
      }
    });
  });

  describe('updateBySlug', () => {
    it('should update article title successfully', async () => {
      const updateData = {
        title: 'Updated Article Title'
      };

      const updatedArticle = await articleService.updateBySlug(testArticleSlug, updateData);

      expect(updatedArticle).toHaveProperty('id', testArticleId);
      expect(updatedArticle.title).toBe('Updated Article Title');
      expect(updatedArticle.slug).toBe('updated-article-title');
      expect(updatedArticle.content).toBe('<p>Original content</p>');
      expect(updatedArticle.status).toBe('draft');
      
      // Reset for subsequent tests
      await articleService.updateBySlug('updated-article-title', { 
        title: 'Test Update Article',
        slug: 'test-update-article'
      });
    });

    it('should update article content with HTML sanitization', async () => {
      const updateData = {
        content: '<p>Updated content</p><script>alert("xss")</script>'
      };

      const updatedArticle = await articleService.updateBySlug(testArticleSlug, updateData);

      expect(updatedArticle.content).toContain('<p>Updated content</p>');
      expect(updatedArticle.content).not.toContain('<script>');
      expect(updatedArticle.content).not.toContain('alert');
      
      // Reset for subsequent tests
      await articleService.updateBySlug(testArticleSlug, { 
        content: '<p>Original content</p>'
      });
    });

    it('should update article status from draft to published', async () => {
      const updateData = {
        status: 'published' as const
      };

      const updatedArticle = await articleService.updateBySlug(testArticleSlug, updateData);

      expect(updatedArticle.status).toBe('published');
      expect(updatedArticle.published_at).not.toBeNull();
      expect(updatedArticle.published_at).toBeInstanceOf(Date);
    });

    it('should update article status from published to draft', async () => {
      const updateData = {
        status: 'draft' as const
      };

      const updatedArticle = await articleService.updateBySlug(testArticleSlug, updateData);

      expect(updatedArticle.status).toBe('draft');
      expect(updatedArticle.published_at).toBeNull();
      
      // Reset for subsequent tests
      await articleService.updateBySlug(testArticleSlug, { 
        status: 'draft' as const
      });
    });

    it('should update custom slug successfully', async () => {
      const updateData = {
        slug: 'updated-slug-test'
      };

      const updatedArticle = await articleService.updateBySlug(testArticleSlug, updateData);

      expect(updatedArticle.slug).toBe('updated-slug-test');
      
      // Reset the slug back to original for subsequent tests
      await articleService.updateBySlug('updated-slug-test', { slug: 'test-update-article' });
    });

    it('should update multiple fields simultaneously', async () => {
      const updateData = {
        title: 'Multi Update Test',
        content: '<p>Multi update content</p>',
        status: 'published' as const
      };

      const updatedArticle = await articleService.updateBySlug(testArticleSlug, updateData);

      expect(updatedArticle.title).toBe('Multi Update Test');
      expect(updatedArticle.slug).toBe('multi-update-test');
      expect(updatedArticle.content).toBe('<p>Multi update content</p>');
      expect(updatedArticle.status).toBe('published');
      expect(updatedArticle.published_at).not.toBeNull();
      
      // Reset for subsequent tests
      await articleService.updateBySlug('multi-update-test', { 
        title: 'Test Update Article',
        content: '<p>Original content</p>',
        status: 'draft' as const,
        slug: 'test-update-article'
      });
    });

    it('should throw error when article not found', async () => {
      const updateData = {
        title: 'Non-existent Article'
      };

      await expect(articleService.updateBySlug('non-existent-slug', updateData))
        .rejects.toThrow('Article not found');
    });

    it('should throw error when slug already exists', async () => {
      // Create another article with existing slug
      const existingArticle = await prisma.article.create({
        data: {
          title: 'Existing Slug Article',
          slug: 'existing-slug-for-update',
          content: '<p>Existing content</p>',
          status: 'draft'
        }
      });

      const updateData = {
        slug: 'existing-slug-for-update'
      };

      await expect(articleService.updateBySlug(testArticleSlug, updateData))
        .rejects.toThrow('Article with this slug already exists');

      // Clean up
      await prisma.article.delete({
        where: { id: existingArticle.id }
      });
    });

    it('should throw error when no fields provided', async () => {
      const updateData = {};

      await expect(articleService.updateBySlug(testArticleSlug, updateData))
        .rejects.toThrow('At least one field must be provided for update');
    });

    it('should throw error when trying to update soft-deleted article', async () => {
      // Clean up any existing articles with this slug
      await prisma.article.deleteMany({
        where: { slug: 'deleted-article-update-test' }
      });
      
      // Create and soft delete an article
      const deletedArticle = await prisma.article.create({
        data: {
          title: 'Deleted Article',
          slug: 'deleted-article-update-test',
          content: '<p>Deleted content</p>',
          status: 'published',
          deleted_at: new Date()
        }
      });

      const updateData = {
        title: 'Updated Deleted Article'
      };

      await expect(articleService.updateBySlug(deletedArticle.slug, updateData))
        .rejects.toThrow('Article not found');

      // Clean up
      await prisma.article.delete({
        where: { id: deletedArticle.id }
      });
    });

    it('should handle empty string values gracefully', async () => {
      const updateData = {
        title: '   ',
        content: ''
      };

      await expect(articleService.updateBySlug(testArticleSlug, updateData))
        .rejects.toThrow('Title cannot be empty');
    });

    it('should trim whitespace from title', async () => {
      // Clean up any existing articles with the target slug
      await prisma.article.deleteMany({
        where: { slug: 'trimmed-title' }
      });
      
      const updateData = {
        title: '  Trimmed Title  '
      };

      const updatedArticle = await articleService.updateBySlug(testArticleSlug, updateData);

      expect(updatedArticle.title).toBe('Trimmed Title');
      expect(updatedArticle.slug).toBe('trimmed-title');
      
      // Reset the article back to original state for subsequent tests
      await articleService.updateBySlug(updatedArticle.slug, {
        title: 'Test Update Article',
        slug: testArticleSlug
      });
    });

    it('should handle special characters in title for slug generation', async () => {
      // Clean up any existing articles with similar slugs
      await prisma.article.deleteMany({
        where: { 
          slug: {
            startsWith: 'special-dollarpercent-characters-and-symbols'
          }
        }
      });
      
      const updateData = {
        title: 'Special @#$% Characters & Symbols!'
      };

      const updatedArticle = await articleService.updateBySlug(testArticleSlug, updateData);

      expect(updatedArticle.title).toBe('Special @#$% Characters & Symbols!');
      expect(updatedArticle.slug).toMatch(/^special-dollarpercent-characters-and-symbols/);
      
      // Reset the article back to original state for subsequent tests
      await articleService.updateBySlug(updatedArticle.slug, {
        title: 'Test Update Article',
        slug: testArticleSlug
      });
    });
  });
});

describe('Create Article Service Unit Tests', () => {
  const { createArticle } = require('../src/services/article.service');
  let createdArticleIds: string[] = [];

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
  });

  describe('createArticle', () => {
    it('should create article with auto-generated slug', async () => {
      const articleData = {
        title: 'Test Article Title',
        content: '<p>This is test content</p>',
        status: 'draft' as const
      };

      const article = await createArticle(articleData);
      createdArticleIds.push(article.id);

      expect(article).toHaveProperty('id');
      expect(article.title).toBe('Test Article Title');
      expect(article.slug).toBe('test-article-title');
      expect(article.content).toBe('<p>This is test content</p>');
      expect(article.status).toBe('draft');
      expect(article.published_at).toBeNull();
    });

    it('should create published article with published_at date', async () => {
      const articleData = {
        title: 'Published Test Article',
        content: '<p>Published content</p>',
        status: 'published' as const
      };

      const article = await createArticle(articleData);
      createdArticleIds.push(article.id);

      expect(article.status).toBe('published');
      expect(article.published_at).not.toBeNull();
      expect(article.published_at).toBeInstanceOf(Date);
    });

    it('should use provided slug when given', async () => {
      const articleData = {
        title: 'Custom Slug Article',
        content: '<p>Content with custom slug</p>',
        slug: 'my-custom-slug'
      };

      const article = await createArticle(articleData);
      createdArticleIds.push(article.id);

      expect(article.slug).toBe('my-custom-slug');
    });

    it('should handle duplicate slug by adding timestamp', async () => {
      const articleData1 = {
        title: 'Duplicate Title',
        content: '<p>First article</p>'
      };

      const articleData2 = {
        title: 'Duplicate Title',
        content: '<p>Second article</p>'
      };

      const article1 = await createArticle(articleData1);
      createdArticleIds.push(article1.id);
 
      const article2 = await createArticle(articleData2);
      createdArticleIds.push(article2.id);

      expect(article1.slug).toBe('duplicate-title');
      expect(article2.slug).toMatch(/^duplicate-title-\d+$/);
      expect(article1.slug).not.toBe(article2.slug);
    });

    it('should sanitize HTML content', async () => {
      const articleData = {
        title: 'HTML Sanitization Test',
        content: '<p>Safe content</p><script>alert("xss")</script><img src="x" onerror="alert(1)">'
      };

      const article = await createArticle(articleData);
      createdArticleIds.push(article.id);

      expect(article.content).toContain('<p>Safe content</p>');
      expect(article.content).not.toContain('<script>');
      expect(article.content).not.toContain('onerror');
    });

    it('should handle empty title gracefully', async () => {
      const articleData = {
        title: '',
        content: '<p>Test content</p>'
      };

      await expect(createArticle(articleData)).rejects.toThrow();
    });

    it('should handle empty content gracefully', async () => {
      const articleData = {
        title: 'Test Title',
        content: ''
      };

      const article = await createArticle(articleData);
      createdArticleIds.push(article.id);
      
      expect(article.content).toBe('');
    });
   });
 });