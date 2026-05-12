// @ts-nocheck
import { useState, FormEvent } from 'react';
import { 
  Video, 
  FileText, 
  Lightbulb, 
  Zap, 
  Clock, 
  Youtube, 
  Layout, 
  Megaphone,
  Settings, 
  ChevronRight, 
  AlertTriangle,
  PanelLeft,
  Wand2,
  Copy,
  CheckCircle2,
  Sparkles,
  Upload,
  Camera,
  History
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { generatePrompt, generateFactsList } from './geminiService';

import OfficialSocializationDesignApp from './OfficialSocializationDesignApp';
import ProductAdvertisingDesignApp from './ProductAdvertisingDesignApp';

const features = [
  {
    id: 'object-talk',
    title: 'Object Talk',
    sidebarTitle: 'Object Talk',
    icon: Video,
    desc: 'Benda mati yang hidup, berbicara, dan memiliki kepribadian.',
    formTitle: 'Object & Story Details',
    systemInstruction: 'Kamu adalah spesialis AI Video "Object Talk", di mana benda mati/buah dibuat seolah-olah hidup, memiliki wajah, ekspresi yang realistis, dan berbicara. Buatkan naskah video komplit (dengan Hook di awal, Body, dan Call to Action di akhir) dan prompt (Image & Video dalam B. Inggris) per scene sesuai dengan jumlah scene yang diminta.\n\nPENTING UNTUK KONSISTENSI KARAKTER: Agar karakter objek tidak berubah bentuk di setiap scene, kamu WAJIB membuat satu "Base Character Description" (deskripsi fisik yang detail misal: sifat material, warna, bentuk wajah, aksesoris) yang di-COPY-PASTE secara identik ke setiap "Image Prompt" dan "Video Prompt" di semua scene. Jangan mengubah ciri fisik utamanya, hanya ubah pose, background, dan ekspresinya saja.\n\nPENTING UNTUK VIDEO: Di dalam hasil Video Prompt, kamu WAJIB menyertakan narasi/dialog yang sedang diucapkan oleh objek tersebut. Jika user meng-upload gambar, sertakan instruksi parameter konsistensi seperti --cref (Midjourney) atau petunjuk image-to-video.',
    fields: [
      { id: 'object_name', label: 'Nama Objek', type: 'text', placeholder: 'e.g. Buah Mangga, Flashdisk, Kipas' },
      { id: 'topic', label: 'Topik Konten', type: 'text', placeholder: 'e.g. Manfaat mangga, Cara pakai flashdisk' },
      { id: 'language', label: 'Bahasa Dialog', type: 'select', options: ['Bahasa Indonesia', 'English', 'Bahasa Malaysia', 'Jawa', 'Sunda'] },
      { id: 'camera_style', label: 'Gaya Kamera', type: 'select', options: ['Handheld & Dinamis', 'Tripod Statis', 'Drone FPV', 'Pan Sinematik', 'Zoom Agresif'] },
      { id: 'personality', label: 'Kepribadian Karakter', type: 'select', options: ['Sarkastik', 'Polos', 'Lucu', 'Sok Tau', 'Agresif', 'Bijak'] },
      { id: 'total_scenes', label: 'Jumlah Scene', type: 'select', options: ['4 Scenes', '6 Scenes', '8 Scenes', '12 Scenes', '16 Scenes', '24 Scenes'], helperText: 'Prompt akan mencakup narasi dan visual per scene dari awal hingga selesai.' },
      { id: 'character_image', label: 'Referensi Karakter', type: 'file', helperText: 'Upload referensi gambar karakter agar konsisten di setiap scene.' },
    ],
    styles: ['Realistik', '3D Pixar Cartoon', '2D Animation', 'Claymation', 'Stop Motion', 'Anime']
  },
  {
    id: 'storyboard',
    title: 'Storyboard SPMB / PPDB',
    sidebarTitle: 'Storyboard PPDB/SPMB',
    icon: FileText,
    desc: 'UGC Commercial Style Storyboard untuk Kampanye Pendidikan',
    formTitle: 'Informasi Kampanye & Profil',
    systemInstruction: 'Kamu adalah sutradara spesialis iklan pendidikan bergaya UGC Commercial (PPDB/SPMB). Buatkan storyboard per scene yang detail (Narasi/Dialog, Keterangan Visual). Fokus pada profil dan keunggulan institusi sesuai input. Berikan juga Image Prompt & Video Prompt (B. Inggris) untuk AI per scene. Pastikan prompt menjaga konsistensi karakter dan gedung (jika ada file terlampir). Semua scene harus kohesif dan naratif.',
    fields: [
      { id: 'campaign_name', label: 'Judul Kampanye', type: 'text', placeholder: 'e.g. SPMB SDN 2 BANDUNG' },
      { id: 'education_level', label: 'Tingkat Pendidikan', type: 'select', options: ['TK', 'SD', 'SMP', 'SMA', 'SMK', 'Universitas', 'Lembaga Pendidikan', 'Les / Kursus'] },
      { id: 'facilities', label: 'Fasilitas Sekolah', type: 'text', placeholder: 'e.g. Lab Komputer, Lapangan Basket' },
      { id: 'extracurricular', label: 'Ekstrakurikuler Sekolah', type: 'text', placeholder: 'e.g. Pramuka, Robotik, Tari' },
      { id: 'awards', label: 'Penghargaan yang Pernah Diraih', type: 'text', placeholder: 'e.g. Juara 1 Olimpiade Sains' },
      { id: 'vision_mission', label: 'Visi Misi / Info Tambahan', type: 'text', placeholder: 'e.g. Mencerdaskan anak bangsa...' },
      { id: 'narration_type', label: 'Tipe Narasi', type: 'select', options: ['Voice Over', 'Dialog', 'Voice Over & Dialog'] },
      { id: 'total_scenes', label: 'Jumlah Scene', type: 'select', options: ['4 Scenes', '6 Scenes', '8 Scenes', '12 Scenes', '16 Scenes', '24 Scenes'] },
      { id: 'char_1_name', label: 'Nama Karakter 1', type: 'text', placeholder: 'e.g. Budi (Siswa Baru)' },
      { id: 'char_2_name', label: 'Nama Karakter 2', type: 'text', placeholder: 'e.g. Ibu Guru Ani' },
      { id: 'character_images', label: 'Referensi Karakter (Max 4)', type: 'file_multiple', maxFiles: 4, helperText: 'Upload gambar aktor untuk konsistensi di setiap scene.' },
      { id: 'building_images', label: 'Referensi Gedung Sekolah (Max 6)', type: 'file_multiple', maxFiles: 6, helperText: 'Upload gambar gedung/lingkungan sekolah yang asli.' },
    ],
    styles: [
      'Sinematik Realistik', '3D Pixar Cartoon', 'Claymation', 'Hyper Realistic',
      'Futuristic Education Promo', 'Documentary Film', 'Modern School Ads',
      'Anime Film', 'Studio Ghibli Style', 'Dreamy Soft Film', 'Minimalist Motion Graphic'
    ]
  },
  {
    id: 'fakta-unik',
    title: 'Fakta Unik / Menarik',
    sidebarTitle: 'Fakta Unik/Menarik',
    icon: Lightbulb,
    desc: 'Konten edu-tainment fakta viral dengan visual animasi dan konsistensi karakter',
    isTwoStep: true,
    formTitle: 'Topik Fakta',
    fields1: [
      { id: 'topic', label: 'Topik Fakta', type: 'text', placeholder: 'e.g. Fakta sejarah dunia, Pulau Lombok...' },
      { id: 'fact_count', label: 'Jumlah Fakta', type: 'select', options: ['3 Fakta', '5 Fakta', '10 Fakta'] },
    ],
    fields2: [
      { id: 'total_scenes', label: 'Jumlah Scene', type: 'select', options: ['4 Scenes', '6 Scenes', '8 Scenes', '10 Scenes', '12 Scenes', '16 Scenes', '20 Scenes', '24 Scenes'] },
      { id: 'narration_type', label: 'Tipe Narasi', type: 'select', options: ['Voice Over', 'Dialog'] },
      { id: 'character_image', label: 'Upload Image Reference', type: 'file', helperText: 'Upload karakter khusus agar tetap konsisten dalam setiap scene.' },
    ],
    systemInstruction1: 'Kamu adalah asisten AI yang cerdas. Berdasarkan "Topik Fakta" dari user, buatkan list fakta unik/menarik sejumlah request user. Setiap fakta harus fokus ke sub-topik berbeda yang sangat unik dan jarang diketahui.',
    systemInstruction2: 'Kamu adalah kreator YouTube & spesialis video edu-tainment. Berdasarkan judul fakta unik yang dipilih user, buatkan naskah video komplit beserta prompt AI (Image Prompt & Video Prompt dalam B. Inggris) yang memecah cerita ke beberapa scene sesuai jumlah yang diminta.\n\nPENTING:\n- Setiap alur cerita wajib menarik, informatif, edukatif, memiliki HOOK di awal dan CTA di akhir.\n- Jika user tidak upload gambar (tidak ada [Character Reference Attached...]), WAJIB ciptakan 1 Karakter Unik sebagai tokoh utama (misal: "seekor burung hantu pintar memakai kacamata") dan deskripsikan ciri-cirinya secara konsisten di setiap Image Prompt dan Video Prompt di semua scene.\n- Sesuaikan Image/Video prompt dengan gaya visual (Visual Style) yang dipilih.',
    fields: [], // Dummy for fallback
    styles: [
      '2D Cartoon (Simple & Fun)', '3D Cartoon (Modern Look)', 
      'Pixar 3D (Ekspresif)', 'Disney (Magical)', 
      'Anime (Emotional)', 'Sinematik (Realistis)', 
      'Claymation (Unik)', 'Cyberpunk (Futuristik)', 
      'Fantasi (Imajinasi)', 'Pixel Art (Retro)', 
      'Amigurumi (Lucu)'
    ]
  },
  {
    id: 'skeleton-short',
    title: 'Skeleton Shorts',
    sidebarTitle: 'Skeleton Shorts',
    icon: Zap,
    desc: 'Generator Prompt Video AI bertema Karakter Tengkorak yang misterius',
    formTitle: 'Skeleton Video Settings',
    systemInstruction: 'Kamu adalah kreator AI spesialis "Skeleton Shorts". Konten ini menampilkan satu karakter tengkorak/skeleton utama (3D aesthetic/sinar-X) dengan nuansa dark, misterius, dramatis, untuk edukasi/storytelling. Berikan: 1) Skrip berserta narasi (Voice Over/Dialog sesuai pilihan), 2) Pembagian scene berurutan (pastikan durasi setiap video scene yang di-generate adalah 8 detik), 3) Image Prompt (Bahasa Inggris) untuk men-generate gambar awal (Open Art/Midjourney style). PENTING: Karakter skeleton harus BENAR-BENAR KONSISTEN di setiap scene! Gunakan deksripsi fisik, pakaian, postur, dan gaya visual karakter yang SANGAT IDENTIK (copy-paste deskripsi karakter ke setiap prompt scene) agar tidak berubah-ubah, 4) Video Prompt untuk menggerakkannya (Cling/Luma). Pastikan prompt detail dan siap digunakan.',
    fields: [
      { id: 'topik', label: 'Topik/Ide Cerita', type: 'text', placeholder: 'e.g. Misteri Segitiga Bermuda, Fakta Tubuh Manusia' },
      { id: 'tipe_narasi', label: 'Jenis Narasi', type: 'select', options: ['Voice Over', 'Dialog'] },
      { id: 'jumlah_scene', label: 'Jumlah Scene', type: 'select', options: ['4 Scenes', '5 Scenes', '6 Scenes', '7 Scenes', '8 Scenes', '9 Scenes', '10 Scenes', '11 Scenes', '12 Scenes', '13 Scenes', '14 Scenes', '15 Scenes', '16 Scenes', '17 Scenes', '18 Scenes', '19 Scenes', '20 Scenes', '21 Scenes', '22 Scenes', '23 Scenes', '24 Scenes'] },
    ],
    styles: ['Dark Cinematic 3D', 'Medical X-Ray', 'Mysterious Atmosphere', 'Neon Cyberpunk Skull', 'Gritty Realistic']
  },
  {
    id: 'timelapse-video',
    title: 'Timelapse Video',
    sidebarTitle: 'Timelapse Video',
    icon: Clock,
    desc: 'Cinematic timelapse transition directions',
    formTitle: 'Scene Settings',
    systemInstruction: 'Kamu adalah videografer timelapse/hyperlapse sinematik. Buatkan konsep video short Timelapse/Hyperlapse sesuai dengan jumlah scene yang diminta, mulai dari awal proses hingga selesai secara berkesinambungan. Di dalam hasil Prompt AI Video Generator (B. Inggris), PASTIKAN durasi setiap video scene adalah 8 detik, TIDAK ADA teks, dan TIDAK ADA suara voice over atau dialog apapun. Voice over (jika ada) harus dibuat dan diletakkan pada bagian "Narration/Voice Over" tersendiri.',
    fields: [
      { id: 'subject', label: 'Subject/Location', type: 'text', placeholder: 'e.g. City Skyline, Plant Growing' },
      { id: 'duration_span', label: 'Time Span', type: 'select', options: ['Day to Night', 'Years passing', 'Seasons changing', 'Construction process'] },
      { id: 'total_scenes', label: 'Jumlah Scene', type: 'select', options: ['1 Scene', '2 Scenes', '3 Scenes', '4 Scenes', '5 Scenes', '6 Scenes', '7 Scenes', '8 Scenes', '9 Scenes', '10 Scenes'] },
    ],
    styles: ['Hyperlapse', 'Motion Control', 'Drone Tilt-Shift', 'Star Trails', 'City Lights Trails', 'Nature Bloom']
  },
  {
    id: 'miniature-short-video',
    title: 'Miniature Short Video',
    sidebarTitle: 'Miniature Short Video',
    icon: Camera,
    desc: 'Pembuat prompt video bergaya diorama/miniatur yang viral (Tilt-Shift)',
    formTitle: 'Miniature Settings',
    systemInstruction: 'Kamu adalah kreator AI spesialis video pendek (Shorts/Reels/TikTok) berskala miniatur (diorama/tilt-shift style) yang lucu, dan mempunyai nilai viral yang tinggi. Konten ini memberikan ilusi objek tampak seperti mainan kecil atau miniatur maket. Berikan: 1) Konsep unik & narasi, 2) Pembagian scene secara berurutan sesuai jumlah scene (pastikan durasi setiap video scene adalah 8 detik), 3) Prompt rinci untuk AI Video Generator (Bahasa Inggris) untuk setiap scene. Dalam Video Prompt, WAJIB sertakan kata kunci utama seperti "tilt-shift lens, tilt-shift macro photography, miniature style, tiny toy-like scale, diorama, shallow depth of field" DAN sesuaikan dengan Visual Style yang dipilih oleh pengguna (misal: 3D Pixar, Claymation, Realistic, dll).',
    fields: [
      { id: 'topik', label: 'Topik/Lokasi', type: 'text', placeholder: 'e.g. Suasana Pasar Tradisional, Konstruksi Bangunan, Balapan Mobil' },
      { id: 'narasi', label: 'Jenis Narasi', type: 'select', options: ['Tanpa Narasi / Hanya BGM', 'Voice Over Storytelling', 'Fakta Menarik'] },
      { id: 'visual_style', label: 'Visual Style', type: 'select', options: ['Realistic Tilt-Shift', '3D Pixar', 'Claymation', 'Papercut/Origami', 'Lego/Block Style', 'Stop-Motion', 'Anime/Ghibli style', 'Low Poly 3D', 'Cyberpunk Miniature'] },
      { id: 'jumlah_scene', label: 'Jumlah Scene', type: 'select', options: ['1 Scene', '2 Scenes', '3 Scenes', '4 Scenes', '5 Scenes', '6 Scenes', '7 Scenes', '8 Scenes', '9 Scenes', '10 Scenes'] },
    ],
    styles: ['Realistic Tilt-Shift', '3D Pixar', 'Claymation', 'Lego/Block Style', 'Papercut/Origami', 'Stop-Motion', 'Hyper-Detailed Diorama']
  },
  {
    id: 'vlog-masalalu',
    title: 'Vlog Masalalu',
    sidebarTitle: 'Vlog Masalalu',
    icon: History,
    desc: 'Cerita perjalanan waktu (time-travel) ke masa lalu dengan gaya cinematic vlog',
    formTitle: 'Setting Perjalanan',
    systemInstruction: 'Kamu adalah Penulis Script & Prompt Engineer spesialis cerita "Vlog Sejarah/Time Travel". Konten ini menampilkan petualangan epik seseorang (time traveler) ke peradaban masa lalu dengan gaya vlog menggunakan kamera yang dipegang tangan (handheld/POV/selfie-vlog). Ceritakan perjalanan historikal ini dengan storytelling dan dialog yang dramatis, engaging, unik, informatif, dan mengedukasi.\n\nBerikan format berikut:\n1) Hook & Konsep Cerita berdurasi pendek.\n2) Script/Naskah dialog karakter (gaya vlogger yang interaktif: "Guys, coba lihat...").\n3) Pembagian Scene secara detail sesuai dengan jumlah scene yang diminta.\n4) Prompt Visual AI (Image & Video Prompt dalam B. Inggris) untuk men-generate adegan per scene (durasi 8 detik per scene). Di dalam prompt visual WAJIB memasukkan kata kunci gaya kamera seperti: "handheld camera view, selfie vlog perspective, wide-angle distortion, talking to the camera". DAN hasil prompt gambar serta prompt video WAJIB SESUAI dengan gaya visual (Visual Style) yang dipilih oleh pengguna (misal: "vintage 90s camcorder", "retro", "klasik" atau sesuai pilihan pengguna).\n\nPENTING: Jika user mengupload referensi gambar [Character Reference Attached...], kamu WAJIB menganalisa pakaian (outfit) karakter pada gambar tersebut dan MENDESKRIPSIKANNYA SECARA SANGAT DETAIL (mulai dari warna, jenis pakaian, aksesoris, ciri fisik) di SETIAP Image dan Video Prompt dari awal sampai akhir. Karakter dan outfitnya harus BENAR-BENAR KONSISTEN di setiap scene tanpa berubah sedikitpun.',
    fields: [
      { id: 'topik', label: 'Topik/Era Sejarah', type: 'text', placeholder: 'e.g. Kerajaan Majapahit, Mesir Kuno, Perang Dunia II' },
      { id: 'jumlah_scene', label: 'Jumlah Scene', type: 'select', options: ['4 Scenes', '5 Scenes', '6 Scenes', '7 Scenes', '8 Scenes', '9 Scenes', '10 Scenes', '11 Scenes', '12 Scenes', '13 Scenes', '14 Scenes', '15 Scenes', '16 Scenes', '17 Scenes', '18 Scenes', '19 Scenes', '20 Scenes', '21 Scenes', '22 Scenes', '23 Scenes', '24 Scenes'] },
      { id: 'character_image', label: 'Upload Wajah/Profile Karakter', type: 'file', helperText: 'Upload gambar karakter agar konsisten dalam video vlog.' },
    ],
    styles: ['Realistic Cinematic Vlog', 'Vintage 90s Camcorder', 'Found Footage Film', 'High-End GoPro', '3D Pixar Animation', 'Anime / Ghibli Style']
  },
  {
    id: 'youtube-short-viral',
    title: 'Youtube Short Viral',
    sidebarTitle: 'Youtube Short Viral',
    icon: Youtube,
    desc: 'Generator Prompt Video & Narasi untuk konten Shorts paling viral',
    formTitle: 'Shorts Content Strategy',
    systemInstruction: 'Kamu adalah pakar konten YouTube Shorts viral dan AI Video Creator. Buatkan konsep video YouTube Short yang sangat viral dan berpotensi fyp. Berikan: 1) Hook yang sangat kuat (3 detik pertama), 2) Naskah/Script voice over yang engaging, 3) Pembagian Scene yang jelas (pastikan durasi setiap video scene yang di-generate adalah 8 detik), 4) Prompt rinci untuk AI Video Generator (dalam Bahasa Inggris, style Midjourney/Runway/Pika) untuk setiap scene-nya agar pengguna tinggal copy-paste. Buat se-engaging dan se-retentif mungkin.',
    fields: [
      { id: 'topik', label: 'Topik/Niche Konten', type: 'text', placeholder: 'e.g. Fakta Psikologi, Tech Hack, Misteri Sejarah' },
      { id: 'target_audiens', label: 'Target Audiens', type: 'select', options: ['Gen Z / Milenial', 'Pekerja Profesional', 'Pelajar / Mahasiswa', 'Umum/Semua Kalangan'] },
      { id: 'hook_style', label: 'Gaya Penceritaan', type: 'select', options: ['Fakta Mencengangkan', 'Plot Twist / Kejutan', 'Storytelling Emosional', 'Pertanyaan Bikin Penasaran', 'Cepat & Agresif (Fast-paced)'] },
      { id: 'durasi', label: 'Durasi Video', type: 'select', options: ['15 Detik (Sangat Pendek & Padat)', '30 Detik (Standar Viral)', '60 Detik (Storytelling Detail)'] },
    ],
    styles: ['Ali Abdaal Style', 'Iman Gadzhi Style', 'MrBeast Style', 'Hormozi Style', 'Faceless Aesthetic', 'Storytime']
  },
  {
    id: 'poster-sosialisasi',
    title: 'Poster Infografis Sosialisasi',
    sidebarTitle: 'Poster Infografis Sosialisasi',
    icon: Layout,
    desc: 'Public service announcement infographic structures',
    formTitle: 'Campaign Information',
    systemInstruction: 'Kamu adalah desainer infografis expert. Berikan konsep poster sosialisasi publik. Strukturkan: Headline, Pesan, dan Prompt AI (B. Inggris) untuk latar ilustrasi.',
    fields: [
      { id: 'issue', label: 'Public Issue/Topic', type: 'text', placeholder: 'e.g. Health Protocol, Tax Payment' },
      { id: 'target_audience', label: 'Target Audience', type: 'select', options: ['General Public', 'Students', 'Elderly', 'Professionals'] },
    ],
    styles: ['Flat Design', 'Corporate Formal', 'Playful & Friendly', 'Isometric', '3D Minimalist', 'High-Contrast']
  },
  {
    id: 'poster-iklan',
    title: 'Poster Iklan Produk',
    sidebarTitle: 'Poster Iklan Produk',
    icon: Megaphone,
    desc: 'Professional commercial advertisement layouts',
    formTitle: 'Product Details',
    systemInstruction: 'Kamu adalah Art Director Periklanan. Buatkan struktur desain poster iklan dan Prompt Visual (B. Inggris) yang Super Detail untuk Midjourney/DALL-E.',
    fields: [
      { id: 'product', label: 'Product Name/Category', type: 'text', placeholder: 'e.g. Smartwatch, Energy Drink' },
      { id: 'angle', label: 'Marketing Angle', type: 'select', options: ['Luxury / High-end', 'Affordable / Value', 'Tech / Innovative', 'Eco-friendly'] },
    ],
    styles: ['Minimalist Modern', 'Neon Cyberpunk', 'Organic & Natural', 'Bold Typographic', 'Product Center Stage', 'Lifestyle Action']
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState(features[6]); // Default to Poster Infografis Sosialisasi
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [activeStyle, setActiveStyle] = useState<string>('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [resultData, setResultData] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});

  // Two-step specific state
  const [currentStep, setCurrentStep] = useState(1);
  const [generatedFacts, setGeneratedFacts] = useState<any[] | null>(null);
  const [selectedFact, setSelectedFact] = useState<any | null>(null);

  // When tab changes, reset form
  const handleSelectMenu = (feat: typeof features[0]) => {
    setActiveTab(feat);
    setFormData({});
    setActiveStyle(feat.styles[0] || '');
    setResultData(null);
    setGeneratedFacts(null);
    setSelectedFact(null);
    setCurrentStep(1);
    setErrorMsg('');
  };

  const handleFieldChange = (id: string, val: string) => {
    setFormData(prev => ({ ...prev, [id]: val }));
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setErrorMsg('');
    
    // Step 1: Generate List of Facts
    if (activeTab.isTwoStep && currentStep === 1) {
      try {
        const userInput = activeTab.fields1.map(f => `${f.label}: ${formData[f.id] || (f.options ? f.options[0] : '')}`).join('\n');
        const facts = await generateFactsList(activeTab.systemInstruction1, userInput);
        setGeneratedFacts(facts);
        // Select the first one by default to prevent empty selection error
        if (facts && facts.length > 0) {
          setSelectedFact(facts[0]);
        }
        setCurrentStep(2);
      } catch (err: any) {
        setErrorMsg(err.message || 'Terjadi kesalahan saat memproses fakta.');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    setResultData(null);
    setCopiedStates({});

    let inputParts = [];
    if (activeTab.isTwoStep) {
        if (!selectedFact) {
           setErrorMsg('Silakan pilih salah satu fakta terlebih dahulu.');
           setIsLoading(false);
           return;
        }
        inputParts.push(`Judul Fakta Terpilih: ${selectedFact.title}`);
        inputParts.push(`Penjelasan Singkat: ${selectedFact.description}`);
        const fields2 = activeTab.fields2 || [];
        fields2.forEach(f => {
            const val = formData[f.id] || (f.type === 'select' && f.options ? f.options[0] : '');
            inputParts.push(`${f.label}: ${val}`);
        });
    } else {
        inputParts = activeTab.fields.map(f => {
          const val = formData[f.id] || (f.type === 'select' && f.options ? f.options[0] : '');
          return `${f.label}: ${val}`;
        });
    }
    
    if (activeStyle) {
      inputParts.push(`Visual Style: ${activeStyle}`);
    }
    const userInput = inputParts.join('\n');
    const systemInstr = activeTab.isTwoStep ? activeTab.systemInstruction2 : activeTab.systemInstruction;

    try {
      const generated = await generatePrompt(systemInstr, userInput);
      setResultData(generated);
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan saat memproses permintaan.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    if (text) {
      navigator.clipboard.writeText(text);
      setCopiedStates(prev => ({ ...prev, [id]: true }));
      setTimeout(() => setCopiedStates(prev => ({ ...prev, [id]: false })), 2000);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#111111] text-[#E0E0E0] font-sans overflow-hidden">
      
      {/* Sidebar */}
      <div className="w-[280px] bg-[#151515] border-r border-[#222222] flex flex-col shrink-0 relative z-20">
        
        {/* Logo Area */}
        <div className="p-6 pb-2 border-b border-[#222222] mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#E5C158] to-[#AA8C2C] rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-[#111111] font-bold text-xl font-serif">K</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold tracking-tight text-[#E0E0E0] text-[1.1rem] leading-tight flex items-center gap-1">
                KORBAN <span className="text-[#E5C158]">AI</span>
              </span>
              <span className="text-[#E5C158] text-[0.65rem] tracking-[0.2em] font-medium uppercase opacity-90">Magic Content</span>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="px-4 flex-1 overflow-y-auto custom-scrollbar pb-6">
          <div className="text-[0.65rem] font-bold text-[#666] tracking-[0.15em] mb-3 px-2 uppercase">
            Magic Tools
          </div>
          
          <ul className="flex flex-col gap-1 list-none p-0 m-0">
            {features.map((item) => {
              const isActive = activeTab.id === item.id;
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleSelectMenu(item)}
                    className={`w-full text-left px-3 py-2.5 flex items-center justify-between rounded-lg transition-all duration-200 outline-none
                      ${isActive 
                        ? 'bg-[#1e1e1e] border-l-4 border-[#E5C158] text-[#E0E0E0]' 
                        : 'border-l-4 border-transparent text-[#888] hover:bg-[#1a1a1a] hover:text-[#d1d1d1]'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-[#E5C158]' : 'text-[#666]'}`} />
                      <span className={`text-[0.85rem] ${isActive ? 'font-medium text-white' : 'font-normal'}`}>
                        {item.sidebarTitle}
                      </span>
                    </div>
                    {isActive && <ChevronRight className="w-4 h-4 text-[#E5C158]/50" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Bottom Banners */}
        <div className="p-4 border-t border-[#222] flex flex-col gap-3">
           <div className="bg-[#1a1a1a] border border-[#333] p-3 rounded-xl flex items-center gap-3 shadow-inner">
             <div className="w-9 h-9 bg-gradient-to-br from-[#E5C158] to-[#AA8C2C] rounded-full flex items-center justify-center shrink-0">
               <span className="text-[#111] font-bold text-[0.7rem] uppercase tracking-wider">PRO</span>
             </div>
             <div className="flex flex-col">
               <span className="text-white text-[0.85rem] font-semibold">Ultra Premium</span>
               <span className="text-[#888] text-[0.7rem]">All tools unlocked</span>
             </div>
           </div>

           <div className="bg-[#2a1010] border border-[#4a1b1b] p-3 rounded-lg flex items-start gap-2 shadow-inner">
              <AlertTriangle className="w-4 h-4 text-[#ff6b6b] shrink-0 mt-0.5" />
              <p className="text-[#ff8f8f] text-[0.65rem] leading-relaxed">
                <strong className="font-semibold block mb-0.5">Dilarang keras menyebarluaskan apalagi</strong> 
                memperjualbelikan tools ini tanpa seizin pemiliknya.
              </p>
           </div>
        </div>

      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#0a0a0a]">
        
        {/* Topbar */}
        <div className="h-[64px] border-b border-[#222222] flex items-center justify-between px-6 shrink-0 bg-[#0d0d0d]">
          <div className="flex items-center gap-4">
            <button className="text-[#888] hover:text-white transition-colors">
              <PanelLeft className="w-5 h-5" />
            </button>
            <div className="bg-[#1a2e1e] border border-[#2a4a30] text-[#4ade80] text-[0.75rem] font-medium px-3 py-1.5 rounded-full flex items-center gap-2">
              <span className="w-2 h-2 bg-[#4ade80] rounded-full animate-pulse shadow-[0_0_8px_#4ade80]"></span>
              Engine Online
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="w-9 h-9 flex items-center justify-center bg-[#1a1a1a] rounded-full border border-[#333] text-[#888] hover:text-white transition-all">
              <Settings className="w-4 h-4" />
            </button>
            <button className="bg-white text-black font-semibold text-[0.8rem] px-5 py-2 rounded-full hover:bg-gray-200 transition-colors shadow-lg">
              Export Project
            </button>
          </div>
        </div>

        {/* Scrollable Form Content */}
        {activeTab.id === 'poster-sosialisasi' ? (
          <div className="flex-1 overflow-y-auto custom-scrollbar relative">
            <OfficialSocializationDesignApp />
          </div>
        ) : activeTab.id === 'poster-iklan' ? (
          <div className="flex-1 overflow-y-auto custom-scrollbar relative">
            <ProductAdvertisingDesignApp />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar relative">
            <div className="max-w-[1100px] mx-auto w-full">
              {/* The Main Magic Card */}
              <div className="border border-[#d4af37]/40 rounded-3xl p-8 md:p-10 relative overflow-hidden bg-[#0d0d0d] shadow-[0_0_50px_rgba(212,175,55,0.05)]">
              {/* Subtle top-left glow inside the card */}
              <div className="absolute top-0 left-0 w-64 h-64 bg-[#E5C158]/5 rounded-full blur-[100px] pointer-events-none -mt-32 -ml-32"></div>

              {/* Header inside Card */}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10 relative z-10">
                <div>
                  <h1 className="text-3xl md:text-4xl font-semibold text-[#E5C158] mb-2 tracking-tight">
                    {activeTab.title}
                  </h1>
                  <p className="text-[#888] text-[0.95rem] font-light">
                    {activeTab.desc}
                  </p>
                </div>
                <div className="px-4 py-2 border border-[#E5C158]/50 bg-[#E5C158]/5 rounded-lg shrink-0">
                  <span className="text-[#E5C158] text-[0.85rem] font-medium">Premium AI Production Suite</span>
                </div>
              </div>

              {/* Grid 2 Columns for Forms & Output */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 md:gap-10 relative z-10 items-start">
                
                {/* Left Column: Configuration */}
                <div className="xl:col-span-5 space-y-8">
                  {/* Form Fields */}
                  <div className="bg-[#111111] border border-[#222222] rounded-2xl p-6 md:p-8">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-[#E5C158] text-[1.1rem] font-semibold">
                        {activeTab.formTitle}
                      </h3>
                      {activeTab.isTwoStep && currentStep === 2 && (
                        <button 
                          onClick={() => setCurrentStep(1)}
                          className="text-[#888] hover:text-white text-[0.8rem] underline underline-offset-2 transition-colors"
                        >
                          Ubah Topik Fakta
                        </button>
                      )}
                    </div>
                    
                    <div className="space-y-6">
                      {activeTab.isTwoStep && currentStep === 2 && generatedFacts && (
                        <div className="mb-6 space-y-3">
                          <label className="block text-[#ccc] text-[0.85rem] font-medium">
                            Pilih Fakta yang Ingin Dibuatkan Video
                          </label>
                          <div className="space-y-3">
                            {generatedFacts.map((fact, idx) => (
                              <label key={idx} className={`block relative p-4 rounded-xl border cursor-pointer transition-all ${selectedFact?.title === fact.title ? 'bg-[#1a1a1a] border-[#E5C158]' : 'bg-[#151515] border-[#333] hover:border-[#555]'}`}>
                                 <div className="flex items-start gap-4">
                                    <input 
                                      type="radio" 
                                      name="selectedFact" 
                                      className="mt-1 accent-[#E5C158]" 
                                      checked={selectedFact?.title === fact.title}
                                      onChange={() => setSelectedFact(fact)}
                                    />
                                    <div>
                                      <h4 className="text-[#E0E0E0] font-medium text-[0.95rem] mb-1">{fact.title}</h4>
                                      <p className="text-[#888] text-[0.8rem] leading-relaxed">{fact.description}</p>
                                    </div>
                                 </div>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}

                      {(activeTab.isTwoStep ? (currentStep === 1 ? activeTab.fields1 : activeTab.fields2) : activeTab.fields).map(field => (
                        <div key={field.id} className="space-y-2 text-left">
                          <label className="block text-[#ccc] text-[0.85rem] font-medium">
                            {field.label}
                          </label>
                          {field.type === 'select' ? (
                            <select
                              value={formData[field.id] || ''}
                              onChange={(e) => handleFieldChange(field.id, e.target.value)}
                              className="w-full bg-[#1a1a1a] border border-[#333] text-white rounded-lg p-3 text-[0.9rem] focus:outline-none focus:border-[#E5C158]/50 transition-colors cursor-pointer appearance-none"
                              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23888'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path>%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1rem' }}
                            >
                              <option value="" disabled>Select {field.label}</option>
                              {field.options?.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                          ) : field.type === 'file' ? (
                            <div className="relative group">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleFieldChange(field.id, `[Character Reference Attached: ${file.name}]`);
                                }}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                title="Upload Character Reference"
                              />
                              <div className="w-full bg-[#1a1a1a] border border-dashed border-[#444] text-[#888] rounded-lg p-5 flex flex-col items-center justify-center transition-colors group-hover:border-[#E5C158] group-hover:text-[#E5C158]">
                                <Upload className="w-6 h-6 mb-2 text-[#666] group-hover:text-[#E5C158] transition-colors" />
                                <span className="text-[0.85rem] font-medium transition-colors text-center">
                                  {formData[field.id] ? formData[field.id].replace('[Character Reference Attached: ', '').replace(']', '') : 'Upload Karakter (Opsional)'}
                                </span>
                                {!formData[field.id] && <span className="text-[0.7rem] text-[#555] mt-1 transition-colors group-hover:text-[#E5C158]/70">Format gambar .JPG, .PNG</span>}
                              </div>
                            </div>
                          ) : field.type === 'file_multiple' ? (
                            <div className="relative group">
                              <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => {
                                  const files = Array.from(e.target.files || []);
                                  if (files.length > 0) {
                                    // @ts-ignore
                                    const max = field.maxFiles || 10;
                                    const selectedFiles = files.slice(0, max);
                                    const fileNames = selectedFiles.map((f: any) => f.name).join(', ');
                                    handleFieldChange(field.id, `[Attached ${selectedFiles.length} files: ${fileNames}]`);
                                  }
                                }}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                title="Upload Multiple Images"
                              />
                              <div className="w-full bg-[#1a1a1a] border border-dashed border-[#444] text-[#888] rounded-lg p-5 flex flex-col items-center justify-center transition-colors group-hover:border-[#E5C158] group-hover:text-[#E5C158]">
                                <Upload className="w-6 h-6 mb-2 text-[#666] group-hover:text-[#E5C158] transition-colors" />
                                <span className="text-[0.85rem] font-medium transition-colors text-center px-4">
                                  {formData[field.id] ? formData[field.id].replace(/^\[Attached \d+ files: |\]$/g, '') : `Upload Gambar (Max ${(field as any).maxFiles || 10})`}
                                </span>
                                {!formData[field.id] && <span className="text-[0.7rem] text-[#555] mt-1 transition-colors group-hover:text-[#E5C158]/70">Format gambar .JPG, .PNG</span>}
                              </div>
                            </div>
                          ) : (
                            <input
                              type="text"
                              value={formData[field.id] || ''}
                              onChange={(e) => handleFieldChange(field.id, e.target.value)}
                              placeholder={field.placeholder}
                              className="w-full bg-[#1a1a1a] border border-[#333] text-white placeholder-[#555] rounded-lg p-3 text-[0.9rem] focus:outline-none focus:border-[#E5C158]/50 transition-colors"
                            />
                          )}
                          {field.helperText && (
                            <p className="text-[#666] text-[0.75rem] mt-1.5 leading-relaxed">{field.helperText}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Visual Configuration */}
                  {(!activeTab.isTwoStep || currentStep === 2) && (
                    <div className="bg-[#111111] border border-[#222222] rounded-2xl p-6 md:p-8">
                      <h3 className="text-[#E5C158] text-[1.1rem] font-semibold mb-6">
                        Visual Configuration
                      </h3>

                      <div className="space-y-4">
                        <label className="block text-[#ccc] text-[0.85rem] font-medium">
                          Visual Style
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {activeTab.styles.map(style => {
                            const isSelected = activeStyle === style;
                            return (
                              <button
                                key={style}
                                onClick={() => setActiveStyle(style)}
                                className={`p-3 rounded-xl border text-[0.8rem] transition-all duration-200 text-center flex items-center justify-center hover:cursor-pointer
                                  ${isSelected 
                                    ? 'bg-[#1a1a1a] border-[#E5C158] text-[#E5C158] shadow-[0_0_15px_rgba(229,193,88,0.15)] font-medium' 
                                    : 'bg-[#151515] border-[#2a2a2a] text-[#888] hover:border-[#444] hover:text-[#bbb]'
                                  }
                                `}
                              >
                                {style}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Submit Button */}
                  <div className="flex justify-start w-full relative z-10">
                    <button
                      onClick={handleGenerate}
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-[#E5C158] to-[#C5A028] text-[#111] font-bold px-10 py-3.5 rounded-xl text-[0.95rem] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(229,193,88,0.2)]"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-[#111]/30 border-t-[#111] rounded-full animate-spin" />
                          GENERATING...
                        </>
                      ) : (
                        <>
                          <Wand2 className="w-5 h-5" />
                          {activeTab.isTwoStep && currentStep === 1 ? 'GENERATE DAFTAR FAKTA' : 'GENERATE PROMPT ENGINE'}
                        </>
                      )}
                    </button>
                  </div>

                  {/* Error Message */}
                  {errorMsg && (
                    <div className="p-4 border border-red-900/50 bg-red-950/20 text-[#ff8f8f] rounded-xl text-[0.85rem] relative z-10 w-full">
                      {errorMsg}
                    </div>
                  )}
                </div>

                {/* Right Column: Output Result */}
                <div className="xl:col-span-7">
                  {resultData ? (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="space-y-8"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-[1.1rem] font-medium text-[#E5C158] flex items-center gap-3 tracking-[0.05em] uppercase">
                          <Sparkles className="w-5 h-5" />
                          Generated Magic Prompt
                        </h3>
                      </div>

                      {resultData.overview && (
                        <div className="bg-[#050505] border border-[#222] rounded-2xl p-6 overflow-x-auto text-[#d1d1d1] text-[0.95rem] font-light leading-relaxed prose prose-invert prose-headings:font-medium prose-headings:text-white prose-a:text-[#E5C158] prose-strong:text-white max-w-none shadow-inner selection:bg-[#E5C158]/30 selection:text-white">
                          <Markdown>{resultData.overview}</Markdown>
                        </div>
                      )}

                      {resultData.scenes && resultData.scenes.map((scene: any, idx: number) => (
                        <div key={idx} className="bg-[#111111] border border-[#222] rounded-2xl p-6 md:p-8 space-y-6">
                          <h4 className="text-[1.05rem] font-semibold text-white border-b border-[#333] pb-3 mb-4">
                            {scene.sceneNumber}
                          </h4>
                          
                          <div className="space-y-2">
                            <span className="text-[#888] text-[0.8rem] font-medium uppercase tracking-widest">Narration / Action:</span>
                            <div className="text-[#d1d1d1] text-[0.95rem] font-light leading-relaxed bg-[#0a0a0a] p-4 rounded-xl border border-[#1a1a1a]">
                              <Markdown>{scene.narration}</Markdown>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Image Prompt */}
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-[#E5C158] text-[0.8rem] font-semibold uppercase tracking-widest">Image Prompt:</span>
                                <button
                                  onClick={() => handleCopy(scene.imagePrompt, `img_${idx}`)}
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1a1a1a] border border-[#333] text-[0.7rem] font-bold tracking-wide uppercase text-[#888] hover:text-[#E5C158] hover:border-[#E5C158]/50 transition-colors cursor-pointer"
                                >
                                  {copiedStates[`img_${idx}`] ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                                  {copiedStates[`img_${idx}`] ? 'COPIED' : 'COPY'}
                                </button>
                              </div>
                              <div className="text-[#E0E0E0] text-[0.85rem] font-mono leading-relaxed bg-[#050505] p-4 rounded-xl border border-[#222] h-[150px] overflow-y-auto custom-scrollbar shadow-inner">
                                {scene.imagePrompt}
                              </div>
                            </div>

                            {/* Video Prompt */}
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-[#4ade80] text-[0.8rem] font-semibold uppercase tracking-widest">Video Prompt:</span>
                                <button
                                  onClick={() => handleCopy(scene.videoPrompt, `vid_${idx}`)}
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1a1a1a] border border-[#333] text-[0.7rem] font-bold tracking-wide uppercase text-[#888] hover:text-[#4ade80] hover:border-[#4ade80]/50 transition-colors cursor-pointer"
                                >
                                  {copiedStates[`vid_${idx}`] ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                                  {copiedStates[`vid_${idx}`] ? 'COPIED' : 'COPY'}
                                </button>
                              </div>
                              <div className="text-[#E0E0E0] text-[0.85rem] font-mono leading-relaxed bg-[#050505] p-4 rounded-xl border border-[#222] h-[150px] overflow-y-auto custom-scrollbar shadow-inner">
                                {scene.videoPrompt}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                    </motion.div>
                  ) : (
                    <div className="bg-[#111111]/40 border border-[#222222] rounded-3xl p-10 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
                      <Sparkles className="w-12 h-12 text-[#E5C158]/20 mb-4" />
                      <h3 className="text-[#888] font-medium text-[1.1rem] mb-2">Ready to Generate</h3>
                      <p className="text-[#555] text-[0.85rem] max-w-[250px]">Fill out the configuration on the left and click generate to see the magic happen.</p>
                      {isLoading && (
                         <div className="mt-8 flex flex-col items-center gap-3">
                           <div className="w-6 h-6 border-2 border-[#E5C158]/30 border-t-[#E5C158] rounded-full animate-spin" />
                           <span className="text-[#E5C158] text-[0.75rem] font-bold tracking-widest uppercase">Processing</span>
                         </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
          </div>
        )}
      </div>

    </div>
  );
}
