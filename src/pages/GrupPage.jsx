import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../utils/firebaseConfig";
import { collection, getDocs, doc, deleteDoc, addDoc, updateDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { FiTrash, FiPlus } from "react-icons/fi";
import { FiX } from "react-icons/fi";
import logo from '../assets/logo.png'

export default function GrupPage() {
  const [grup, setGrup] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [namaGrupBaru, setNamaGrupBaru] = useState("");
  const [anggota, setAnggota] = useState([{ id: uuidv4(), nama: "" }]);

  // Fetch grup data from Firestore
  useEffect(() => {
    const fetchGrup = async () => {
      const snapshot = await getDocs(collection(db, "grup"));
      const grupData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setGrup(grupData);
    };
    fetchGrup();
  }, []);

  // Tambah grup baru
  const handleTambahGrup = async () => {
    if (!namaGrupBaru.trim()) return;

    const grupBaru = { namaGrup: namaGrupBaru, anggotaTim: anggota.filter((member) => member.nama.trim() !== "") }; // Anggota kosong tidak disimpan
    const docRef = await addDoc(collection(db, "grup"), grupBaru); // Simpan ke Firestore

    setGrup([...grup, { id: docRef.id, ...grupBaru }]); // Perbarui state lokal
    setNamaGrupBaru(""); // Reset input
    setAnggota([{ id: uuidv4(), nama: "" }]); // Reset anggota
    setShowModal(false); // Tutup modal
  };

  // Tambah input anggota baru
  const tambahAnggotaInput = () => {
    setAnggota((prevAnggota) => [...prevAnggota, { id: uuidv4(), nama: "" }]); // Tambahkan input anggota baru
  };

  // Hapus anggota input
  const hapusAnggotaInput = (id) => {
    const updatedAnggota = anggota.filter((member) => member.id !== id);
    setAnggota(updatedAnggota);
  };

  // Update nilai input anggota
  const handleInputAnggota = (id, value) => {
    const updatedAnggota = anggota.map((member) =>
      member.id === id ? { ...member, nama: value } : member
    );
    setAnggota(updatedAnggota);
  };

  // Hapus grup berdasarkan ID
  const handleHapusGrup = async (grupId) => {
    try {
      await deleteDoc(doc(db, "grup", grupId)); // Hapus dari Firestore
      setGrup(grup.filter((item) => item.id !== grupId)); // Perbarui state lokal
    } catch (error) {
      console.error("Error menghapus grup:", error);
    }
  };

  return (
    
    <div className="min-h-screen bg-[#081028] text-white p-6">
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <img
            src={logo}
            alt="Avatar"
            style={{ width: '10%', height: '50%' }}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h1 className="text-xl font-bold">TASK MANAGER</h1>
            <p className="text-sm text-gray-400">FikraLex Digital Hub</p>
          </div>
        </div>
      </header>
      <h1 className="text-3xl font-bold text-center mb-8 font-plus-jakarta">BUAT TIM PROJEK ANDA</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {grup.map((item) => (
         <div
         key={item.id}
         
  className="card"
       >
         <Link
           to={`/tugas/${item.id}`}
           className="text-xl font-bold font-plus-jakarta  text-white text-overflow-ellipsis text-fit"
           style={{ width: "100%" }}
         >
           {item.namaGrup}
         </Link>
         <div className="w-full bg-gray-300 rounded-full h-2 mb-2">
           <div
             className="bg-blue-500 h-2 rounded-full"
             style={{ width: "95%" }}
           ></div>
         </div>
         <span className="text-sm font-plus-jakarta">95/100</span>
         <button className="bg-[#FF0000] text-white rounded-full p-2">
  <FiTrash size={20} /> {/* Ikon Sampah */}
</button>

       </div>
       
        ))}
      </div>

      {/* Tombol Tambah Grup */}
      <button
  onClick={() => setShowModal(true)}
  className="fixed bottom-8 right-8 bg-[#FF4D00] text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center"
>
  <FiPlus size={24} /> {/* Ikon Plus */}
</button>


      {/* Modal Tambah Grup */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-[#0B1739] p-6 rounded-lg shadow-lg w-96 relative">
            <h2 className="text-xl font-plus-jakarta font-bold mb-4 text-center text-white">
              NAMA GRUP
            </h2>
            <input
  type="text"
  placeholder="Nama Grup"
  value={namaGrupBaru}
  onChange={(e) => setNamaGrupBaru(e.target.value)}
  className="w-full p-2 rounded mb-4 text-gray-800 pe border border-gray-300"
  style={{ backgroundColor: 'white' }}
/>


            <h2 className="text-lg font-bold font-plus-jakarta mb-2 text-white">ANGGOTA TIM</h2>
            {anggota.map((member) => (
              <div key={member.id} className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder={`Nama Anggota`}
                  value={member.nama}
                  onChange={(e) => handleInputAnggota(member.id, e.target.value)}
                  className="w-full p-2 rounded mb-4 text-gray-800 pe border border-gray-300"
                  style={{ backgroundColor: 'white' }}
                />
                {anggota.length > 1 && (
                  <button
                    onClick={() => hapusAnggotaInput(member.id)}
                    className="bg-[#FF0000] text-white px-2 py-1 h-10 rounded"
                  >
                <FiTrash size={20} />
                  </button>
                )}
              </div>
            ))}
       <button
  onClick={tambahAnggotaInput}
  className="w-full bg-white border border-white text-white py-2 px-4 rounded flex items-center justify-center gap-4"
>
  <FiPlus size={20} /> 
</button>

            <button
              onClick={handleTambahGrup}
              className="w-full bg-[#FF3F14] text-white py-2 rounded mt-4"
            >
              BUAT GRUP
            </button>

            <button
              onClick={() => setShowModal(false)}
              className="bg-[#0B1739] absolute top-2 right-2"
            >
             <FiX size={24} color="#FFFFFF" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
