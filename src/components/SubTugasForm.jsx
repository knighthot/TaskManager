import { useState } from 'react';

export default function SubTugasForm({ onAddSubTugas, anggotaTim }) {
  const [namaSubTugas, setNamaSubTugas] = useState('');
  const [tanggalMulai, setTanggalMulai] = useState('');
  const [tanggalSelesai, setTanggalSelesai] = useState('');
  const [penanggungJawab, setPenanggungJawab] = useState([]);

  const tambahSubTugas = () => {
    onAddSubTugas({ namaSubTugas, tanggalMulai, tanggalSelesai, penanggungJawab });
    setNamaSubTugas('');
    setTanggalMulai('');
    setTanggalSelesai('');
    setPenanggungJawab([]);
  };

  return (
    <div className="p-4 bg-gray-100 rounded mb-4">
      <input
        type="text"
        placeholder="Nama Sub-Tugas"
        value={namaSubTugas}
        onChange={(e) => setNamaSubTugas(e.target.value)}
        className="w-full border p-2 rounded mb-2"
        required
      />
      <div className="flex gap-4 mb-2">
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
      <select
        multiple
        value={penanggungJawab}
        onChange={(e) => setPenanggungJawab(Array.from(e.target.selectedOptions, (o) => o.value))}
        className="w-full border p-2 rounded mb-4"
      >
        {anggotaTim.map((anggota, index) => (
          <option key={index} value={anggota}>
            {anggota}
          </option>
        ))}
      </select>
      <button type="button" onClick={tambahSubTugas} className="bg-blue-500 text-white px-4 py-2 rounded">
        Tambah Sub-Tugas
      </button>
    </div>
  );
}
