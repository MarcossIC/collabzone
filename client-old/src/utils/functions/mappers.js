export const welcomeAPIMapper = client => {
  return {
    firstName: client.name,
    lastName: client.lastname,
    rol: client.role,
  };
};
