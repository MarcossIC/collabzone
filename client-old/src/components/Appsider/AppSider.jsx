/* eslint-disable prettier/prettier */

import React, { useState, useRef, useEffect } from 'react';

const roomsData = [
  { id: 1, name: 'Sala General', users: ['Usuario 1', 'Usuario 2', 'Usuario 3'] },
  { id: 2, name: 'Sala de Desarrollo', users: ['Dev 1', 'Dev 2', 'Dev 3'] },
  { id: 3, name: 'Sala de Diseño', users: ['Diseñador 1', 'Diseñador 2'] },
];

export default function AppSider() {
  const [expandedRooms, setExpandedRooms] = useState([]);
  const [viewMode, setViewMode] = useState('tree');
  const contentRefs = useRef({});

  const toggleRoom = roomId => {
    setExpandedRooms(prev =>
      prev.includes(roomId) ? prev.filter(id => id !== roomId) : [...prev, roomId]
    );
  };

  const toggleViewMode = () => {
    setViewMode(prev => (prev === 'tree' ? 'list' : 'tree'));
  };

  useEffect(() => {
    Object.entries(contentRefs.current).forEach(([roomId, ref]) => {
      if (ref) {
        if (expandedRooms.includes(Number(roomId))) {
          ref.style.maxHeight = `${ref.scrollHeight}px`;
        } else {
          ref.style.maxHeight = '0px';
        }
      }
    });
  }, [expandedRooms]);

  const allUsers = roomsData.flatMap(room => room.users);

  return (
    <div className="fixed left-0 top-0 h-screen w-64 overflow-y-auto bg-gray-100 p-4 text-gray-800 shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">DevDomination</h2>
        <button
          onClick={toggleViewMode}
          className="rounded-full bg-gray-200 p-2 transition-colors duration-200 hover:bg-gray-300"
          aria-label={
            viewMode === 'tree'
              ? 'Cambiar a vista de lista'
              : 'Cambiar a vista de árbol'
          }>
          {viewMode === 'tree' ? <>🚗</> : <>💵</>}
        </button>
      </div>

      {viewMode === 'tree' ? (
        <ul>
          {roomsData.map(room => (
            <li key={room.id} className="mb-2">
              <button
                onClick={() => toggleRoom(room.id)}
                className="flex w-full items-center rounded p-2 text-left transition-colors duration-200 hover:bg-gray-200">
                {expandedRooms.includes(room.id) ? (
                  // <ChevronDown className="w-4 h-4 mr-2 transition-transform duration-200" />
                  <>🎯</>
                ) : (
                  // <ChevronRight className="w-4 h-4 mr-2 transition-transform duration-200" />
                  <>⚡</>
                )}
                {room.name}
              </button>
              <div
                ref={el => (contentRefs.current[room.id] = el)}
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{ maxHeight: '0px' }}>
                <ul className="ml-6 mt-1">
                  {room.users.map((user, index) => (
                    <li key={index} className="flex items-center p-1 text-sm">
                      {/* <Users className="w-4 h-4 mr-2" /> */}
                      <>🚗</>
                      {user}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div>
          <h3 className="mb-2 font-semibold">Usuarios en línea</h3>
          <ul className="mb-4">
            {allUsers.map((user, index) => (
              <li key={index} className="flex items-center p-1 text-sm">
                {/* <Users className="w-4 h-4 mr-2" /> */}
                <>🚗</>
                {user}
              </li>
            ))}
          </ul>
          <h3 className="mb-2 font-semibold">Salas disponibles</h3>
          <ul>
            {roomsData.map(room => (
              <li key={room.id} className="flex items-center p-1 text-sm">
                {/* <FolderTree className="w-4 h-4 mr-2" /> */}
                <>🚗</>
                {room.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
