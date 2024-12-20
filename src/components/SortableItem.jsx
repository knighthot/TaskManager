import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export const SortableItem = ({ id, item }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    backgroundColor: item.color || "gray", // Warna card berdasarkan properti `color`
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-4 rounded-lg shadow mb-2"
    >
      <h3 className="text-white font-bold">{item.title}</h3>
      <ul className="text-gray-400 text-sm mt-2">
        {/* Tampilkan hanya nama subtasks */}
        {item.subtasks && item.subtasks.length > 0 ? (
          item.subtasks.map((subtask) => (
            <li key={subtask.id}>{subtask.title}</li> // Hanya tampilkan nama subtask
          ))
        ) : (
          <li>Tidak ada subtasks</li>
        )}
      </ul>
    </div>
  );
};
