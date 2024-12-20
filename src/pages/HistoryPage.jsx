import { useState, useEffect } from 'react';
import { db } from '../utils/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

export default function HistoryPage() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const grupSnapshot = await getDocs(collection(db, 'grup'));
      const tugasSnapshot = await getDocs(collection(db, 'tugas'));
      setHistory([
        ...grupSnapshot.docs.map(doc => ({ ...doc.data(), type: 'grup' })),
        ...tugasSnapshot.docs.map(doc => ({ ...doc.data(), type: 'tugas' })),
      ]);
    };
    fetchHistory();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Riwayat</h1>
      <ul>
        {history.map((item, index) => (
          <li key={index} className="p-2 bg-gray-200 shadow mb-2 rounded">
            <strong>{item.namaGrup || item.namaTugas}</strong>
            {item.type === 'grup' && <p>Anggota: {item.anggotaTim.join(', ')}</p>}
            {item.type === 'tugas' && (
              <p>
                Tugas: {item.tanggalMulai} - {item.tanggalSelesai || 'Belum Ditentukan'}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
