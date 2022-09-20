import { AnimatePresence, motion } from 'framer-motion';
import { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

export default function AppRoutes() {
    const LoginPage = lazy(() => import('@/pages/LoginPage/LoginPage'));
    const MainPage = lazy(() => import('@/pages/MainPage/MainPage'));
    const ErrorPage = lazy(() => import('@/pages/ErrorPage'))

    const location = useLocation();
    //TODO Loader
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