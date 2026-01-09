import React, { useState, useEffect } from 'react';
import { BookOpen, Calculator, Info, Calculator as CalcIcon, Coins, Users, RefreshCcw, HelpCircle, User, Heart, Plus, Minus, PieChart as PieChartIcon, ChevronDown, ChevronUp, ScrollText, AlertTriangle, Scale, List, FileText, Search, ArrowRightCircle } from 'lucide-react';

const FaraidApp = () => {
  const [activeTab, setActiveTab] = useState('belajar');

  // Lifting State Up: Memindahkan state ahli waris ke level App agar bisa diakses oleh Modul Analisis & Kalkulator
  const [globalTotalHarta, setGlobalTotalHarta] = useState(100000000);
  const [globalHutang, setGlobalHutang] = useState(0);
  const [globalWasiat, setGlobalWasiat] = useState(0);
  const [globalJenazahGender, setGlobalJenazahGender] = useState('L');
  const [globalHeirs, setGlobalHeirs] = useState({
    ayah: true,
    ibu: true,
    pasangan: true, 
    istriCount: 1,
    anakLk: 2,
    anakPr: 1,
    kakekAyah: false, 
    nenekAyah: false, 
    nenekIbu: false,  
    saudaraLk: 0,     
    saudaraPr: 0,     
    paman: 0, 
  });

  // Fungsi untuk update dari modul analisis
  const updateFromAnalysis = (analysisData) => {
    setGlobalJenazahGender(analysisData.gender);
    setGlobalHeirs(prev => ({
      ...prev,
      ...analysisData.heirs
    }));
    setActiveTab('hitung'); // Pindah otomatis ke tab hitung
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Navbar */}
      <nav className="bg-emerald-700 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 sm:py-4 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
          <div className="flex items-center space-x-2">
            <Coins className="h-6 w-6 text-yellow-300 flex-shrink-0" />
            <h1 className="text-lg sm:text-xl font-bold truncate">FaraidKu</h1>
          </div>
          <div className="flex space-x-1 sm:space-x-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
            <button
              onClick={() => setActiveTab('belajar')}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center space-x-1 text-sm whitespace-nowrap ${
                activeTab === 'belajar' ? 'bg-emerald-800 text-yellow-300' : 'hover:bg-emerald-600'
              }`}
            >
              <BookOpen className="h-4 w-4" />
              <span>Belajar</span>
            </button>
            <button
              onClick={() => setActiveTab('analisis')}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center space-x-1 text-sm whitespace-nowrap ${
                activeTab === 'analisis' ? 'bg-emerald-800 text-yellow-300' : 'hover:bg-emerald-600'
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>Analisis Cerita</span>
            </button>
            <button
              onClick={() => setActiveTab('hitung')}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center space-x-1 text-sm whitespace-nowrap ${
                activeTab === 'hitung' ? 'bg-emerald-800 text-yellow-300' : 'hover:bg-emerald-600'
              }`}
            >
              <Calculator className="h-4 w-4" />
              <span>Kalkulator</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {activeTab === 'belajar' && <LearningModule />}
        {activeTab === 'analisis' && <StoryAnalysisModule onApply={updateFromAnalysis} />}
        {activeTab === 'hitung' && (
          <CalculatorModule 
            initialData={{
              totalHarta: globalTotalHarta,
              hutang: globalHutang,
              wasiat: globalWasiat,
              jenazahGender: globalJenazahGender,
              heirs: globalHeirs
            }}
            setGlobalData={{
              setTotalHarta: setGlobalTotalHarta,
              setHutang: setGlobalHutang,
              setWasiat: setGlobalWasiat,
              setJenazahGender: setGlobalJenazahGender,
              setHeirs: setGlobalHeirs
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 text-slate-300 py-6 text-center text-xs sm:text-sm px-4">
        <p>© 2024 FaraidKu - Aplikasi Hitung Waris Islam Sederhana.</p>
        <p className="mt-1 text-slate-500">Konsultasikan hasil akhir dengan Ulama atau Ahli Faraid terpercaya.</p>
      </footer>
    </div>
  );
};

// --- KOMPONEN BARU: MODUL ANALISIS CERITA ---
const StoryAnalysisModule = ({ onApply }) => {
  const [story, setStory] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);

  const analyzeStory = () => {
    const text = story.toLowerCase();
    
    // Logika Deteksi Sederhana (Heuristik)
    let gender = 'L'; // Default jenazah Laki-laki
    const newHeirs = {
      ayah: false, ibu: false, pasangan: false, istriCount: 0,
      anakLk: 0, anakPr: 0, kakekAyah: false, nenekAyah: false,
      nenekIbu: false, saudaraLk: 0, saudaraPr: 0, paman: 0
    };

    // 1. Deteksi Gender Jenazah dari konteks Pasangan
    if (text.includes('suami') && !text.includes('istri')) {
      gender = 'P'; // Jika ada suami, jenazah perempuan
      newHeirs.pasangan = true;
    } else if (text.includes('istri')) {
      gender = 'L'; // Jika ada istri, jenazah laki-laki
      // Coba deteksi jumlah istri
      const istriMatch = text.match(/(\d+)\s*istri/);
      newHeirs.istriCount = istriMatch ? parseInt(istriMatch[1]) : 1;
      newHeirs.pasangan = true;
    }

    // 2. Deteksi Orang Tua
    if (text.includes('ayah') || text.includes('bapak') || text.includes('papa')) newHeirs.ayah = true;
    if (text.includes('ibu') || text.includes('mama') || text.includes('bunda')) newHeirs.ibu = true;

    // 3. Deteksi Anak (Regex untuk angka kata atau digit)
    const anakLkKeywords = ['anak laki', 'putra', 'anak cowok', 'anak pria'];
    const anakPrKeywords = ['anak perempuan', 'putri', 'anak cewek', 'anak wanita'];

    // Helper hitung jumlah
    const countOccurrence = (keywords, textStr) => {
        let count = 0;
        // Cek pola "2 anak laki" atau "dua anak laki"
        keywords.forEach(key => {
            const digitMatch = new RegExp(`(\\d+)\\s*${key}`).exec(textStr);
            if (digitMatch) count = Math.max(count, parseInt(digitMatch[1]));
            
            const wordMatch = new RegExp(`(seorang|satu|dua|tiga|empat|lima|enam)\\s*${key}`).exec(textStr);
            if (wordMatch) {
                const map = {seorang:1, satu:1, dua:2, tiga:3, empat:4, lima:5, enam:6};
                count = Math.max(count, map[wordMatch[1]] || 0);
            }
            
            // Jika disebut tanpa jumlah, asumsi minimal 1
            if (count === 0 && textStr.includes(key)) count = 1;
        });
        return count;
    };

    newHeirs.anakLk = countOccurrence(anakLkKeywords, text);
    newHeirs.anakPr = countOccurrence(anakPrKeywords, text);

    // 4. Deteksi Keluarga Lain
    if (text.includes('kakek')) newHeirs.kakekAyah = true;
    if (text.includes('nenek')) newHeirs.nenekAyah = true; // Simplifikasi ke nenek ayah dulu
    if (text.includes('paman')) {
        // Cek jumlah paman
        const pamanMatch = text.match(/(\d+)\s*paman/);
        newHeirs.paman = pamanMatch ? parseInt(pamanMatch[1]) : 1;
    }
    
    // Saudara
    const sdrLkKeys = ['saudara laki', 'kakak laki', 'adik laki'];
    const sdrPrKeys = ['saudara perempuan', 'kakak perempuan', 'adik perempuan'];
    newHeirs.saudaraLk = countOccurrence(sdrLkKeys, text);
    newHeirs.saudaraPr = countOccurrence(sdrPrKeys, text);

    setAnalysisResult({ gender, heirs: newHeirs });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2 flex items-center">
          <Search className="mr-2 h-6 w-6 text-emerald-600" /> 
          Analisis Cerita Waris
        </h2>
        <p className="text-slate-600 text-sm mb-6">
          Bingung mengisi form? Ceritakan saja kondisi keluarga yang ditinggalkan di sini. Sistem akan mencoba mendeteksi ahli warisnya.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Deskripsi Kasus:</label>
            <textarea
              className="w-full p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 min-h-[150px] text-sm"
              placeholder="Contoh: Ayah saya meninggal dunia. Beliau meninggalkan seorang istri, ibu kandung beliau yang masih hidup, 2 orang anak laki-laki dan 1 anak perempuan..."
              value={story}
              onChange={(e) => setStory(e.target.value)}
            ></textarea>
          </div>
          
          <button 
            onClick={analyzeStory}
            disabled={!story.trim()}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded-lg transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCcw className="mr-2 h-4 w-4" /> Analisis Teks
          </button>
        </div>

        {analysisResult && (
          <div className="mt-8 bg-slate-50 p-5 rounded-xl border border-slate-200 animate-in fade-in">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center">
              <Info className="mr-2 h-5 w-5 text-blue-500" /> Hasil Deteksi:
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-white p-3 rounded border text-sm">
                <span className="text-slate-500 block text-xs">Jenazah</span>
                <span className="font-semibold">{analysisResult.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</span>
              </div>
              
              <div className="bg-white p-3 rounded border text-sm space-y-1">
                <span className="text-slate-500 block text-xs mb-1">Ahli Waris Terdeteksi:</span>
                {analysisResult.heirs.pasangan && <div className="font-medium text-emerald-700">✓ Pasangan {analysisResult.gender === 'L' ? `(Istri: ${analysisResult.heirs.istriCount})` : '(Suami)'}</div>}
                {analysisResult.heirs.ayah && <div className="font-medium text-emerald-700">✓ Ayah</div>}
                {analysisResult.heirs.ibu && <div className="font-medium text-emerald-700">✓ Ibu</div>}
                {analysisResult.heirs.anakLk > 0 && <div className="font-medium text-emerald-700">✓ Anak Laki-laki: {analysisResult.heirs.anakLk}</div>}
                {analysisResult.heirs.anakPr > 0 && <div className="font-medium text-emerald-700">✓ Anak Perempuan: {analysisResult.heirs.anakPr}</div>}
                {analysisResult.heirs.saudaraLk > 0 && <div className="font-medium text-emerald-700">✓ Sdr Laki-laki: {analysisResult.heirs.saudaraLk}</div>}
                {(analysisResult.heirs.kakekAyah || analysisResult.heirs.nenekAyah) && <div className="font-medium text-emerald-700">✓ Kakek/Nenek</div>}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => onApply(analysisResult)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors flex items-center shadow-lg shadow-blue-200"
              >
                Gunakan Data Ini di Kalkulator <ArrowRightCircle className="ml-2 h-5 w-5" />
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-3 italic">* Periksa kembali hasil deteksi di kalkulator. Sistem mendeteksi berdasarkan kata kunci yang Anda tulis.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// --- KOMPONEN TOOLTIP (TETAP) ---
const Tooltip = ({ text }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-flex items-center ml-2 align-middle">
      <button 
        type="button"
        onClick={() => setIsVisible(!isVisible)}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="p-1 -m-1 text-slate-400 hover:text-emerald-600 transition-colors focus:outline-none"
        aria-label="Info lebih lanjut"
      >
        <HelpCircle className="h-4 w-4" />
      </button>
      {isVisible && (
        <div className="absolute z-50 w-48 sm:w-64 px-3 py-2 text-xs font-normal text-white bg-slate-800 rounded-lg shadow-xl bottom-full left-1/2 -translate-x-1/2 mb-2 pointer-events-none animate-in fade-in zoom-in duration-200">
          {text}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
        </div>
      )}
    </div>
  );
};

// --- KOMPONEN PIE CHART (TETAP) ---
const DistributionChart = ({ data }) => {
  if (!data || data.length === 0) return null;

  const activeData = data.filter(d => d.nominal > 0);
  const total = activeData.reduce((sum, item) => sum + item.nominal, 0);
  let currentAngle = 0;
  const colors = ['#10b981', '#3b82f6', '#f43f5e', '#f59e0b', '#8b5cf6', '#06b6d4', '#64748b', '#ec4899', '#84cc16'];

  const getCoordinatesForPercent = (percent) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border border-slate-100 mb-4">
      <h4 className="text-sm font-bold text-slate-700 mb-4 flex items-center">
        <PieChartIcon className="w-4 h-4 mr-2" /> Visualisasi Porsi
      </h4>
      <div className="flex flex-col sm:flex-row items-center w-full justify-around">
        <div className="relative w-48 h-48 mb-4 sm:mb-0 sm:mr-6 flex-shrink-0">
          <svg viewBox="-1 -1 2 2" className="transform -rotate-90 w-full h-full">
            {activeData.map((item, idx) => {
              const percent = item.nominal / total;
              const [startX, startY] = getCoordinatesForPercent(currentAngle);
              currentAngle += percent;
              const [endX, endY] = getCoordinatesForPercent(currentAngle);
              const pathData = `M 0 0 L ${startX} ${startY} A 1 1 0 ${percent > 0.5 ? 1 : 0} 1 ${endX} ${endY} L 0 0`;
              return (
                <path key={idx} d={pathData} fill={colors[idx % colors.length]} stroke="white" strokeWidth="0.02" />
              );
            })}
             {activeData.length === 0 && <circle cx="0" cy="0" r="1" fill="#e2e8f0" />}
          </svg>
        </div>
        <div className="flex-1 w-full sm:w-auto grid grid-cols-2 sm:grid-cols-1 gap-2">
          {activeData.map((item, idx) => (
            <div key={idx} className="flex items-center text-xs sm:text-sm">
              <span className="w-3 h-3 rounded-full mr-2 flex-shrink-0" style={{ backgroundColor: colors[idx % colors.length] }}></span>
              <span className="truncate flex-1 font-medium text-slate-600">{item.name}</span>
              <span className="font-bold text-slate-800 ml-2">{((item.nominal / total) * 100).toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- KOMPONEN FAMILY TREE INTERAKTIF (TETAP) ---
const InteractiveFamilyTree = ({ heirs, setHeirs, jenazahGender, setJenazahGender }) => {
  const [showExtended, setShowExtended] = useState(false);

  useEffect(() => {
    if (heirs.kakekAyah || heirs.nenekAyah || heirs.nenekIbu || heirs.paman > 0 || heirs.saudaraLk > 0 || heirs.saudaraPr > 0) {
      setShowExtended(true);
    }
  }, [heirs]);

  const toggleHeir = (key) => setHeirs(prev => ({ ...prev, [key]: !prev[key] }));
  const toggleGender = () => setJenazahGender(prev => prev === 'L' ? 'P' : 'L');
  const updateCount = (key, delta) => setHeirs(prev => ({ ...prev, [key]: Math.max(0, prev[key] + delta) }));

  const TreeNode = ({ label, active, isMain, isSpouse, countKey, onClick, icon, count, colorClass, small, disabled }) => {
    const isCountable = countKey !== undefined;
    const isActive = isCountable ? count > 0 : active;
    const baseSize = small ? "w-10 h-10" : "w-12 h-12 sm:w-14 sm:h-14";
    const iconSize = small ? "w-5 h-5" : "w-6 h-6 sm:w-7 sm:h-7";
    const textSize = small ? "text-[9px] leading-tight" : "text-[10px] sm:text-xs leading-tight";

    return (
      <div className={`flex flex-col items-center z-10 animate-in zoom-in group relative flex-shrink-0 mx-1 ${isMain ? 'scale-110' : ''} ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
        <button 
          onClick={onClick}
          className={`${baseSize} rounded-full border-2 flex items-center justify-center mb-1 relative shadow-sm transition-all
            ${isMain ? 'border-emerald-500 bg-emerald-100 text-emerald-700 cursor-pointer hover:bg-emerald-200' : 
              isActive 
                ? (colorClass || (isSpouse ? 'border-pink-400 bg-pink-50 text-pink-600 hover:bg-pink-100' : 'border-blue-400 bg-blue-50 text-blue-600 hover:bg-blue-100')) + ' hover:scale-105 shadow-md'
                : 'border-slate-300 bg-slate-100 text-slate-300 grayscale opacity-60 hover:opacity-100 hover:grayscale-0'
            }`}
        >
          {icon || <User className={iconSize} />}
          {isCountable && count > 0 && (
            <span className="absolute -top-1 -right-1 bg-slate-700 text-white text-[9px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">{count}</span>
          )}
        </button>
        {isCountable && !disabled && (
          <div className="absolute top-0 -right-6 flex flex-col space-y-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 p-0.5 rounded shadow-sm backdrop-blur-sm z-20">
             <button onClick={(e) => { e.stopPropagation(); updateCount(countKey, 1); }} className="w-5 h-5 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center hover:bg-emerald-200 border border-emerald-200"><Plus size={10} /></button>
             <button onClick={(e) => { e.stopPropagation(); updateCount(countKey, -1); }} className="w-5 h-5 bg-red-100 text-red-700 rounded-full flex items-center justify-center hover:bg-red-200 border border-red-200"><Minus size={10} /></button>
          </div>
        )}
        <span className={`${textSize} font-bold text-center max-w-[70px] select-none ${isMain ? 'text-emerald-800' : (isActive ? 'text-slate-700' : 'text-slate-400')}`}>{label}</span>
      </div>
    );
  };

  return (
    <div className="w-full bg-white rounded-lg border border-slate-200 p-2 sm:p-4 mb-4 relative">
      <div className="flex justify-between items-center mb-4 px-2 border-b border-slate-100 pb-2">
        <h4 className="text-sm font-bold text-slate-700 flex items-center"><Users className="w-4 h-4 mr-2" /> Struktur Keluarga</h4>
        <button onClick={() => setShowExtended(!showExtended)} className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full hover:bg-emerald-100 transition-colors">
          {showExtended ? 'Mode Ringkas' : 'Mode Lengkap'}
          {showExtended ? <ChevronUp size={14} className="ml-1" /> : <ChevronDown size={14} className="ml-1" />}
        </button>
      </div>
      <div className="w-full overflow-x-auto pb-6">
        <div className={`flex flex-col items-center transition-all duration-500 min-w-full w-fit mx-auto px-4 ${showExtended ? 'sm:px-12' : ''}`}>
          {showExtended && (
            <div className="flex justify-center items-end gap-8 sm:gap-16 mb-6 relative animate-in fade-in slide-in-from-bottom-4">
               <div className="flex flex-col items-center relative">
                  <div className="flex gap-2 sm:gap-4 mb-1">
                     <TreeNode label="Kakek (Ayah)" active={heirs.kakekAyah} onClick={() => toggleHeir('kakekAyah')} small colorClass="border-indigo-300 bg-indigo-50 text-indigo-500" />
                     <TreeNode label="Nenek (Ayah)" active={heirs.nenekAyah} onClick={() => toggleHeir('nenekAyah')} small colorClass="border-indigo-300 bg-indigo-50 text-indigo-500" />
                  </div>
                  <div className="text-[9px] text-slate-400 mb-1">Jalur Ayah</div>
                  <div className="h-6 w-px border-l-2 border-dashed border-indigo-200 absolute top-full left-1/2 -translate-x-1/2 -z-10"></div>
               </div>
               <div className="flex flex-col items-center relative">
                  <div className="flex gap-2 sm:gap-4 mb-1">
                     <div className="w-10"></div> 
                     <TreeNode label="Nenek (Ibu)" active={heirs.nenekIbu} onClick={() => toggleHeir('nenekIbu')} small colorClass="border-indigo-300 bg-indigo-50 text-indigo-500" />
                  </div>
                  <div className="text-[9px] text-slate-400 mb-1">Jalur Ibu</div>
                  <div className="h-6 w-px border-l-2 border-dashed border-indigo-200 absolute top-full right-[20%] translate-x-1/2 -z-10"></div>
               </div>
            </div>
          )}
          <div className="flex justify-center items-end relative mb-6">
            {showExtended && (
              <div className="mr-6 sm:mr-8 mb-6 animate-in fade-in slide-in-from-right-4 relative">
                 <TreeNode label="Paman" countKey="paman" count={heirs.paman} onClick={() => heirs.paman === 0 ? updateCount('paman', 1) : null} small colorClass="border-slate-400 bg-slate-50 text-slate-600" />
                  <div className="h-0.5 w-6 sm:w-8 bg-slate-300 absolute top-1/2 left-full -z-10"></div>
              </div>
            )}
            <div className="flex gap-12 sm:gap-24 relative">
               <TreeNode label="Ayah" active={heirs.ayah} onClick={() => toggleHeir('ayah')} />
               <TreeNode label="Ibu" active={heirs.ibu} onClick={() => toggleHeir('ibu')} />
               <div className="absolute top-1/2 left-10 right-10 h-0.5 border-t-2 border-slate-300 -z-10"></div>
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 h-16 w-0.5 border-l-2 border-slate-300 -z-10"></div>
            </div>
          </div>
          <div className="flex items-center justify-center relative mb-6">
             {showExtended && (
               <div className="flex flex-col items-end mr-6 sm:mr-8 pr-4 border-r-2 border-slate-100 animate-in fade-in slide-in-from-right-4">
                  <span className="text-[9px] text-slate-400 mb-1 text-right block">Sdr Kandung</span>
                  <div className="flex gap-2">
                     <TreeNode label="Lk" countKey="saudaraLk" count={heirs.saudaraLk} onClick={() => heirs.saudaraLk === 0 ? updateCount('saudaraLk', 1) : null} small colorClass="border-orange-300 bg-orange-50 text-orange-600" />
                     <TreeNode label="Pr" countKey="saudaraPr" count={heirs.saudaraPr} onClick={() => heirs.saudaraPr === 0 ? updateCount('saudaraPr', 1) : null} small colorClass="border-orange-300 bg-orange-50 text-orange-600" />
                  </div>
               </div>
             )}
            <div className="relative z-10">
              <TreeNode label={`Jenazah (${jenazahGender})`} active={true} isMain={true} icon={<User className="w-6 h-6" />} onClick={toggleGender} />
            </div>
            <div className="w-8 sm:w-16 h-0.5 border-t-2 border-dashed border-slate-400 relative mx-2"><Heart className="w-3 h-3 text-red-400 absolute -top-1.5 left-1/2 -translate-x-1/2 bg-white px-0.5" fill="currentColor" /></div>
            {jenazahGender === 'L' ? (
                <TreeNode label={`Istri (${heirs.istriCount || 0})`} countKey="istriCount" count={heirs.istriCount} onClick={() => heirs.istriCount === 0 ? updateCount('istriCount', 1) : null} isSpouse={true} icon={<User className="w-5 h-5" />} />
            ) : (
                <TreeNode label="Suami" active={heirs.pasangan} isSpouse={true} icon={<User className="w-5 h-5" />} onClick={() => toggleHeir('pasangan')} />
            )}
          </div>
          <div className="flex flex-col items-center">
             <div className="h-6 border-l-2 border-slate-300 -mt-2"></div>
             <div className="w-32 sm:w-56 border-t-2 border-slate-300 h-2 relative mb-1"><div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-300 rounded-full"></div></div>
             <div className="flex justify-center gap-8 sm:gap-16">
               <TreeNode label="Anak Laki" countKey="anakLk" count={heirs.anakLk} onClick={() => heirs.anakLk === 0 ? updateCount('anakLk', 1) : null} />
               <TreeNode label="Anak Pr" countKey="anakPr" count={heirs.anakPr} onClick={() => heirs.anakPr === 0 ? updateCount('anakPr', 1) : null} />
             </div>
          </div>
        </div>
      </div>
      <p className="text-center text-[10px] text-slate-400 mt-2 flex items-center justify-center"><Info size={10} className="mr-1"/> {showExtended ? "Geser layar kiri-kanan untuk melihat seluruh keluarga" : "Klik ikon orang untuk mengaktifkan/menonaktifkan"}</p>
    </div>
  );
};

// --- KOMPONEN BELAJAR (TETAP) ---
const LearningModule = () => {
  const [openSection, setOpenSection] = useState(null);
  const toggleSection = (idx) => setOpenSection(openSection === idx ? null : idx);
  const sections = [
    { title: "1. Pengantar & Definisi", icon: <BookOpen className="h-5 w-5 text-emerald-600" />, content: (<div className="space-y-3 text-sm text-slate-600"><p><strong>Faraid (الفرائض)</strong> adalah bentuk jamak dari <em>Faridhah</em>...</p></div>)},
    { title: "2. Dalil & Dasar Hukum", icon: <ScrollText className="h-5 w-5 text-emerald-600" />, content: (<div className="space-y-4 text-sm text-slate-600"><div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100"><p className="font-bold text-emerald-800 mb-1">QS. An-Nisa: 11</p>...</div></div>)},
    { title: "3. Rukun & Syarat", icon: <Scale className="h-5 w-5 text-emerald-600" />, content: (<div className="space-y-4 text-sm text-slate-600"><div><h5 className="font-bold text-slate-800 mb-1">Rukun Waris (3 Hal):</h5>...</div></div>)},
    { title: "4. Ahli Waris & Bagian Pasti", icon: <Users className="h-5 w-5 text-emerald-600" />, content: (<div className="space-y-4 text-sm text-slate-600"><p>Bagian pasti yang disebutkan dalam Al-Qur'an ada 6: <strong>1/2, 1/4, 1/8, 2/3, 1/3, 1/6</strong>.</p>...</div>)},
    { title: "5. Konsep Asabah", icon: <PieChartIcon className="h-5 w-5 text-emerald-600" />, content: (<div className="space-y-2 text-sm text-slate-600"><p><strong>Asabah</strong> adalah ahli waris yang menerima sisa harta...</p></div>)},
    { title: "6. Hijab (Penghalang)", icon: <List className="h-5 w-5 text-emerald-600" />, content: (<div className="space-y-2 text-sm text-slate-600"><p><strong>Hijab</strong> adalah terhalangnya seseorang...</p></div>)}
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2">Belajar Hukum Waris Islam</h2>
        <p className="text-slate-600 text-sm mb-6">Panduan lengkap ilmu Faraid dari dasar hingga rincian pembagian.</p>
        <div className="space-y-3">{sections.map((section, idx) => (<div key={idx} className="border border-slate-200 rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md bg-white"><button onClick={() => toggleSection(idx)} className="w-full flex items-center justify-between p-4 text-left bg-white hover:bg-slate-50 transition-colors"><div className="flex items-center space-x-3"><div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">{section.icon}</div><h3 className="font-bold text-slate-800 text-sm sm:text-base">{section.title}</h3></div>{openSection === idx ? <ChevronUp size={20} className="text-slate-400"/> : <ChevronDown size={20} className="text-slate-400"/>}</button>{openSection === idx && (<div className="p-4 pt-0 border-t border-slate-100 bg-white animate-in slide-in-from-top-2"><div className="pt-4">{section.content}</div></div>)}</div>))}</div>
      </div>
    </div>
  );
};

// --- KOMPONEN KALKULATOR (MODIFIED TO ACCEPT PROPS) ---
const CalculatorModule = ({ initialData, setGlobalData }) => {
  // Use global state handlers if provided, otherwise local (fallback)
  const [localTotalHarta, setLocalTotalHarta] = useState(100000000);
  const [localHutang, setLocalHutang] = useState(0);
  const [localWasiat, setLocalWasiat] = useState(0);
  const [localJenazahGender, setLocalJenazahGender] = useState('L');
  const [localHeirs, setLocalHeirs] = useState({
    ayah: true, ibu: true, pasangan: true, istriCount: 1, anakLk: 2, anakPr: 1, kakekAyah: false, nenekAyah: false, nenekIbu: false, saudaraLk: 0, saudaraPr: 0, paman: 0, 
  });

  const totalHarta = initialData ? initialData.totalHarta : localTotalHarta;
  const hutang = initialData ? initialData.hutang : localHutang;
  const wasiat = initialData ? initialData.wasiat : localWasiat;
  const jenazahGender = initialData ? initialData.jenazahGender : localJenazahGender;
  const heirs = initialData ? initialData.heirs : localHeirs;

  const setTotalHarta = setGlobalData ? setGlobalData.setTotalHarta : setLocalTotalHarta;
  const setHutang = setGlobalData ? setGlobalData.setHutang : setLocalHutang;
  const setWasiat = setGlobalData ? setGlobalData.setWasiat : setLocalWasiat;
  const setJenazahGender = setGlobalData ? setGlobalData.setJenazahGender : setLocalJenazahGender;
  const setHeirs = setGlobalData ? setGlobalData.setHeirs : setLocalHeirs;

  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const formatRupiah = (number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);

  const handleCalculate = () => {
    setError('');
    let hartaBersih = totalHarta - hutang;
    const maxWasiat = hartaBersih / 3;
    let validWasiat = wasiat > maxWasiat ? maxWasiat : wasiat;
    hartaBersih = hartaBersih - validWasiat;

    if (hartaBersih <= 0) {
      setError("Harta habis untuk hutang/pengurusan jenazah.");
      setResult(null);
      return;
    }
    calculateExtended(hartaBersih, validWasiat);
  };

  const calculateExtended = (netAsset, wasiatVal) => {
    const shares = [];
    let totalPortion = 0;
    const hasAnakLk = heirs.anakLk > 0;
    const hasAnakPr = heirs.anakPr > 0;
    const hasKids = hasAnakLk || hasAnakPr;
    const hasFather = heirs.ayah;
    const hasMother = heirs.ibu;

    if (jenazahGender === 'P' && heirs.pasangan) {
        const portion = hasKids ? 0.25 : 0.5; 
        shares.push({ name: 'Suami', portion, nominal: 0, note: hasKids ? '1/4 (Ada anak)' : '1/2 (Tidak ada anak)' });
        totalPortion += portion;
    } else if (jenazahGender === 'L' && heirs.istriCount > 0) {
        const totalWifePortion = hasKids ? 0.125 : 0.25;
        const note = `${hasKids ? '1/8' : '1/4'} dibagi ${heirs.istriCount} Istri`;
        shares.push({ name: `Istri (${heirs.istriCount} org)`, portion: totalWifePortion, nominal: 0, note });
        totalPortion += totalWifePortion;
    }

    if (hasFather) {
        shares.push({ name: 'Ayah', portion: 1/6, nominal: 0, note: hasKids ? '1/6' : '1/6 + Asabah' });
        totalPortion += 1/6;
    } else if (heirs.kakekAyah) {
        shares.push({ name: 'Kakek (dari Ayah)', portion: 1/6, nominal: 0, note: 'Pengganti Ayah' });
        totalPortion += 1/6;
    }

    if (hasMother) {
        const portion = hasKids ? 1/6 : 1/3;
        shares.push({ name: 'Ibu', portion, nominal: 0, note: hasKids ? '1/6 (Ada Keturunan)' : '1/3' });
        totalPortion += portion;
    } else {
        const nenekAyahAda = heirs.nenekAyah && !hasFather; 
        const nenekIbuAda = heirs.nenekIbu;
        if (nenekAyahAda || nenekIbuAda) {
            const label = (nenekAyahAda && nenekIbuAda) ? 'Nenek (Ayah & Ibu)' : (nenekAyahAda ? 'Nenek (Ayah)' : 'Nenek (Ibu)');
            shares.push({ name: label, portion: 1/6, nominal: 0, note: '1/6 (Pengganti Ibu)' });
            totalPortion += 1/6;
        }
    }

    if (heirs.anakPr > 0 && heirs.anakLk === 0) {
        const portion = heirs.anakPr === 1 ? 0.5 : (2/3);
        shares.push({ name: `Anak Perempuan (${heirs.anakPr})`, portion, nominal: 0, note: heirs.anakPr === 1 ? '1/2 (Tunggal)' : '2/3 (Jamak)' });
        totalPortion += portion;
    }

    const isBlockedSibling = hasAnakLk || hasFather || heirs.kakekAyah;
    let factor = 1;
    if (totalPortion > 1) factor = 1 / totalPortion;

    let distributedAmount = 0;
    shares.forEach(s => {
        s.nominal = s.portion * factor * netAsset;
        distributedAmount += s.nominal;
        if (factor < 1) s.note += " (Aul)";
    });

    let remainder = netAsset - distributedAmount;
    
    if (remainder > 100) {
        if (hasAnakLk) {
            const totalShares = (heirs.anakLk * 2) + heirs.anakPr;
            const unitVal = remainder / totalShares;
            shares.push({ name: `Anak Laki (${heirs.anakLk})`, nominal: unitVal * 2 * heirs.anakLk, note: 'Asabah (Sisa)' });
            if (hasAnakPr) shares.push({ name: `Anak Pr (${heirs.anakPr})`, nominal: unitVal * 1 * heirs.anakPr, note: 'Asabah bil Ghair' });
        } else if (hasFather) {
             const ayah = shares.find(s => s.name === 'Ayah');
             if(ayah) { ayah.nominal += remainder; ayah.note += " + Sisa"; }
        } else if (heirs.kakekAyah) {
             const kakek = shares.find(s => s.name === 'Kakek (dari Ayah)');
             if(kakek) { kakek.nominal += remainder; kakek.note += " + Sisa"; }
        } else if (!isBlockedSibling && (heirs.saudaraLk > 0 || heirs.saudaraPr > 0)) {
            if (heirs.saudaraLk > 0) {
                 const totalShares = (heirs.saudaraLk * 2) + heirs.saudaraPr;
                 const unitVal = remainder / totalShares;
                 shares.push({ name: `Sdr Kandung Lk (${heirs.saudaraLk})`, nominal: unitVal * 2 * heirs.saudaraLk, note: 'Asabah' });
                 if (heirs.saudaraPr > 0) shares.push({ name: `Sdr Kandung Pr (${heirs.saudaraPr})`, nominal: unitVal * 1 * heirs.saudaraPr, note: 'Asabah' });
            } else if (hasAnakPr) {
                shares.push({ name: `Sdr Kandung Pr (${heirs.saudaraPr})`, nominal: remainder, note: 'Asabah Ma\'a Ghair (Bersama Anak Pr)' });
            } else {
                shares.push({ name: `Sdr Kandung Pr (${heirs.saudaraPr})`, nominal: remainder, note: 'Sisa Waris (Ashabul Furud/Radd)' });
            }
        } else if (heirs.paman > 0 && !isBlockedSibling && heirs.saudaraLk === 0) { 
             shares.push({ name: `Paman (${heirs.paman})`, nominal: remainder, note: 'Asabah (Penerima Sisa Akhir)' });
        } else {
             shares.push({ name: 'Baitul Mal / Kerabat Jauh', nominal: remainder, note: 'Sisa Harta' });
        }
    }
    setResult({ hartaBersih: netAsset, wasiat: wasiatVal, details: shares });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in duration-500">
      <div className="p-4 sm:p-6 bg-emerald-50 border-b border-emerald-100">
        <h2 className="text-xl sm:text-2xl font-bold text-emerald-900 flex items-center"><Calculator className="mr-2" /> Kalkulator Waris</h2>
        <p className="text-emerald-700 text-xs sm:text-sm mt-1">Simulasi mencakup Kakek/Nenek, Saudara, Paman, dan Poligami.</p>
      </div>
      <div className="p-4 sm:p-6 grid gap-6 sm:gap-8 lg:grid-cols-2">
        <div className="space-y-5 sm:space-y-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-800 border-b pb-2 text-sm sm:text-base">1. Data Harta</h3>
            <div><label className="flex items-center text-sm font-medium text-slate-700 mb-1">Total Nilai Aset</label><div className="relative"><span className="absolute left-3 top-2.5 sm:top-2 text-slate-500 text-sm">Rp</span><input type="number" value={totalHarta} onChange={(e) => setTotalHarta(Number(e.target.value))} className="w-full pl-10 pr-4 py-2 sm:py-2 border rounded-lg text-base sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none" /></div></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="flex items-center text-sm font-medium text-slate-700 mb-1">Hutang</label><input type="number" value={hutang} onChange={(e) => setHutang(Number(e.target.value))} className="w-full px-4 py-2 border rounded-lg text-base sm:text-sm" /></div>
              <div><label className="flex items-center text-sm font-medium text-slate-700 mb-1">Wasiat</label><input type="number" value={wasiat} onChange={(e) => setWasiat(Number(e.target.value))} className="w-full px-4 py-2 border rounded-lg text-base sm:text-sm" /></div>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-800 border-b pb-2 text-sm sm:text-base">2. Kondisi Jenazah</h3>
            <div className="flex space-x-3 sm:space-x-4">
              <button onClick={() => setJenazahGender('L')} className={`flex-1 py-2 rounded-lg border text-sm ${jenazahGender === 'L' ? 'bg-emerald-100 border-emerald-500 text-emerald-800' : 'bg-white'}`}>Laki-laki</button>
              <button onClick={() => setJenazahGender('P')} className={`flex-1 py-2 rounded-lg border text-sm ${jenazahGender === 'P' ? 'bg-emerald-100 border-emerald-500 text-emerald-800' : 'bg-white'}`}>Perempuan</button>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-800 border-b pb-2 text-sm sm:text-base">3. Ahli Waris</h3>
            <div className="grid grid-cols-2 gap-3">
               <div className="bg-slate-50 p-3 rounded-lg"><span className="text-xs font-bold text-slate-500 block mb-2">Jalur Ayah</span><div className="space-y-2"><div className="flex justify-between items-center"><span className="text-sm">Kakek</span><input type="checkbox" checked={heirs.kakekAyah} onChange={(e) => setHeirs({...heirs, kakekAyah: e.target.checked})} className="h-4 w-4 text-emerald-600 rounded" /></div><div className="flex justify-between items-center"><span className="text-sm">Nenek</span><input type="checkbox" checked={heirs.nenekAyah} onChange={(e) => setHeirs({...heirs, nenekAyah: e.target.checked})} className="h-4 w-4 text-emerald-600 rounded" /></div></div></div>
               <div className="bg-slate-50 p-3 rounded-lg"><span className="text-xs font-bold text-slate-500 block mb-2">Jalur Ibu</span><div className="space-y-2"><div className="flex justify-between items-center"><span className="text-sm text-slate-400">Kakek</span><span className="text-[10px] text-slate-400">(Non-Ahli Waris)</span></div><div className="flex justify-between items-center"><span className="text-sm">Nenek</span><input type="checkbox" checked={heirs.nenekIbu} onChange={(e) => setHeirs({...heirs, nenekIbu: e.target.checked})} className="h-4 w-4 text-emerald-600 rounded" /></div></div></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg"><span className="text-sm">Ayah</span><input type="checkbox" checked={heirs.ayah} onChange={(e) => setHeirs({...heirs, ayah: e.target.checked})} className="h-5 w-5 text-emerald-600 rounded" /></div>
              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg"><span className="text-sm">Ibu</span><input type="checkbox" checked={heirs.ibu} onChange={(e) => setHeirs({...heirs, ibu: e.target.checked})} className="h-5 w-5 text-emerald-600 rounded" /></div>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg"><span className="text-xs font-bold text-slate-500 block mb-2">Saudara Kandung</span><div className="grid grid-cols-2 gap-4"><div><label className="text-[10px] text-slate-500 block mb-1">Laki-laki</label><div className="flex items-center"><button onClick={() => setHeirs({...heirs, saudaraLk: Math.max(0, heirs.saudaraLk - 1)})} className="px-2 bg-white border rounded-l h-8">-</button><span className="px-2 bg-white border-y text-sm h-8 flex items-center justify-center w-full">{heirs.saudaraLk}</span><button onClick={() => setHeirs({...heirs, saudaraLk: heirs.saudaraLk + 1})} className="px-2 bg-white border rounded-r h-8">+</button></div></div><div><label className="text-[10px] text-slate-500 block mb-1">Perempuan</label><div className="flex items-center"><button onClick={() => setHeirs({...heirs, saudaraPr: Math.max(0, heirs.saudaraPr - 1)})} className="px-2 bg-white border rounded-l h-8">-</button><span className="px-2 bg-white border-y text-sm h-8 flex items-center justify-center w-full">{heirs.saudaraPr}</span><button onClick={() => setHeirs({...heirs, saudaraPr: heirs.saudaraPr + 1})} className="px-2 bg-white border rounded-r h-8">+</button></div></div></div></div>
            <div className="bg-slate-50 p-3 rounded-lg">
              {jenazahGender === 'L' ? (
                 <div className="flex items-center justify-between"><span className="text-sm">Jumlah Istri</span><div className="flex items-center"><button onClick={() => setHeirs({...heirs, istriCount: Math.max(0, heirs.istriCount - 1)})} className="px-2 bg-white border rounded-l">-</button><span className="px-3 bg-white border-y text-sm">{heirs.istriCount}</span><button onClick={() => setHeirs({...heirs, istriCount: Math.min(4, heirs.istriCount + 1)})} className="px-2 bg-white border rounded-r">+</button></div></div>
              ) : (
                <div className="flex items-center justify-between"><span className="text-sm">Suami</span><input type="checkbox" checked={heirs.pasangan} onChange={(e) => setHeirs({...heirs, pasangan: e.target.checked})} className="h-5 w-5 text-emerald-600 rounded" /></div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
               <div><label className="text-xs text-slate-500 block mb-1">Anak Laki-laki</label><input type="number" min="0" value={heirs.anakLk} onChange={(e) => setHeirs({...heirs, anakLk: parseInt(e.target.value)||0})} className="w-full border rounded p-2 text-sm" /></div>
               <div><label className="text-xs text-slate-500 block mb-1">Anak Perempuan</label><input type="number" min="0" value={heirs.anakPr} onChange={(e) => setHeirs({...heirs, anakPr: parseInt(e.target.value)||0})} className="w-full border rounded p-2 text-sm" /></div>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg flex items-center justify-between"><span className="text-sm">Paman <span className="text-[10px] text-slate-400 block">(Saudara Lk Ayah)</span></span><div className="flex items-center"><button onClick={() => setHeirs({...heirs, paman: Math.max(0, heirs.paman - 1)})} className="px-2 bg-white border rounded-l">-</button><span className="px-3 bg-white border-y text-sm">{heirs.paman}</span><button onClick={() => setHeirs({...heirs, paman: heirs.paman + 1})} className="px-2 bg-white border rounded-r">+</button></div></div>
          </div>
        </div>
        <div className="bg-slate-50 rounded-xl border border-slate-200 flex flex-col h-full min-h-[300px] sm:min-h-auto">
           <div className="bg-white rounded-t-xl overflow-hidden">
             <div className="p-4 sm:p-5 border-b border-slate-200">
                <InteractiveFamilyTree heirs={heirs} setHeirs={setHeirs} jenazahGender={jenazahGender} setJenazahGender={setJenazahGender} />
             </div>
             <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200">
               <button onClick={handleCalculate} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-lg flex items-center justify-center space-x-2"><CalcIcon className="h-5 w-5" /><span>Hitung Pembagian</span></button>
               {error && <div className="mt-3 p-3 bg-red-50 text-red-700 text-sm rounded-lg">{error}</div>}
             </div>
           </div>
          {result && (
            <div className="flex-1 flex flex-col">
              <div className="p-4 bg-white border-b border-slate-200"><h3 className="font-bold text-slate-800 mb-2">Ringkasan</h3><div className="text-sm space-y-1"><div className="flex justify-between"><span>Harta Bersih</span><span className="font-medium text-emerald-700">{formatRupiah(result.hartaBersih)}</span></div></div></div>
              <div className="px-4 pt-4"><DistributionChart data={result.details} /></div>
              <div className="p-4 flex-1 overflow-auto space-y-3">
                  {result.details.map((item, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm"><div className="flex justify-between items-start mb-1"><span className="font-bold text-slate-800">{item.name}</span><span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full">{item.note}</span></div><div className="text-lg font-bold text-emerald-600">{formatRupiah(item.nominal)}</div></div>
                  ))}
                  {result.details.length === 0 && <div className="text-center p-4 text-slate-500 text-sm">Harta ke Baitul Mal.</div>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FaraidApp;