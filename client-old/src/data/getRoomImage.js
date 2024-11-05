import centralImg from '/public/images/CENTRAL.png';
import dailyImg from '/public/images/DAILY.png';
import designImg from '/public/images/DESIGN.png';
import forgeImg from '/public/images/FORGE.png';
import zenzoneImg from '/public/images/ZENZONE.png';

export const getRoomImage = tileset => {
  if (tileset === 'CENTRAL') return centralImg;
  if (tileset === 'DAILY') return dailyImg;
  if (tileset === 'DESIGN') return designImg;
  if (tileset === 'FORGE') return forgeImg;
  if (tileset === 'ZENZONE') return zenzoneImg;
  return '';
};
