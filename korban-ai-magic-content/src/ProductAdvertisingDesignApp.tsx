import React from 'react';

export default function ProductAdvertisingDesignApp() {
  const audienceOptions = [
    "Anak muda",
    "Pelajar",
    "Gamers",
    "Pekerja",
    "Ibu-ibu",
    "Konten kreator",
    "Pebisnis",
    "Luxury market",
    "Semua kalangan",
  ];

  const vibeOptions = [
    "Hype & Fun",
    "Premium",
    "Dark Luxury",
    "Street",
    "Cyberpunk",
    "Cozy Homey",
    "Viral Kekinian",
    "Minimalist Elegant",
  ];
  
  const aspectRatioOptions = [
    "1:1 (Square)",
    "9:16 (Story/Reels)",
    "4:5 (Portrait)",
    "16:9 (Landscape)",
  ];

  const [product, setProduct] = React.useState("");
  const [audience, setAudience] = React.useState("");
  const [vibe, setVibe] = React.useState("");
  const [aspectRatio, setAspectRatio] = React.useState("");
  const [promo, setPromo] = React.useState("");
  const [harga, setHarga] = React.useState("");
  const [brand, setBrand] = React.useState("");
  const [keterangan, setKeterangan] = React.useState("");
  const [productImageCount, setProductImageCount] = React.useState(0);
  const [hasGenerated, setHasGenerated] = React.useState(false);
  const [result, setResult] = React.useState("");

  const audienceMap: Record<string, string> = {
    "Anak muda": "viral tiktok aesthetic, energetic composition, trendy fashion styling, neon social media atmosphere",
    "Pelajar": "clean youthful atmosphere, educational modern aesthetic, bright colors, trendy minimal visuals",
    "Gamers": "RGB cyber lighting, futuristic setup, gaming room cinematic mood, high energy visuals",
    "Pekerja": "modern professional atmosphere, sleek office aesthetic, cinematic corporate advertising",
    "Ibu-ibu": "warm cozy lighting, homey kitchen atmosphere, soft emotional commercial style",
    "Konten kreator": "social media influencer aesthetic, cinematic content creator setup, viral composition",
    "Pebisnis": "professional branding visuals, premium marketing composition, elegant advertising campaign",
    "Luxury market": "high-end luxury photography, elegant shadows, premium editorial campaign",
    "Semua kalangan": "universal appealing design, modern commercial aesthetic, clean and accessible visual style, friendly atmosphere",
  };

  const vibeMap: Record<string, string> = {
    "Hype & Fun": "vibrant colors, dynamic motion, playful commercial energy",
    "Premium": "clean luxury composition, elegant cinematic lighting, glossy advertising style",
    "Dark Luxury": "black and gold cinematic atmosphere, dramatic shadows, luxury premium branding",
    "Street": "urban gritty environment, streetwear aesthetic, realistic city atmosphere",
    "Cyberpunk": "neon futuristic city lights, sci-fi cinematic glow, cyberpunk visual mood",
    "Cozy Homey": "warm ambient lighting, soft textures, emotional home atmosphere",
    "Viral Kekinian": "tiktok viral poster style, modern social media campaign aesthetic",
    "Minimalist Elegant": "minimal composition, luxury white space, elegant typography",
  };

  const generatePrompt = () => {
    const audienceStyle = audienceMap[audience] || "modern commercial advertising style";
    const vibeStyle = vibeMap[vibe] || "cinematic commercial mood";
    const ratioParam = aspectRatio ? `--ar ${aspectRatio.split(' ')[0].replace(':', ':')}` : "--ar 4:5";

    const prompt = `ULTRA DETAILED UGC COMMERCIAL ADVERTISING POSTER OF ${product},
authentic user generated content, eye-catching social media advertisement,
brand name ${brand || "premium modern brand"},
${audienceStyle},
${vibeStyle},
large bold typography,
premium commercial photography,
cinematic lighting,
dramatic composition,
ultra realistic details,
8k ultra HD,
high contrast shadows,
glossy advertising campaign aesthetic,
professional poster layout,
trending visual design,
commercial branding masterpiece,
promo text: ${promo || "special promotion"},
${harga ? `price text: ${harga},` : ""}
${keterangan ? `additional text/details: ${keterangan},` : ""}
${productImageCount > 0 ? `incorporate ${productImageCount} product images beautifully into the scene,` : ""}
sharp focus,
luxury visual direction,
award-winning advertising poster,
modern marketing campaign,
studio quality render,
midjourney style,
flux style,
stable diffusion optimized ${ratioParam}`;

    setResult(prompt);
    setHasGenerated(true);
  };

  return (
    <div className="min-h-full bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-black tracking-wide bg-gradient-to-r from-yellow-400 to-yellow-700 bg-clip-text text-transparent">
            Grog Design AI
          </h1>
          <p className="text-zinc-400 mt-4 text-lg">
            AI Commercial Poster Prompt Generator
          </p>
        </div>

        <div className="bg-zinc-900 border border-yellow-700 rounded-3xl p-8 shadow-2xl mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-600/10 rounded-full blur-[100px] pointer-events-none"></div>
          <h2 className="text-3xl font-bold mb-8 text-yellow-400 relative z-10">
            Input Produk & Kampanye
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            <div>
              <label className="block mb-2 font-semibold text-zinc-300">
                Nama Produk
              </label>
              <input
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                placeholder="contoh: Seblak Pedas Level 10"
                className="w-full p-4 rounded-2xl bg-zinc-800 border border-zinc-700 focus:border-yellow-500 outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold text-zinc-300">
                Target Audiens
              </label>
              <select
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="w-full p-4 rounded-2xl bg-zinc-800 border border-zinc-700 focus:border-yellow-500 outline-none transition-colors"
              >
                <option value="">Pilih Audiens</option>
                {audienceOptions.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2 font-semibold text-zinc-300">
                Vibe Desain
              </label>
              <select
                value={vibe}
                onChange={(e) => setVibe(e.target.value)}
                className="w-full p-4 rounded-2xl bg-zinc-800 border border-zinc-700 focus:border-yellow-500 outline-none transition-colors"
              >
                <option value="">Pilih Vibe</option>
                {vibeOptions.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block mb-2 font-semibold text-zinc-300">
                Aspek Rasio
              </label>
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value)}
                className="w-full p-4 rounded-2xl bg-zinc-800 border border-zinc-700 focus:border-yellow-500 outline-none transition-colors"
              >
                <option value="">Pilih Rasio</option>
                {aspectRatioOptions.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2 font-semibold text-zinc-300">
                Promo
              </label>
              <input
                value={promo}
                onChange={(e) => setPromo(e.target.value)}
                placeholder="contoh: Beli 1 Gratis 1"
                className="w-full p-4 rounded-2xl bg-zinc-800 border border-zinc-700 focus:border-yellow-500 outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold text-zinc-300">
                Harga
              </label>
              <input
                value={harga}
                onChange={(e) => setHarga(e.target.value)}
                placeholder="contoh: Rp 15.000"
                className="w-full p-4 rounded-2xl bg-zinc-800 border border-zinc-700 focus:border-yellow-500 outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold text-zinc-300">
                Nama Brand
              </label>
              <input
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="contoh: Seblak Nampol"
                className="w-full p-4 rounded-2xl bg-zinc-800 border border-zinc-700 focus:border-yellow-500 outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold text-zinc-300">
                Keterangan Lainnya
              </label>
              <input
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                placeholder="contoh: Contact Person 081937696616"
                className="w-full p-4 rounded-2xl bg-zinc-800 border border-zinc-700 focus:border-yellow-500 outline-none transition-colors"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block mb-2 font-semibold text-zinc-300">
                Upload Gambar Produk
              </label>
              <label className="border-2 border-dashed border-zinc-700 rounded-2xl p-6 text-center hover:border-yellow-500 transition-all cursor-pointer block relative group">
                <input type="file" multiple accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  if (files.length > 4) {
                    alert('Maksimal 4 gambar produk diperbolehkan.');
                    e.target.value = '';
                    setProductImageCount(0);
                  } else {
                    setProductImageCount(files.length);
                  }
                }} />
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">📸</div>
                <h3 className="font-semibold text-base leading-tight mt-1">{productImageCount > 0 ? `${productImageCount} Produk Terupload` : 'Upload Produk'}</h3>
                <p className="text-zinc-500 mt-1 text-xs">
                  Maksimal 4 Gambar
                </p>
              </label>
            </div>

            <div className="md:col-span-2 mt-4">
              <button
                onClick={generatePrompt}
                className="w-full p-5 rounded-2xl bg-yellow-500 hover:bg-yellow-400 text-black font-black text-xl transition-all shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:shadow-[0_0_30px_rgba(234,179,8,0.5)] transform hover:-translate-y-1"
              >
                ✨ Generate Prompt AI
              </button>
            </div>
          </div>
        </div>

        {hasGenerated && (
          <div className="bg-zinc-950 border border-yellow-700/50 rounded-3xl p-8 shadow-2xl relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 to-yellow-600"></div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <h2 className="text-3xl font-bold text-yellow-400">
                🚀 Hasil Prompt AI
              </h2>
              <button
                onClick={() => navigator.clipboard.writeText(result)}
                className="px-6 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 font-bold transition-all text-white flex items-center gap-2"
              >
                <span>📋</span> Copy Prompt
              </button>
            </div>

            <div className="bg-black border border-zinc-800 rounded-2xl p-6 min-h-[150px] whitespace-pre-wrap text-zinc-300 leading-relaxed font-mono text-sm md:text-base">
              {result}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
