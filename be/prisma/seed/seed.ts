// [seed.ts]: Database seed script with comprehensive fake data
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create admin users
  console.log('👤 Creating admin users...');
  const hashedPassword = await bcrypt.hash('admin123', 12);
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@elshadaifm.com' },
    update: {},
    create: {
      email: 'admin@elshadaifm.com',
      password: hashedPassword,
      name: 'Administrator',
      role: 'admin',
    },
  });

  const moderatorUser = await prisma.user.upsert({
    where: { email: 'moderator@elshadaifm.com' },
    update: {},
    create: {
      email: 'moderator@elshadaifm.com',
      password: hashedPassword,
      name: 'Moderator',
      role: 'moderator',
    },
  });

  const editorUser = await prisma.user.upsert({
    where: { email: 'editor@elshadaifm.com' },
    update: {},
    create: {
      email: 'editor@elshadaifm.com',
      password: hashedPassword,
      name: 'Editor',
      role: 'editor',
    },
  });

  const penyiarUser = await prisma.user.upsert({
    where: { email: 'penyiar@elshadaifm.com' },
    update: {},
    create: {
      email: 'penyiar@elshadaifm.com',
      password: hashedPassword,
      name: 'Penyiar',
      role: 'penyiar',
    },
  });

  console.log(`✅ Created admin user: ${adminUser.email}`);
  console.log(`✅ Created moderator user: ${moderatorUser.email}`);
  console.log(`✅ Created editor user: ${editorUser.email}`);
  console.log(`✅ Created penyiar user: ${penyiarUser.email}`);

  // Create radio programs
  console.log('📻 Creating radio programs...');
  const programs = [
    {
      name: 'Morning Glory',
      description: 'Program pagi yang memberkati dengan lagu-lagu rohani dan renungan firman Tuhan',
    },
    {
      name: 'Gospel Hour',
      description: 'Satu jam penuh dengan lagu-lagu gospel terbaru dan klasik',
    },
    {
      name: 'Prayer Time',
      description: 'Waktu khusus untuk berdoa bersama dan meminta doa',
    },
    {
      name: 'Youth Spirit',
      description: 'Program khusus untuk kaum muda dengan musik kontemporer Kristen',
    },
    {
      name: 'Evening Worship',
      description: 'Program malam dengan pujian dan penyembahan yang khidmat',
    },
  ];

  const createdPrograms = [];
  for (const program of programs) {
    const existingProgram = await prisma.program.findFirst({
      where: { name: program.name }
    });
    
    let createdProgram;
    if (existingProgram) {
      createdProgram = await prisma.program.update({
        where: { id: existingProgram.id },
        data: program,
      });
    } else {
      createdProgram = await prisma.program.create({
        data: program,
      });
    }
    createdPrograms.push(createdProgram);
  }

  // Create schedules for each program
  console.log('📅 Creating program schedules...');
  if (createdPrograms.length < 5) {
    console.error('Not enough programs created');
    return;
  }

  const scheduleData = [
    // Morning Glory - Every Monday to Friday 06:00-08:00
    { programId: createdPrograms[0]!.id, dayOfWeek: 1, startTime: '06:00', endTime: '08:00' },
    { programId: createdPrograms[0]!.id, dayOfWeek: 2, startTime: '06:00', endTime: '08:00' },
    { programId: createdPrograms[0]!.id, dayOfWeek: 3, startTime: '06:00', endTime: '08:00' },
    { programId: createdPrograms[0]!.id, dayOfWeek: 4, startTime: '06:00', endTime: '08:00' },
    { programId: createdPrograms[0]!.id, dayOfWeek: 5, startTime: '06:00', endTime: '08:00' },
    
    // Gospel Hour - Every Sunday 10:00-11:00
    { programId: createdPrograms[1]!.id, dayOfWeek: 0, startTime: '10:00', endTime: '11:00' },
    
    // Prayer Time - Every Tuesday and Thursday 19:00-20:00
    { programId: createdPrograms[2]!.id, dayOfWeek: 2, startTime: '19:00', endTime: '20:00' },
    { programId: createdPrograms[2]!.id, dayOfWeek: 4, startTime: '19:00', endTime: '20:00' },
    
    // Youth Spirit - Every Saturday 16:00-18:00
    { programId: createdPrograms[3]!.id, dayOfWeek: 6, startTime: '16:00', endTime: '18:00' },
    
    // Evening Worship - Every Sunday 18:00-19:00
    { programId: createdPrograms[4]!.id, dayOfWeek: 0, startTime: '18:00', endTime: '19:00' },
  ];

  for (const schedule of scheduleData) {
    await prisma.schedule.create({
      data: schedule,
    });
  }

  // Create articles
  console.log('📝 Creating articles...');
  const articles = [
    {
      title: 'Kekuatan Doa dalam Kehidupan Sehari-hari',
      slug: 'kekuatan-doa-dalam-kehidupan-sehari-hari',
      content: `Doa adalah nafas kehidupan orang percaya. Melalui doa, kita dapat berkomunikasi langsung dengan Allah yang Maha Kuasa. Dalam Filipi 4:6-7 tertulis: "Janganlah hendaknya kamu kuatir tentang apapun juga, tetapi nyatakanlah dalam segala hal keinginanmu kepada Allah dalam doa dan permohonan dengan ucapan syukur. Damai sejahtera Allah, yang melampaui segala akal, akan memelihara hati dan pikiranmu dalam Kristus Yesus."

Doa bukan hanya sekedar ritual, tetapi merupakan hubungan yang hidup antara kita dan Allah. Ketika kita berdoa, kita mengakui ketergantungan kita kepada-Nya dan menyerahkan segala kekhawatiran kita ke dalam tangan-Nya yang penuh kasih.

Mari kita jadikan doa sebagai prioritas utama dalam hidup kita setiap hari.`,
      status: 'published',
      published_at: new Date('2024-01-15'),
    },
    {
      title: 'Mengapa Musik Rohani Penting bagi Jiwa',
      slug: 'mengapa-musik-rohani-penting-bagi-jiwa',
      content: `Musik rohani memiliki kekuatan luar biasa untuk menyentuh hati dan jiwa manusia. Sejak zaman Daud, musik telah menjadi sarana untuk memuji dan menyembah Allah. Dalam Mazmur 100:1-2 tertulis: "Bersorak-sorailah bagi TUHAN, hai seluruh bumi! Beribadahlah kepada TUHAN dengan sukacita, datanglah ke hadapan-Nya dengan sorak-sorai!"

Musik rohani tidak hanya menghibur telinga, tetapi juga:
- Mengangkat jiwa kita kepada Allah
- Memberikan penghiburan di saat susah
- Memperkuat iman dan pengharapan
- Menyatukan hati jemaat dalam penyembahan

Radio El Shaddai FM hadir untuk membawa berkat melalui musik-musik rohani yang mendidik dan membangun iman.`,
      status: 'published',
      published_at: new Date('2024-01-20'),
    },
    {
      title: 'Pentingnya Persekutuan dalam Kehidupan Beriman',
      slug: 'pentingnya-persekutuan-dalam-kehidupan-beriman',
      content: `Hidup beriman tidak dapat dijalani sendirian. Allah menciptakan kita untuk hidup dalam komunitas dan saling menguatkan satu sama lain. Dalam Ibrani 10:24-25 tertulis: "Dan marilah kita saling memperhatikan supaya kita saling mendorong dalam kasih dan dalam pekerjaan baik. Janganlah kita menjauhkan diri dari pertemuan-pertemuan ibadah kita, seperti yang biasa dilakukan oleh beberapa orang, tetapi marilah kita saling menasihati, dan semakin giat melakukannya menjelang hari Tuhan yang mendekat."

Melalui persekutuan, kita dapat:
- Saling mendoakan dan mendukung
- Belajar dari pengalaman orang lain
- Bertumbuh dalam pengenalan akan Allah
- Melayani bersama-sama

Mari aktif dalam persekutuan dan menjadi berkat bagi sesama.`,
      status: 'published',
      published_at: new Date('2024-01-25'),
    },
    {
      title: 'Menghadapi Tantangan Hidup dengan Iman',
      slug: 'menghadapi-tantangan-hidup-dengan-iman',
      content: `Setiap orang pasti menghadapi tantangan dalam hidupnya. Namun sebagai orang percaya, kita memiliki senjata yang ampuh yaitu iman kepada Yesus Kristus. Dalam Roma 8:28 tertulis: "Kita tahu sekarang, bahwa Allah turut bekerja dalam segala sesuatu untuk mendatangkan kebaikan bagi mereka yang mengasihi Dia, yaitu bagi mereka yang terpanggil sesuai dengan rencana Allah."

Tantangan hidup dapat berupa:
- Masalah keuangan
- Penyakit
- Konflik dalam keluarga
- Tekanan pekerjaan

Namun dengan iman, kita dapat melihat bahwa Allah mengizinkan semuanya terjadi untuk kebaikan kita dan untuk kemuliaan nama-Nya.`,
      status: 'draft',
    },
    {
      title: 'Peran Keluarga Kristen di Era Modern',
      slug: 'peran-keluarga-kristen-di-era-modern',
      content: `Keluarga adalah institusi pertama yang Allah ciptakan. Dalam era modern yang penuh tantangan, keluarga Kristen memiliki peran penting sebagai benteng terakhir nilai-nilai Kristiani. Efesus 6:4 mengatakan: "Dan kamu, bapa-bapa, janganlah bangkitkan amarah di dalam hati anak-anakmu, tetapi didiklah mereka di dalam ajaran dan nasihat Tuhan."

Keluarga Kristen harus menjadi:
- Tempat pertama anak-anak mengenal Allah
- Contoh hidup yang mencerminkan kasih Kristus
- Benteng dari pengaruh dunia yang negatif
- Sumber doa dan dukungan bagi setiap anggota keluarga

Mari kita bangun keluarga yang takut akan Tuhan dan menjadi berkat bagi generasi mendatang.`,
      status: 'published',
      published_at: new Date('2024-02-01'),
    },
  ];

  for (const article of articles) {
    await prisma.article.upsert({
      where: { slug: article.slug },
      update: article,
      create: article,
    });
  }

  // Create static pages
  console.log('📄 Creating static pages...');
  const pages = [
    {
      title: 'Tentang Kami',
      slug: 'tentang-kami',
      content: `Radio El Shaddai FM adalah stasiun radio Kristen yang didedikasikan untuk menyebarkan Kabar Baik melalui musik rohani, program-program yang membangun iman, dan pelayanan yang mengasihi.

Visi Kami:
Menjadi berkat bagi jutaan jiwa di Indonesia melalui siaran radio yang berkualitas dan pelayanan yang tulus.

Misi Kami:
- Menyebarkan Injil Yesus Kristus melalui media radio
- Memberikan hiburan yang sehat dan membangun
- Melayani masyarakat dengan kasih dan kerendahan hati
- Membangun komunitas Kristen yang solid

Sejak berdiri pada tahun 2010, Radio El Shaddai FM telah melayani ribuan pendengar di seluruh Indonesia dengan berbagai program yang bervariatif dan bermutu.`,
      status: 'published',
    },
    {
      title: 'Kontak',
      slug: 'kontak',
      content: `Hubungi Kami

Alamat Studio:
Jl. Kasih Karunia No. 123
Jakarta Pusat 10110
Indonesia

Telepon Studio: (021) 1234-5678
WhatsApp: +62 812-3456-7890
Email: info@elshadaifm.com

Jam Operasional:
Senin - Jumat: 05:00 - 24:00 WIB
Sabtu - Minggu: 06:00 - 24:00 WIB

Untuk kerjasama, iklan, atau sponsorship:
Email: kerjasama@elshadaifm.com
Telepon: (021) 1234-5679

Untuk permintaan doa:
WhatsApp: +62 812-3456-7891
Email: doa@elshadaifm.com`,
      status: 'published',
    },
  ];

  for (const page of pages) {
    await prisma.page.upsert({
      where: { slug: page.slug },
      update: page,
      create: page,
    });
  }

  // Create guest users and sessions for live chat
  console.log('👥 Creating guest users and chat sessions...');
  const guestUsers = [
    { name: 'John Doe', city: 'Jakarta', country: 'Indonesia' },
    { name: 'Maria Santos', city: 'Surabaya', country: 'Indonesia' },
    { name: 'David Chen', city: 'Medan', country: 'Indonesia' },
    { name: 'Sarah Johnson', city: 'Bandung', country: 'Indonesia' },
    { name: 'Michael Brown', city: 'Makassar', country: 'Indonesia' },
  ];

  const createdGuests = [];
  for (const guest of guestUsers) {
    const createdGuest = await prisma.guestUser.create({
      data: guest,
    });
    createdGuests.push(createdGuest);

    // Create active session for each guest
    await prisma.session.create({
      data: {
        guestUserId: createdGuest.id,
        isActive: true,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Expires in 24 hours
      },
    });
  }

  // Create prayer requests
  console.log('🙏 Creating prayer requests...');
  const prayerRequests = [
    {
      name: 'Budi Santoso',
      contact: '081234567890',
      content: 'Mohon didoakan untuk kesembuhan ibu saya yang sedang sakit kanker. Kiranya Tuhan memberikan mujizat kesembuhan.',
      isAnonymous: false,
    },
    {
      name: 'Anonymous',
      contact: 'anonymous@gmail.com',
      content: 'Doakan saya yang sedang mencari pekerjaan. Sudah 6 bulan menganggur dan butuh pekerjaan untuk menghidupi keluarga.',
      isAnonymous: true,
    },
    {
      name: 'Siti Rahma',
      contact: '087654321098',
      content: 'Mohon doa untuk pernikahan saya yang sedang mengalami masalah. Kiranya Tuhan memulihkan hubungan kami.',
      isAnonymous: false,
    },
    {
      name: 'Denny Pratama',
      contact: '089876543210',
      content: 'Doakan anak saya yang akan mengikuti ujian masuk universitas. Kiranya diberi hikmat dan kemampuan.',
      isAnonymous: false,
    },
  ];

  for (const request of prayerRequests) {
    await prisma.prayerRequest.create({
      data: {
        ...request,
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random time in last 30 days
      },
    });
  }

  // Create song requests
  console.log('🎵 Creating song requests...');
  const songRequests = [
    {
      name: 'Lisa Wijaya',
      city: 'Jakarta',
      songTitle: 'Amazing Grace',
      message: 'Lagu ini selalu menguatkan iman saya di saat sulit.',
    },
    {
      name: 'Robert Hutapea',
      city: 'Medan',
      songTitle: 'How Great Thou Art',
      message: 'Request untuk program evening worship malam ini.',
    },
    {
      name: 'Grace Angelina',
      city: 'Surabaya',
      songTitle: 'Yesus Kekasihku',
      message: 'Lagu kesukaan almarhum mama. Mohon diputar untuk mengenangnya.',
    },
    {
      name: 'Tommy Sinaga',
      city: 'Batam',
      songTitle: 'What a Friend We Have in Jesus',
      message: 'Terima kasih untuk semua program yang memberkati!',
    },
    {
      name: 'Indah Permata',
      city: 'Yogyakarta',
      songTitle: 'Kubersyukur',
      message: 'Lagu ini mengingatkan saya untuk selalu bersyukur dalam segala situasi.',
    },
  ];

  for (const request of songRequests) {
    await prisma.songRequest.create({
      data: {
        ...request,
        createdAt: new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000), // Random time in last 15 days
      },
    });
  }

  // Create testimonials
  console.log('✝️ Creating testimonials...');
  const testimonials = [
    {
      name: 'Agus Setiawan',
      email: 'agus.setiawan@gmail.com',
      city: 'Jakarta',
      title: 'Radio El Shaddai Mengubah Hidup Saya',
      content: 'Dulu saya adalah seorang pecandu narkoba. Namun melalui program-program di Radio El Shaddai, saya mulai mengenal Yesus lebih dalam. Sekarang hidup saya sudah berubah total. Saya sudah bersih dari narkoba dan melayani Tuhan di gereja. Terima kasih Radio El Shaddai!',
      status: 'approved',
    },
    {
      name: 'Maria Sinaga',
      email: 'maria.sinaga@yahoo.com',
      city: 'Medan',
      title: 'Kekuatan Doa Bersama',
      content: 'Ketika suami saya sakit keras, saya menelepon Radio El Shaddai untuk meminta doa. Tim doa di radio ini sangat luar biasa. Mereka tidak hanya mendoakan, tapi juga memberikan dukungan moral. Puji Tuhan, suami saya sekarang sudah sembuh total!',
      status: 'approved',
    },
    {
      name: 'David Chandra',
      email: 'david.chandra@gmail.com',
      city: 'Surabaya',
      title: 'Program Youth Spirit Memberkati Generasi Muda',
      content: 'Sebagai pemuda, saya merasa program Youth Spirit sangat sesuai dengan kebutuhan rohani kaum muda zaman sekarang. Musik-musiknya keren dan pesannya juga dalam. Teman-teman saya juga suka mendengarkan program ini.',
      status: 'approved',
    },
    {
      name: 'Ruth Manurung',
      email: 'ruth.manurung@gmail.com',
      city: 'Balikpapan',
      title: 'Morning Glory Memulai Hari dengan Berkat',
      content: 'Setiap pagi saya selalu mendengarkan program Morning Glory sambil berangkat kerja. Program ini membantu saya memulai hari dengan semangat dan hati yang damai. Renungan-renungannya selalu tepat sasaran dan menguatkan iman.',
      status: 'pending',
    },
    {
      name: 'Samuel Hutabarat',
      email: 'samuel.hutabarat@gmail.com',
      city: 'Pekanbaru',
      title: 'Radio yang Benar-benar Melayani',
      content: 'Yang saya suka dari Radio El Shaddai adalah hati untuk melayani yang tulus. Setiap kali saya menelepon atau mengirim pesan, selalu ditanggapi dengan penuh kasih. Ini bukan sekedar bisnis, tapi benar-benar pelayanan.',
      status: 'approved',
    },
  ];

  for (const testimonial of testimonials) {
    await prisma.testimonial.create({
      data: {
        ...testimonial,
        createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000), // Random time in last 60 days
      },
    });
  }

  console.log('✅ Database seeding completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`👤 Users: ${await prisma.user.count()}`);
  console.log(`📻 Programs: ${await prisma.program.count()}`);
  console.log(`📅 Schedules: ${await prisma.schedule.count()}`);
  console.log(`📝 Articles: ${await prisma.article.count()}`);
  console.log(`📄 Pages: ${await prisma.page.count()}`);
  console.log(`👥 Guest Users: ${await prisma.guestUser.count()}`);
  console.log(`🔗 Sessions: ${await prisma.session.count()}`);
  console.log(`🙏 Prayer Requests: ${await prisma.prayerRequest.count()}`);
  console.log(`🎵 Song Requests: ${await prisma.songRequest.count()}`);
  console.log(`✝️ Testimonials: ${await prisma.testimonial.count()}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
