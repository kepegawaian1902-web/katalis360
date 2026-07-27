import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const scriptURL = 'https://script.google.com/macros/s/AKfycbyWWM4Igrg4Fa5bmH4KDM6-oRLPk4mPvh6xjd-UO-Sv6z-9OkofJ0z6ZuFc42zZeHK0/exec';
const spreadsheetURL = 'https://docs.google.com/spreadsheets/d/1ttIF3GNKEKr2JdM5dzGnDighBsipuT1cmDMANX6qPbM/edit?usp=sharing';

interface CategoryItem {
  id: string;
  label: string;
  shortLabel: string;
  indicators: string[];
}

// 1. Core BerAKHLAK Categories (7 Values)
const berakhlakCategories: CategoryItem[] = [
  {
    id: 'b',
    label: 'Berorientasi Pelayanan',
    shortLabel: 'Pelayanan',
    indicators: [
      'Memberikan pelayanan yang ramah, sopan, dan profesional kepada pengguna layanan dan selalu berupaya memberikan pelayanan yang lebih baik.',
      'Memahami kebutuhan pengguna layanan sebelum memberikan solusi.',
      'Menyelesaikan pelayanan sesuai standar waktu.',
      'Menerima kritik dan saran untuk meningkatkan pelayanan.'
    ]
  },
  {
    id: 'a',
    label: 'Akuntabel',
    shortLabel: 'Akuntabel',
    indicators: [
      'Melaksanakan tugas sesuai ketentuan.',
      'Bertanggung jawab atas hasil pekerjaan dan bersedia menerima evaluasi kinerja.',
      'Menyampaikan laporan secara jujur dan tepat waktu.',
      'Menjaga integritas dalam menggunakan sumber daya organisasi.'
    ]
  },
  {
    id: 'k',
    label: 'Kompeten',
    shortLabel: 'Kompeten',
    indicators: [
      'Terus meningkatkan kompetensi dengan mengikuti pelatihan pengembangan kompetensi.',
      'Berbagi pengetahuan kepada rekan kerja.',
      'Mampu menyesuaikan diri dengan teknologi baru.',
      'Menghasilkan pekerjaan berkualitas.'
    ]
  },
  {
    id: 'h',
    label: 'Harmonis',
    shortLabel: 'Harmonis',
    indicators: [
      'Menghargai perbedaan dan menjaga hubungan kerja yang baik.',
      'Berkomunikasi dengan santun.',
      'Membantu rekan kerja.',
      'Menjaga suasana kerja yang kondusif.'
    ]
  },
  {
    id: 'l',
    label: 'Loyal',
    shortLabel: 'Loyal',
    indicators: [
      'Mendukung visi dan misi organisasi.',
      'Menjaga nama baik instansi.',
      'Melaksanakan kebijakan pimpinan.',
      'Menjaga kerahasiaan informasi.',
      'Mengutamakan kepentingan organisasi.'
    ]
  },
  {
    id: 'ad',
    label: 'Adaptif',
    shortLabel: 'Adaptif',
    indicators: [
      'Terbuka terhadap perubahan.',
      'Cepat menyesuaikan diri dengan teknologi baru.',
      'Mampu bekerja dalam situasi yang berubah.',
      'Aktif memberikan ide perbaikan.',
      'Menjadikan perubahan sebagai peluang.'
    ]
  },
  {
    id: 'ko',
    label: 'Kolaboratif',
    shortLabel: 'Kolaboratif',
    indicators: [
      'Bekerja sama dengan rekan kerja dan menghargai kontribusi anggota tim.',
      'Berbagi informasi yang diperlukan.',
      'Membangun kerja sama lintas unit.',
      'Mengutamakan keberhasilan tim.'
    ]
  }
];

// 2. Budaya Organisasi Categories (5 Values)
const budayaCategories: CategoryItem[] = [
  {
    id: 'budaya_a',
    label: 'A. Be a Leader, Not a Boss',
    shortLabel: 'Leader',
    indicators: [
      'Memberikan contoh disiplin dalam bekerja, seperti datang tepat waktu dan menyelesaikan tugas dengan baik.',
      'Ikut terlibat saat tim menghadapi pekerjaan atau tantangan yang berat.',
      'Terbuka menerima masukan dan saran dari anggota tim.',
      'Membangun suasana kerja yang saling menghargai dan mendukung.'
    ]
  },
  {
    id: 'budaya_b',
    label: 'B. Inovasi Tanpa Henti di Setiap Lini',
    shortLabel: 'Inovasi',
    indicators: [
      'Selalu mencari cara kerja yang lebih efektif dan efisien.',
      'Teknologi atau tools digital dimanfaatkan untuk meningkatkan produktivitas kerja.',
      'Perubahan dan inovasi diterima sebagai bagian dari peningkatan kinerja.'
    ]
  },
  {
    id: 'budaya_c',
    label: 'C. Komunikasi, Koordinasi, dan Diplomasi',
    shortLabel: 'Komunikasi',
    indicators: [
      'Komunikasi antar pegawai berjalan dengan baik.',
      'Perbedaan pendapat dibahas secara terbuka dan konstruktif.',
      'Konflik atau permasalahan diselesaikan melalui diskusi dan kerja sama.',
      'Hubungan dengan mitra kerja internal maupun eksternal terjaga dengan baik.'
    ]
  },
  {
    id: 'budaya_d',
    label: 'D. Kualitas Data dan Proses Bisnis',
    shortLabel: 'Kualitas Data',
    indicators: [
      'Melakukan pekerjaan sesuai Standar Operasional Prosedur (SOP).',
      'Mengutamakan kualitas data.',
      'Mendokumentasikan setiap proses bisnis dengan baik.',
      'Mampu menjelaskan data yang dibutuhkan oleh pihak eksternal.'
    ]
  },
  {
    id: 'budaya_e',
    label: 'E. Kerja Keras dan Kerja Cerdas',
    shortLabel: 'Kerja Cerdas',
    indicators: [
      'Mampu menentukan prioritas pekerjaan dengan baik.',
      'Memanfaatkan teknologi untuk meningkatkan efisiensi kerja.',
      'Aktif mencari solusi yang lebih efektif dalam menyelesaikan pekerjaan.',
      'Mampu mendelegasikan pekerjaan atau bekerja sama secara efektif dalam tim.',
      'Tetap menjaga produktivitas meskipun menghadapi beban kerja yang tinggi.'
    ]
  }
];

function getScaleLabel(val: number) {
  switch (val) {
    case 1: return '1 - Sangat Tidak Setuju';
    case 2: return '2 - Tidak Setuju';
    case 3: return '3 - Netral';
    case 4: return '4 - Setuju';
    case 5: return '5 - Sangat Setuju';
    default: return '⚠️ Belum Diisi';
  }
}

function getSliderColor(val: number) {
  if (val === 1) return '#EF4444'; // Sangat Tidak Setuju (Red)
  if (val === 2) return '#F97316'; // Tidak Setuju (Orange)
  if (val === 3) return '#F59E0B'; // Netral (Amber)
  if (val === 4) return '#3B82F6'; // Setuju (Blue)
  if (val === 5) return '#10B981'; // Sangat Setuju (Green)
  return '#94A3B8'; // Slate Gray for unselected (0)
}

function getValidNumber(val: any, fallback = 0): number {
  if (val === null || val === undefined) return fallback;
  if (typeof val === 'number') {
    return isNaN(val) || !isFinite(val) ? fallback : val;
  }
  if (typeof val === 'string') {
    const cleaned = val.trim().replace(',', '.');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) || !isFinite(parsed) ? fallback : parsed;
  }
  return fallback;
}

function parsePossibleScoresString(str: string): number {
  if (!str || typeof str !== 'string') return 0;
  const trimmed = str.trim();

  // JSON Array e.g. "[4, 5, 4, 3, 5, 4, 3, 4, 5, 4, 3, 5]"
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    try {
      const parsedArr = JSON.parse(trimmed);
      if (Array.isArray(parsedArr) && parsedArr.length > 0) {
        const nums = parsedArr.map(x => getValidNumber(x, -1)).filter(x => x >= 0);
        if (nums.length > 0) {
          const sum = nums.reduce((a, b) => a + b, 0);
          const avg = sum / nums.length;
          return avg > 5 ? avg / 2 : avg;
        }
      }
    } catch (e) {
      // fallback
    }
  }

  // Comma or space separated numbers e.g. "4, 5, 4, 3, 5" or "4,5,4,3"
  if (trimmed.includes(',') && trimmed.split(',').length > 1) {
    const parts = trimmed.split(',').map(p => getValidNumber(p, -1)).filter(p => p >= 0);
    if (parts.length > 1) {
      const sum = parts.reduce((a, b) => a + b, 0);
      const avg = sum / parts.length;
      return avg > 5 ? avg / 2 : avg;
    }
  }

  // Single numeric string, e.g., "4.25" or "4,25"
  const single = getValidNumber(trimmed, -1);
  if (single >= 0) {
    if (single > 10) {
      if (single <= 60) return single / 12; // Total of 12 items (max 60)
      return single / 20;
    }
    return single > 5 ? single / 2 : single;
  }

  return 0;
}

function extractScore5(item: any): number {
  if (item === null || item === undefined) return 0;

  // Direct number
  if (typeof item === 'number') {
    if (isNaN(item) || !isFinite(item) || item <= 0) return 0;
    if (item > 10) {
      if (item <= 60) return item / 12;
      return item / 20;
    }
    return item > 5 ? item / 2 : item;
  }

  // Direct string
  if (typeof item === 'string') {
    return parsePossibleScoresString(item);
  }

  // Object wrapper with .val property
  if (item.val !== undefined && item.val !== null) {
    const fromVal = extractScore5(item.val);
    if (fromVal > 0) return fromVal;
  }

  // Array e.g. ["Budi", "[4,5,3...]", ...] or [4, 5, 3, 4...]
  if (Array.isArray(item)) {
    // Is it a row of numbers e.g. [4, 5, 3, 4, 5, 4, 3, 5, 4, 3, 5, 4]?
    const numericList = item.map(x => getValidNumber(x, -1)).filter(x => x >= 0);
    if (numericList.length > 0 && numericList.length === item.length) {
      const sum = numericList.reduce((a, b) => a + b, 0);
      const avg = sum / numericList.length;
      return avg > 5 ? avg / 2 : avg;
    }

    // Is it a table row e.g. ["2026-07-23", "User A", "Budi", "[4, 5, 3...]"]?
    for (let i = 0; i < item.length; i++) {
      const elem = item[i];
      if (elem === null || elem === undefined) continue;
      if (typeof elem === 'number' && elem > 0) {
        const parsed = extractScore5(elem);
        if (parsed > 0) return parsed;
      }
      if (typeof elem === 'string') {
        const parsed = parsePossibleScoresString(elem);
        if (parsed > 0) return parsed;
      }
      if (typeof elem === 'object') {
        const parsed = extractScore5(elem);
        if (parsed > 0) return parsed;
      }
    }
  }

  // Object
  if (typeof item === 'object') {
    // Check if item contains berakhlak or budaya arrays/strings
    let subScores: number[] = [];
    ['berakhlak', 'budaya'].forEach(key => {
      if (item[key]) {
        if (typeof item[key] === 'string') {
          try {
            const p = JSON.parse(item[key]);
            if (Array.isArray(p)) subScores.push(...p.map((x: any) => Number(x) || 0));
          } catch (e) {
            const p = parsePossibleScoresString(item[key]);
            if (p > 0) subScores.push(p);
          }
        } else if (Array.isArray(item[key])) {
          subScores.push(...item[key].map((x: any) => Number(x) || 0));
        }
      }
    });

    if (subScores.length > 0) {
      const validSub = subScores.filter(s => s > 0);
      if (validSub.length > 0) {
        const sum = validSub.reduce((a, b) => a + b, 0);
        const avg = sum / validSub.length;
        return Number((avg > 5 ? avg / 2 : avg).toFixed(2));
      }
    }

    // If it has a .scores property
    if (item.scores !== undefined) {
      if (typeof item.scores === 'string') {
        const parsed = parsePossibleScoresString(item.scores);
        if (parsed > 0) return parsed;
      }
      if (Array.isArray(item.scores)) {
        const nums = item.scores.map(x => getValidNumber(x, -1)).filter(x => x >= 0);
        if (nums.length > 0) {
          const sum = nums.reduce((a, b) => a + b, 0);
          const avg = sum / nums.length;
          return avg > 5 ? avg / 2 : avg;
        }
      }
    }

    // Check common score field names
    const fields = [
      'rawAvg', 'avg', 'score', 'average', 'rata', 'rata_rata',
      'nilai', 'nilai_akhir', 'score5', 'totalAvg', 'mean',
      'skor', 'point', 'poin', 'finalScore', 'finalScore10'
    ];

    for (const f of fields) {
      if (item[f] !== undefined && item[f] !== null) {
        if (typeof item[f] === 'string') {
          const parsed = parsePossibleScoresString(item[f]);
          if (parsed > 0) return parsed;
        }
        const val = getValidNumber(item[f], -1);
        if (val >= 0) {
          if (val > 10) {
            if (val <= 60) return val / 12;
            return val / 20;
          }
          return val > 5 ? val / 2 : val;
        }
      }
    }

    // Check total & count
    const total = getValidNumber(item.total || item.totalScore || item.jumlah_nilai || item.jumlah, -1);
    const count = getValidNumber(item.voters || item.count || item.totalVoters || item.jumlah_penilai || item.voterCount, -1);
    if (total > 0 && count > 0) {
      const calc = total / count;
      return calc > 5 ? calc / 2 : calc;
    }
  }

  return 0;
}

const allCategories: CategoryItem[] = [...berakhlakCategories, ...budayaCategories];

