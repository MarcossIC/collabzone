const dateFormat = date => {
  const now = new Date();
  const notificationDate = new Date(date);
  const diffMs = now - notificationDate; // Diferencia en milisegundos
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 60) {
    return `${diffMinutes} mn`;
  } else if (diffHours < 24) {
    return `${diffHours} h`;
  } else {
    return `${diffDays} d`;
  }
};

export default dateFormat;
