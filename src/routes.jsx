import { AnimatePresence, motion } from 'framer-motion';
import { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

export default function AppRoutes() {
    const LoginPage = lazy(() => import('@/pages/LoginPage/LoginPage.jsx'));
    const MainPage = lazy(() => import('@/pages/MainPage/MainPage.jsx'));
    const ErrorPage = lazy(() => import('@/pages/ErrorPage/ErrorPage.jsx'));
    const ResetPage = lazy(() => import('@/pages/ResetPasswordPage/ResetPassword.jsx'));
    const UserPage = lazy(() => import('@/pages/UserPage/UserPage.jsx'))
    const AdminPage = lazy(() => import('@/pages/AdminPage/AdminPage.jsx'))

    const location = useLocation();
    
    return (
        <Suspense fallback={<></>}>
            <AnimatePresence mode='wait'>
                <Routes location={location} key={location.pathname}>
                    <Route path='/' element={
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}>
                            <LoginPage />
                        </motion.div>
                    } />
                    <Route path='/main' element={
                        <motion.div 
                            initial={{ opacity: 0}}
                            animate={{ opacity: 1}}
                            exit={{ opacity: 0}}>
                            <MainPage />
                        </motion.div>
                    } />
                    <Route path='/user/:id' element={
                        <motion.div 
                            initial={{ opacity: 0}}
                            animate={{ opacity: 1}}
                            exit={{ opacity: 0}}>
                            <UserPage />
                        </motion.div>
                    } />
                    <Route path='/admin' element={
                        <motion.div 
                            initial={{ opacity: 0}}
                            animate={{ opacity: 1}}
                            exit={{ opacity: 0}}>
                            <AdminPage />
                        </motion.div>
                    } />
                    <Route path='/reset-page/:id/:token' element={
                        <motion.div 
                            initial={{ opacity: 0}}
                            animate={{ opacity: 1}}
                            exit={{ opacity: 0}}>
                            <ResetPage />
                        </motion.div>
                    } />
                    <Route path='/*' element={
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1}}
                            exit={{ opacity: 0}}>
                            <ErrorPage />
                        </motion.div>
                    } />
                </Routes>
            </AnimatePresence>
        </Suspense>
    )
}