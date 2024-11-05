import { getRoomImage } from '@/data/getRoomImage';
import { EmptyTab } from '../EmptyTab/EmptyTab';
import { TabItem } from './TabItem';
import container from '/public/svg/container.svg';
import users from '/public/svg/icon-toolbar/profile-2user.svg';
//item.name.length > 20 ? item.name.slice(0, 20) + '...' : item.name
export const TabListItem = ({ items, isRoom = false }) => (
  <div className="flex h-[275px] max-h-full w-full overflow-hidden">
    <div className="flex w-full flex-col gap-y-4 overflow-auto">
      {items?.length > 0 ? (
        items.map((item, i) => (
          <TabItem
            key={item.name + i}
            id={item.id}
            roomId={item.roomId}
            name={item.name}
            count={item?.users?.length}
            sub={item?.sub}
            img={isRoom ? getRoomImage(item.tileset) : item?.picture}
            isRoom={isRoom}
          />
        ))
      ) : (
        <EmptyTab text="No hay elementos" img={isRoom ? container : users} />
      )}
    </div>
  </div>
);
