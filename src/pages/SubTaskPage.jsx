import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../utils/firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';    


export default function SubTaskPage() {
  const { taskId } = useParams();
  const [task, setTask] = useState(null);
  const [grup, setGrup] = useState(null);
  const [subTugasBaru, setSubTugasBaru] = useState('');
  const [tanggalSelesaiSubTugas, setTanggalSelesaiSubTugas] = useState({});

  // Fetch task data
  useEffect(() => {
    const fetchTask = async () => {
      const taskRef = doc(db, 'tugas', taskId);
      const taskSnap = await getDoc(taskRef);
      if (taskSnap.exists()) {
        setTask({ id: taskSnap.id, ...taskSnap.data() });
      }
    };
    fetchTask();
  }, [taskId]);

  // Fetch grup data
  useEffect(() => {
    if (task) {
      const fetchGrup = async () => {
        const grupRef = doc(db, 'grup', task.grupId);
        const grupSnap = await getDoc(grupRef);
        if (grupSnap.exists()) {
          setGrup({ id: grupSnap.id, ...grupSnap.data() });
        }
      };
      fetchGrup();
    }
  }, [task]);

  // Tambah sub-tugas
  const handleTambahSubTugas = async () => {
    if (!subTugasBaru.trim()) return;
  
    const updatedSubTugas = [
      ...task.subTugas,
      {
        id: uuidv4(), // ID unik untuk setiap sub-tugas
        namaSubTugas: subTugasBaru,
        tanggalMulai: '',
        tanggalSelesai: '',
        selesai: false,
        penanggungJawab: [],
      },
    ];
  
    const taskRef = doc(db, 'tugas', task.id);
    await updateDoc(taskRef, { subTugas: updatedSubTugas });
    setTask({ ...task, subTugas: updatedSubTugas });
    setSubTugasBaru('');
  };
  // Edit sub-tugas
  const handleEditSubTugas = async (subTaskId, field, value) => {
    const updatedSubTugas = task.subTugas.map((sub) =>
      sub.id === subTaskId ? { ...sub, [field]: value } : sub
    );
  
    const taskRef = doc(db, 'tugas', task.id);
    await updateDoc(taskRef, { subTugas: updatedSubTugas });
    setTask({ ...task, subTugas: updatedSubTugas });
  };
  

 
// Hapus sub-tugas
const handleHapusSubTugas = async (subTaskId) => {
    const updatedSubTugas = task.subTugas.filter((sub) => sub.id !== subTaskId);
  
    const taskRef = doc(db, 'tugas', task.id);
    await updateDoc(taskRef, { subTugas: updatedSubTugas });
    setTask({ ...task, subTugas: updatedSubTugas });
    checkIfAllSubTasksAreComplete(updatedSubTugas);
  };
  
  
  

  const handleTogglePenanggungJawab = async (subTaskId, anggota) => {
    const updatedSubTugas = task.subTugas.map((sub) =>
      sub.id === subTaskId
        ? {
            ...sub,
            penanggungJawab: sub.penanggungJawab.includes(anggota)
              ? sub.penanggungJawab.filter((p) => p !== anggota)
              : [...sub.penanggungJawab, anggota],
          }
        : sub
    );

    const taskRef = doc(db, 'tugas', task.id);
    await updateDoc(taskRef, { subTugas: updatedSubTugas });
    setTask({ ...task, subTugas: updatedSubTugas });
  };

  // Tandai sub-tugas selesai
  const handleSubTaskSelesai = async (subTaskId, tanggalSelesai) => {
    const updatedSubTugas = task.subTugas.map((sub) =>
      sub.id === subTaskId ? { ...sub, selesai: true, tanggalSelesai } : sub
    );

    const taskRef = doc(db, 'tugas', task.id);
    await updateDoc(taskRef, { subTugas: updatedSubTugas });
    setTask({ ...task, subTugas: updatedSubTugas });
    checkIfAllSubTasksAreComplete(updatedSubTugas);
  };

  // Periksa apakah semua sub-tugas selesai
  const checkIfAllSubTasksAreComplete = async (subTugas) => {
    const allComplete = subTugas.every((sub) => sub.selesai);
    if (allComplete) {
      const tanggalSelesai = subTugas.reduce((latest, sub) => {
        return new Date(sub.tanggalSelesai) > new Date(latest) ? sub.tanggalSelesai : latest;
      }, subTugas[0].tanggalSelesai);

      const taskRef = doc(db, 'tugas', task.id);
      await updateDoc(taskRef, { selesai: true, tanggalSelesai });
      setTask({ ...task, selesai: true, tanggalSelesai });
    }
  };

  const calculateDays = (start, end) => {
    if (!start || !end) return '-';
    const startDate = new Date(start);
    const endDate = new Date(end);
    const oneDay = 24 * 60 * 60 * 1000; // Miliseconds in a day
    return Math.round((endDate - startDate) / oneDay);
  };

  if (!task || !grup) {
    return <p>Memuat data...</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Sub-Tugas untuk: {task.namaTugas}</h2>

      {/* Daftar sub-tugas */}
      <ul>
      {task.subTugas.map((sub) => (
        <li key={sub.id} className="p-4 bg-gray-100 rounded mb-2">
            <div className="flex justify-between items-center">
              <input
                type="text"
                defaultValue={sub.namaSubTugas}
                onBlur={(e) => handleEditSubTugas(sub.id, 'namaSubTugas', e.target.value)}
                className="border p-2 rounded w-full mb-2"
              />
              <button
               onClick={() => handleHapusSubTugas(sub.id)}
                className="bg-red-500 text-white px-2 py-1 rounded ml-4"
              >
                ✖
              </button>
            </div>
            <div className="flex gap-4">
              <input
                type="date"
                defaultValue={sub.tanggalMulai}
                onBlur={(e) => handleEditSubTugas(sub.id, 'tanggalMulai', e.target.value)}
                className="border p-2 rounded w-full"
              />
              <input
                type="date"
                defaultValue={sub.tanggalSelesai}
                onBlur={(e) => handleEditSubTugas(sub.id, 'tanggalSelesai', e.target.value)}
                className="border p-2 rounded w-full"
              />
            </div>
            <p className="mt-2">
              <strong>Jumlah Hari:</strong> {calculateDays(sub.tanggalMulai, sub.tanggalSelesai)}
            </p>
            <h3 className="text-lg font-bold mt-2">Penanggung Jawab:</h3>
            <div className="flex flex-wrap gap-4 mt-2">
              {grup.anggotaTim.map((anggota) => (
                <label key={anggota} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={sub.penanggungJawab?.includes(anggota)}
                    onChange={() => handleTogglePenanggungJawab(sub.id, anggota)}
                  />
                  {anggota}
                </label>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-4">
              <input
                type="date"
                onChange={(e) => setTanggalSelesaiSubTugas({ ...tanggalSelesaiSubTugas, [sub.id]: e.target.value })}
                className="border p-2 rounded"
              />
              <button
                onClick={() => handleSubTaskSelesai(sub.id, tanggalSelesaiSubTugas[sub.id])}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Tandai Selesai
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Tambah sub-tugas */}
      <div className="mt-4 flex gap-4">
        <input
          type="text"
          placeholder="Nama Sub-Tugas Baru"
          value={subTugasBaru}
          onChange={(e) => setSubTugasBaru(e.target.value)}
          className="border p-2 rounded flex-grow"
        />
        <button
          onClick={handleTambahSubTugas}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          ➕
        </button>
      </div>
    </div>
  );
}
