import React, { useState, useEffect } from 'react';
import { BookOpen, Calculator, Info, Calculator as CalcIcon, Coins, Users, RefreshCcw, HelpCircle, User, Heart, Plus, Minus, PieChart as PieChartIcon, ZoomIn, ZoomOut, Maximize } from 'lucide-react';

const FaraidApp = () => {
  const [activeTab, setActiveTab] = useState('belajar');

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Navbar */}
      <nav className="bg-emerald-700 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 sm:py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Coins className="h-6 w-6 text-yellow-300 flex-shrink-0" />
            <h1 className="text-lg sm:text-xl font-bold truncate">FaraidKu</h1>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('belajar')}
              className={`px-3 py-2 sm:px-4 rounded-lg transition-colors flex items-center space-x-1 text-sm sm:text-base ${
                activeTab === 'belajar' ? 'bg-emerald-800 text-yellow-300' : 'hover:bg-emerald-600'
              }`}
            >
              <BookOpen className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Belajar</span>
            </button>
            <button
              onClick={() => setActiveTab('hitung')}
              className={`px-3 py-2 sm:px-4 rounded-lg transition-colors flex items-center space-x-1 text-sm sm:text-base ${
                activeTab === 'hitung' ? 'bg-emerald-800 text-yellow-300' : 'hover:bg-emerald-600'
              }`}
            >
              <Calculator className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Hitung Waris</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {activeTab === 'belajar' ? <LearningModule /> : <CalculatorModule />}
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 text-slate-300 py-6 text-center text-xs sm:text-sm px-4">
        <p>© 2024 FaraidKu - Aplikasi Hitung Waris Islam Sederhana.</p>
        <p className="mt-1 text-slate-500">Konsultasikan hasil akhir dengan Ulama atau Ahli Faraid terpercaya.</p>
      </footer>
    </div>
  );
};

// --- KOMPONEN TOOLTIP ---
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

