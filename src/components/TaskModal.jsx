import React, { useState } from "react";

const TaskModal = ({ onClose, onSave }) => {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [color, setColor] = useState("#ffffff");
  const [status, setStatus] = useState("todo");

  const handleSave = () => {
    const newTask = { name, date, color, status, subtasks: [] };
    onSave(newTask);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-[#1e293b] p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Tambah Task</h2>
        <input
          type="text"
          placeholder="Nama Task"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 rounded mb-4"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-2 rounded mb-4"
        />
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-full p-2 rounded mb-4"
        />
        <button onClick={handleSave} className="bg-blue-500 px-4 py-2 rounded text-white">
          Simpan
        </button>
        <button onClick={onClose} className="bg-red-500 px-4 py-2 rounded text-white ml-4">
          Batal
        </button>
      </div>
    </div>
  );
};

export default TaskModal;