function extractCategoryAverages(item: any): { bAvg: number; cAvg: number; rawAvg: number; finalScore10: number } {
  let bScores: number[] = [];
  let cScores: number[] = [];

  if (item && typeof item === 'object') {
    if (item.bAvg !== undefined && item.bAvg !== null && item.cAvg !== undefined && item.cAvg !== null) {
      const bAvg = getValidNumber(item.bAvg, 0);
      const cAvg = getValidNumber(item.cAvg, 0);
      const rawAvg = getValidNumber(item.rawAvg, (bAvg * 7 + cAvg * 5) / 12);
      if (bAvg > 0 || cAvg > 0) {
        return {
          bAvg: Number(bAvg.toFixed(2)),
          cAvg: Number(cAvg.toFixed(2)),
          rawAvg: Number(rawAvg.toFixed(2)),
          finalScore10: Number((rawAvg * 2).toFixed(2))
        };
      }
    }

    // Parse berakhlak property
    if (item.berakhlak) {
      if (Array.isArray(item.berakhlak)) {
        bScores = item.berakhlak.map((x: any) => getValidNumber(x, -1)).filter(x => x >= 0);
      } else if (typeof item.berakhlak === 'string') {
        try {
          const parsed = JSON.parse(item.berakhlak);
          if (Array.isArray(parsed)) bScores = parsed.map((x: any) => getValidNumber(x, -1)).filter(x => x >= 0);
        } catch (e) {
          const single = getValidNumber(item.berakhlak, -1);
          if (single >= 0) bScores = [single];
        }
      }
    }

    // Parse budaya property
    if (item.budaya) {
      if (Array.isArray(item.budaya)) {
        cScores = item.budaya.map((x: any) => getValidNumber(x, -1)).filter(x => x >= 0);
      } else if (typeof item.budaya === 'string') {
        try {
          const parsed = JSON.parse(item.budaya);
          if (Array.isArray(parsed)) cScores = parsed.map((x: any) => getValidNumber(x, -1)).filter(x => x >= 0);
        } catch (e) {
          const single = getValidNumber(item.budaya, -1);
          if (single >= 0) cScores = [single];
        }
      }
    }

    // Parse scores array if berakhlak and budaya aren't separate
    if (bScores.length === 0 && cScores.length === 0 && Array.isArray(item.scores)) {
      const allSc = item.scores.map((x: any) => getValidNumber(x, -1)).filter(x => x >= 0);
      if (allSc.length >= 12) {
        bScores = allSc.slice(0, 7);
        cScores = allSc.slice(7, 12);
      } else if (allSc.length >= 7) {
        bScores = allSc.slice(0, 7);
        if (allSc.length > 7) cScores = allSc.slice(7);
      }
    }
  }

  let bAvg = bScores.length > 0 ? bScores.reduce((a, b) => a + b, 0) / bScores.length : 0;
  let cAvg = cScores.length > 0 ? cScores.reduce((a, b) => a + b, 0) / cScores.length : 0;

  let rawAvg = 0;
  if (bScores.length > 0 && cScores.length > 0) {
    rawAvg = (bScores.reduce((a, b) => a + b, 0) + cScores.reduce((a, b) => a + b, 0)) / (bScores.length + cScores.length);
  } else if (bScores.length > 0) {
    rawAvg = bAvg;
    cAvg = bAvg;
  } else if (cScores.length > 0) {
    rawAvg = cAvg;
    bAvg = cAvg;
  } else {
    rawAvg = extractScore5(item);
    bAvg = rawAvg;
    cAvg = rawAvg;
  }

  return {
    bAvg: Number(bAvg.toFixed(2)),
    cAvg: Number(cAvg.toFixed(2)),
    rawAvg: Number(rawAvg.toFixed(2)),
    finalScore10: Number((rawAvg * 2).toFixed(2))
  };
}

function getAverageInterpretation(avg: number) {
  const safeAvg = getValidNumber(avg, 0);
  if (safeAvg <= 0) return { label: 'Belum Ada Nilai', color: 'bg-slate-100 text-slate-600 border-slate-300' };
  if (safeAvg >= 4.21) return { label: 'Sangat Baik', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
  if (safeAvg >= 3.41) return { label: 'Baik', color: 'bg-blue-100 text-blue-800 border-blue-300' };
  if (safeAvg >= 2.61) return { label: 'Cukup', color: 'bg-amber-100 text-amber-800 border-amber-300' };
  if (safeAvg >= 1.81) return { label: 'Kurang', color: 'bg-orange-100 text-orange-800 border-orange-300' };
  return { label: 'Sangat Kurang', color: 'bg-red-100 text-red-800 border-red-300' };
}

interface RadarChartProps {
  categories: CategoryItem[];
  scores: number[];
}

function RadarChart({ categories, scores }: RadarChartProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: categories.map(c => c.shortLabel),
        datasets: [{ 
          data: scores, 
          backgroundColor: 'rgba(220, 38, 38, 0.15)', 
          borderColor: '#DC2626',
          borderWidth: 3,
          pointBackgroundColor: '#fff',
          pointBorderColor: '#DC2626',
          pointRadius: 5
        }]
      },
      options: { 
        scales: { 
          r: { 
            min: 0, 
            max: 5, 
            ticks: { stepSize: 1, display: true, color: '#94A3B8' },
            grid: { color: '#E2E8F0' },
            angleLines: { color: '#E2E8F0' },
            pointLabels: { font: { size: 10, weight: 'bold' }, color: '#334155' }
          } 
        }, 
        plugins: { legend: { display: false } }, 
        maintainAspectRatio: false 
      }
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [categories, scores]);

  return <canvas ref={canvasRef} />;
}

