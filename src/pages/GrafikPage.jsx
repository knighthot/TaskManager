import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { db } from '../utils/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

export default function GrafikPage() {
  const [dataChart, setDataChart] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    const fetchTugas = async () => {
      const tugasSnapshot = await getDocs(collection(db, 'tugas'));
      const tugasData = tugasSnapshot.docs.map(doc => doc.data());

      setDataChart({
        labels: tugasData.map(item => item.namaTugas),
        datasets: [
          {
            label: 'Durasi Tugas (Hari)',
            data: tugasData.map(item => {
              const mulai = new Date(item.tanggalMulai);
              const selesai = new Date(item.tanggalSelesai);
              return isNaN(mulai) || isNaN(selesai) ? 0 : Math.ceil((selesai - mulai) / (1000 * 60 * 60 * 24));
            }),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      });
    };
    fetchTugas();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Grafik Tugas</h1>
      <Bar data={dataChart} />
    </div>
  );
}
