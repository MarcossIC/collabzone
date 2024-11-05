import { useSearchParams } from 'react-router-dom';

const firstLetterToUpper = str => {
  const letter = str.split(' ');
  if (letter.length === 0) return '';
  return (
    letter[0].charAt(0).toUpperCase() +
    letter[0].slice(1) +
    ' ' +
    letter.slice(1).join(' ').toLowerCase()
  );
};

const RoomName = ({ roomId }) => {
  const [searchParams] = useSearchParams();
  const name = searchParams.get('roomName') || '';

  const formattedRoomName = firstLetterToUpper(name.replace(/-/g, ' '));

  return (
    <h1 className="mb-3 text-xl font-semibold">
      {roomId ? `${formattedRoomName}` : 'Lobby'}
    </h1>
  );
};

export default RoomName;