// --- KOMPONEN PIE CHART ---
const DistributionChart = ({ data }) => {
  if (!data || data.length === 0) return null;

  const activeData = data.filter(d => d.nominal > 0);
  const total = activeData.reduce((sum, item) => sum + item.nominal, 0);
  
  let currentAngle = 0;
  
  const colors = [
    '#10b981', '#3b82f6', '#f43f5e', '#f59e0b', '#8b5cf6', '#06b6d4', '#64748b', '#ec4899', '#84cc16'
  ];

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
              const largeArcFlag = percent > 0.5 ? 1 : 0;
              const pathData = `M 0 0 L ${startX} ${startY} A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY} L 0 0`;
              
              return (
                <path 
                  key={idx} 
                  d={pathData} 
                  fill={colors[idx % colors.length]} 
                  stroke="white" 
                  strokeWidth="0.02"
                />
              );
            })}
             {activeData.length === 0 && <circle cx="0" cy="0" r="1" fill="#e2e8f0" />}
          </svg>
        </div>
        <div className="flex-1 w-full sm:w-auto grid grid-cols-2 sm:grid-cols-1 gap-2">
          {activeData.map((item, idx) => (
            <div key={idx} className="flex items-center text-xs sm:text-sm">
              <span 
                className="w-3 h-3 rounded-full mr-2 flex-shrink-0" 
                style={{ backgroundColor: colors[idx % colors.length] }}
              ></span>
              <span className="truncate flex-1 font-medium text-slate-600">{item.name}</span>
              <span className="font-bold text-slate-800 ml-2">
                 {((item.nominal / total) * 100).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- KOMPONEN FAMILY TREE INTERAKTIF ---
const InteractiveFamilyTree = ({ heirs, setHeirs, jenazahGender, setJenazahGender }) => {
  const [scale, setScale] = useState(0.6); // Default scale untuk mobile agar fit

  // Reset scale saat resize window
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) {
        setScale(1); // Desktop normal size
      } else {
        setScale(0.55); // Mobile fit size
      }
    };
    
    handleResize(); // Init
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const zoomIn = () => setScale(prev => Math.min(prev + 0.1, 1.2));
  const zoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.4));
  const resetZoom = () => setScale(window.innerWidth >= 640 ? 1 : 0.55);

  const toggleHeir = (key) => {
    setHeirs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleGender = () => {
    setJenazahGender(prev => prev === 'L' ? 'P' : 'L');
  };

  const updateCount = (key, delta) => {
    setHeirs(prev => {
      const newVal = Math.max(0, prev[key] + delta);
      return { ...prev, [key]: newVal };
    });
  };

  // Node Component reusable
  const TreeNode = ({ label, active, isMain, isSpouse, countKey, onClick, icon, count, colorClass, small }) => {
    const isCountable = countKey !== undefined;
    const isActive = isCountable ? count > 0 : active;

    const baseSize = small ? "w-10 h-10" : "w-12 h-12 sm:w-14 sm:h-14";
    const iconSize = small ? "w-5 h-5" : "w-6 h-6 sm:w-7 sm:h-7";
    const textSize = small ? "text-[8px] sm:text-[9px]" : "text-[10px] sm:text-xs";

    return (
      <div className={`flex flex-col items-center z-10 transition-all duration-300 animate-in zoom-in group relative flex-shrink-0 mx-1 ${isMain ? 'scale-110' : ''}`}>
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
            <span className="absolute -top-1 -right-1 bg-slate-700 text-white text-[9px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
              {count}
            </span>
          )}
        </button>

        {isCountable && (
          <div className="absolute top-0 -right-6 flex flex-col space-y-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 p-0.5 rounded shadow-sm backdrop-blur-sm z-20">
             <button onClick={(e) => { e.stopPropagation(); updateCount(countKey, 1); }} className="w-5 h-5 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center hover:bg-emerald-200 border border-emerald-200"><Plus size={10} /></button>
             <button onClick={(e) => { e.stopPropagation(); updateCount(countKey, -1); }} className="w-5 h-5 bg-red-100 text-red-700 rounded-full flex items-center justify-center hover:bg-red-200 border border-red-200"><Minus size={10} /></button>
          </div>
        )}

        <span className={`${textSize} font-bold text-center max-w-[80px] leading-tight select-none ${isMain ? 'text-emerald-800' : (isActive ? 'text-slate-700' : 'text-slate-400')}`}>
          {label}
        </span>
      </div>
    );
  };

  return (
    <div className="w-full bg-white rounded-lg border border-slate-200 p-2 sm:p-4 mb-6 relative overflow-hidden">
      <div className="flex justify-between items-center mb-2 px-2">
        <h4 className="text-sm font-bold text-slate-700 flex items-center">
          <Users className="w-4 h-4 mr-2" /> Bagan Struktur
        </h4>
        
        {/* Zoom Controls */}
        <div className="flex items-center space-x-1 bg-slate-100 rounded-lg p-1">
           <button onClick={zoomOut} className="p-1 hover:bg-white rounded text-slate-600"><ZoomOut size={14} /></button>
           <span className="text-[10px] w-8 text-center text-slate-500">{Math.round(scale * 100)}%</span>
           <button onClick={zoomIn} className="p-1 hover:bg-white rounded text-slate-600"><ZoomIn size={14} /></button>
           <div className="w-px h-3 bg-slate-300 mx-1"></div>
           <button onClick={resetZoom} className="p-1 hover:bg-white rounded text-slate-600" title="Reset"><Maximize size={14} /></button>
        </div>
      </div>
      
      {/* Container Scalable */}
      <div className="w-full flex justify-center items-start overflow-hidden transition-all duration-300 bg-slate-50/50 rounded-lg border border-slate-100/50" style={{ height: `${360 * scale}px` }}>
        <div 
          className="origin-top transition-transform duration-300 ease-out pt-4"
          style={{ transform: `scale(${scale})` }}
        >
          <div className="min-w-[580px] flex flex-col items-center">
            
            {/* LEVEL 0: KAKEK & NENEK */}
            <div className="flex justify-between w-full max-w-lg mb-4 relative">
               {/* Jalur Ayah */}
               <div className="flex flex-col items-center">
                  <div className="flex space-x-4 mb-1">
                     <TreeNode label="Kakek (Ayah)" active={heirs.kakekAyah} onClick={() => toggleHeir('kakekAyah')} small colorClass="border-indigo-300 bg-indigo-50 text-indigo-500" />
                     <TreeNode label="Nenek (Ayah)" active={heirs.nenekAyah} onClick={() => toggleHeir('nenekAyah')} small colorClass="border-indigo-300 bg-indigo-50 text-indigo-500" />
                  </div>
                  <div className="h-4 border-l-2 border-dashed border-indigo-200"></div>
               </div>

               {/* Jalur Ibu */}
               <div className="flex flex-col items-center">
                  <div className="flex space-x-4 mb-1">
                     <div className="w-10"></div> 
                     <TreeNode label="Nenek (Ibu)" active={heirs.nenekIbu} onClick={() => toggleHeir('nenekIbu')} small colorClass="border-indigo-300 bg-indigo-50 text-indigo-500" />
                  </div>
                  <div className="h-4 border-l-2 border-dashed border-indigo-200 translate-x-6"></div>
               </div>
            </div>

            {/* LEVEL 1: ORANG TUA */}
            <div className="flex justify-between w-full max-w-md relative mb-6">
              <div className="flex flex-col items-center">
                 <TreeNode label="Ayah" active={heirs.ayah} onClick={() => toggleHeir('ayah')} />
              </div>
              
              {/* Connector Parents */}
              <div className="absolute top-1/2 left-10 right-10 h-0.5 border-t-2 border-slate-300 -z-10"></div>
              
              <div className="flex flex-col items-center">
                 <TreeNode label="Ibu" active={heirs.ibu} onClick={() => toggleHeir('ibu')} />
              </div>
            </div>

            {/* LEVEL 2: JENAZAH, SAUDARA, PASANGAN */}
            <div className="flex items-center justify-center space-x-6 relative mb-6">
               {/* Saudara Kandung */}
               <div className="flex flex-col items-end space-y-2 mr-4 border-r-2 border-slate-200 pr-4">
                  <div className="flex items-center">
                     <span className="text-[10px] text-slate-400 mr-2 text-right">Sdr<br/>Kandung</span>
                     <TreeNode 
                       label="Lk" 
                       countKey="saudaraLk"
                       count={heirs.saudaraLk}
                       onClick={() => heirs.saudaraLk === 0 ? updateCount('saudaraLk', 1) : null}
                       small
                       colorClass="border-orange-300 bg-orange-50 text-orange-600"
                     />
                     <TreeNode 
                       label="Pr" 
                       countKey="saudaraPr"
                       count={heirs.saudaraPr}
                       onClick={() => heirs.saudaraPr === 0 ? updateCount('saudaraPr', 1) : null}
                       small
                       colorClass="border-orange-300 bg-orange-50 text-orange-600"
                     />
                  </div>
               </div>

               <div className="absolute -top-6 left-1/2 h-6 border-l-2 border-slate-300"></div>

              <TreeNode 
                label={`Jenazah (${jenazahGender})`} 
                active={true} 
                isMain={true} 
                icon={<User className="w-6 h-6" />}
                onClick={toggleGender}
              />

              {/* Garis Nikah */}
              <div className="flex items-center">
                  <div className="w-8 border-t-2 border-dashed border-slate-400 relative">
                    <Heart className="w-3 h-3 text-red-400 absolute -top-1.5 left-1/2 -translate-x-1/2 bg-white px-0.5" fill="currentColor" />
                  </div>
                  {jenazahGender === 'L' ? (
                      <TreeNode 
                        label={`Istri (${heirs.istriCount || 0})`} 
                        countKey="istriCount"
                        count={heirs.istriCount}
                        onClick={() => heirs.istriCount === 0 ? updateCount('istriCount', 1) : null}
                        isSpouse={true} 
                        icon={<User className="w-5 h-5" />}
                      />
                  ) : (
                      <TreeNode 
                        label="Suami" 
                        active={heirs.pasangan} 
                        isSpouse={true} 
                        icon={<User className="w-5 h-5" />}
                        onClick={() => toggleHeir('pasangan')}
                      />
                  )}
              </div>
            </div>

            {/* LEVEL 3: ANAK-ANAK */}
            <div className="flex flex-col items-center">
               <div className="h-6 border-l-2 border-slate-300 -mt-2"></div>
               <div className="w-40 border-t-2 border-slate-300 h-2 relative mb-1">
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-300 rounded-full"></div>
               </div>
               
               <div className="flex justify-center space-x-8">
                 <TreeNode 
                   label="Anak Laki" 
                   countKey="anakLk"
                   count={heirs.anakLk}
                   onClick={() => heirs.anakLk === 0 ? updateCount('anakLk', 1) : null}
                 />
                 <TreeNode 
                   label="Anak Pr" 
                   countKey="anakPr"
                   count={heirs.anakPr}
                   onClick={() => heirs.anakPr === 0 ? updateCount('anakPr', 1) : null}
                 />
               </div>
            </div>

            {/* Paman */}
            <div className="absolute right-4 top-1/2 border-l-2 border-slate-100 pl-2">
                 <div className="text-[9px] text-slate-400 mb-1">Jalur Ayah</div>
                 <TreeNode 
                     label="Paman" 
                     countKey="paman"
                     count={heirs.paman}
                     onClick={() => heirs.paman === 0 ? updateCount('paman', 1) : null}
                     small 
                     colorClass="border-slate-400 bg-slate-50 text-slate-600" 
                  />
            </div>

          </div>
        </div>
      </div>
      <p className="text-center text-[10px] text-slate-400 -mt-2 mb-2">Gunakan tombol zoom atau klik ikon untuk edit</p>
    </div>
  );
};

