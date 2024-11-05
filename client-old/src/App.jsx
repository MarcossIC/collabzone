import { Suspense } from 'react';
import AppRouter from './routes/Router.jsx';
import ToastNotification from './components/ToastNotification/ToastNotification.jsx';

const App = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <ToastNotification />
    <AppRouter />
  </Suspense>
);

export default App;
