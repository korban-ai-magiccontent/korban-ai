import { useState } from 'react';
import { Loader2, Wand2 } from 'lucide-react';
import { generateSinglePrompt } from './geminiService';

export default function OfficialSocializationDesignApp() {
  const designTypes = [
    "Desain Infografis Premium",
    "Redesign Banner / X-Banner",
    "Poster Sosialisasi SPMB",
    "Instagram Feed / Story",
    "Prompt AI Image Generator",
    "Cinematic Luxury",
    "Modern School Ads",
    "Government Infographic"
  ];

  const visualStyles = [
    "Luxury Navy & Gold",
    "Minimal Modern",
    "Futuristic Education",
    "Elegant Academic",
    "Cinematic Glossy",
    "3D Infographic",
    "Flat Clean Design"
  ];

  const aspectRatios = [
    "1:1",
    "3:4",
    "4:3",
    "9:16",
    "16:9"
  ];

  const samplePrompt = `Ultra detailed premium educational infographic design for official school socialization campaign, elegant government-style layout, cinematic glossy finish, dark navy blue and metallic gold color palette, modern infographic structure, luxury academic branding, realistic Indonesian students, sophisticated typography, professional educational advertisement composition, visually balanced modular layout, high-end poster design, premium lighting, clean information hierarchy, modern school campaign visual.`;

  const [activeDesignType, setActiveDesignType] = useState(designTypes[2]);
  const [activeVisualStyle, setActiveVisualStyle] = useState(visualStyles[0]);
  const [activeAspectRatio, setActiveAspectRatio] = useState(aspectRatios[1]);
  
  const [judulKegiatan, setJudulKegiatan] = useState('');
  const [namaSekolah, setNamaSekolah] = useState('');
  const [tema, setTema] = useState('');
  const [isiPoin, setIsiPoin] = useState('');
  const [tanggalLokasi, setTanggalLokasi] = useState('');
  const [additionalDirection, setAdditionalDirection] = useState('');
  
  const [docFileCount, setDocFileCount] = useState(0);
  const [imageFileCount, setImageFileCount] = useState(0);
  const [logoFileCount, setLogoFileCount] = useState(0);
  const [characterFileCount, setCharacterFileCount] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [hasGenerated, setHasGenerated] = useState(false);
  
  const [logoFiles, setLogoFiles] = useState<File[]>([]);
  const [characterFiles, setCharacterFiles] = useState<File[]>([]);

  const handleGenerate = async () => {
    setIsLoading(true);
    setErrorMsg('');
    setHasGenerated(false);
    
    try {
      const parts: any[] = [];
      const sysInst = "Kamu adalah spesialis pembuat Master Prompt AI Image Generator (Midjourney/DALL-E) untuk desain poster sosialisasi pendidikan resmi. Hasilkan HANYA 1 paragraf prompt berbahasa Inggris yang mendeskripsikan secara sangat detail elemen visual, tema, teks apa saja yang muncul, gaya warna, lighting, komposisi layout, dan rasio gambar. JIKA user mengupload dokumen (PDF/Teks), baca isinya dan ekstrak informasi penting tersebut untuk dijadikan teks yang muncul di poster. JIKA TIDAK ADA dokumen, gunakan informasi Manual Input yang diberikan.";

      // Process all uploaded files
      const processFiles = async (files: File[], type: string) => {
        for (const file of files) {
          if (file.type.startsWith('text/') || file.type === 'application/json') {
             const text = await file.text();
             parts.push({ text: `\n--- [${type}] ${file.name} ---\n${text}\n---` });
          } else {
             // For Images, PDFs, and potentially other office documents if supported
             const base64 = await new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
                reader.readAsDataURL(file);
             });
             // Provide a context text before the inlineData so the model knows what it is
             parts.push({ text: `\n[${type} - ${file.name}]: ` });
             parts.push({
               inlineData: {
                 data: base64,
                 mimeType: file.type || 'application/octet-stream'
               }
             });
          }
        }
      };

      await processFiles(logoFiles, 'Logo Instansi');
      await processFiles(characterFiles, 'Character Reference');

      // Add text input context
      let textInput = `\n\n--- MANUAL INPUT ---\n`;
      textInput += `Jenis Desain: ${activeDesignType}\nVisual Style: ${activeVisualStyle}\nAspect Ratio: ${activeAspectRatio}\n`;
      if (judulKegiatan) textInput += `Judul Kegiatan: ${judulKegiatan}\n`;
      if (namaSekolah) textInput += `Nama Sekolah: ${namaSekolah}\n`;
      if (tema) textInput += `Tema: ${tema}\n`;
      if (isiPoin) textInput += `Isi Informasi: ${isiPoin}\n`;
      if (tanggalLokasi) textInput += `Tanggal & Lokasi: ${tanggalLokasi}\n`;
      if (additionalDirection) textInput += `Additional Direction: ${additionalDirection}\n`;

      parts.push({ text: textInput });

      const res = await generateSinglePrompt(sysInst, parts);
      setGeneratedPrompt(res);
      setHasGenerated(true);
    } catch (err: any) {
      setErrorMsg('Gagal menghasilkan prompt: ' + (err.message || 'Error occurred'));
    } finally {
      setIsLoading(false);
    }
  };

  const copyPrompt = () => {
    navigator.clipboard.writeText(generatedPrompt);
  };

  return (
    <div className="w-full bg-black text-white p-6 md:p-10">
      <div className="max-w-[1400px] mx-auto">
        <div className="bg-gradient-to-br from-zinc-950 via-black to-zinc-900 border border-yellow-600 rounded-[32px] shadow-2xl overflow-hidden">
          <div className="p-8 border-b border-zinc-800">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
              <div>
                <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-700 bg-clip-text text-transparent pb-2">
                  Official Design Generator
                </h1>
                <p className="text-zinc-400 text-base md:text-lg mt-3 max-w-3xl">
                  Luxury AI Generator for Educational Socialization Posters, Infographics, X-Banners & School Campaign Visuals.
                </p>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500 rounded-2xl px-6 py-4 shrink-0">
                <p className="text-yellow-400 font-semibold text-lg">
                  Premium Government Design Suite
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 p-8">
            <div className="xl:col-span-2 space-y-8">
              <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6">
                <h2 className="text-2xl font-semibold text-yellow-400 mb-6">
                  Upload Visual & Ornamen
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <label className="border-2 border-dashed border-zinc-700 rounded-2xl p-6 text-center hover:border-yellow-500 transition-all cursor-pointer block relative group">
                    <input type="file" multiple accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      if (files.length > 6) {
                        alert('Maksimal 6 logo diperbolehkan.');
                        e.target.value = '';
                        setLogoFiles([]);
                        setLogoFileCount(0);
                      } else {
                        setLogoFiles(files);
                        setLogoFileCount(files.length);
                      }
                    }} />
                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">✨</div>
                    <h3 className="font-semibold text-base leading-tight mt-1">{logoFileCount > 0 ? `${logoFileCount} Logo Terupload` : 'Upload Logo'}</h3>
                    <p className="text-zinc-500 mt-1 text-xs">
                      Maksimal 6 Gambar Logo
                    </p>
                  </label>

                  <label className="border-2 border-dashed border-zinc-700 rounded-2xl p-6 text-center hover:border-yellow-500 transition-all cursor-pointer block relative group">
                    <input type="file" multiple accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      if (files.length > 4) {
                        alert('Maksimal 4 karakter diperbolehkan.');
                        e.target.value = '';
                        setCharacterFiles([]);
                        setCharacterFileCount(0);
                      } else {
                        setCharacterFiles(files);
                        setCharacterFileCount(files.length);
                      }
                    }} />
                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">👤</div>
                    <h3 className="font-semibold text-base leading-tight mt-1">{characterFileCount > 0 ? `${characterFileCount} Karakter Terupload` : 'Upload Karakter'}</h3>
                    <p className="text-zinc-500 mt-1 text-xs">
                      Maksimal 4 Karakter
                    </p>
                  </label>
                </div>
              </div>

              <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6">
                <h2 className="text-2xl font-semibold text-yellow-400 mb-6">
                  Socialization Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="text-sm text-zinc-400">Judul Kegiatan</label>
                    <input
                      type="text"
                      value={judulKegiatan}
                      onChange={(e) => setJudulKegiatan(e.target.value)}
                      placeholder="SOSIALISASI SPMB 2026"
                      className="w-full mt-2 bg-zinc-900 border border-zinc-700 rounded-xl p-3 focus:outline-none focus:border-yellow-500 text-white placeholder-zinc-500"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-zinc-400">Nama Sekolah / Instansi</label>
                    <input
                      type="text"
                      value={namaSekolah}
                      onChange={(e) => setNamaSekolah(e.target.value)}
                      placeholder="SDN Cibuluh 2"
                      className="w-full mt-2 bg-zinc-900 border border-zinc-700 rounded-xl p-3 focus:outline-none focus:border-yellow-500 text-white placeholder-zinc-500"
                    />
                  </div>
                </div>

                <div className="mt-5">
                  <label className="text-sm text-zinc-400">Tema Sosialisasi</label>
                  <input
                    type="text"
                    value={tema}
                    onChange={(e) => setTema(e.target.value)}
                    placeholder="Mewujudkan Generasi Unggul dan Berkarakter"
                    className="w-full mt-2 bg-zinc-900 border border-zinc-700 rounded-xl p-3 focus:outline-none focus:border-yellow-500 text-white placeholder-zinc-500"
                  />
                </div>

                <div className="mt-5">
                  <label className="text-sm text-zinc-400">Isi Poin Informasi</label>
                  <textarea
                    rows={6}
                    value={isiPoin}
                    onChange={(e) => setIsiPoin(e.target.value)}
                    placeholder="• Jadwal Pendaftaran&#10;• Persyaratan&#10;• Jalur Pendaftaran&#10;• Tahapan Seleksi"
                    className="w-full mt-2 bg-zinc-900 border border-zinc-700 rounded-xl p-3 focus:outline-none focus:border-yellow-500 text-white placeholder-zinc-500"
                  />
                </div>

                <div className="mt-5">
                  <label className="text-sm text-zinc-400">Tanggal & Lokasi</label>
                  <input
                    type="text"
                    value={tanggalLokasi}
                    onChange={(e) => setTanggalLokasi(e.target.value)}
                    placeholder="10 Mei 2026 - Aula Sekolah"
                    className="w-full mt-2 bg-zinc-900 border border-zinc-700 rounded-xl p-3 focus:outline-none focus:border-yellow-500 text-white placeholder-zinc-500"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6">
                <h2 className="text-2xl font-semibold text-yellow-400 mb-6">
                  Design Settings
                </h2>

                <div>
                  <label className="text-sm text-zinc-400">Jenis Desain</label>
                  <div className="grid grid-cols-1 gap-3 mt-3 max-h-[250px] overflow-y-auto custom-scrollbar pr-2">
                    {designTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() => setActiveDesignType(type)}
                        className={`border rounded-xl py-3 px-4 text-left transition-all text-sm font-medium ${activeDesignType === type ? 'bg-yellow-500/10 border-yellow-500 text-yellow-500' : 'bg-zinc-900 border-zinc-700 hover:border-yellow-500/50'}`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <label className="text-sm text-zinc-400">Visual Style</label>
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    {visualStyles.map((style) => (
                      <button
                        key={style}
                        onClick={() => setActiveVisualStyle(style)}
                        className={`border rounded-xl py-3 px-3 text-xs md:text-sm transition-all font-medium ${activeVisualStyle === style ? 'bg-yellow-500/10 border-yellow-500 text-yellow-500' : 'bg-zinc-900 border-zinc-700 hover:border-yellow-500/50'}`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <label className="text-sm text-zinc-400">Aspect Ratio</label>
                  <div className="grid grid-cols-3 gap-3 mt-3">
                    {aspectRatios.map((ratio) => (
                      <button
                        key={ratio}
                        onClick={() => setActiveAspectRatio(ratio)}
                        className={`border rounded-xl py-3 text-sm font-semibold transition-all ${activeAspectRatio === ratio ? 'bg-yellow-500/10 border-yellow-500 text-yellow-500' : 'bg-zinc-900 border-zinc-700 hover:border-yellow-500/50'}`}
                      >
                        {ratio}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <label className="text-sm text-zinc-400">Additional Design Direction</label>
                  <textarea
                    rows={4}
                    value={additionalDirection}
                    onChange={(e) => setAdditionalDirection(e.target.value)}
                    placeholder="Luxury government style, elegant cinematic atmosphere, glossy reflections, futuristic infographic dashboard, modern educational branding"
                    className="w-full mt-2 bg-zinc-900 border border-zinc-700 rounded-xl p-3 focus:outline-none focus:border-yellow-500 text-white placeholder-zinc-500 text-sm"
                  />
                </div>

                {errorMsg && (
                  <div className="mt-4 p-4 text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl text-sm leading-relaxed">
                    {errorMsg}
                  </div>
                )}

                <button 
                  onClick={handleGenerate}
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2 w-full mt-8 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black py-4 rounded-2xl font-bold text-lg hover:scale-[1.02] transition-all shadow-xl shadow-yellow-900/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> Sedang Membuat Prompt...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5" /> Generate AI Design Prompt
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {hasGenerated && (
          <div className="mt-8 bg-zinc-950 border border-zinc-800 rounded-3xl p-6 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-600/10 rounded-full blur-[100px] pointer-events-none"></div>
             <div className="relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 gap-4">
                  <h2 className="text-2xl font-semibold text-yellow-400">
                    ✨ AI Prompt Result
                  </h2>

                  <button
                    onClick={copyPrompt}
                    className="bg-yellow-500 text-black px-6 py-2.5 rounded-xl text-sm font-semibold hover:scale-[1.03] transition-all shadow-lg"
                  >
                    Copy Prompt
                  </button>
                </div>

                <div className="bg-black border border-zinc-800 rounded-2xl p-6 max-h-[600px] overflow-auto text-zinc-300 text-base leading-relaxed font-mono whitespace-pre-wrap">
                  {generatedPrompt}
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
