import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { Toaster } from 'react-hot-toast';
import apolloClient from './graphql/apolloClient';
import { AuthProvider, useAuth } from './context/AuthContext';
import PrivateRoute from './components/common/PrivateRoute';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Courses from './pages/Courses';
import Universities from './pages/Universities';
import Chatbot from './pages/Chatbot';
import StudentCourseRelations from './pages/StudentCourseRelations';
import AccessDenied from './pages/AccessDenied';
import { ROUTES } from './utils/constants';

// Admin-only route wrapper
function AdminRoute({ children }) {
  const { isAdmin } = useAuth();
  return isAdmin() ? children : <Navigate to="/access-denied" replace />;
}

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <Router>
        <AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff',
                },
              },
            }}
          />
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/access-denied" element={<AccessDenied />} />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Layout />
                </PrivateRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path={ROUTES.STUDENTS} element={<Students />} />
              <Route path={ROUTES.COURSES} element={<Courses />} />
              <Route path={ROUTES.UNIVERSITIES} element={<Universities />} />
              <Route path={ROUTES.CHATBOT} element={<Chatbot />} />
              <Route 
                path={ROUTES.RELATIONS} 
                element={
                  <AdminRoute>
                    <StudentCourseRelations />
                  </AdminRoute>
                } 
              />
            </Route>

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </Router>
    </ApolloProvider>
  );
}

export default App;