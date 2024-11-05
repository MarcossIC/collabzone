import { useRoutes } from 'react-router-dom';
import Office from '../views/Office/Office';
import NotFound from '@/views/NotFound/NotFound';
import { UserSignupPage } from '@/views/UserSignup/UserSignupPage';
import { UserSigninPage } from '@/views/UserSignin/UserSigninPage';
import { UserWelcomePage } from '@/views/UserWelcome/UserWelcomePage';
import { EnterpriseSignup } from '@/views/EnterpriseSignup/EnterpriseSignup';
import { Outlet } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { OnlyNoAuth } from './OnlyNoAuth';
import { Navigate } from 'react-router-dom';

const AppRouter = () => {
  const routes = useRoutes([
    {
      path: '/',
      element: (
        <ProtectedRoute>
          <Navigate to="/office" />
        </ProtectedRoute>
      ),
    },
    {
      path: '/office',
      element: <Outlet />,
      children: [
        {
          index: true,
          element: (
            <ProtectedRoute>
              <Office />
            </ProtectedRoute>
          ),
        },
        {
          path: ':roomId',
          element: (
            <ProtectedRoute isAllowed={user => !user.isEmp}>
              <Office />
            </ProtectedRoute>
          ),
        },
      ],
    },
    {
      path: '/signup',
      element: (
        <OnlyNoAuth>
          <UserSignupPage />
        </OnlyNoAuth>
      ),
    },
    {
      path: '/signin',
      element: (
        <OnlyNoAuth>
          <UserSigninPage />
        </OnlyNoAuth>
      ),
    },
    {
      path: '/enterprise-signup',
      element: (
        <OnlyNoAuth>
          <EnterpriseSignup />
        </OnlyNoAuth>
      ),
    },
    {
      path: '/welcome',
      element: (
        <ProtectedRoute isAllowed={user => !user.isEmp}>
          <UserWelcomePage />
        </ProtectedRoute>
      ),
    },
    {
      path: '*',
      element: <NotFound />,
    },
  ]);

  return routes;
};

export default AppRouter;
