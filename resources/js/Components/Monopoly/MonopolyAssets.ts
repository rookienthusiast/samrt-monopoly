
import { Property, TileData } from './MonopolyTypes';

export const generateBoardTiles = (dbProperties: Property[]): TileData[] => {
    const tiles: TileData[] = [
        // Top Row (0-10) - Moving Right
        { index: 0, type: 'START', name: 'Start', color: 'bg-slate-900', textColor: 'text-white' },
        { index: 1, type: 'PROPERTY', name: 'Hotel Budget', subName: 'Rp 2,5 M - 4 M', color: 'bg-blue-600', textColor: 'text-black' },
        { index: 2, type: 'EVENT', name: 'EVENT', subName: 'Control Environment (Integrity & Ethical Values)', color: 'bg-yellow-400', textColor: 'text-black' },
        { index: 3, type: 'EVENT', name: 'EVENT', subName: 'Control Environment (Independent Oversight)', color: 'bg-yellow-400', textColor: 'text-black' },
        { index: 4, type: 'PROPERTY', name: 'Restoran menengah', subName: 'Rp 700 Jt - 1,2 M', color: 'bg-blue-600', textColor: 'text-black' },
        { index: 5, type: 'PROPERTY', name: 'Pabrik Tekstil', subName: 'Rp 10 M - 20 M', color: 'bg-blue-600', textColor: 'text-black' },
        { index: 6, type: 'EVENT', name: 'EVENT', subName: 'Control Activities (Implementation)', color: 'bg-yellow-400', textColor: 'text-black' },
        { index: 7, type: 'PROPERTY', name: 'Warung Kopi', subName: 'Rp 200 Jt - 350 Jt', color: 'bg-blue-300', textColor: 'text-black' },
        { index: 8, type: 'EVENT', name: 'EVENT', subName: 'Risk Assessment (Objective Setting)', color: 'bg-yellow-400', textColor: 'text-black' },
        { index: 9, type: 'PROPERTY', name: 'Rumah Sakit', subName: 'Rp 4 M - 6 M', color: 'bg-blue-300', textColor: 'text-black' },
        { index: 10, type: 'AUDIT', name: 'AUDIT', subName: '(AI Governance Audit)', color: 'bg-slate-900', textColor: 'text-white' },

        // Right Column (11-19) - Moving Down
        { index: 11, type: 'PROPERTY', name: 'Kost Mahasiswa', subName: 'Rp 1 M - 1,8 M', color: 'bg-sky-200', textColor: 'text-black' },
        { index: 12, type: 'EVENT', name: 'EVENT', subName: 'Risk Assessment (Fraud Risk)', color: 'bg-yellow-400', textColor: 'text-black' },
        { index: 13, type: 'PROPERTY', name: 'Minimarket', subName: 'Rp 900 Jt - 1,5 M', color: 'bg-sky-200', textColor: 'text-black' },
        { index: 14, type: 'ZONE', name: 'AUDIT ZONE', subName: '(Biaya: Rp 60-90 Jt)', color: 'bg-red-600', textColor: 'text-white' },
        { index: 15, type: 'PROPERTY', name: 'Cloud Kitchen', subName: 'Rp 300 Jt - 400 Jt', color: 'bg-cyan-400', textColor: 'text-black' },
        { index: 16, type: 'EVENT', name: 'EVENT', subName: 'Control Activities (Risk Mitigation)', color: 'bg-yellow-400', textColor: 'text-black' },
        { index: 17, type: 'PROPERTY', name: 'Sewa Apartemen', subName: 'Rp 1,5 M - 2 M', color: 'bg-cyan-400', textColor: 'text-black' },
        { index: 18, type: 'EVENT', name: 'EVENT', subName: 'Control Activities (IT Controls)', color: 'bg-yellow-400', textColor: 'text-black' },
        { index: 19, type: 'PROPERTY', name: 'Desa Wisata', subName: 'Rp 2 M - 2,5 M', color: 'bg-cyan-400', textColor: 'text-black' },

        // Bottom Row (20-30) - Moving Left
        { index: 20, type: 'AUDIT', name: 'Pengadilan', subName: '(kasus hukum) (perdata - pidana)', color: 'bg-slate-900', textColor: 'text-white' },
        { index: 21, type: 'EVENT', name: 'EVENT', subName: 'Control Activities (Policies & Procedures)', color: 'bg-yellow-400', textColor: 'text-black' },
        { index: 22, type: 'PROPERTY', name: 'Pusat oleh-oleh', subName: 'Rp 1,3 M - 1,6 M', color: 'bg-blue-300', textColor: 'text-black' },
        { index: 23, type: 'PROPERTY', name: 'Jasa Konsultan', subName: 'Rp 500 Jt - 800 Jt', color: 'bg-blue-400', textColor: 'text-black' },
        { index: 24, type: 'EVENT', name: 'EVENT', subName: 'Information & Communication (Quality Information)', color: 'bg-yellow-400', textColor: 'text-black' },
        { index: 25, type: 'EVENT', name: 'EVENT', subName: 'Information & Communication (Internal Communication)', color: 'bg-yellow-400', textColor: 'text-black' },
        { index: 26, type: 'PROPERTY', name: 'Kawasan Kuliner', subName: 'Rp 2,2 M - 3 M', color: 'bg-blue-300', textColor: 'text-black' },
        { index: 27, type: 'EVENT', name: 'EVENT', subName: 'Information & Communication (External Communication)', color: 'bg-yellow-400', textColor: 'text-black' },
        { index: 28, type: 'ZONE', name: 'AUDIT ZONE', subName: '(Biaya: Rp 80-100 Jt)', color: 'bg-red-600', textColor: 'text-white' },
        { index: 29, type: 'PROPERTY', name: 'Hotel Bisnis', subName: 'Rp 5 M - 7 M', color: 'bg-blue-200', textColor: 'text-black' },
        { index: 30, type: 'CRISIS', name: 'CRISIS', subName: 'Systemic Fraud / ESG Shock', color: 'bg-slate-900', textColor: 'text-white' },

        // Left Column (31-39) - Moving Up
        { index: 31, type: 'EVENT', name: 'EVENT', subName: 'Monitoring (Ongoing Evaluation)', color: 'bg-yellow-400', textColor: 'text-black' },
        { index: 32, type: 'PROPERTY', name: 'Super Mall', subName: 'Rp 7 M - 10 M', color: 'bg-blue-300', textColor: 'text-black' },
        { index: 33, type: 'EVENT', name: 'EVENT', subName: 'Monitoring (Deficiency & Corrective Action)', color: 'bg-yellow-400', textColor: 'text-black' },
        { index: 34, type: 'PROPERTY', name: 'Kawasan Industri', subName: 'Rp 7 M - 10 M', color: 'bg-gray-400', textColor: 'text-black' },
        { index: 35, type: 'EVENT', name: 'EVENT', subName: 'Governance Reform', color: 'bg-yellow-400', textColor: 'text-black' },
        { index: 36, type: 'PROPERTY', name: 'Pecel Ayam', subName: 'Rp 100 Jt - 200 Jt', color: 'bg-blue-300', textColor: 'text-black' },
        { index: 37, type: 'PROPERTY', name: 'Hotel Resort', subName: 'Rp 8 M - 12 M', color: 'bg-blue-300', textColor: 'text-black' },
        { index: 38, type: 'EVENT', name: 'EVENT', subName: '', color: 'bg-yellow-400', textColor: 'text-black' },
        { index: 39, type: 'PROPERTY', name: 'Laundry', subName: 'Rp 250 Jt - 450 Jt', color: 'bg-blue-600', textColor: 'text-black' },
    ];

    return tiles;
};
