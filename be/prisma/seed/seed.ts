// [seed.ts]: Database seed script
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create or update admin user
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {
      password: hashedPassword,
      name: 'Admin User',
      role: 'admin',
    },
    create: {
      email: 'admin@example.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'admin',
    },
  });

  // Create or update editor user
  await prisma.user.upsert({
    where: { email: 'editor@example.com' },
    update: {
      password: hashedPassword,
      name: 'Editor User',
      role: 'editor',
    },
    create: {
      email: 'editor@example.com',
      password: hashedPassword,
      name: 'Editor User',
      role: 'editor',
    },
  });

  // Create or update test articles
  await prisma.article.upsert({
    where: { slug: 'test-article-1' },
    update: {
      title: 'Test Article 1',
      content: 'This is a test article content.',
      status: 'published',
      published_at: new Date(),
    },
    create: {
      title: 'Test Article 1',
      slug: 'test-article-1',
      content: 'This is a test article content.',
      status: 'published',
      published_at: new Date(),
    },
  });

  await prisma.article.upsert({
    where: { slug: 'test-article-2' },
    update: {
      title: 'Test Article 2',
      content: 'This is another test article content.',
      status: 'draft',
    },
    create: {
      title: 'Test Article 2',
      slug: 'test-article-2',
      content: 'This is another test article content.',
      status: 'draft',
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
