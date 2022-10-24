import './MainPage.scss';

import { useEffect} from 'react';
import CookieConsent from 'react-cookie-consent';

import { useUserInfo } from '@/hooks';
import { TriangleLoader } from '@/common';

import { NavBar, PostsList, PostsFilter } from '@/components';

export default function MainPage() {
    const { isLoading, getUserInfo } = useUserInfo();
   
    useEffect(() => { getUserInfo() }, []);

    console.log('render main');

    return (
        <section className="main-page">
            {isLoading ? 
            <div className="main-page__loader-container">
                <p>Loading...</p>
                <TriangleLoader /> 
            </div>
        : 
            <>
                <NavBar />
                <PostsFilter />
                <PostsList />
                <CookieConsent
                    containerClasses='slide-top'
                    style={{ background: "var(--primary-main)" }}
                    buttonStyle={{ 
                        backgroundColor: "var(--secondary-main)", 
                        color: "var(--tertiary-main)",
                        borderRadius: "5px" }}>
                    This website uses cookies to enhance the user experience.
                </CookieConsent>
            </>}
        </section>
    )
}