export const MOCK_PORT = 3000;

export const mockConfigService = {
  get: jest.fn().mockImplementation((key: string) => {
    if (key === 'server.port') {
      return MOCK_PORT;
    }
    return null;
  }),
};
