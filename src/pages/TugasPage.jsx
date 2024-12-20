import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../utils/firebaseConfig';
import { collection, doc, getDoc, getDocs, updateDoc, addDoc,deleteDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid'; 
import Sidebar from '../components/Sidebar';
export default function TugasPage() {
  const { grupId } = useParams();
  const navigate = useNavigate();
  const [grup, setGrup] = useState(null);
  const [anggotaBaru, setAnggotaBaru] = useState('');
  const [tugas, setTugas] = useState([]);
  const [namaTugas, setNamaTugas] = useState('');
  const [tanggalMulai, setTanggalMulai] = useState('');
  const [tanggalSelesai, setTanggalSelesai] = useState('');
  const [warnaTugas, setWarnaTugas] = useState('#ffffff');

  useEffect(() => {
    const fetchGrup = async () => {
      try {
        const grupRef = doc(db, 'grup', grupId);
        const grupSnap = await getDoc(grupRef);
        if (grupSnap.exists()) {
          setGrup({ id: grupSnap.id, ...grupSnap.data() });
        } else {
          console.error('Grup tidak ditemukan');
        }
      } catch (error) {
        console.error('Error mengambil data grup:', error);
      }
    };
    fetchGrup();
  }, [grupId]);

  const tambahAnggota = async () => {
    if (!anggotaBaru.trim() || !grup) return;
  
    const updatedAnggota = [
      ...grup.anggotaTim,
      { id: uuidv4(), nama: anggotaBaru.trim() }, // Tambahkan anggota dengan ID unik
    ];
    const grupRef = doc(db, 'grup', grup.id);
  
    try {
      await updateDoc(grupRef, { anggotaTim: updatedAnggota });
      setGrup({ ...grup, anggotaTim: updatedAnggota });
      setAnggotaBaru('');
    } catch (error) {
      console.error('Error menambahkan anggota:', error);
    }
  };
  
  // Hapus anggota berdasarkan ID
  const hapusAnggota = async (anggotaId) => {
    const updatedAnggota = grup.anggotaTim.filter((anggota) => anggota.id !== anggotaId);
    const grupRef = doc(db, 'grup', grup.id);
  
    try {
      await updateDoc(grupRef, { anggotaTim: updatedAnggota });
      setGrup({ ...grup, anggotaTim: updatedAnggota });
    } catch (error) {
      console.error('Error menghapus anggota:', error);
    }
  };
  
  // Edit nama anggota berdasarkan ID
  const editAnggota = async (anggotaId, namaBaru) => {
    const updatedAnggota = grup.anggotaTim.map((anggota) =>
      anggota.id === anggotaId ? { ...anggota, nama: namaBaru.trim() } : anggota
    );
    const grupRef = doc(db, 'grup', grup.id);
  
    try {
      await updateDoc(grupRef, { anggotaTim: updatedAnggota });
      setGrup({ ...grup, anggotaTim: updatedAnggota });
    } catch (error) {
      console.error('Error mengedit anggota:', error);
    }
  };


  useEffect(() => {
    const fetchTugas = async () => {
      const tugasSnapshot = await getDocs(collection(db, 'tugas'));
      const tugasData = tugasSnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((task) => task.grupId === grupId);
      setTugas(tugasData);
    };
    fetchTugas();
  }, [grupId]);

  const handleTambahTugas = async () => {
    if (!namaTugas || !tanggalMulai || !tanggalSelesai) return;
    const tugasBaru = {
      namaTugas,
      tanggalMulai,
      tanggalSelesai,
      grupId,
      warnaTugas,
      subTugas: [],
    };
    const docRef = await addDoc(collection(db, 'tugas'), tugasBaru);
    setTugas([...tugas, { id: docRef.id, ...tugasBaru }]);
    setNamaTugas('');
    setTanggalMulai('');
    setTanggalSelesai('');
    setWarnaTugas('#ffffff');
  };

  const handleHapusTugas = async (taskId) => {
    try {
      const taskRef = doc(db, 'tugas', taskId);
      await deleteDoc(taskRef); // Menghapus tugas dari Firestore
      setTugas(tugas.filter((t) => t.id !== taskId)); // Memperbarui state tugas
    } catch (error) {
      console.error('Error menghapus tugas:', error);
    }
  };

  if (!grup) {
    return <p>Memuat data grup...</p>; // Tambahkan kondisi loading
  }
  
  return (
    <div className="flex gap-8 p-4">
    {/* Sidebar untuk informasi grup */}
    <div className="w-1/3 bg-gray-100 p-4 shadow rounded">
      <h2 className="text-xl font-bold mb-4">Informasi Grup</h2>
      <p className="mb-4">
      <h2 className="text-xl font-bold mb-4">Tugas untuk Grup: {grup.namaGrup}</h2>
      </p>
      <h3 className="text-lg font-bold mb-2">Anggota Tim:</h3>
      <ul>
          {grup.anggotaTim.map((anggota) => (
            <li key={anggota.id} className="flex items-center gap-2 mb-2">
              {anggota.nama}
              <button
                onClick={() => hapusAnggota(anggota.id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Hapus
              </button>
            </li>
          ))}
        </ul>
<div className="flex gap-2 mt-4">
  <input
    type="text"
    placeholder="Nama anggota baru"
    value={anggotaBaru}
    onChange={(e) => setAnggotaBaru(e.target.value)}
    className="border p-2 rounded flex-grow"
  />
  <button
    onClick={tambahAnggota}
    className="bg-blue-500 text-white px-4 py-2 rounded"
  >
    Tambah
  </button>
</div>

    </div>
      {/* Area untuk tugas */}
      <div className="flex-1 bg-white p-4 shadow rounded">
        <h2 className="text-xl font-bold mb-4">Tugas untuk Grup: {grup?.namaGrup}</h2>
        <div className="mb-4 p-4 bg-gray-100 rounded shadow">
          <h2 className="text-xl font-bold mb-2">Tambah Tugas</h2>
          <input
            type="text"
            placeholder="Nama Tugas"
            value={namaTugas}
            onChange={(e) => setNamaTugas(e.target.value)}
            className="border p-2 rounded w-full mb-2"
          />
          <div className="flex gap-4">
            <input
              type="date"
              value={tanggalMulai}
              onChange={(e) => setTanggalMulai(e.target.value)}
              className="border p-2 rounded w-full"
            />
            <input
              type="date"
              value={tanggalSelesai}
              onChange={(e) => setTanggalSelesai(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>
          <input
            type="color"
            value={warnaTugas}
            onChange={(e) => setWarnaTugas(e.target.value)}
            className="w-full mt-2 border rounded"
          />
          <button
            onClick={handleTambahTugas}
            className="bg-green-500 text-white px-4 py-2 rounded mt-2"
          >
            Tambah Tugas
          </button>
        </div>

        {tugas.map((task) => (
          <div
            key={task.id}
            className="p-4 rounded shadow mb-4 cursor-pointer"
            style={{ backgroundColor: task.warnaTugas || '#ffffff' }}
            onClick={() => navigate(`/subtasks/${task.id}`)}
          >
           
            <h2 className="text-xl font-bold mb-2">{task.namaTugas}</h2>
            <p>
              <strong>Tanggal:</strong> {task.tanggalMulai} - {task.tanggalSelesai}
            </p>
            <div>
      <button
        className="text-red-500 text-sm underline"
        onClick={(e) => {
          e.stopPropagation(); // Menghindari navigasi saat tombol hapus diklik
          handleHapusTugas(task.id);
        }}
      >
        Hapus Tugas
      </button>
    </div>
          </div>
          
        ))}
      </div>
    </div>
  );
}
