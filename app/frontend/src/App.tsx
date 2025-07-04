import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { router } from './routes';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