// --- KOMPONEN BELAJAR ---
const LearningModule = () => {
  const topics = [
    {
      title: "Apa itu Faraid?",
      content: "Faraid adalah ilmu untuk mengetahui siapa yang berhak mewarisi dan siapa yang tidak, serta berapa kadar ukuran yang diterima oleh setiap ahli waris. Hukum ini bersumber langsung dari Al-Qur'an.",
      icon: <Info className="h-6 w-6 text-emerald-600" />
    },
    {
      title: "Hijab (Penghalang)",
      content: "Tidak semua keluarga mendapat warisan. Ada yang terhalang (Mahjub) oleh ahli waris yang lebih dekat. Contoh: Kakek terhalang oleh Ayah, Saudara terhalang oleh Anak Laki-laki.",
      icon: <Users className="h-6 w-6 text-emerald-600" />
    },
    {
      title: "Poligami (Istri > 1)",
      content: "Jika istri lebih dari satu, mereka berbagi rata bagian 1/8 (jika ada anak) atau 1/4 (jika tidak ada anak). Bagian tersebut dibagi rata sesuai jumlah istri.",
      icon: <CalcIcon className="h-6 w-6 text-emerald-600" />
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-3 sm:mb-4">Belajar Hukum Waris</h2>
        
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {topics.map((topic, idx) => (
            <div key={idx} className="bg-slate-50 p-4 sm:p-5 rounded-lg border border-slate-100 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-emerald-100 rounded-lg flex-shrink-0">
                  {topic.icon}
                </div>
                <h3 className="font-semibold text-slate-900 text-sm sm:text-base">{topic.title}</h3>
              </div>
              <div className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                {topic.content}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- KOMPONEN KALKULATOR ---
const CalculatorModule = () => {
  // State Input
  const [totalHarta, setTotalHarta] = useState(100000000);
  const [hutang, setHutang] = useState(0);
  const [wasiat, setWasiat] = useState(0);
  const [jenazahGender, setJenazahGender] = useState('L'); 
  
  // State Ahli Waris Lengkap
  const [heirs, setHeirs] = useState({
    ayah: true,
    ibu: true,
    pasangan: true, 
    istriCount: 1,
    anakLk: 2,
    anakPr: 1,
    kakekAyah: false, // Kakek dari Ayah
    nenekAyah: false, // Nenek dari Ayah
    nenekIbu: false,  // Nenek dari Ibu
    saudaraLk: 0,     // Saudara Laki Kandung
    saudaraPr: 0,     // Saudara Pr Kandung
    paman: 0, 
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // Helper format currency
  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number);
  };

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

    // 1. PASANGAN
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

    // 2. ORANG TUA & KAKEK/NENEK
    // Ayah Menghijab Kakek (Ayah) dan Nenek (Ayah) - (Nenek Ayah mahjub oleh Ayah menurut jumhur/sebagian)
    // Ibu Menghijab Nenek (Ayah) dan Nenek (Ibu)
    
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
        // Jika Ibu tidak ada, cek Nenek
        // Nenek dari Ibu dan Nenek dari Ayah berbagi 1/6 jika keduanya ada
        const nenekAyahAda = heirs.nenekAyah && !hasFather; // Nenek Ayah terhalang Ayah (Jumhur)
        const nenekIbuAda = heirs.nenekIbu;
        
        if (nenekAyahAda || nenekIbuAda) {
            const label = (nenekAyahAda && nenekIbuAda) ? 'Nenek (Ayah & Ibu)' : (nenekAyahAda ? 'Nenek (Ayah)' : 'Nenek (Ibu)');
            shares.push({ name: label, portion: 1/6, nominal: 0, note: '1/6 (Pengganti Ibu)' });
            totalPortion += 1/6;
        }
    }

    // 3. ANAK PEREMPUAN (JIKA SENDIRI TANPA ANAK LAKI)
    if (heirs.anakPr > 0 && heirs.anakLk === 0) {
        const portion = heirs.anakPr === 1 ? 0.5 : (2/3);
        shares.push({ name: `Anak Perempuan (${heirs.anakPr})`, portion, nominal: 0, note: heirs.anakPr === 1 ? '1/2 (Tunggal)' : '2/3 (Jamak)' });
        totalPortion += portion;
    }

    // 4. SAUDARA KANDUNG (Kalalah)
    // Syarat: Tidak ada Anak (Lk/Pr) dan Tidak ada Ayah (dan Kakek menurut sebagian besar).
    // Disini kita pakai blokir oleh Anak Laki, Anak Pr (mengurangi jadi asabah), dan Ayah.
    const isKalalah = !hasKids && !hasFather && !heirs.kakekAyah; 
    
    // Simplifikasi Logic Saudara untuk MVP:
    // Terhalang oleh: Anak Laki-laki, Ayah, Kakek (Jumhur).
    const isBlockedSibling = hasAnakLk || hasFather || heirs.kakekAyah;

    // --- STEP: CEK AUL ---
    let factor = 1;
    if (totalPortion > 1) {
        factor = 1 / totalPortion;
    }

    // Assign Nominal Bagian Pasti
    let distributedAmount = 0;
    shares.forEach(s => {
        s.nominal = s.portion * factor * netAsset;
        distributedAmount += s.nominal;
        if (factor < 1) s.note += " (Aul)";
    });

    // --- STEP: ASABAH (SISA) ---
    let remainder = netAsset - distributedAmount;
    
    if (remainder > 100) {
        if (hasAnakLk) {
            // 1. Anak Laki (Utama)
            const totalShares = (heirs.anakLk * 2) + heirs.anakPr;
            const unitVal = remainder / totalShares;
            shares.push({ name: `Anak Laki (${heirs.anakLk})`, nominal: unitVal * 2 * heirs.anakLk, note: 'Asabah (Sisa)' });
            if (hasAnakPr) {
                shares.push({ name: `Anak Pr (${heirs.anakPr})`, nominal: unitVal * 1 * heirs.anakPr, note: 'Asabah bil Ghair' });
            }
        } else if (hasFather) {
            // 2. Ayah
             const ayah = shares.find(s => s.name === 'Ayah');
             if(ayah) { ayah.nominal += remainder; ayah.note += " + Sisa"; }
        } else if (heirs.kakekAyah) {
            // 3. Kakek
             const kakek = shares.find(s => s.name === 'Kakek (dari Ayah)');
             if(kakek) { kakek.nominal += remainder; kakek.note += " + Sisa"; }
        } else if (!isBlockedSibling && (heirs.saudaraLk > 0 || heirs.saudaraPr > 0)) {
            // 4. Saudara Kandung
            
            if (heirs.saudaraLk > 0) {
                 const totalShares = (heirs.saudaraLk * 2) + heirs.saudaraPr;
                 const unitVal = remainder / totalShares;
                 shares.push({ name: `Sdr Kandung Lk (${heirs.saudaraLk})`, nominal: unitVal * 2 * heirs.saudaraLk, note: 'Asabah' });
                 if (heirs.saudaraPr > 0) {
                    shares.push({ name: `Sdr Kandung Pr (${heirs.saudaraPr})`, nominal: unitVal * 1 * heirs.saudaraPr, note: 'Asabah' });
                 }
            } else if (hasAnakPr) {
                // Ada Anak Pr, Saudara Pr jadi Asabah Ma'a Ghair (ambil sisa)
                shares.push({ name: `Sdr Kandung Pr (${heirs.saudaraPr})`, nominal: remainder, note: 'Asabah Ma\'a Ghair (Bersama Anak Pr)' });
            } else {
                // Tidak ada Anak, Tidak ada Saudara Lk, hanya Saudara Pr.
                shares.push({ name: `Sdr Kandung Pr (${heirs.saudaraPr})`, nominal: remainder, note: 'Sisa Waris (Ashabul Furud/Radd)' });
            }

        } else if (heirs.paman > 0 && !isBlockedSibling && heirs.saudaraLk === 0) { // Paman terhalang saudara Lk juga
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
        <h2 className="text-xl sm:text-2xl font-bold text-emerald-900 flex items-center">
          <Calculator className="mr-2" /> Kalkulator Waris
        </h2>
        <p className="text-emerald-700 text-xs sm:text-sm mt-1">Simulasi mencakup Kakek/Nenek, Saudara, Paman, dan Poligami.</p>
      </div>

      <div className="p-4 sm:p-6 grid gap-6 sm:gap-8 lg:grid-cols-2">
        {/* KOLOM KIRI: INPUT */}
        <div className="space-y-5 sm:space-y-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-800 border-b pb-2 text-sm sm:text-base">1. Data Harta</h3>
            <div>
              <label className="flex items-center text-sm font-medium text-slate-700 mb-1">
                Total Nilai Aset
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 sm:top-2 text-slate-500 text-sm">Rp</span>
                <input 
                  type="number" 
                  value={totalHarta}
                  onChange={(e) => setTotalHarta(Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-2 sm:py-2 border rounded-lg text-base sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center text-sm font-medium text-slate-700 mb-1">Hutang</label>
                <input type="number" value={hutang} onChange={(e) => setHutang(Number(e.target.value))} className="w-full px-4 py-2 border rounded-lg text-base sm:text-sm" />
              </div>
              <div>
                <label className="flex items-center text-sm font-medium text-slate-700 mb-1">Wasiat</label>
                <input type="number" value={wasiat} onChange={(e) => setWasiat(Number(e.target.value))} className="w-full px-4 py-2 border rounded-lg text-base sm:text-sm" />
              </div>
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
            
            {/* Extended Family Inputs */}
            <div className="grid grid-cols-2 gap-3">
               <div className="bg-slate-50 p-3 rounded-lg">
                  <span className="text-xs font-bold text-slate-500 block mb-2">Jalur Ayah</span>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-sm">Kakek</span>
                        <input type="checkbox" checked={heirs.kakekAyah} onChange={(e) => setHeirs({...heirs, kakekAyah: e.target.checked})} className="h-4 w-4 text-emerald-600 rounded" />
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm">Nenek</span>
                        <input type="checkbox" checked={heirs.nenekAyah} onChange={(e) => setHeirs({...heirs, nenekAyah: e.target.checked})} className="h-4 w-4 text-emerald-600 rounded" />
                    </div>
                  </div>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg">
                  <span className="text-xs font-bold text-slate-500 block mb-2">Jalur Ibu</span>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-400">Kakek</span>
                        <span className="text-[10px] text-slate-400">(Non-Ahli Waris)</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm">Nenek</span>
                        <input type="checkbox" checked={heirs.nenekIbu} onChange={(e) => setHeirs({...heirs, nenekIbu: e.target.checked})} className="h-4 w-4 text-emerald-600 rounded" />
                    </div>
                  </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg">
                <span className="text-sm">Ayah</span>
                <input type="checkbox" checked={heirs.ayah} onChange={(e) => setHeirs({...heirs, ayah: e.target.checked})} className="h-5 w-5 text-emerald-600 rounded" />
              </div>
              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg">
                <span className="text-sm">Ibu</span>
                <input type="checkbox" checked={heirs.ibu} onChange={(e) => setHeirs({...heirs, ibu: e.target.checked})} className="h-5 w-5 text-emerald-600 rounded" />
              </div>
            </div>

            {/* Saudara Kandung */}
            <div className="bg-slate-50 p-3 rounded-lg">
                <span className="text-xs font-bold text-slate-500 block mb-2">Saudara Kandung (Seayah Seibu)</span>
                <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="text-[10px] text-slate-500 block mb-1">Laki-laki</label>
                        <div className="flex items-center">
                            <button onClick={() => setHeirs({...heirs, saudaraLk: Math.max(0, heirs.saudaraLk - 1)})} className="px-2 bg-white border rounded-l h-8">-</button>
                            <span className="px-2 bg-white border-y text-sm h-8 flex items-center justify-center w-full">{heirs.saudaraLk}</span>
                            <button onClick={() => setHeirs({...heirs, saudaraLk: heirs.saudaraLk + 1})} className="px-2 bg-white border rounded-r h-8">+</button>
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] text-slate-500 block mb-1">Perempuan</label>
                        <div className="flex items-center">
                            <button onClick={() => setHeirs({...heirs, saudaraPr: Math.max(0, heirs.saudaraPr - 1)})} className="px-2 bg-white border rounded-l h-8">-</button>
                            <span className="px-2 bg-white border-y text-sm h-8 flex items-center justify-center w-full">{heirs.saudaraPr}</span>
                            <button onClick={() => setHeirs({...heirs, saudaraPr: heirs.saudaraPr + 1})} className="px-2 bg-white border rounded-r h-8">+</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dynamic Spouse Input */}
            <div className="bg-slate-50 p-3 rounded-lg">
              {jenazahGender === 'L' ? (
                 <div className="flex items-center justify-between">
                    <span className="text-sm">Jumlah Istri</span>
                    <div className="flex items-center">
                        <button onClick={() => setHeirs({...heirs, istriCount: Math.max(0, heirs.istriCount - 1)})} className="px-2 bg-white border rounded-l">-</button>
                        <span className="px-3 bg-white border-y text-sm">{heirs.istriCount}</span>
                        <button onClick={() => setHeirs({...heirs, istriCount: Math.min(4, heirs.istriCount + 1)})} className="px-2 bg-white border rounded-r">+</button>
                    </div>
                 </div>
              ) : (
                <div className="flex items-center justify-between">
                    <span className="text-sm">Suami</span>
                    <input type="checkbox" checked={heirs.pasangan} onChange={(e) => setHeirs({...heirs, pasangan: e.target.checked})} className="h-5 w-5 text-emerald-600 rounded" />
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-3">
               <div>
                  <label className="text-xs text-slate-500 block mb-1">Anak Laki-laki</label>
                  <input type="number" min="0" value={heirs.anakLk} onChange={(e) => setHeirs({...heirs, anakLk: parseInt(e.target.value)||0})} className="w-full border rounded p-2 text-sm" />
               </div>
               <div>
                  <label className="text-xs text-slate-500 block mb-1">Anak Perempuan</label>
                  <input type="number" min="0" value={heirs.anakPr} onChange={(e) => setHeirs({...heirs, anakPr: parseInt(e.target.value)||0})} className="w-full border rounded p-2 text-sm" />
               </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg flex items-center justify-between">
                <span className="text-sm">
                   Paman
                   <span className="text-[10px] text-slate-400 block">(Saudara Lk Ayah)</span>
                </span>
                <div className="flex items-center">
                    <button onClick={() => setHeirs({...heirs, paman: Math.max(0, heirs.paman - 1)})} className="px-2 bg-white border rounded-l">-</button>
                    <span className="px-3 bg-white border-y text-sm">{heirs.paman}</span>
                    <button onClick={() => setHeirs({...heirs, paman: heirs.paman + 1})} className="px-2 bg-white border rounded-r">+</button>
                </div>
            </div>

          </div>
        </div>

        {/* KOLOM KANAN */}
        <div className="bg-slate-50 rounded-xl border border-slate-200 flex flex-col h-full min-h-[300px] sm:min-h-auto">
           <div className="bg-white rounded-t-xl overflow-hidden">
             <div className="p-4 sm:p-5 border-b border-slate-200">
                <InteractiveFamilyTree 
                  heirs={heirs} 
                  setHeirs={setHeirs} 
                  jenazahGender={jenazahGender}
                  setJenazahGender={setJenazahGender}
                />
             </div>
             <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200">
               <button onClick={handleCalculate} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-lg flex items-center justify-center space-x-2">
                  <CalcIcon className="h-5 w-5" />
                  <span>Hitung Pembagian</span>
                </button>
                {error && <div className="mt-3 p-3 bg-red-50 text-red-700 text-sm rounded-lg">{error}</div>}
             </div>
           </div>

          {result && (
            <div className="flex-1 flex flex-col">
              <div className="p-4 bg-white border-b border-slate-200">
                <h3 className="font-bold text-slate-800 mb-2">Ringkasan</h3>
                <div className="text-sm space-y-1">
                   <div className="flex justify-between"><span>Harta Bersih</span><span className="font-medium text-emerald-700">{formatRupiah(result.hartaBersih)}</span></div>
                </div>
              </div>
              <div className="px-4 pt-4"><DistributionChart data={result.details} /></div>
              <div className="p-4 flex-1 overflow-auto space-y-3">
                  {result.details.map((item, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-bold text-slate-800">{item.name}</span>
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full">{item.note}</span>
                      </div>
                      <div className="text-lg font-bold text-emerald-600">{formatRupiah(item.nominal)}</div>
                    </div>
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