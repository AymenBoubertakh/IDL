import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { Toaster } from 'react-hot-toast';
import apolloClient from './graphql/apolloClient';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Courses from './pages/Courses';
import Chatbot from './pages/Chatbot';
import StudentCourseRelations from './pages/StudentCourseRelations';
import { ROUTES } from './utils/constants';

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <Router>
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
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path={ROUTES.STUDENTS} element={<Students />} />
            <Route path={ROUTES.COURSES} element={<Courses />} />
            <Route path={ROUTES.CHATBOT} element={<Chatbot />} />
            <Route path={ROUTES.RELATIONS} element={<StudentCourseRelations />} />
          </Route>
        </Routes>
      </Router>
    </ApolloProvider>
  );
}

export default App;