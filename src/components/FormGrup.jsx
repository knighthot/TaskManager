import { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../utils/firebaseConfig';

export default function FormGrup({ onSubmit }) {
  const [namaGrup, setNamaGrup] = useState('');
  const [anggotaTim, setAnggotaTim] = useState(['']);

  // Tambah anggota baru
  const tambahAnggota = () => {
    setAnggotaTim([...anggotaTim, '']);
  };

  // Hapus anggota dari daftar
  const hapusAnggota = (index) => {
    const anggotaBaru = [...anggotaTim];
    anggotaBaru.splice(index, 1);
    setAnggotaTim(anggotaBaru);
  };

  // Kirim form untuk membuat grup baru
  const kirimForm = async (e) => {
    e.preventDefault();
    const newGroup = { namaGrup, anggotaTim };
    try {
      await addDoc(collection(db, 'grup'), newGroup);
      onSubmit(newGroup);
      setNamaGrup('');
      setAnggotaTim(['']);
    } catch (error) {
      console.error('Error saat membuat grup:', error);
    }
  };

  return (
    <form onSubmit={kirimForm} className="p-4 bg-white shadow-md rounded">
      <h2 className="text-xl font-bold mb-4">Buat Grup</h2>

      {/* Input nama grup */}
      <input
        type="text"
        placeholder="Nama Grup"
        value={namaGrup}
        onChange={(e) => setNamaGrup(e.target.value)}
        className="w-full border p-2 rounded mb-4"
        required
      />

      {/* Daftar anggota tim */}
      <h3 className="text-lg mb-2">Anggota Tim</h3>
      {anggotaTim.map((anggota, index) => (
        <div key={index} className="flex items-center mb-2">
          <input
            type="text"
            placeholder={`Anggota ${index + 1}`}
            value={anggota}
            onChange={(e) => {
              const anggotaBaru = [...anggotaTim];
              anggotaBaru[index] = e.target.value;
              setAnggotaTim(anggotaBaru);
            }}
            className="border p-2 rounded flex-grow"
            required
          />
          <button
            type="button"
            onClick={() => hapusAnggota(index)}
            className="text-red-500 ml-2"
          >
            Hapus
          </button>
        </div>
      ))}

      {/* Tombol tambah anggota */}
      <button
        type="button"
        onClick={tambahAnggota}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
      >
        Tambah Anggota
      </button>

      {/* Tombol submit form */}
      <button
        type="submit"
        className="bg-green-500 text-white px-4 py-2 rounded mt-4"
      >
        Buat Grup
      </button>
    </form>
  );
}
