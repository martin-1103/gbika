import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const renunganData = [
  {
    title: "Kasih yang Tidak Berkesudahan",
    slug: "kasih-yang-tidak-berkesudahan",
    content: `"Karena begitu besar kasih Allah akan dunia ini, sehingga Ia telah mengaruniakan Anak-Nya yang tunggal, supaya setiap orang yang percaya kepada-Nya tidak binasa, melainkan beroleh hidup yang kekal." - Yohanes 3:16

Kasih Allah kepada kita sungguh luar biasa dan tidak terbatas. Dia memberikan yang terbaik bagi kita, yaitu Yesus Kristus, Anak-Nya yang tunggal.

Dalam kehidupan sehari-hari, kadang kita merasa tidak layak menerima kasih Allah. Kita merasa terlalu banyak berbuat salah, terlalu jauh dari kesempurnaan. Namun, kasih Allah tidak bergantung pada perbuatan baik kita.

Kasih-Nya adalah kasih karunia - diberikan dengan cuma-cuma tanpa syarat. Dia mengasihi kita bukan karena kita sempurna, tetapi karena Dia adalah kasih itu sendiri.

Hari ini, izinkan kasih Allah mengalir dalam hidup Anda. Rasakan kehangatan cinta-Nya yang tidak akan pernah berubah, tidak peduli apa yang telah Anda lakukan atau belum lakukan.

Doa:
Ya Tuhan, terima kasih atas kasih-Mu yang tidak berkesudahan. Bantu kami untuk merasakan dan membagikan kasih ini kepada orang lain. Dalam nama Yesus. Amin.`,
    status: "published",
    published_at: new Date('2024-01-15'),
  },
  {
    title: "Kekuatan dalam Kelemahan",
    slug: "kekuatan-dalam-kelemahan",
    content: `"Tetapi firman-Nya kepadaku: 'Cukuplah kasih karunia-Ku bagimu, sebab justru dalam kelemahanlah kuasa-Ku menjadi sempurna.' Sebab itu terlebih suka aku bermegah atas kelemahanku, supaya kuasa Kristus turun menaungi aku." - 2 Korintus 12:9

Seringkali kita merasa malu dengan kelemahan dan kekurangan yang kita miliki. Kita berusaha menyembunyikannya dan berusaha tampak sempurna di hadapan orang lain.

Namun, Paulus mengajarkan kita sesuatu yang sangat berbeda. Dia justru bermegah atas kelemahannya karena melalui kelemahan itulah kuasa Allah menjadi nyata.

Ketika kita mengakui bahwa kita lemah dan tidak bisa mengandalkan kekuatan sendiri, maka ruang terbuka bagi Allah untuk bekerja dalam hidup kita. Kuasa-Nya menjadi sempurna justru dalam kelemahan kita.

Jangan takut untuk jujur dengan kelemahan Anda. Allah tidak mencari orang yang sempurna, tetapi orang yang mau dipakai-Nya meski dengan segala keterbatasan.

Hari ini, serahkan kelemahan Anda kepada Tuhan. Biarkan Dia menunjukkan kuasa-Nya melalui hidup Anda yang tidak sempurna.

Doa:
Tuhan, dalam kelemahan ini kami datang kepada-Mu. Nyatakan kuasa-Mu dalam hidup kami yang tidak sempurna ini. Amin.`,
    status: "published",
    published_at: new Date('2024-01-20'),
  },
  {
    title: "Damai Sejahtera di Tengah Badai",
    slug: "damai-sejahtera-di-tengah-badai",
    content: `"Damai sejahtera Kutinggalkan bagimu. Damai sejahtera-Ku Kuberikan kepadamu, dan apa yang Kuberikan tidak seperti yang diberikan oleh dunia. Janganlah gelisah hatimu dan janganlah gentar." - Yohanes 14:27

Hidup ini penuh dengan tantangan dan ujian. Ada kalanya kita menghadapi "badai" yang begitu besar hingga kita merasa takut dan cemas.

Namun Yesus menjanjikan damai sejahtera yang berbeda dari apa yang ditawarkan dunia. Damai sejahtera dari Yesus tidak bergantung pada keadaan eksternal, tetapi bersumber dari hubungan kita dengan Dia.

Damai sejahtera dunia bergantung pada kestabilan keadaan: kesehatan yang baik, keuangan yang cukup, hubungan yang harmonis. Ketika satu saja goyah, damai itu hilang.

Tetapi damai sejahtera dari Kristus berbeda. Damai ini tetap ada bahkan di tengah penderitaan, kesulitan, atau ketidakpastian. Karena damai ini bersumber dari kepastian bahwa Allah mengasihi kita dan memegang kendali atas hidup kita.

Hari ini, jika Anda sedang menghadapi "badai" dalam hidup, ingatlah janji Tuhan. Dia memberikan damai sejahtera yang melampaui akal budi manusia.

Doa:
Ya Yesus, terima kasih atas damai sejahtera yang Engkau berikan. Di tengah badai kehidupan, kami berlindung dalam damai-Mu. Amin.`,
    status: "published",
    published_at: new Date('2024-01-25'),
  },
  {
    title: "Pengharapan yang Tidak Mengecewakan",
    slug: "pengharapan-yang-tidak-mengecewakan",
    content: `"Dan pengharapan tidak mengecewakan, karena kasih Allah telah dicurahkan di dalam hati kita oleh Roh Kudus yang telah dikaruniakan kepada kita." - Roma 5:5

Di dunia ini, banyak pengharapan yang berakhir dengan kekecewaan. Janji yang tidak ditepati, impian yang pupus, rencana yang gagal. Namun ada satu pengharapan yang tidak akan pernah mengecewakan: pengharapan dalam Allah.

Pengharapan kepada Allah tidak bergantung pada kemampuan manusia yang terbatas, tetapi pada karakter Allah yang tidak berubah. Dia adalah Allah yang setia, yang selalu menepati janji-Nya.

Mungkin hari ini Anda sedang menghadapi situasi yang sulit dan merasa putus asa. Mungkin impian-impian Anda terasa begitu jauh atau tidak mungkin tercapai. Ingatlah bahwa Allah memiliki rencana yang indah bagi hidup Anda.

Pengharapan dalam Allah bukan berarti semua keinginan kita akan terkabul persis seperti yang kita mau. Tetapi pengharapan dalam Allah berarti kita percaya bahwa Dia akan memberikan yang terbaik bagi kita, sesuai dengan kehendak-Nya yang sempurna.

Kasih Allah yang telah dicurahkan dalam hati kita melalui Roh Kudus menjadi jaminan bahwa pengharapan kita tidak sia-sia.

Doa:
Bapa yang baik, kuatkan pengharapan kami kepada-Mu. Bantu kami untuk terus percaya pada rencana-Mu yang indah. Amin.`,
    status: "published",
    published_at: new Date('2024-02-01'),
  },
  {
    title: "Bersyukur dalam Segala Keadaan",
    slug: "bersyukur-dalam-segala-keadaan",
    content: `"Mengucap syukurlah dalam segala hal, sebab itulah yang dikehendaki Allah di dalam Kristus Yesus bagi kamu." - 1 Tesalonika 5:18

Bersyukur ketika segala sesuatu berjalan lancar adalah hal yang mudah. Tetapi bersyukur dalam segala keadaan, termasuk saat menghadapi kesulitan, membutuhkan iman yang kuat.

Paulus menulis ayat ini bukan dalam keadaan yang nyaman. Dia menulis surat ini dalam penjara, menghadapi berbagai penderitaan. Namun dia tetap mengajarkan untuk bersyukur dalam segala hal.

Mengapa kita harus bersyukur dalam segala keadaan? Bukan berarti kita harus senang dengan penderitaan atau berpura-pura bahwa semuanya baik-baik saja. Tetapi kita bersyukur karena kita tahu bahwa Allah bekerja dalam segala sesuatu untuk mendatangkan kebaikan bagi orang yang mengasihi Dia.

Kita bersyukur karena Allah memakai setiap pengalaman hidup kita - baik yang menyenangkan maupun yang menyakitkan - untuk membentuk karakter kita dan mendekatkan kita kepada-Nya.

Hari ini, mulailah dengan menghitung berkat-berkat yang telah Allah berikan. Bahkan dalam kesulitan, masih ada hal-hal yang bisa kita syukuri: napas yang masih berhembus, kasih keluarga, atau kesempatan untuk bertumbuh.

Doa:
Tuhan, ajari kami untuk bersyukur dalam segala keadaan. Buka mata kami untuk melihat berkat-berkat-Mu. Amin.`,
    status: "published",
    published_at: new Date('2024-02-05'),
  },
  {
    title: "Tidak Ada yang Mustahil bagi Allah",
    slug: "tidak-ada-yang-mustahil-bagi-allah",
    content: `"Karena bagi Allah tidak ada yang mustahil." - Lukas 1:37

Ketika malaikat Gabriel memberitahu Maria bahwa dia akan mengandung Anak Allah, hal itu terdengar mustahil bagi akal manusia. Seorang perawan muda dari Nazaret akan melahirkan Juruselamat dunia? Tetapi bagi Allah, tidak ada yang mustahil.

Dalam hidup kita, seringkali kita menghadapi situasi yang terlihat tidak ada jalan keluar. Masalah keuangan yang menumpuk, penyakit yang tidak kunjung sembuh, hubungan yang rusak parah, atau impian yang terasa terlalu besar untuk diraih.

Ketika kita melihat dengan mata manusia, memang banyak hal yang terlihat mustahil. Tetapi kita melayani Allah yang menciptakan alam semesta dari yang tidak ada, yang membelah Laut Merah, dan yang membangkitkan orang mati.

Allah yang sama yang melakukan mukjizat-mukjizat itu juga hadir dalam hidup kita hari ini. Dia masih bekerja dengan cara-cara yang melampaui pemahaman manusia.

Hari ini, jika ada situasi dalam hidup Anda yang terasa tidak ada harapan, ingatlah bahwa Anda melayani Allah yang tidak terbatas. Serahkan situasi yang "mustahil" itu kepada-Nya.

Percayalah bahwa Dia dapat membuat jalan di tempat yang tidak ada jalan, memberikan harapan di tengah putus asa, dan mengubah yang mustahil menjadi mungkin.

Doa:
Allah yang Mahakuasa, kami percaya bahwa tidak ada yang mustahil bagi-Mu. Kami serahkan situasi yang sulit ini kepada-Mu. Amin.`,
    status: "published",
    published_at: new Date('2024-02-10'),
  },
  {
    title: "Mengampuni Seperti Kristus",
    slug: "mengampuni-seperti-kristus",
    content: `"Dan ampunilah kami akan kesalahan kami, seperti kami juga mengampuni orang yang bersalah kepada kami." - Matius 6:12

Mengampuni adalah salah satu hal tersulit yang harus dilakukan manusia. Ketika seseorang menyakiti kita, naluri kita adalah membalas atau setidaknya menyimpan dendam.

Namun Yesus mengajarkan kita untuk mengampuni, bahkan sampai tujuh puluh kali tujuh kali. Mengapa pengampunan begitu penting? Karena tanpa pengampunan, hati kita akan dipenuhi kepahitan yang meracuni jiwa.

Mengampuni bukan berarti kita mengatakan bahwa apa yang dilakukan orang lain kepada kita itu benar. Mengampuni juga bukan berarti kita harus melupakan atau berpura-pura tidak ada yang terjadi.

Mengampuni berarti kita memilih untuk melepaskan hak kita untuk membalas dendam dan menyerahkannya kepada Allah. Mengampuni berarti kita memilih untuk tidak lagi membiarkan kepahitan menguasai hati kita.

Kristus telah mengampuni dosa-dosa kita yang tidak terhitung jumlahnya. Karena itu, kita pun dipanggil untuk mengampuni orang lain.

Hari ini, jika ada seseorang yang telah menyakiti Anda dan Anda masih menyimpan dendam, mintalah kekuatan kepada Tuhan untuk mengampuni. Pengampunan akan membebaskan bukan hanya orang yang bersalah, tetapi terutama membebaskan diri Anda sendiri.

Doa:
Ya Tuhan, seperti Engkau telah mengampuni kami, berilah kami kekuatan untuk mengampuni orang yang telah menyakiti kami. Amin.`,
    status: "published",
    published_at: new Date('2024-02-15'),
  },
  {
    title: "Terang di Tengah Kegelapan",
    slug: "terang-di-tengah-kegelapan",
    content: `"Akulah terang dunia; barangsiapa mengikut Aku, ia tidak akan berjalan dalam kegelapan, melainkan ia akan mempunyai terang hidup." - Yohanes 8:12

Dunia ini penuh dengan kegelapan: kejahatan, penderitaan, ketidakadilan, dan kematian. Di tengah kegelapan ini, mudah sekali kita merasa putus asa dan kehilangan arah.

Namun Yesus menyatakan diri sebagai terang dunia. Dia bukan hanya membawa terang, tetapi Dia adalah terang itu sendiri. Di mana pun ada Yesus, di sana kegelapan harus menyingkir.

Ketika kita mengikut Yesus, kita tidak akan berjalan dalam kegelapan. Ini bukan berarti hidup kita akan bebas dari masalah, tetapi berarti kita memiliki terang yang menuntun langkah kita.

Terang Kristus memberikan kita hikmat untuk membuat keputusan yang benar, pengharapan di tengah kesulitan, dan damai sejahtera di tengah kekacauan dunia.

Sebagai pengikut Kristus, kita juga dipanggil untuk menjadi terang bagi dunia. Hidup kita harus memancarkan terang Kristus sehingga orang lain dapat melihat kasih Allah melalui kita.

Hari ini, biarkan terang Kristus bersinar melalui hidup Anda. Jadi berkat bagi orang-orang di sekitar yang mungkin sedang berjalan dalam kegelapan.

Doa:
Ya Yesus, Terang dunia, bersinar melalui hidup kami. Jadikan kami terang bagi orang lain yang sedang dalam kegelapan. Amin.`,
    status: "published",
    published_at: new Date('2024-02-20'),
  },
  {
    title: "Rencana Allah Lebih Tinggi",
    slug: "rencana-allah-lebih-tinggi",
    content: `"Sebab rancangan-Ku bukanlah rancanganmu, dan jalan-Ku bukanlah jalanmu, demikianlah firman TUHAN. Seperti tingginya langit dari bumi, demikianlah tingginya jalan-Ku dari jalanmu dan rancangan-Ku dari rancanganmu." - Yesaia 55:8-9

Seringkali kita memiliki rencana dan harapan tertentu dalam hidup. Kita sudah memetakan jalan yang akan kita tempuh, menetapkan target yang ingin dicapai, dan membayangkan masa depan yang ideal.

Namun kadang-kadang Allah memiliki rencana yang berbeda. Jalan yang Dia tunjukkan tidak sesuai dengan yang kita harapkan. Pintu yang kita inginkan tertutup, sementara pintu yang tidak pernah kita bayangkan terbuka.

Dalam situasi seperti ini, mudah sekali kita merasa kecewa atau bahkan mempertanyakan Allah. Mengapa rencana-Ku tidak jadi? Mengapa Allah tidak memberikan yang aku minta?

Ayat ini mengingatkan kita bahwa rancangan Allah jauh lebih tinggi dari rancangan kita. Dia melihat gambaran yang lebih besar, memahami masa depan yang tidak dapat kita lihat, dan tahu apa yang terbaik bagi kita.

Seperti seorang anak kecil yang tidak mengerti mengapa orang tuanya melarang dia main di jalan raya, kadang kita juga tidak mengerti mengapa Allah tidak memberikan apa yang kita minta. Tetapi orang tua yang bijak melindungi anaknya dari bahaya yang tidak disadari anak tersebut.

Hari ini, percayalah pada rencana Allah. Meski jalan-Nya berbeda dari yang Anda harapkan, percayalah bahwa Dia sedang mengerjakan yang terbaik bagi hidup Anda.

Doa:
Bapa yang bijaksana, kami percaya pada rencana-Mu yang lebih tinggi. Berikan kami hati yang tunduk pada kehendak-Mu. Amin.`,
    status: "published",
    published_at: new Date('2024-02-25'),
  },
  {
    title: "Takut akan Tuhan adalah Permulaan Hikmat",
    slug: "takut-akan-tuhan-adalah-permulaan-hikmat",
    content: `"Takut akan TUHAN adalah permulaan pengetahuan, tetapi orang bodoh menghina hikmat dan didikan." - Amsal 1:7

Dalam dunia modern ini, konsep "takut akan Tuhan" seringkali disalahpahami. Banyak orang mengira ini berarti hidup dalam ketakutan dan kecemasan terhadap Allah.

Namun "takut akan Tuhan" dalam konteks Alkitab adalah rasa hormat yang mendalam, kagum akan kebesaran-Nya, dan pengakuan akan kedaulatan-Nya atas hidup kita. Ini adalah sikap hati yang mengakui bahwa Allah adalah Allah dan kita adalah ciptaan-Nya.

Ketika kita memiliki takut akan Tuhan, kita akan:
- Menghormati perintah-perintah-Nya
- Menjalani hidup dengan integritas
- Mencari kehendak-Nya dalam setiap keputusan
- Bergantung pada hikmat-Nya, bukan kebijaksanaan dunia

Takut akan Tuhan adalah permulaan pengetahuan karena mengajarkan kita untuk memposisikan diri dengan benar di hadapan Allah. Ketika kita menyadari bahwa kita tidak tahu segalanya dan membutuhkan bimbingan-Nya, maka kita terbuka untuk menerima hikmat dari-Nya.

Sebaliknya, kesombongan membuat kita merasa tidak membutuhkan Allah atau nasihat dari siapa pun. Sikap ini menutup hati kita dari hikmat sejati.

Hari ini, rendahkanlah hati Anda di hadapan Tuhan. Akuilah bahwa Dia adalah sumber segala hikmat dan mintalah bimbingan-Nya dalam setiap langkah hidup Anda.

Doa:
Ya Tuhan, ajarkan kami untuk takut akan Engkau dengan benar. Berikan kami hati yang rendah hati dan terbuka untuk menerima hikmat-Mu. Amin.`,
    status: "published",
    published_at: new Date('2024-03-01'),
  }
]

async function main() {
  console.log('🗑️  Clearing existing articles...')
  
  // Delete all existing articles
  const deleteResult = await prisma.article.deleteMany({})
  console.log(`✅ Deleted ${deleteResult.count} existing articles`)
  
  console.log('📝 Creating renungan articles...')
  
  // Insert new renungan data
  for (const renungan of renunganData) {
    const created = await prisma.article.create({
      data: {
        ...renungan,
        createdAt: renungan.published_at,
        updatedAt: renungan.published_at,
      }
    })
    console.log(`✅ Created: ${created.title}`)
  }
  
  console.log(`🎉 Successfully seeded ${renunganData.length} renungan articles!`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Error seeding database:', e)
    await prisma.$disconnect()
    process.exit(1)
  })