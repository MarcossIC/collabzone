import { TabListItem, Tabs, TabsContent, TabsList, TabsTrigger } from '../Tabs';

export const UserModalTabs = ({ users }) => {
  return (
    <Tabs defaultValue="all" className="max-h-full overflow-hidden px-4">
      <TabsList className="mb-3 mt-4">
        <TabsTrigger value="all">Todas</TabsTrigger>
        <TabsTrigger value="online">En linea</TabsTrigger>
        <TabsTrigger value="offline">Desconectados</TabsTrigger>
      </TabsList>
      <TabsContent value="all">
        <TabListItem items={users} />
      </TabsContent>
      <TabsContent value="online">
        <TabListItem items={users.filter(user => user.status !== 'offline')} />
      </TabsContent>
      <TabsContent value="offline">
        <TabListItem items={users.filter(user => user.status === 'offline')} />
      </TabsContent>
    </Tabs>
  );
};
