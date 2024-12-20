import { useState } from 'react';
import SubTugasForm from './SubTugasForm';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../utils/firebaseConfig';

export default function FormTugas({ anggotaTim, onSubmit }) {
  const [namaTugas, setNamaTugas] = useState('');
  const [subTugas, setSubTugas] = useState([]);
  const [tanggalMulai, setTanggalMulai] = useState('');
  const [tanggalSelesai, setTanggalSelesai] = useState('');

  const tambahSubTugas = (subTugasBaru) => {
    setSubTugas([...subTugas, subTugasBaru]);
  };

  const kirimForm = async (e) => {
    e.preventDefault();
    const newTask = { namaTugas, subTugas, tanggalMulai, tanggalSelesai };
    await addDoc(collection(db, 'tugas'), newTask);
    onSubmit(newTask);
    setNamaTugas('');
    setSubTugas([]);
    setTanggalMulai('');
    setTanggalSelesai('');
  };

  return (
    <form onSubmit={kirimForm} className="p-4 bg-white shadow-md rounded">
      <h2 className="text-xl font-bold mb-4">Buat Tugas</h2>
      <input
        type="text"
        placeholder="Nama Tugas"
        value={namaTugas}
        onChange={(e) => setNamaTugas(e.target.value)}
        className="w-full border p-2 rounded mb-4"
        required
      />
      <h3 className="text-lg mb-2">Sub-Tugas</h3>
      <SubTugasForm onAddSubTugas={tambahSubTugas} anggotaTim={anggotaTim} />
      <h3 className="text-lg mb-2 mt-4">Tanggal Tugas</h3>
      <div className="flex gap-4">
        <input
          type="date"
          value={tanggalMulai}
          onChange={(e) => setTanggalMulai(e.target.value)}
          className="border p-2 rounded w-full"
          required
        />
        <input
          type="date"
          value={tanggalSelesai}
          onChange={(e) => setTanggalSelesai(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>
      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded mt-4">
        Buat Tugas
      </button>
    </form>
  );
}