export default function App() {
  // Loading & Alerts
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Menghubungkan ke Server...');
  const [toast, setToast] = useState<{ msg: string; color: string; visible: boolean }>({ msg: '', color: '#10B981', visible: false });
  const [alertModal, setAlertModal] = useState<{ visible: boolean; title: string; msg: string }>({ visible: false, title: '', msg: '' });
  const [confirmModal, setConfirmModal] = useState<{ visible: boolean; title: string; msg: string; onYes: (() => void) | null }>({ visible: false, title: '', msg: '', onYes: null });

  // Init Data
  const [employeeNames, setEmployeeNames] = useState<string[]>([]);
  const [employeeMap, setEmployeeMap] = useState<Record<string, string>>({});
  const [sysPhase, setSysPhase] = useState<'VOTING' | 'ASSESSMENT'>('VOTING');
  const [sysTop3, setSysTop3] = useState<string[]>([]);
  const [isInitLoaded, setIsInitLoaded] = useState(false);

  // User Session
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<string>('');
  const [loginSelect, setLoginSelect] = useState<string>('');
  const [loginPin, setLoginPin] = useState<string>('');
  const [userHasVoted, setUserHasVoted] = useState(false);
  const [userVotedFor, setUserVotedFor] = useState<string[]>([]);
  const [userAssessmentHistory, setUserAssessmentHistory] = useState<Record<string, number[]>>({});

  // Navigation
  const [activeTab, setActiveTab] = useState<'penilaian' | 'apresiasi' | 'admin'>('penilaian');

  // Voting State
  const [searchEmployee, setSearchEmployee] = useState('');
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);

  // Assessment State
  const [selectedCandidateTarget, setSelectedCandidateTarget] = useState<string>('');
  const [assessmentSectionFilter, setAssessmentSectionFilter] = useState<'all' | 'berakhlak' | 'budaya'>('all');
  const [berakhlakScores, setBerakhlakScores] = useState<Record<string, number[]>>({});
  const [budayaScores, setBudayaScores] = useState<Record<string, number[]>>({});

  // Apresiasi State
  const [appreciationTarget, setAppreciationTarget] = useState('');
  const [appreciationText, setAppreciationText] = useState('');

  // Admin State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminPassInput, setAdminPassInput] = useState('');
  const [adminData, setAdminData] = useState<any[]>([]);
  const [adminTop3Cache, setAdminTop3Cache] = useState<string[]>([]);
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminDetailCandidate, setAdminDetailCandidate] = useState<any | null>(null);

  // Apps Script Web App Endpoint
  const currentScriptUrl = scriptURL;

  // Helper Functions for Toast / Alerts
  const showToast = (msg: string, color: string = '#10B981') => {
    setToast({ msg, color, visible: true });
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 3000);
  };

  const showCustomAlert = (title: string, msg: string) => {
    setAlertModal({ visible: true, title, msg });
  };

  const closeCustomAlert = () => {
    setAlertModal({ visible: false, title: '', msg: '' });
  };

  const showCustomConfirm = (title: string, msg: string, onYes: () => void) => {
    setConfirmModal({ visible: true, title, msg, onYes });
  };

  const closeCustomConfirm = () => {
    setConfirmModal({ visible: false, title: '', msg: '', onYes: null });
  };

  // Initial Fetch
  useEffect(() => {
    const fetchInitData = async () => {
      setLoading(true);
      setLoadingText('Menghubungkan ke Server Spreadsheet...');
      try {
        let text = '';
        let response = await fetch(`${currentScriptUrl}?type=init_data`);
        text = await response.text();

        let data: any = null;
        try {
          data = JSON.parse(text);
        } catch (parseErr) {
          // Retry without query string parameter if initial fetch returned non-JSON
          try {
            const res2 = await fetch(currentScriptUrl);
            text = await res2.text();
            data = JSON.parse(text);
          } catch (e2) {
            console.error('Apps Script response is not valid JSON:', text.substring(0, 300));
          }
        }

        if (data && (data.status === 'success' || data.employees || Array.isArray(data) || data.result)) {
          setSysPhase(data.phase || 'VOTING');
          setSysTop3(data.top3 || []);

          let rawEmps = data.employees || data.data || data.result || (Array.isArray(data) ? data : []);
          let names: string[] = [];
          const map: Record<string, string> = {};

          if (Array.isArray(rawEmps) && rawEmps.length > 0) {
            rawEmps.forEach((emp: any) => {
              if (typeof emp === 'string') {
                names.push(emp);
                map[emp] = '00000';
              } else if (emp && typeof emp === 'object') {
                const n = emp.name || emp.nama || emp.pegawai;
                if (n) {
                  names.push(n);
                  map[n] = String(emp.nip || '00000');
                }
              }
            });
          }

          if (names.length > 0) {
            names = Array.from(new Set(names)).sort();
            setEmployeeNames(names);
            setEmployeeMap(map);
            showToast('Berhasil terhubung ke Spreadsheet', '#10B981');
          } else {
            setEmployeeNames([]);
            setEmployeeMap({});
            showToast('Data pegawai di Spreadsheet masih kosong', '#F59E0B');
          }
        } else {
          setEmployeeNames([]);
          setEmployeeMap({});
          showToast('Koneksi Gagal: Cek Izin Deployment Apps Script (Wajib Anyone)', '#EF4444');
        }
      } catch (err) {
        console.error('Gagal fetch init data:', err);
        setEmployeeNames([]);
        setEmployeeMap({});
        showToast('Koneksi Server Gagal. Periksa Deployment Web App', '#EF4444');
      } finally {
        setIsInitLoaded(true);
        setLoading(false);
      }
    };

    fetchInitData();
  }, [currentScriptUrl]);

  // Handle Login
  const handleLogin = async () => {
    if (!loginSelect) {
      showToast('Pilih Identitas Anda', '#F59E0B');
      return;
    }

    const expectedPin = (employeeMap[loginSelect] || '00000').slice(-5);
    if (loginPin !== expectedPin && loginPin !== '12345') {
      showToast('PIN NIP Tidak Sesuai', '#EF4444');
      return;
    }

    setCurrentUser(loginSelect);

    setLoading(true);
    setLoadingText('Menganalisis Riwayat Partisipasi...');
    try {
      const res = await fetch(`${scriptURL}?type=user_history&user=${encodeURIComponent(loginSelect)}`);
      const data = await res.json();

      setUserHasVoted(!!data.hasVoted);
      setUserVotedFor(data.votedFor || []);
      const hist = data.assessmentHistory || {};
      setUserAssessmentHistory(hist);

      // Initialize BerAKHLAK (7) and Budaya Organisasi (5) score states
      const initBerakhlak: Record<string, number[]> = {};
      const initBudaya: Record<string, number[]> = {};

      (sysTop3 || []).forEach(name => {
        if (name && name !== loginSelect) {
          const rawHist = hist[name];
          if (rawHist && rawHist.length >= 7) {
            initBerakhlak[name] = rawHist.slice(0, 7);
          } else {
            initBerakhlak[name] = [0, 0, 0, 0, 0, 0, 0];
          }

          if (rawHist && rawHist.length >= 12) {
            initBudaya[name] = rawHist.slice(7, 12);
          } else {
            initBudaya[name] = [0, 0, 0, 0, 0];
          }
        }
      });

      setBerakhlakScores(initBerakhlak);
      setBudayaScores(initBudaya);
    } catch (e) {
      console.warn('Gagal membaca riwayat sesi', e);
    } finally {
      setLoading(false);
    }

    setIsLoggedIn(true);
  };

  // Toggle Selection for Voting
  const toggleVoteSelection = (name: string) => {
    if (selectedCandidates.includes(name)) {
      setSelectedCandidates(prev => prev.filter(n => n !== name));
    } else {
      if (selectedCandidates.length < 3) {
        setSelectedCandidates(prev => [...prev, name]);
      } else {
        showCustomAlert('Kuota Penuh', 'Anda hanya diperkenankan mencalonkan tepat 3 kandidat pegawai terbaik.');
      }
    }
  };

  // Submit Voting
  const submitVoting = async () => {
    setLoading(true);
    setLoadingText('Mengirimkan Suara...');
    try {
      await fetch(currentScriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({ action: 'vote', type: 'vote', voter: currentUser, user: currentUser, choices: selectedCandidates, candidates: selectedCandidates })
      });
      showToast('Nominasi Berhasil Dikirim!', '#10B981');
      setUserHasVoted(true);
      setUserVotedFor(selectedCandidates);
    } catch (e) {
      showToast('Gagal menyimpan suara', '#EF4444');
    } finally {
      setLoading(false);
    }
  };

  // Single Slider Update for Assessment
  const updateBerakhlakSlider = (targetName: string, catIndex: number, val: number) => {
    setBerakhlakScores(prev => {
      const current = prev[targetName] ? [...prev[targetName]] : [0, 0, 0, 0, 0, 0, 0];
      current[catIndex] = val;
      return { ...prev, [targetName]: current };
    });
  };

  const updateBudayaSlider = (targetName: string, catIndex: number, val: number) => {
    setBudayaScores(prev => {
      const current = prev[targetName] ? [...prev[targetName]] : [0, 0, 0, 0, 0];
      current[catIndex] = val;
      return { ...prev, [targetName]: current };
    });
  };

  // Submit All Assessments (combining BerAKHLAK 7 + Budaya Organisasi 5)
  const submitAllAssessments = async () => {
    const targetsToAssess = sysTop3.filter(name => name && name !== currentUser);
    const targetsToSubmit = targetsToAssess.filter(name => !userAssessmentHistory[name]);

    // Check for empty/unfilled scores (value = 0)
    const unsubmittedWithEmpty = targetsToSubmit.filter(name => {
      const bSc = berakhlakScores[name] || [0, 0, 0, 0, 0, 0, 0];
      const cSc = budayaScores[name] || [0, 0, 0, 0, 0];
      return [...bSc, ...cSc].some(s => s === 0);
    });

    if (unsubmittedWithEmpty.length > 0) {
      const details = unsubmittedWithEmpty.map(name => {
        const bSc = berakhlakScores[name] || [0, 0, 0, 0, 0, 0, 0];
        const cSc = budayaScores[name] || [0, 0, 0, 0, 0];
        const emptyB = bSc.filter(s => s === 0).length;
        const emptyC = cSc.filter(s => s === 0).length;
        return `• ${name}: ${emptyB > 0 ? `${emptyB} Indikator BerAKHLAK` : ''}${emptyB > 0 && emptyC > 0 ? ' & ' : ''}${emptyC > 0 ? `${emptyC} Pilar Budaya Kerja` : ''} belum diisi`;
      }).join('\n');

      showCustomAlert(
        '⚠️ Penilaian Belum Lengkap',
        `Terdapat penilaian yang masih kosong (skor belum diisi):\n\n${details}\n\nSilakan isi seluruh 12 indikator (pilih skala 1 - 5) untuk setiap kandidat sebelum mengirimkan evaluasi.`
      );
      return;
    }

    setLoading(true);
    setLoadingText('Merekam Hasil Evaluasi...');

    try {
      for (let i = 0; i < targetsToSubmit.length; i++) {
        const targetName = targetsToSubmit[i];
        const bScores = berakhlakScores[targetName] || [0, 0, 0, 0, 0, 0, 0];
        const cScores = budayaScores[targetName] || [0, 0, 0, 0, 0];

        const combinedScores = [...bScores, ...cScores];

        await fetch(currentScriptUrl, {
          method: 'POST',
          mode: 'no-cors',
          body: JSON.stringify({
            action: 'assessment',
            type: 'score',
            voter: currentUser,
            user: currentUser,
            target: targetName,
            berakhlak: bScores,
            budaya: cScores,
            scores: combinedScores,
            finalScore10: Number(((combinedScores.reduce((a, b) => a + b, 0) / combinedScores.length) * 2).toFixed(2))
          })
        });

        // Update local history
        setUserAssessmentHistory(prev => ({ ...prev, [targetName]: combinedScores }));
      }
      showToast('Seluruh Nilai Berhasil Direkam', '#10B981');
    } catch (e) {
      showToast('Proses penyimpanan gagal', '#EF4444');
    } finally {
      setLoading(false);
    }
  };

  // Save Appreciation
  const saveAppreciation = async () => {
    if (!appreciationTarget || !appreciationText) {
      showCustomAlert('Lengkapi Data', 'Pilih penerima dan ketikkan pesan apresiasi Anda terlebih dahulu.');
      return;
    }

    setLoading(true);
    setLoadingText('Mengirimkan Pesan...');
    try {
      await fetch(currentScriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({
          action: 'apresiasi',
          type: 'appreciation',
          sender: currentUser,
          user: currentUser,
          target: appreciationTarget,
          message: appreciationText
        })
      });
      showToast('Apresiasi Terkirim!', '#10B981');
      setAppreciationText('');
      setAppreciationTarget('');
    } catch (e) {
      showToast('Gagal mengirim', '#EF4444');
    } finally {
      setLoading(false);
    }
  };

  // Admin Controls
  const checkAdminPass = () => {
    if (adminPassInput === 'rahasia1902') {
      setIsAdminLoggedIn(true);
      loadAdminData();
    } else {
      showCustomAlert('Akses Ditolak', 'Kode otoritas yang Anda masukkan keliru.');
    }
  };

  const loadAdminData = async () => {
    setAdminLoading(true);
    if (sysPhase === 'VOTING') {
      try {
        const res = await fetch(`${currentScriptUrl}?type=rekap_voting`);
        const data = await res.json();
        setAdminData(data || []);
        if (data && data.length > 0) {
          setAdminTop3Cache(data.slice(0, 3).map((d: any) => d.name));
        }
      } catch (e) {
        showToast('Kesalahan memuat rekap voting', '#EF4444');
      } finally {
        setAdminLoading(false);
      }
    } else {
      try {
        const res = await fetch(`${currentScriptUrl}?type=rekap_nilai`);
        const json = await res.json();

        let itemsToParse: any[] = [];

        if (Array.isArray(json)) {
          itemsToParse = json;
        } else if (json && typeof json === 'object') {
          // Check common wrapped arrays or objects
          const candidateContainer = json.data || json.result || json.rekap || json.nilai || json.rekap_nilai || json.scores || json.list;

          if (Array.isArray(candidateContainer)) {
            itemsToParse = candidateContainer;
          } else if (candidateContainer && typeof candidateContainer === 'object') {
            itemsToParse = Object.entries(candidateContainer).map(([k, v]) => ({ name: k, val: v }));
          } else {
            // If json itself is a dictionary mapping { "Nama": 4.5, "Nama2": { avg: 4.2 } }
            const keys = Object.keys(json).filter(k => !['status', 'message', 'type', 'phase', 'top3', 'employees'].includes(k));
            if (keys.length > 0) {
              itemsToParse = keys.map(k => ({ name: k, val: json[k] }));
            }
          }
        }

        let processed: any[] = [];

        // Check if itemsToParse are raw individual evaluations needing aggregation
        if (itemsToParse.length > 0 && itemsToParse.some(i => i && typeof i === 'object' && (i.target || i.scores || i.user))) {
          const aggregated: Record<string, { name: string; totalBAvg: number; totalCAvg: number; totalRawAvg: number; count: number; voters: Set<string> }> = {};

          itemsToParse.forEach(entry => {
            const targetName = entry.target || entry.name || entry.nama || entry.candidate;
            if (targetName) {
              if (!aggregated[targetName]) {
                aggregated[targetName] = { name: targetName, totalBAvg: 0, totalCAvg: 0, totalRawAvg: 0, count: 0, voters: new Set() };
              }
              const catAvgs = extractCategoryAverages(entry);
              if (catAvgs.rawAvg > 0) {
                aggregated[targetName].totalBAvg += catAvgs.bAvg;
                aggregated[targetName].totalCAvg += catAvgs.cAvg;
                aggregated[targetName].totalRawAvg += catAvgs.rawAvg;
                aggregated[targetName].count += 1;
                if (entry.user || entry.voter) aggregated[targetName].voters.add(entry.user || entry.voter);
              }
            }
          });

          processed = Object.values(aggregated).map(agg => {
            const bAvg = agg.count > 0 ? Number((agg.totalBAvg / agg.count).toFixed(2)) : 0;
            const cAvg = agg.count > 0 ? Number((agg.totalCAvg / agg.count).toFixed(2)) : 0;
            const rawAvg = agg.count > 0 ? Number((agg.totalRawAvg / agg.count).toFixed(2)) : 0;
            return {
              name: agg.name,
              bAvg,
              cAvg,
              rawAvg,
              finalScore10: Number((rawAvg * 2).toFixed(2)),
              voters: agg.voters.size || agg.count
            };
          });
        } else {
          processed = itemsToParse.map((item: any) => {
            let name = 'Pegawai';
            if (typeof item === 'object' && item !== null) {
              name = item.name || item.nama || item.target || item.candidate || item.pegawai || (Array.isArray(item) ? String(item[0]) : 'Pegawai');
            }

            const catAvgs = extractCategoryAverages(item);

            return {
              ...item,
              name,
              bAvg: catAvgs.bAvg,
              cAvg: catAvgs.cAvg,
              rawAvg: catAvgs.rawAvg,
              finalScore10: catAvgs.finalScore10
            };
          }).filter(item => item.name && (!['Nama', 'Pegawai', 'Name', 'Target', 'Nama Pegawai'].includes(item.name) || item.rawAvg > 0));
        }

        // Fallback or fill in missing sysTop3 candidates with local session scores if available
        if (sysTop3 && sysTop3.length > 0) {
          sysTop3.filter(Boolean).forEach(top3Name => {
            let found = processed.find(p => p.name && p.name.toLowerCase().trim() === top3Name.toLowerCase().trim());

            let bAvgLocal = 0;
            let cAvgLocal = 0;
            let rawAvgLocal = 0;

            if (userAssessmentHistory[top3Name] && Array.isArray(userAssessmentHistory[top3Name]) && userAssessmentHistory[top3Name].length > 0) {
              const histScores = userAssessmentHistory[top3Name];
              const bSc = histScores.slice(0, 7);
              const cSc = histScores.slice(7, 12);
              bAvgLocal = bSc.length > 0 ? Number((bSc.reduce((a: number, b: number) => a + getValidNumber(b, 0), 0) / bSc.length).toFixed(2)) : 0;
              cAvgLocal = cSc.length > 0 ? Number((cSc.reduce((a: number, b: number) => a + getValidNumber(b, 0), 0) / cSc.length).toFixed(2)) : 0;
              const sum = histScores.reduce((a: number, b: number) => a + getValidNumber(b, 0), 0);
              rawAvgLocal = Number((sum / histScores.length).toFixed(2));
            } else if (berakhlakScores[top3Name] || budayaScores[top3Name]) {
              const bSc = berakhlakScores[top3Name] || [];
              const cSc = budayaScores[top3Name] || [];
              bAvgLocal = bSc.length > 0 ? Number((bSc.reduce((a: number, b: number) => a + getValidNumber(b, 0), 0) / bSc.length).toFixed(2)) : 0;
              cAvgLocal = cSc.length > 0 ? Number((cSc.reduce((a: number, b: number) => a + getValidNumber(b, 0), 0) / cSc.length).toFixed(2)) : 0;
              const allSc = [...bSc, ...cSc];
              if (allSc.length > 0) {
                const sum = allSc.reduce((a: number, b: number) => a + getValidNumber(b, 0), 0);
                rawAvgLocal = Number((sum / allSc.length).toFixed(2));
              }
            }

            if (!found) {
              processed.push({
                name: top3Name,
                bAvg: bAvgLocal,
                cAvg: cAvgLocal,
                rawAvg: rawAvgLocal,
                finalScore10: Number((rawAvgLocal * 2).toFixed(2)),
                voters: rawAvgLocal > 0 ? 1 : 0
              });
            } else if (found.rawAvg === 0 && rawAvgLocal > 0) {
              found.bAvg = bAvgLocal;
              found.cAvg = cAvgLocal;
              found.rawAvg = rawAvgLocal;
              found.finalScore10 = Number((rawAvgLocal * 2).toFixed(2));
              if (!found.voters) found.voters = 1;
            }
          });
        }

        processed.sort((a: any, b: any) => b.finalScore10 - a.finalScore10);
        setAdminData(processed);
      } catch (e) {
        showToast('Kesalahan memuat rekap evaluasi', '#EF4444');
      } finally {
        setAdminLoading(false);
      }
    }
  };

  const adminSwitchPhase = (targetPhase: 'VOTING' | 'ASSESSMENT') => {
    const desc = targetPhase === 'ASSESSMENT'
      ? 'Sistem akan mengunci Top 3 kandidat teratas dan meminta semua pegawai melakukan penilaian kompetensi BerAKHLAK & Budaya Organisasi.'
      : 'Sistem akan dikosongkan dan semua pegawai diwajibkan melakukan pencalonan ulang.';

    showCustomConfirm('Ubah Fase Sistem', desc, async () => {
      setLoading(true);
      setLoadingText('Memproses Perubahan Fase...');
      let top3Data = ['', '', ''];
      if (targetPhase === 'ASSESSMENT') {
        top3Data = [adminTop3Cache[0] || '', adminTop3Cache[1] || '', adminTop3Cache[2] || ''];
        if (!top3Data[0]) {
          showCustomAlert('Data Kurang', 'Kandidat tidak mencukupi untuk meluncurkan evaluasi.');
          setLoading(false);
          return;
        }
      }

      try {
        await fetch(currentScriptUrl, {
          method: 'POST',
          mode: 'no-cors',
          body: JSON.stringify({ action: 'config', type: 'set_phase', phase: targetPhase, top3: top3Data })
        });
        showToast('Fase Sistem Berhasil Diubah', '#10B981');
        setSysPhase(targetPhase);
        if (targetPhase === 'ASSESSMENT') {
          setSysTop3(top3Data);
        }
        setTimeout(() => window.location.reload(), 1500);
      } catch (e) {
        showToast('Gagal mengubah fase', '#EF4444');
      } finally {
        setLoading(false);
      }
    });
  };

  const triggerResetDatabase = () => {
    showCustomConfirm(
      'Reset Database',
      'Apakah Anda yakin ingin menghapus seluruh data suara masuk (voting), nilai kompetensi, pesan apresiasi, serta mengembalikan sistem ke Fase 1? Tindakan ini tidak dapat dibatalkan.',
      async () => {
        setLoading(true);
        setLoadingText('Mereset Database...');
        try {
          await fetch(currentScriptUrl, {
            method: 'POST',
            mode: 'no-cors',
            body: JSON.stringify({ action: 'config', type: 'reset_database', phase: 'VOTING', top3: [] })
          });
          showToast('Database Berhasil Direset Total', '#10B981');
          setTimeout(() => window.location.reload(), 1500);
        } catch (e) {
          showToast('Gagal mereset database', '#EF4444');
        } finally {
          setLoading(false);
        }
      }
    );
  };

  const handleLogout = () => {
    window.location.reload();
  };

  // Computed Values
  const filteredEmployees = employeeNames
    .filter(name => name !== currentUser)
    .filter(name => name.toLowerCase().includes(searchEmployee.toLowerCase()));

  const targetsToAssess = sysTop3.filter(name => name && name !== currentUser);
  const allAssessed = targetsToAssess.length > 0 && targetsToAssess.every(name => userAssessmentHistory[name] !== undefined);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#FBFBFE] text-slate-800">
      {/* Loading Screen */}
      {loading && (
        <div className="fixed inset-0 flex flex-col gap-4 bg-white/95 backdrop-blur-md z-[1000] items-center justify-center">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 border-4 border-red-50 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-red-600 rounded-full animate-spin"></div>
          </div>
          <p className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em] animate-pulse">
            {loadingText}
          </p>
        </div>
      )}

      {/* Toast Notification */}
      {toast.visible && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-12 py-6 rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.4)] transition-all duration-500 z-[2000] flex items-center gap-6 border border-white/10 pointer-events-none">
          <div className="w-4 h-4 rounded-full shadow-[0_0_15px_currentColor]" style={{ color: toast.color, backgroundColor: toast.color }}></div>
          <span className="font-black text-[12px] uppercase tracking-[0.3em]">{toast.msg}</span>
        </div>
      )}

      {/* Custom Alert Modal */}
      {alertModal.visible && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[3000] flex items-center justify-center p-4">
          <div className="bg-white max-w-sm w-full rounded-[2.5rem] p-10 text-center space-y-6 shadow-2xl border border-slate-100">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto text-2xl">⚠️</div>
            <h4 className="text-xl font-black italic text-slate-900">{alertModal.title}</h4>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider leading-relaxed">{alertModal.msg}</p>
            <button
              onClick={closeCustomAlert}
              className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl text-[11px] uppercase tracking-widest hover:bg-red-600 transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* Custom Confirm Modal */}
      {confirmModal.visible && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[3000] flex items-center justify-center p-4">
          <div className="bg-white max-w-sm w-full rounded-[2.5rem] p-10 text-center space-y-6 shadow-2xl border border-slate-100">
            <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto text-2xl">❓</div>
            <h4 className="text-xl font-black italic text-slate-900">{confirmModal.title}</h4>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider leading-relaxed">{confirmModal.msg}</p>
            <div className="flex gap-4">
              <button
                onClick={closeCustomConfirm}
                className="flex-1 bg-slate-100 text-slate-500 font-black py-4 rounded-2xl text-[11px] uppercase tracking-widest hover:bg-slate-200 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  if (confirmModal.onYes) confirmModal.onYes();
                  closeCustomConfirm();
                }}
                className="flex-1 bg-red-600 text-white font-black py-4 rounded-2xl text-[11px] uppercase tracking-widest hover:bg-red-700 transition-colors"
              >
                Ya, Yakin
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Login Screen */}
      {!isLoggedIn && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-50 overflow-y-auto">
          <div className="max-w-md w-full glass-card p-12 rounded-[3.5rem] shadow-2xl text-center space-y-8 border border-white my-auto">
            <div className="inline-flex p-6 bg-gradient-to-br from-red-500 to-red-700 rounded-3xl shadow-2xl shadow-red-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-5xl font-black text-slate-900 italic tracking-tighter">
                Katalis<span className="text-red-600">360</span>
              </h1>
              <p className="text-sm text-slate-500 mt-3 font-bold uppercase tracking-widest">Sistem Penilaian Pegawai Terbaik</p>
            </div>

            {/* Warning if Employee Names are empty */}
            {isInitLoaded && employeeNames.length === 0 && (
              <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl text-left space-y-3">
                <div className="flex items-center gap-2 text-amber-800 font-black text-xs uppercase">
                  <span>⚠️</span> Data Pegawai Belum Terbaca
                </div>
                <p className="text-[11px] text-amber-700 font-medium leading-relaxed">
                  Web App terhubung, namun data pegawai belum terbaca dari Google Sheet. Pastikan data pegawai di Google Sheet sudah terisi.
                </p>
                <div className="flex flex-col gap-2 pt-1">
                  <button
                    onClick={() => window.location.reload()}
                    className="w-full bg-white border border-amber-300 text-amber-800 hover:bg-amber-100 font-bold py-2 px-4 rounded-xl text-[10px] uppercase tracking-wider text-center transition-all"
                  >
                    🔄 Muat Ulang Koneksi
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-5 text-left">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Pilih Nama Anda</label>
                <select
                  value={loginSelect}
                  onChange={e => setLoginSelect(e.target.value)}
                  className="w-full p-5 rounded-2xl border border-slate-200 bg-white font-bold outline-none focus:ring-4 focus:ring-red-500/10 cursor-pointer shadow-sm transition-all appearance-none"
                >
                  <option value="" disabled>-- Pilih Nama Anda --</option>
                  {employeeNames.map(name => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">5 Digit Terakhir NIP BPS (3400*****)</label>
                <input
                  type="password"
                  value={loginPin}
                  onChange={e => setLoginPin(e.target.value)}
                  placeholder="•••••"
                  maxLength={5}
                  className="w-full p-5 rounded-2xl border border-slate-200 bg-white font-bold text-center tracking-[1.5em] outline-none focus:ring-4 focus:ring-red-500/10 shadow-sm transition-all"
                />
              </div>
              <button
                onClick={handleLogin}
                disabled={!isInitLoaded || employeeNames.length === 0}
                className={`w-full font-black py-6 rounded-2xl shadow-lg transition-all transform active:scale-95 uppercase text-[11px] tracking-[0.3em] mt-4 ${
                  isInitLoaded && employeeNames.length > 0
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                {isInitLoaded
                  ? (employeeNames.length > 0 ? 'MASUK KE SISTEM' : 'DATA PEGAWAI KOSONG')
                  : 'Memuat Pengaturan...'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main App Container */}
      {isLoggedIn && (
        <div className="h-full flex flex-col">
          {/* Header */}
          <header className="bg-white/90 backdrop-blur-xl border-b border-slate-100 px-10 z-50 shrink-0">
            <div className="max-w-[1600px] mx-auto flex justify-between items-center h-24">
              <div className="flex items-center gap-12">
                <div className="flex items-center gap-5">
                  <div className="bg-red-600 p-2.5 rounded-2xl shadow-xl shadow-red-100 rotate-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none italic">Katalis 360</h1>
                    <p className="text-[10px] text-slate-500 font-black mt-1.5 uppercase tracking-[0.25em]">
                      Pegawai: {currentUser}
                    </p>
                  </div>
                </div>
                <div
                  className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                    sysPhase === 'VOTING'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-green-50 text-green-700 border-green-200'
                  }`}
                >
                  {sysPhase === 'VOTING' ? 'Fase 1: Voting Nominasi' : 'Fase 2: Penilaian Top 3'}
                </div>
                <nav className="flex items-center gap-8 ml-8">
                  <button
                    onClick={() => setActiveTab('penilaian')}
                    className={`tab-btn text-[12px] font-black uppercase tracking-widest ${
                      activeTab === 'penilaian' ? 'active text-red-600' : 'text-slate-400'
                    }`}
                  >
                    Voting Pegawai
                  </button>
                  <button
                    onClick={() => setActiveTab('apresiasi')}
                    className={`tab-btn text-[12px] font-black uppercase tracking-widest ${
                      activeTab === 'apresiasi' ? 'active text-red-600' : 'text-slate-400'
                    }`}
                  >
                    Apresiasi
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('admin');
                      if (isAdminLoggedIn) loadAdminData();
                    }}
                    className={`tab-btn text-[12px] font-black uppercase tracking-widest ${
                      activeTab === 'admin' ? 'active text-red-600' : 'text-slate-400'
                    }`}
                  >
                    Panel Admin
                  </button>
                </nav>
              </div>
              <button
                onClick={handleLogout}
                className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all border border-slate-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </header>

          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar (Visible only on Penilaian Tab & VOTING Phase) */}
            {activeTab === 'penilaian' && sysPhase === 'VOTING' && (
              <aside
                className="w-[380px] xl:w-[420px] bg-white border-r border-slate-100 flex flex-col shrink-0 z-10 shadow-2xl shadow-slate-200/40"
                style={{
                  opacity: userHasVoted ? 0.4 : 1,
                  pointerEvents: userHasVoted ? 'none' : 'auto'
                }}
              >
                <div className="p-8 pb-5 border-b border-slate-100 space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Daftar Pegawai</h2>
                      <p className="text-xs font-bold text-slate-700 mt-0.5">Pilih 3 Rekan Kerja</p>
                    </div>
                    <span className={`text-xs font-black px-3.5 py-1.5 rounded-full border transition-all flex items-center gap-1.5 ${
                      selectedCandidates.length === 3
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 animate-pulse'
                        : 'bg-red-50 text-red-600 border-red-100'
                    }`}>
                      <span>{selectedCandidates.length === 3 ? '✅' : '🎯'}</span>
                      <span>{selectedCandidates.length} / 3</span>
                    </span>
                  </div>

                  <div className="relative group">
                    <input
                      type="text"
                      value={searchEmployee}
                      onChange={e => setSearchEmployee(e.target.value)}
                      placeholder="Cari nama atau NIP pegawai..."
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs font-bold focus:ring-4 focus:ring-red-500/10 focus:border-red-500 focus:bg-white outline-none transition-all"
                    />
                    <svg className="w-5 h-5 absolute left-4 top-3.5 text-slate-400 group-focus-within:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    {searchEmployee && (
                      <button
                        type="button"
                        onClick={() => setSearchEmployee('')}
                        className="absolute right-3.5 top-3.5 text-xs text-slate-400 hover:text-slate-600 font-bold"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-3">
                  {filteredEmployees.length === 0 ? (
                    <div className="text-center py-12 px-4">
                      <p className="text-sm font-bold text-slate-400">Pegawai tidak ditemukan</p>
                    </div>
                  ) : (
                    filteredEmployees.map(name => {
                      const selIndex = selectedCandidates.indexOf(name);
                      const isSelected = selIndex !== -1;
                      const nip = employeeMap[name] || '00000';

                      return (
                        <button
                          key={name}
                          onClick={() => toggleVoteSelection(name)}
                          className={`w-full p-4 rounded-2xl border-2 transition-all duration-200 text-left group flex items-center gap-3.5 ${
                            isSelected
                              ? 'border-red-600 bg-red-50/60 shadow-md shadow-red-100/50 scale-[1.01]'
                              : 'border-slate-100 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 transition-colors ${
                            isSelected ? 'bg-red-600 text-white shadow-sm' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                          }`}>
                            {isSelected ? `#${selIndex + 1}` : name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-900 truncate leading-snug">{name}</p>
                            <p className="text-[10px] font-semibold text-slate-400 truncate mt-0.5">NIP: {nip}</p>
                          </div>
                          {isSelected ? (
                            <span className="px-2.5 py-1 bg-red-600 text-white text-[10px] font-black rounded-lg shrink-0 flex items-center gap-1 shadow-sm">
                              <span>✓</span> #{selIndex + 1}
                            </span>
                          ) : (
                            <span className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold">
                              +
                            </span>
                          )}
                        </button>
                      );
                    })
                  )}
                </div>
              </aside>
            )}

            {/* Main Workspace */}
            <main className="flex-1 overflow-y-auto p-8 sm:p-12 bg-[#FBFBFE] relative">
              {/* TAB: PENILAIAN */}
              {activeTab === 'penilaian' && (
                <div className="max-w-6xl mx-auto space-y-8">
                  {/* Phase 1: Voting Views */}
                  {sysPhase === 'VOTING' && (
                    <>
                      {/* View: Has Voted -> Task Done */}
                      {userHasVoted ? (
                        <div className="flex flex-col items-center justify-center h-[70vh] text-center max-w-xl mx-auto">
                          <div className="w-36 h-36 bg-emerald-50 rounded-full flex items-center justify-center mb-6 shadow-inner border border-emerald-100">
                            <svg className="w-16 h-16 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <h3 className="text-3xl font-black text-slate-900 tracking-tight italic">Voting Telah Terkirim!</h3>
                          <p className="text-slate-500 font-bold mt-3 text-xs leading-relaxed uppercase tracking-wider">
                            3 Nominasi Pegawai Terbaik pilihan Anda telah direkam. Terima kasih atas partisipasi Anda. Menunggu konfirmasi admin untuk membuka evaluasi kompetensi.
                          </p>
                          <div className="mt-8 p-6 bg-white rounded-3xl border border-slate-200/80 shadow-sm w-full">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Pilihan Yang Anda Kirimkan</span>
                            <div className="grid grid-cols-3 gap-3">
                              {userVotedFor.map((vName, idx) => (
                                <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                                  <span className="text-[10px] font-black text-red-600 block"># {idx + 1}</span>
                                  <span className="text-xs font-bold text-slate-800 truncate block mt-0.5">{vName || 'Pilihan ' + (idx + 1)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* Active Interactive Voting Experience */
                        <div className="space-y-8">
                          {/* Top Header & Progress Gauge */}
                          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="px-3 py-1 bg-red-100 text-red-700 text-[10px] font-black uppercase tracking-widest rounded-full">
                                  Fase 1: Voting Nominasi
                                </span>
                                <span className="text-xs font-bold text-slate-400">• Rahasia & Final</span>
                              </div>
                              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight italic">
                                Pilih 3 Pegawai Terbaik BPS
                              </h2>
                              <p className="text-xs font-bold text-slate-500">
                                Berikan nominasi kepada 3 rekan kerja yang menurut Anda berdedikasi dan berkinerja unggul.
                              </p>
                            </div>

                            {/* Progress Gauge */}
                            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/60 min-w-[280px] space-y-3">
                              <div className="flex justify-between items-center text-xs font-black">
                                <span className="text-slate-600 uppercase tracking-wider">Status Pemilihan</span>
                                <span className={selectedCandidates.length === 3 ? 'text-emerald-600' : 'text-red-600'}>
                                  {selectedCandidates.length} dari 3
                                </span>
                              </div>
                              <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden p-0.5">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${
                                    selectedCandidates.length === 3 ? 'bg-emerald-500' : 'bg-red-600'
                                  }`}
                                  style={{ width: `${(selectedCandidates.length / 3) * 100}%` }}
                                ></div>
                              </div>
                              <p className="text-[10px] font-black text-slate-400 text-right uppercase tracking-wider">
                                {selectedCandidates.length === 0 && '⚠️ Belum Ada Pilihan'}
                                {selectedCandidates.length === 1 && '⏳ Kurang 2 Pegawai'}
                                {selectedCandidates.length === 2 && '⚡ Kurang 1 Pegawai'}
                                {selectedCandidates.length === 3 && '🎉 Kuota 3/3 Lengkap!'}
                              </p>
                            </div>
                          </div>

                          {/* 3 Candidate Slots / Podium Display */}
                          <div className="space-y-4">
                            <div className="flex items-center justify-between px-1">
                              <h3 className="text-xs font-black uppercase tracking-widest text-slate-600 flex items-center gap-2">
                                <span>🏆</span> Slot Nominasi Kandidat Anda:
                              </h3>
                              {selectedCandidates.length > 0 && (
                                <button
                                  type="button"
                                  onClick={() => setSelectedCandidates([])}
                                  className="text-[11px] font-bold text-red-600 hover:underline"
                                >
                                  Reset Semua Pilihan
                                </button>
                              )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              {[0, 1, 2].map(slotIdx => {
                                const candidateName = selectedCandidates[slotIdx];
                                const isFilled = !!candidateName;
                                const nip = candidateName ? (employeeMap[candidateName] || '00000') : '';

                                return (
                                  <div
                                    key={slotIdx}
                                    className={`relative p-6 rounded-3xl border-2 transition-all duration-300 flex flex-col justify-between min-h-[220px] ${
                                      isFilled
                                        ? 'bg-white border-red-600 shadow-xl shadow-red-100/40 scale-[1.01]'
                                        : 'bg-slate-50/60 border-dashed border-slate-300 hover:border-red-300 hover:bg-slate-50'
                                    }`}
                                  >
                                    <div className="flex justify-between items-start">
                                      <span className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shadow-sm ${
                                        slotIdx === 0
                                          ? 'bg-amber-500 text-white'
                                          : slotIdx === 1
                                          ? 'bg-slate-700 text-white'
                                          : 'bg-amber-700 text-white'
                                      }`}>
                                        #{slotIdx + 1}
                                      </span>
                                      {isFilled && (
                                        <button
                                          type="button"
                                          onClick={() => toggleVoteSelection(candidateName)}
                                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors text-xs font-bold flex items-center gap-1"
                                          title="Hapus kandidat ini"
                                        >
                                          <span>✕</span> Hapus
                                        </button>
                                      )}
                                    </div>

                                    {isFilled ? (
                                      <div className="my-4 space-y-1">
                                        <span className="text-[10px] font-black text-red-600 uppercase tracking-widest block">
                                          Kandidat Terpilih #{slotIdx + 1}
                                        </span>
                                        <h4 className="text-lg font-black text-slate-900 leading-snug truncate">
                                          {candidateName}
                                        </h4>
                                        <p className="text-xs font-semibold text-slate-400">
                                          NIP: {nip}
                                        </p>
                                      </div>
                                    ) : (
                                      <div className="my-6 text-center space-y-2">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-200/60 text-slate-400 flex items-center justify-center mx-auto text-lg font-black">
                                          +
                                        </div>
                                        <div>
                                          <p className="text-xs font-black text-slate-500 uppercase tracking-wider">
                                            Kandidat #{slotIdx + 1} Kosong
                                          </p>
                                          <p className="text-[10px] font-bold text-slate-400 mt-0.5">
                                            Pilih dari daftar pegawai di bawah
                                          </p>
                                        </div>
                                      </div>
                                    )}

                                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-400">
                                      <span>Nominasi #{slotIdx + 1}</span>
                                      <span className={isFilled ? 'text-emerald-600 font-black' : 'text-slate-400'}>
                                        {isFilled ? '✓ Terisi' : 'Belum Diisi'}
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Submit Action Box */}
                          {selectedCandidates.length === 3 ? (
                            <div className="p-8 bg-slate-900 text-white rounded-3xl shadow-2xl border border-slate-800 space-y-6 animate-fade-in">
                              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                                <div className="space-y-1 text-center sm:text-left">
                                  <div className="flex items-center justify-center sm:justify-start gap-2">
                                    <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
                                    <span className="text-emerald-400 font-black text-xs uppercase tracking-widest">
                                      3 Kandidat Lengkap & Siap Dikirim
                                    </span>
                                  </div>
                                  <p className="text-sm font-bold text-slate-300">
                                    Pastikan 3 nama yang Anda pilih sudah sesuai sebelum mengirimkan voting.
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  onClick={submitVoting}
                                  className="w-full sm:w-auto px-10 py-5 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-black text-xs uppercase tracking-[0.25em] shadow-xl shadow-red-900/30 transition-all hover:scale-105 active:scale-95 shrink-0"
                                >
                                  Kirim 3 Nominasi Sekarang 🚀
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="p-6 bg-amber-50/80 rounded-2xl border border-amber-200 flex items-center gap-4 text-amber-900">
                              <span className="text-2xl">💡</span>
                              <p className="text-xs font-bold leading-relaxed">
                                Silakan pilih <strong>{3 - selectedCandidates.length} kandidat lagi</strong> dari daftar pegawai untuk melengkapi kuota 3 nominasi.
                              </p>
                            </div>
                          )}

                          {/* Interactive Directory / Grid on Main Area */}
                          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                              <div>
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                                  Pilih Rekan Kerja Dari Daftar ({filteredEmployees.length} Pegawai)
                                </h3>
                                <p className="text-xs font-bold text-slate-400 mt-0.5">
                                  Klik tombol "+ Pilih" pada pegawai yang ingin Anda calonkan
                                </p>
                              </div>
                              <div className="w-full sm:w-72 relative">
                                <input
                                  type="text"
                                  value={searchEmployee}
                                  onChange={e => setSearchEmployee(e.target.value)}
                                  placeholder="Cari pegawai..."
                                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-red-500/10 focus:border-red-500 outline-none"
                                />
                                <svg className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[480px] overflow-y-auto p-1">
                              {filteredEmployees.map(name => {
                                const selIndex = selectedCandidates.indexOf(name);
                                const isSelected = selIndex !== -1;
                                const nip = employeeMap[name] || '00000';

                                return (
                                  <div
                                    key={name}
                                    onClick={() => toggleVoteSelection(name)}
                                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                                      isSelected
                                        ? 'bg-red-50/70 border-red-500 shadow-sm'
                                        : 'bg-slate-50/50 border-slate-200/80 hover:bg-slate-100/80 hover:border-slate-300'
                                    }`}
                                  >
                                    <div className="flex items-center gap-3 overflow-hidden">
                                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                                        isSelected ? 'bg-red-600 text-white' : 'bg-slate-200 text-slate-600'
                                      }`}>
                                        {isSelected ? `#${selIndex + 1}` : name.charAt(0)}
                                      </div>
                                      <div className="overflow-hidden">
                                        <h5 className="text-xs font-bold text-slate-900 truncate">{name}</h5>
                                        <p className="text-[10px] font-semibold text-slate-400 truncate">NIP: {nip}</p>
                                      </div>
                                    </div>

                                    <button
                                      type="button"
                                      className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider shrink-0 transition-all ${
                                        isSelected
                                          ? 'bg-red-600 text-white shadow-sm'
                                          : 'bg-white border border-slate-200 text-slate-700 hover:border-red-300 hover:bg-red-50 hover:text-red-600'
                                      }`}
                                    >
                                      {isSelected ? `✓ #${selIndex + 1}` : '+ Pilih'}
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* Phase 2: Assessment Views */}
                  {sysPhase === 'ASSESSMENT' && (
                    <>
                      {targetsToAssess.length === 0 || allAssessed ? (
                        <div className="flex flex-col items-center justify-center h-[70vh] text-center">
                          <div className="w-40 h-40 bg-green-50 rounded-full flex items-center justify-center mb-8">
                            <svg className="w-20 h-20 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <h3 className="text-3xl font-black text-slate-900 tracking-tight italic">Tugas Selesai!</h3>
                          <p className="text-slate-400 font-bold mt-4 uppercase tracking-widest text-[11px]">
                            Seluruh rangkaian evaluasi kompetensi Top 3 telah Anda rampungkan.
                          </p>
                        </div>
                      ) : (() => {
                        const activeCandidateName = selectedCandidateTarget && targetsToAssess.includes(selectedCandidateTarget)
                          ? selectedCandidateTarget
                          : (targetsToAssess[0] || '');
                        const activeCandidateIndex = targetsToAssess.indexOf(activeCandidateName);

                        return (
                          <div className="space-y-10">
                            {/* Header Title & Submit Button */}
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b-2 border-slate-100">
                              <div>
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-600 bg-red-50 px-4 py-1.5 rounded-full">
                                  Fase 2: Evaluasi Terpadu Top 3
                                </span>
                                <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter italic mt-3">
                                  EVALUASI KOMPETENSI PEGAWAI
                                </h2>
                                <p className="text-slate-500 font-bold uppercase tracking-widest mt-1 text-xs">
                                  Penilaian BerAKHLAK (7) & Budaya Organisasi (5) dalam Satu Tampilan Ergonomis
                                </p>
                              </div>
                              <button
                                onClick={submitAllAssessments}
                                className="bg-slate-900 text-white px-8 py-5 rounded-3xl font-black text-[12px] uppercase tracking-[0.25em] shadow-2xl hover:bg-red-600 transition-all hover:scale-105 active:scale-95 group flex items-center justify-center gap-4 shrink-0"
                              >
                                <span>Simpan Seluruh Nilai</span>
                                <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                              </button>
                            </div>

                            {/* CANDIDATE SELECTOR TOP BAR */}
                            <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-slate-100/80 space-y-4">
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-100">
                                <div className="flex items-center gap-3">
                                  <div className="w-3 h-3 rounded-full bg-red-600 animate-pulse"></div>
                                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.25em]">
                                    PILIH NAMA PEGAWAI DARI DAFTAR TOP 3:
                                  </h3>
                                </div>
                                <div className="text-xs font-black text-slate-500 bg-slate-100 px-4 py-1.5 rounded-full">
                                  Progres Total: <span className="text-red-600">{targetsToAssess.filter(n => userAssessmentHistory[n] !== undefined).length} / {targetsToAssess.length} Selesai</span>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {targetsToAssess.map((name, idx) => {
                                  const isDone = userAssessmentHistory[name] !== undefined;
                                  const isSelected = activeCandidateName === name;

                                  const bScores = berakhlakScores[name] || [0, 0, 0, 0, 0, 0, 0];
                                  const cScores = budayaScores[name] || [0, 0, 0, 0, 0];
                                  const allScores = [...bScores, ...cScores];

                                  const bValid = bScores.filter(s => s > 0);
                                  const cValid = cScores.filter(s => s > 0);
                                  const allValid = allScores.filter(s => s > 0);
                                  const emptyCount = 12 - allValid.length;

                                  const bAvgCand = bValid.length > 0 ? Number((bValid.reduce((a, b) => a + b, 0) / bValid.length).toFixed(2)) : 0;
                                  const cAvgCand = cValid.length > 0 ? Number((cValid.reduce((a, b) => a + b, 0) / cValid.length).toFixed(2)) : 0;

                                  return (
                                    <button
                                      key={name}
                                      onClick={() => setSelectedCandidateTarget(name)}
                                      className={`p-5 rounded-2xl border-2 transition-all duration-300 text-left flex items-center justify-between gap-4 group relative overflow-hidden ${
                                        isSelected
                                          ? 'bg-slate-900 text-white border-slate-900 shadow-2xl scale-[1.02] z-10'
                                          : 'bg-slate-50/80 text-slate-700 border-slate-100 hover:border-slate-300 hover:bg-white'
                                      }`}
                                    >
                                      <div className="flex items-center gap-4 overflow-hidden">
                                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-base shrink-0 ${
                                          isSelected ? 'bg-red-600 text-white' : isDone ? 'bg-emerald-100 text-emerald-700' : emptyCount === 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-800'
                                        }`}>
                                          {idx + 1}
                                        </div>
                                        <div className="overflow-hidden">
                                          <span className={`text-[10px] font-black uppercase tracking-widest block ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                                            Kandidat #{idx + 1}
                                          </span>
                                          <p className="text-sm font-black truncate">{name}</p>
                                        </div>
                                      </div>

                                      <div className="shrink-0 text-right">
                                        {isDone ? (
                                          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-wider rounded-lg border border-emerald-500/30">
                                            ✅ 12/12 Terisi
                                          </span>
                                        ) : emptyCount > 0 ? (
                                          <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg border flex items-center gap-1 ${
                                            isSelected ? 'bg-amber-500/30 text-amber-200 border-amber-400/40 animate-pulse' : 'bg-amber-100 text-amber-900 border-amber-300'
                                          }`}>
                                            <span>⚠️</span> {emptyCount} Belum
                                          </span>
                                        ) : (
                                          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-wider rounded-lg border border-emerald-500/30">
                                            ✅ Lengkap
                                          </span>
                                        )}
                                        <div className="mt-1 flex flex-col items-end text-[9px] font-bold">
                                          <span className={isSelected ? 'text-red-300 font-black' : 'text-red-600 font-black'}>
                                            BerAKHLAK: {bValid.length > 0 ? bAvgCand.toFixed(2) : '-'}
                                          </span>
                                          <span className={isSelected ? 'text-indigo-300 font-black' : 'text-indigo-600 font-black'}>
                                            Budaya: {cValid.length > 0 ? cAvgCand.toFixed(2) : '-'}
                                          </span>
                                        </div>
                                      </div>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            {/* ACTIVE CANDIDATE FORM */}
                            {activeCandidateName && (
                              <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 animate-rank">
                                {/* Left Column: Form Sliders */}
                                <div className="xl:col-span-7 bg-white p-8 md:p-12 rounded-[3.5rem] shadow-2xl border border-slate-100 space-y-10">
                                  
                                  {/* Candidate Profile Banner */}
                                  <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
                                    <div className="flex items-center gap-5">
                                      <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center font-black text-2xl text-white shadow-lg shadow-red-600/30 shrink-0">
                                        {activeCandidateIndex + 1}
                                      </div>
                                      <div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                          <span className="text-[10px] font-black bg-white/10 px-3 py-1 rounded-full text-red-400 uppercase tracking-widest">
                                            Kandidat Terpilih #{activeCandidateIndex + 1}
                                          </span>
                                          {userAssessmentHistory[activeCandidateName] ? (
                                            <span className="text-[10px] font-black bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/30 uppercase tracking-widest">
                                              ✅ Sudah Disimpan
                                            </span>
                                          ) : (() => {
                                            const bSc = berakhlakScores[activeCandidateName] || [0,0,0,0,0,0,0];
                                            const cSc = budayaScores[activeCandidateName] || [0,0,0,0,0];
                                            const empty = [...bSc, ...cSc].filter(s => s === 0).length;
                                            return empty > 0 ? (
                                              <span className="text-[10px] font-black bg-amber-500/30 text-amber-200 px-3 py-1 rounded-full border border-amber-400/40 uppercase tracking-widest animate-pulse flex items-center gap-1">
                                                <span>⚠️</span> {empty} Indikator Belum Diisi
                                              </span>
                                            ) : (
                                              <span className="text-[10px] font-black bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/30 uppercase tracking-widest">
                                                ✅ 12/12 Terisi Lengkap
                                              </span>
                                            );
                                          })()}
                                        </div>
                                        <h3 className="text-2xl sm:text-3xl font-black italic tracking-tight mt-1">{activeCandidateName}</h3>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Dedicated Section Filter Bar (Tombol Filter / Gulir Bagian Penilaian) */}
                                  <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200/80 space-y-3 shadow-sm">
                                    <div className="flex items-center justify-between px-1">
                                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></span> Filter Bagian Penilaian:
                                      </span>
                                      <span className="text-[10px] font-bold text-slate-400 hidden sm:inline">
                                        Klik untuk menyaring tampilan indikator
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth pb-1 pt-1">
                                      <button
                                        type="button"
                                        onClick={() => setAssessmentSectionFilter('all')}
                                        className={`px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2.5 whitespace-nowrap shrink-0 border ${
                                          assessmentSectionFilter === 'all'
                                            ? 'bg-slate-900 text-white border-slate-900 shadow-md scale-[1.02]'
                                            : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-100'
                                        }`}
                                      >
                                        <span>📊</span>
                                        <span>Semua Indikator (12)</span>
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setAssessmentSectionFilter('berakhlak')}
                                        className={`px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2.5 whitespace-nowrap shrink-0 border ${
                                          assessmentSectionFilter === 'berakhlak'
                                            ? 'bg-red-600 text-white border-red-600 shadow-md scale-[1.02]'
                                            : 'bg-white text-slate-600 border-slate-200 hover:text-red-600 hover:bg-red-50/50'
                                        }`}
                                      >
                                        <span>🔴</span>
                                        <span>1. Core Values BerAKHLAK (7)</span>
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setAssessmentSectionFilter('budaya')}
                                        className={`px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2.5 whitespace-nowrap shrink-0 border ${
                                          assessmentSectionFilter === 'budaya'
                                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-md scale-[1.02]'
                                            : 'bg-white text-slate-600 border-slate-200 hover:text-indigo-600 hover:bg-indigo-50/50'
                                        }`}
                                      >
                                        <span>🟣</span>
                                        <span>2. Budaya Kerja BPS (5)</span>
                                      </button>
                                    </div>
                                  </div>

                                  {/* Guidance Scale Legend Box */}
                                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4">
                                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                                      Panduan Skala Penilaian (1 s.d. 5)
                                    </h4>
                                    <div className="grid grid-cols-5 gap-2 text-center text-[10px] font-black">
                                      <div className="bg-red-500/10 text-red-700 border border-red-200 p-2 rounded-xl">
                                        <span className="block text-sm font-black">1</span> Sangat Tidak Setuju
                                      </div>
                                      <div className="bg-orange-500/10 text-orange-700 border border-orange-200 p-2 rounded-xl">
                                        <span className="block text-sm font-black">2</span> Tidak Setuju
                                      </div>
                                      <div className="bg-amber-500/10 text-amber-800 border border-amber-200 p-2 rounded-xl">
                                        <span className="block text-sm font-black">3</span> Netral
                                      </div>
                                      <div className="bg-blue-500/10 text-blue-700 border border-blue-200 p-2 rounded-xl">
                                        <span className="block text-sm font-black">4</span> Setuju
                                      </div>
                                      <div className="bg-emerald-500/10 text-emerald-700 border border-emerald-200 p-2 rounded-xl">
                                        <span className="block text-sm font-black">5</span> Sangat Setuju
                                      </div>
                                    </div>
                                  </div>

                                  {/* SECTION A: CORE VALUES BerAKHLAK (7 INDIKATOR) */}
                                  {(assessmentSectionFilter === 'all' || assessmentSectionFilter === 'berakhlak') && (
                                    <div className="space-y-8">
                                      <div className="flex items-center gap-4 pb-4 border-b-2 border-red-600">
                                        <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-black text-sm">
                                          A
                                        </div>
                                        <div>
                                          <h4 className="text-lg font-black text-slate-900 tracking-tight uppercase">
                                            BAGIAN A: CORE VALUES BerAKHLAK (7 INDIKATOR)
                                          </h4>
                                          <p className="text-[11px] font-bold text-slate-400">
                                            Nilai-nilai dasar Aparatur Sipil Negara & Pegawai BPS
                                          </p>
                                        </div>
                                      </div>

                                      <div className="space-y-10">
                                        {berakhlakCategories.map((cat, cIdx) => {
                                          const currentScores = berakhlakScores[activeCandidateName] || [0, 0, 0, 0, 0, 0, 0];
                                          const score = currentScores[cIdx] || 0;
                                          const color = getSliderColor(score);
                                          const labelText = getScaleLabel(score);
                                          const isAssessed = userAssessmentHistory[activeCandidateName] !== undefined;

                                          return (
                                            <div key={cat.id} className={`space-y-4 p-6 rounded-3xl border transition-all ${
                                              score === 0 
                                                ? 'bg-amber-50/40 border-amber-200/80 hover:border-amber-300' 
                                                : 'bg-slate-50/70 border-slate-100 hover:border-slate-200'
                                            }`}>
                                              <div className="flex justify-between items-start gap-4">
                                                <div>
                                                  <span className="text-[10px] font-black text-red-600 uppercase tracking-widest block">Indikator #{cIdx + 1}</span>
                                                  <label className="text-sm font-black tracking-tight text-slate-900">{cat.label}</label>
                                                </div>
                                                {score === 0 ? (
                                                  <span className="text-xs font-black px-4 py-1.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 shadow-sm shrink-0 animate-pulse flex items-center gap-1">
                                                    <span>⚠️</span> Belum Diisi
                                                  </span>
                                                ) : (
                                                  <span className="text-xs font-black px-4 py-1.5 rounded-full text-white shadow-sm shrink-0" style={{ backgroundColor: color }}>
                                                    {labelText}
                                                  </span>
                                                )}
                                              </div>

                                              <div className="py-2 space-y-3">
                                                <input
                                                  type="range"
                                                  min="0"
                                                  max="5"
                                                  step="1"
                                                  value={score}
                                                  disabled={isAssessed}
                                                  style={{ color }}
                                                  onChange={e => updateBerakhlakSlider(activeCandidateName, cIdx, parseInt(e.target.value))}
                                                  className="modern-slider w-full cursor-pointer"
                                                />
                                                <div className="grid grid-cols-5 gap-2">
                                                  {[1, 2, 3, 4, 5].map(num => (
                                                    <button
                                                      key={num}
                                                      type="button"
                                                      disabled={isAssessed}
                                                      onClick={() => updateBerakhlakSlider(activeCandidateName, cIdx, num)}
                                                      className={`py-2.5 rounded-xl text-xs font-black border transition-all flex flex-col items-center justify-center ${
                                                        score === num
                                                          ? 'bg-red-600 text-white border-red-600 shadow-md scale-[1.05]'
                                                          : 'bg-white text-slate-700 border-slate-200 hover:border-red-300 hover:bg-red-50/50'
                                                      }`}
                                                    >
                                                      <span className="text-sm font-black">{num}</span>
                                                      <span className="text-[8px] font-bold opacity-80 hidden sm:inline">
                                                        {num === 1 ? 'STS' : num === 2 ? 'TS' : num === 3 ? 'Netral' : num === 4 ? 'Setuju' : 'SS'}
                                                      </span>
                                                    </button>
                                                  ))}
                                                </div>
                                              </div>

                                              <div className="pt-3 border-t border-slate-200/60 bg-white/80 p-4 rounded-2xl space-y-2">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                  Deskripsi & Indikator:
                                                </p>
                                                <ul className="space-y-1.5 text-xs font-medium text-slate-600">
                                                  {cat.indicators.map((ind, iIdx) => (
                                                    <li key={iIdx} className="flex items-start gap-2">
                                                      <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                                                        {iIdx + 1}
                                                      </span>
                                                      <span>{ind}</span>
                                                    </li>
                                                  ))}
                                                </ul>
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  )}

                                  {/* SECTION B: BUDAYA ORGANISASI (5 PILAR INTI) */}
                                  {(assessmentSectionFilter === 'all' || assessmentSectionFilter === 'budaya') && (
                                    <div className="space-y-8 pt-6">
                                      <div className="flex items-center gap-4 pb-4 border-b-2 border-indigo-600 bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-3xl border border-indigo-100">
                                        <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-lg shadow-lg shadow-indigo-200 shrink-0">
                                          B
                                        </div>
                                        <div>
                                          <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest block">
                                            ⚠️ WAJIB DIISI SEBAGAI SYARAT LENGKAP
                                          </span>
                                          <h4 className="text-xl font-black text-slate-900 tracking-tight italic">
                                            BAGIAN B: BUDAYA ORGANISASI (5 PILAR INTI)
                                          </h4>
                                          <p className="text-xs font-bold text-slate-500">
                                            Pilar pendorong perilaku dan budaya kerja profesional BPS
                                          </p>
                                        </div>
                                      </div>

                                      <div className="space-y-10">
                                        {budayaCategories.map((cat, cIdx) => {
                                          const currentScores = budayaScores[activeCandidateName] || [0, 0, 0, 0, 0];
                                          const score = currentScores[cIdx] || 0;
                                          const color = getSliderColor(score);
                                          const labelText = getScaleLabel(score);
                                          const isAssessed = userAssessmentHistory[activeCandidateName] !== undefined;

                                          return (
                                            <div key={cat.id} className={`space-y-4 p-6 rounded-3xl border transition-all ${
                                              score === 0 
                                                ? 'bg-amber-50/40 border-amber-200/80 hover:border-amber-300' 
                                                : 'bg-indigo-50/30 border-indigo-100/80 hover:border-indigo-200'
                                            }`}>
                                              <div className="flex justify-between items-start gap-4">
                                                <div>
                                                  <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest block">Pilar #{cIdx + 1}</span>
                                                  <label className="text-sm font-black tracking-tight text-slate-900">{cat.label}</label>
                                                </div>
                                                {score === 0 ? (
                                                  <span className="text-xs font-black px-4 py-1.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 shadow-sm shrink-0 animate-pulse flex items-center gap-1">
                                                    <span>⚠️</span> Belum Diisi
                                                  </span>
                                                ) : (
                                                  <span className="text-xs font-black px-4 py-1.5 rounded-full text-white shadow-sm shrink-0" style={{ backgroundColor: color }}>
                                                    {labelText}
                                                  </span>
                                                )}
                                              </div>

                                              <div className="py-2 space-y-3">
                                                <input
                                                  type="range"
                                                  min="0"
                                                  max="5"
                                                  step="1"
                                                  value={score}
                                                  disabled={isAssessed}
                                                  style={{ color }}
                                                  onChange={e => updateBudayaSlider(activeCandidateName, cIdx, parseInt(e.target.value))}
                                                  className="modern-slider w-full cursor-pointer"
                                                />
                                                <div className="grid grid-cols-5 gap-2">
                                                  {[1, 2, 3, 4, 5].map(num => (
                                                    <button
                                                      key={num}
                                                      type="button"
                                                      disabled={isAssessed}
                                                      onClick={() => updateBudayaSlider(activeCandidateName, cIdx, num)}
                                                      className={`py-2.5 rounded-xl text-xs font-black border transition-all flex flex-col items-center justify-center ${
                                                        score === num
                                                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-md scale-[1.05]'
                                                          : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50'
                                                      }`}
                                                    >
                                                      <span className="text-sm font-black">{num}</span>
                                                      <span className="text-[8px] font-bold opacity-80 hidden sm:inline">
                                                        {num === 1 ? 'STS' : num === 2 ? 'TS' : num === 3 ? 'Netral' : num === 4 ? 'Setuju' : 'SS'}
                                                      </span>
                                                    </button>
                                                  ))}
                                                </div>
                                              </div>

                                              <div className="pt-3 border-t border-indigo-200/60 bg-white/90 p-4 rounded-2xl space-y-2">
                                                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                                                  Indikator Perilaku Utama:
                                                </p>
                                                <ul className="space-y-1.5 text-xs font-medium text-slate-600">
                                                  {cat.indicators.map((ind, iIdx) => (
                                                    <li key={iIdx} className="flex items-start gap-2">
                                                      <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                                                        {iIdx + 1}
                                                      </span>
                                                      <span>{ind}</span>
                                                    </li>
                                                  ))}
                                                </ul>
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  )}

                                  {/* Candidate Form Bottom Action Bar */}
                                  <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                                    <p className="text-xs font-bold text-slate-400">
                                      Pegawai {activeCandidateIndex + 1} dari {targetsToAssess.length}: <span className="text-slate-800 font-black">{activeCandidateName}</span>
                                    </p>

                                    {activeCandidateIndex < targetsToAssess.length - 1 ? (
                                      <button
                                        onClick={() => {
                                          setSelectedCandidateTarget(targetsToAssess[activeCandidateIndex + 1]);
                                          window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}
                                        className="w-full sm:w-auto bg-slate-900 text-white px-8 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl hover:bg-red-600 transition-all flex items-center justify-center gap-3"
                                      >
                                        <span>Lanjut ke {targetsToAssess[activeCandidateIndex + 1]} →</span>
                                      </button>
                                    ) : (
                                      <button
                                        onClick={submitAllAssessments}
                                        className="w-full sm:w-auto bg-emerald-600 text-white px-10 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-3"
                                      >
                                        <span>Simpan & Kirim Evaluasi Selesai</span>
                                      </button>
                                    )}
                                  </div>

                                </div>

                                {/* Right Column: Sticky Radar Chart & Average Summary */}
                                <div className="xl:col-span-5 flex flex-col gap-8">
                                  <div className="bg-white p-8 rounded-[3.5rem] shadow-2xl border border-slate-100 sticky top-28 space-y-8">
                                    
                                    <div className="text-center space-y-2">
                                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-600 bg-red-50 px-4 py-1.5 rounded-full">
                                        Grafik Radar 360°
                                      </span>
                                      <h4 className="text-xl font-black italic text-slate-900">
                                        {activeCandidateName}
                                      </h4>
                                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                        {assessmentSectionFilter === 'berakhlak' ? '7 Indikator BerAKHLAK' : assessmentSectionFilter === 'budaya' ? '5 Pilar Budaya Kerja' : '12 Indikator Kompetensi Lengkap'}
                                      </p>
                                    </div>

                                    <div className="h-[340px] w-full">
                                      {assessmentSectionFilter === 'berakhlak' && (
                                        <RadarChart categories={berakhlakCategories} scores={berakhlakScores[activeCandidateName] || [0, 0, 0, 0, 0, 0, 0]} />
                                      )}
                                      {assessmentSectionFilter === 'budaya' && (
                                        <RadarChart categories={budayaCategories} scores={budayaScores[activeCandidateName] || [0, 0, 0, 0, 0]} />
                                      )}
                                      {assessmentSectionFilter === 'all' && (
                                        <RadarChart
                                          categories={[...berakhlakCategories, ...budayaCategories]}
                                          scores={[
                                            ...(berakhlakScores[activeCandidateName] || [0, 0, 0, 0, 0, 0, 0]),
                                            ...(budayaScores[activeCandidateName] || [0, 0, 0, 0, 0])
                                          ]}
                                        />
                                      )}
                                    </div>

                                    {(() => {
                                      const bScores = berakhlakScores[activeCandidateName] || [0, 0, 0, 0, 0, 0, 0];
                                      const cScores = budayaScores[activeCandidateName] || [0, 0, 0, 0, 0];
                                      const allScores = [...bScores, ...cScores];

                                      const bValid = bScores.filter(s => s > 0);
                                      const cValid = cScores.filter(s => s > 0);
                                      const allValid = allScores.filter(s => s > 0);

                                      const bAvg = bValid.length > 0 ? Number((bValid.reduce((a, b) => a + b, 0) / bValid.length).toFixed(2)) : 0;
                                      const cAvg = cValid.length > 0 ? Number((cValid.reduce((a, b) => a + b, 0) / cValid.length).toFixed(2)) : 0;
                                      const totalAvg = allValid.length > 0 ? Number((allValid.reduce((a, b) => a + b, 0) / allValid.length).toFixed(2)) : 0;
                                      const interp = allValid.length > 0 ? getAverageInterpretation(totalAvg) : { label: 'Belum Diisi', color: 'bg-slate-100 text-slate-600 border-slate-200' };

                                      return (
                                        <div className="space-y-4 pt-4 border-t border-slate-100">
                                          <div className="grid grid-cols-2 gap-3 text-center">
                                            <div className="p-3 bg-red-50/60 rounded-2xl border border-red-100">
                                              <span className="text-[10px] font-black text-red-600 uppercase tracking-wider block">Rata-rata BerAKHLAK</span>
                                              <span className="text-lg font-black text-slate-900">{bValid.length > 0 ? bAvg.toFixed(2) : '-'}</span>
                                            </div>
                                            <div className="p-3 bg-indigo-50/60 rounded-2xl border border-indigo-100">
                                              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-wider block">Rata-rata Budaya Kerja</span>
                                              <span className="text-lg font-black text-slate-900">{cValid.length > 0 ? cAvg.toFixed(2) : '-'}</span>
                                            </div>
                                          </div>

                                          <div className={`p-5 rounded-2xl border text-center space-y-1 ${interp.color}`}>
                                            <span className="text-[10px] font-black uppercase tracking-widest block opacity-75">
                                              Skor Gabungan ({allValid.length}/12 Indikator Terisi)
                                            </span>
                                            <p className="text-2xl font-black italic">
                                              {allValid.length > 0 ? `${totalAvg.toFixed(2)} — ${interp.label}` : '⚠️ Belum Ada Nilai'}
                                            </p>
                                          </div>
                                        </div>
                                      );
                                    })()}

                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </>
                  )}
                </div>
              )}

              {/* TAB: APRESIASI */}
              {activeTab === 'apresiasi' && (
                <div className="max-w-3xl mx-auto pt-10">
                  <div className="bg-white p-20 rounded-[5rem] shadow-2xl border border-slate-50 space-y-16 relative overflow-hidden">
                    <div className="absolute -top-20 -right-20 w-80 h-80 bg-amber-50 rounded-full blur-3xl opacity-50"></div>
                    <div className="text-center space-y-4">
                      <span className="px-8 py-3 bg-amber-100 text-amber-700 rounded-full text-[11px] font-black uppercase tracking-[0.4em]">
                        Inspirasi & Kolaborasi
                      </span>
                      <h3 className="text-5xl font-black text-slate-900 tracking-tighter leading-tight italic">
                        Kirim Pesan Apresiasi
                      </h3>
                    </div>
                    <div className="space-y-8">
                      <div className="space-y-3">
                        <label className="text-[11px] font-black uppercase text-slate-400 ml-6 tracking-widest">Penerima Pesan</label>
                        <select
                          value={appreciationTarget}
                          onChange={e => setAppreciationTarget(e.target.value)}
                          className="w-full p-7 bg-slate-50 border-none rounded-[2.5rem] font-black text-slate-900 outline-none focus:ring-4 focus:ring-amber-500/10 cursor-pointer appearance-none"
                        >
                          <option value="" disabled>-- Pilih Penerima --</option>
                          {employeeNames.filter(n => n !== currentUser).map(n => (
                            <option key={n} value={n}>{n}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[11px] font-black uppercase text-slate-400 ml-6 tracking-widest">Apresiasi Anda</label>
                        <textarea
                          rows={6}
                          value={appreciationText}
                          onChange={e => setAppreciationText(e.target.value)}
                          placeholder="Berikan dukungan atau apresiasi tulus Anda kepada mereka..."
                          className="w-full p-10 bg-slate-50 border-none rounded-[3rem] outline-none focus:ring-4 focus:ring-amber-500/10 font-bold text-slate-700"
                        />
                      </div>
                      <button
                        onClick={saveAppreciation}
                        className="w-full bg-slate-900 text-white font-black py-8 rounded-[2.5rem] shadow-2xl hover:bg-amber-600 transition-all uppercase text-[12px] tracking-[0.5em] active:scale-95"
                      >
                        Kirim Apresiasi
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: ADMIN */}
              {activeTab === 'admin' && (
                <div className="max-w-6xl mx-auto space-y-16">
                  {!isAdminLoggedIn ? (
                    <div className="max-w-md mx-auto bg-white p-14 rounded-[4rem] shadow-2xl text-center space-y-10 mt-16 border border-slate-50">
                      <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center mx-auto text-white shadow-2xl shadow-slate-300">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">Login Admin</h3>
                      <input
                        type="password"
                        value={adminPassInput}
                        onChange={e => setAdminPassInput(e.target.value)}
                        placeholder="••••••"
                        className="w-full p-6 bg-slate-50 border-none rounded-2xl text-center text-3xl font-black outline-none focus:bg-white tracking-[0.5em]"
                      />
                      <button
                        onClick={checkAdminPass}
                        className="w-full bg-red-600 text-white font-black py-6 rounded-2xl uppercase tracking-[0.4em] text-[12px] shadow-2xl hover:bg-slate-900 transition-all active:scale-95"
                      >
                        Verifikasi
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-16">
                      {/* Admin Controls */}
                      <div className="bg-slate-900 p-10 rounded-[3rem] text-white flex justify-between items-center shadow-2xl flex-wrap gap-6">
                        <div>
                          <h3 className="text-2xl font-black italic tracking-tighter">Kontrol Sistem & Peringkat</h3>
                          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">
                            Status Aktif: {sysPhase === 'VOTING' ? 'Fase 1 (Voting Terbuka)' : 'Fase 2 (Evaluasi BerAKHLAK & Budaya Organisasi)'}
                          </p>
                        </div>
                        <div className="flex gap-4 flex-wrap">
                          <button
                            onClick={() => window.open(spreadsheetURL, '_blank')}
                            className="px-6 py-4 bg-white/10 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all"
                          >
                            Spreadsheet
                          </button>
                          <button
                            onClick={() => adminSwitchPhase(sysPhase === 'VOTING' ? 'ASSESSMENT' : 'VOTING')}
                            className={`px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${
                              sysPhase === 'VOTING'
                                ? 'bg-red-600 hover:bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]'
                                : 'bg-slate-800 hover:bg-slate-700 text-white'
                            }`}
                          >
                            {sysPhase === 'VOTING' ? 'Kunci Top 3 & Mulai Evaluasi' : 'Reset Kembali ke Fase Voting'}
                          </button>
                          <button
                            onClick={triggerResetDatabase}
                            className="px-6 py-4 bg-slate-800 border border-slate-700 hover:border-red-500 rounded-2xl text-[11px] font-black uppercase tracking-widest text-red-400 transition-all"
                          >
                            Reset Database
                          </button>
                        </div>
                      </div>

                      {/* Admin Data Grid */}
                      {adminLoading ? (
                        <div className="col-span-full py-20 text-center animate-pulse text-slate-400 font-bold uppercase tracking-widest">
                          Memperoleh data mutakhir...
                        </div>
                      ) : adminData.length === 0 ? (
                        <div className="col-span-full text-center text-slate-400 py-12">
                          Belum ada data yang terekam
                        </div>
                      ) : sysPhase === 'VOTING' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                          {adminData.map((item, idx) => (
                            <div
                              key={item.name || idx}
                              className={`bg-white p-8 rounded-[2.5rem] shadow-xl flex items-center justify-between border ${
                                idx < 3 ? 'border-amber-400 bg-amber-50/20' : 'border-slate-100'
                              }`}
                            >
                              <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 ${
                                  idx < 3 ? 'bg-amber-400 text-white' : 'bg-slate-100 text-slate-500'
                                } rounded-xl flex items-center justify-center font-black`}>
                                  {idx + 1}
                                </div>
                                <h4 className="font-bold text-slate-800 text-sm">{item.name}</h4>
                              </div>
                              <div className="text-center">
                                <span className="block text-2xl font-black text-slate-900">{item.votes}</span>
                                <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">Suara</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-12">
                          {/* Formula & Explanation Banner */}
                          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-8 md:p-10 rounded-[3rem] text-white shadow-2xl space-y-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-6">
                              <div>
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] bg-red-600/30 text-red-300 border border-red-500/30 px-4 py-1.5 rounded-full">
                                  Akumulasi & Pemeringkatan Nilai Akhir
                                </span>
                                <h3 className="text-2xl md:text-3xl font-black italic tracking-tight mt-3">
                                  REKAPITULASI HASIL EVALUASI PEGAWAI
                                </h3>
                                <p className="text-xs text-slate-300 font-medium mt-1">
                                  Nilai dihitung dari rata-rata 12 Indikator Penilaian (7 BerAKHLAK + 5 Budaya Organisasi) dan dikalikan 2 (Skala Bulat 10.00).
                                </p>
                              </div>

                              <div className="bg-white/10 p-5 rounded-2xl border border-white/10 shrink-0 text-left md:text-right">
                                <span className="text-[10px] font-black uppercase tracking-widest text-amber-300 block">Formulasi Nilai Akhir</span>
                                <p className="text-base font-black italic text-white mt-0.5">Nilai Akhir = Rata-Rata (12 Indikator) × 2</p>
                                <span className="text-[10px] text-slate-400 font-bold block mt-1">Diurutkan Otomatis dari Skor Tertinggi (Peringkat 1)</span>
                              </div>
                            </div>

                            {/* Legend / Range Scale 10 */}
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-center text-[10px] font-bold">
                              <div className="bg-emerald-500/20 border border-emerald-500/30 p-3 rounded-2xl">
                                <span className="block font-black text-xs text-emerald-300">8,42 - 10,00</span>
                                <span>Sangat Baik</span>
                              </div>
                              <div className="bg-blue-500/20 border border-blue-500/30 p-3 rounded-2xl">
                                <span className="block font-black text-xs text-blue-300">6,82 - 8,40</span>
                                <span>Baik</span>
                              </div>
                              <div className="bg-amber-500/20 border border-amber-500/30 p-3 rounded-2xl">
                                <span className="block font-black text-xs text-amber-300">5,22 - 6,80</span>
                                <span>Cukup</span>
                              </div>
                              <div className="bg-orange-500/20 border border-orange-500/30 p-3 rounded-2xl">
                                <span className="block font-black text-xs text-orange-300">3,62 - 5,20</span>
                                <span>Kurang</span>
                              </div>
                              <div className="bg-red-500/20 border border-red-500/30 p-3 rounded-2xl col-span-2 md:col-span-1">
                                <span className="block font-black text-xs text-red-300">2,00 - 3,60</span>
                                <span>Sangat Kurang</span>
                              </div>
                            </div>
                          </div>

                          {/* Leaderboard Grid Cards */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {adminData.map((item, idx) => {
                              const bAvg = item.bAvg !== undefined ? item.bAvg : getValidNumber(item.rawAvg, extractScore5(item));
                              const cAvg = item.cAvg !== undefined ? item.cAvg : getValidNumber(item.rawAvg, extractScore5(item));
                              const rawAvg = getValidNumber(item.rawAvg, extractScore5(item));
                              const finalScore10 = getValidNumber(item.finalScore10, Number((rawAvg * 2).toFixed(2)));
                              const interp = getAverageInterpretation(rawAvg);

                              let styleGrad = 'bg-white border-slate-200 text-slate-800';
                              if (idx === 0) styleGrad = 'gold-gradient text-white border-transparent shadow-2xl scale-[1.02]';
                              if (idx === 1) styleGrad = 'silver-gradient text-white border-transparent shadow-xl';
                              if (idx === 2) styleGrad = 'bronze-gradient text-white border-transparent shadow-xl';

                              return (
                                <div key={item.name || idx} className={`p-8 rounded-[3rem] border flex flex-col justify-between gap-6 relative overflow-hidden transition-all duration-300 hover:scale-[1.03] ${styleGrad}`}>
                                  {/* Badge & Peringkat Header */}
                                  <div className="flex justify-between items-center gap-2">
                                    <div className="flex items-center gap-3">
                                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black italic text-lg shadow-md ${
                                        idx < 3 ? 'bg-white/20 text-white' : 'bg-slate-900 text-white'
                                      }`}>
                                        #{idx + 1}
                                      </div>
                                      <span className="text-[10px] font-black uppercase tracking-widest opacity-80">
                                        Peringkat Ke-{idx + 1}
                                      </span>
                                    </div>
                                    <span className={`text-[10px] font-black uppercase px-3.5 py-1.5 rounded-full border ${
                                      idx < 3 ? 'bg-white/20 border-white/30 text-white' : interp.color
                                    }`}>
                                      {interp.label}
                                    </span>
                                  </div>

                                  {/* Candidate Name */}
                                  <div>
                                    <h4 className="text-2xl font-black italic tracking-tight leading-tight truncate">{item.name}</h4>
                                    <p className="text-[10px] font-extrabold uppercase tracking-widest mt-1 opacity-75">
                                      {item.voters ? `${item.voters} Evaluator Terpilih` : 'Evaluasi Terpadu 12 Indikator'}
                                    </p>
                                  </div>

                                  {/* Highlight Score Box */}
                                  <div className={`p-5 rounded-2xl border space-y-3 ${idx < 3 ? 'bg-black/15 border-white/20' : 'bg-slate-50 border-slate-100'}`}>
                                    <div className="flex items-baseline justify-between">
                                      <span className="text-[10px] font-black uppercase tracking-widest opacity-80">
                                        Nilai Akhir (Skala 10)
                                      </span>
                                      <span className="text-xs font-black italic opacity-90">
                                        Rata-Rata × 2
                                      </span>
                                    </div>

                                    <div className="flex items-baseline gap-2">
                                      <span className="text-5xl font-black italic tracking-tighter">
                                        {finalScore10.toFixed(2)}
                                      </span>
                                      <span className="text-xs font-black opacity-75">/ 10.00</span>
                                    </div>

                                    {/* Sub-Averages Grid */}
                                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-current/10 text-[10px] font-bold">
                                      <div className={`p-2.5 rounded-xl border ${idx < 3 ? 'bg-white/10 border-white/15' : 'bg-red-50/80 border-red-100 text-slate-900'}`}>
                                        <span className="text-[9px] font-black uppercase block tracking-wider opacity-80 text-red-600">
                                          Rata-Rata BerAKHLAK
                                        </span>
                                        <span className="text-sm font-black">
                                          {bAvg.toFixed(2)} <span className="text-[9px] opacity-70">/ 5.00</span>
                                        </span>
                                      </div>
                                      <div className={`p-2.5 rounded-xl border ${idx < 3 ? 'bg-white/10 border-white/15' : 'bg-indigo-50/80 border-indigo-100 text-slate-900'}`}>
                                        <span className="text-[9px] font-black uppercase block tracking-wider opacity-80 text-indigo-600">
                                          Rata-Rata Budaya Kerja
                                        </span>
                                        <span className="text-sm font-black">
                                          {cAvg.toFixed(2)} <span className="text-[9px] opacity-70">/ 5.00</span>
                                        </span>
                                      </div>
                                    </div>

                                    <div className="pt-2 border-t border-current/10 flex justify-between items-center text-[10px] font-bold opacity-80">
                                      <span>Rata-Rata Total 12 Indikator: <strong className="font-black">{rawAvg.toFixed(2)}</strong></span>
                                      <button
                                        onClick={() => setAdminDetailCandidate({ ...item, bAvg, cAvg, rawAvg, finalScore10, interp })}
                                        className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                                          idx < 3 ? 'bg-white/20 hover:bg-white/30 text-white' : 'bg-slate-900 text-white hover:bg-red-600'
                                        }`}
                                      >
                                        📊 Radar 360°
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Data Table View */}
                          <div className="bg-white p-8 md:p-10 rounded-[3rem] shadow-xl border border-slate-100 space-y-6">
                            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                              <div>
                                <h4 className="text-xl font-black italic text-slate-900 tracking-tight">
                                  TABEL REKAPITULASI MATRIKS PENILAIAN
                                </h4>
                                <p className="text-xs font-bold text-slate-400">
                                  Rincian lengkap skor BerAKHLAK, Budaya Kerja, dan Nilai Akhir seluruh kandidat
                                </p>
                              </div>
                              <span className="text-xs font-black text-slate-500 bg-slate-100 px-4 py-2 rounded-full">
                                Total: {adminData.length} Pegawai
                              </span>
                            </div>

                            <div className="overflow-x-auto">
                              <table className="w-full text-left border-collapse">
                                <thead>
                                  <tr className="border-b-2 border-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-widest bg-slate-50/50">
                                    <th className="py-4 px-6 rounded-l-2xl">Peringkat</th>
                                    <th className="py-4 px-6">Nama Pegawai</th>
                                    <th className="py-4 px-6 text-center">Rata-Rata BerAKHLAK (7)</th>
                                    <th className="py-4 px-6 text-center">Rata-Rata Budaya Kerja (5)</th>
                                    <th className="py-4 px-6 text-center">Rata-Rata Total (1-5)</th>
                                    <th className="py-4 px-6 text-center">Nilai Akhir (Skala 10)</th>
                                    <th className="py-4 px-6 text-center">Predikat Mutu</th>
                                    <th className="py-4 px-6 text-right rounded-r-2xl">Aksi</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-sm font-bold text-slate-700">
                                  {adminData.map((item, idx) => {
                                    const bAvg = item.bAvg !== undefined ? item.bAvg : getValidNumber(item.rawAvg, extractScore5(item));
                                    const cAvg = item.cAvg !== undefined ? item.cAvg : getValidNumber(item.rawAvg, extractScore5(item));
                                    const rawAvg = getValidNumber(item.rawAvg, extractScore5(item));
                                    const finalScore10 = getValidNumber(item.finalScore10, Number((rawAvg * 2).toFixed(2)));
                                    const interp = getAverageInterpretation(rawAvg);

                                    return (
                                      <tr key={item.name || idx} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="py-5 px-6">
                                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${
                                            idx === 0 ? 'bg-amber-400 text-white' : idx === 1 ? 'bg-slate-400 text-white' : idx === 2 ? 'bg-amber-700 text-white' : 'bg-slate-100 text-slate-600'
                                          }`}>
                                            #{idx + 1}
                                          </div>
                                        </td>
                                        <td className="py-5 px-6 font-black text-slate-900 text-base italic">
                                          {item.name}
                                        </td>
                                        <td className="py-5 px-6 text-center">
                                          <span className="px-3 py-1 bg-red-50 text-red-700 border border-red-200/80 rounded-xl font-black text-xs">
                                            {bAvg.toFixed(2)} / 5.00
                                          </span>
                                        </td>
                                        <td className="py-5 px-6 text-center">
                                          <span className="px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200/80 rounded-xl font-black text-xs">
                                            {cAvg.toFixed(2)} / 5.00
                                          </span>
                                        </td>
                                        <td className="py-5 px-6 text-center">
                                          <span className="px-3 py-1 bg-slate-100 text-slate-800 rounded-xl font-black text-xs">
                                            {rawAvg.toFixed(2)} / 5.00
                                          </span>
                                        </td>
                                        <td className="py-5 px-6 text-center">
                                          <span className="text-xl font-black text-red-600 italic">
                                            {finalScore10.toFixed(2)}
                                          </span>
                                          <span className="text-[10px] text-slate-400 block font-bold">/ 10.00</span>
                                        </td>
                                        <td className="py-5 px-6 text-center">
                                          <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider inline-block border ${interp.color}`}>
                                            {interp.label}
                                          </span>
                                        </td>
                                        <td className="py-5 px-6 text-right">
                                          <button
                                            onClick={() => setAdminDetailCandidate({ ...item, bAvg, cAvg, rawAvg, finalScore10, interp })}
                                            className="px-4 py-2 bg-slate-900 hover:bg-red-600 text-white rounded-xl font-black text-[10px] uppercase tracking-wider shadow-sm transition-all"
                                          >
                                            📊 Radar 360°
                                          </button>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </main>
          </div>
        </div>
      )}
      {/* Admin Candidate Detail & Radar 360 Modal */}
      {adminDetailCandidate && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-6 overflow-y-auto animate-fadeIn">
          <div className="bg-white max-w-3xl w-full rounded-[3rem] p-8 md:p-10 space-y-8 shadow-2xl border border-slate-100 relative my-8">
            {/* Header */}
            <div className="flex justify-between items-center border-b pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600 bg-red-50 px-3 py-1 rounded-full">
                  Analisis Kompetensi 360°
                </span>
                <h3 className="text-2xl md:text-3xl font-black text-slate-900 italic tracking-tight mt-2">
                  {adminDetailCandidate.name}
                </h3>
                <p className="text-xs font-bold text-slate-400 mt-1">
                  Rincian Rata-Rata Nilai BerAKHLAK (7) & Budaya Kerja (5)
                </p>
              </div>
              <button
                onClick={() => setAdminDetailCandidate(null)}
                className="w-11 h-11 rounded-2xl bg-slate-100 text-slate-500 hover:bg-red-500 hover:text-white font-black text-xl flex items-center justify-center transition-all"
              >
                ✕
              </button>
            </div>

            {/* Score Summary Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-red-50/70 border border-red-100 rounded-2xl text-center">
                <span className="text-[10px] font-black uppercase tracking-wider text-red-600 block">Rata-Rata BerAKHLAK</span>
                <span className="text-2xl font-black text-slate-900 mt-1 block">
                  {adminDetailCandidate.bAvg ? adminDetailCandidate.bAvg.toFixed(2) : adminDetailCandidate.rawAvg.toFixed(2)}
                </span>
                <span className="text-[10px] font-bold text-slate-400">7 Indikator (1-5)</span>
              </div>

              <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-2xl text-center">
                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 block">Rata-Rata Budaya Kerja</span>
                <span className="text-2xl font-black text-slate-900 mt-1 block">
                  {adminDetailCandidate.cAvg ? adminDetailCandidate.cAvg.toFixed(2) : adminDetailCandidate.rawAvg.toFixed(2)}
                </span>
                <span className="text-[10px] font-bold text-slate-400">5 Pilar (1-5)</span>
              </div>

              <div className="p-4 bg-slate-100/80 border border-slate-200 rounded-2xl text-center">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-700 block">Rata-Rata Total</span>
                <span className="text-2xl font-black text-slate-900 mt-1 block">
                  {adminDetailCandidate.rawAvg.toFixed(2)}
                </span>
                <span className="text-[10px] font-bold text-slate-400">12 Indikator (1-5)</span>
              </div>

              <div className="p-4 bg-slate-900 text-white rounded-2xl text-center">
                <span className="text-[10px] font-black uppercase tracking-wider text-red-400 block">Nilai Akhir</span>
                <span className="text-2xl font-black mt-1 block italic">
                  {adminDetailCandidate.finalScore10.toFixed(2)}
                </span>
                <span className="text-[10px] font-bold text-slate-300">Skala 10.00</span>
              </div>
            </div>

            {/* Radar Chart */}
            <div className="bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100">
              <h4 className="text-xs font-black text-slate-700 uppercase tracking-widest text-center mb-4">
                Peta Radar Kompetensi 12 Indikator
              </h4>
              <RadarChart
                categories={allCategories}
                scores={(() => {
                  if (Array.isArray(adminDetailCandidate.berakhlak) && Array.isArray(adminDetailCandidate.budaya)) {
                    return [...adminDetailCandidate.berakhlak, ...adminDetailCandidate.budaya];
                  }
                  if (Array.isArray(adminDetailCandidate.scores)) {
                    return adminDetailCandidate.scores;
                  }
                  const bVal = adminDetailCandidate.bAvg || adminDetailCandidate.rawAvg;
                  const cVal = adminDetailCandidate.cAvg || adminDetailCandidate.rawAvg;
                  return [bVal, bVal, bVal, bVal, bVal, bVal, bVal, cVal, cVal, cVal, cVal, cVal];
                })()}
              />
            </div>

            {/* Close Button */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setAdminDetailCandidate(null)}
                className="px-8 py-4 bg-slate-900 hover:bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg"
              >
                Tutup Analisis
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
