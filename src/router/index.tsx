import { createBrowserRouter, Navigate } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Courses from '../pages/Courses'
import CourseDetail from '../pages/CourseDetail'
import Learning from '../pages/Learning'
import CodePlayground from '../pages/CodePlayground'
import Profile from '../pages/Profile'
import Community from '../pages/Community'
import Achievements from '../pages/Achievements'
import AIAgent from '../pages/AIAgent'
import Cognition from '../pages/Cognition'

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    element: <MainLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/courses', element: <Courses /> },
      { path: '/courses/:id', element: <CourseDetail /> },
      { path: '/learn/:courseId/:chapterId', element: <Learning /> },
      { path: '/playground', element: <CodePlayground /> },
      { path: '/profile', element: <Profile /> },
      { path: '/community', element: <Community /> },
      { path: '/achievements', element: <Achievements /> },
      { path: '/ai-agent', element: <AIAgent /> },
      { path: '/cognition', element: <Cognition /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])

export default router
