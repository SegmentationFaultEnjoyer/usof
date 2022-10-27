import './Image.scss'

import { useState, useRef } from 'react'
import { CSSTransition } from 'react-transition-group'

export default function Image({ url, alt }) {
    const [isFullScreen, setIsFullScreen] = useState(false)
    const fullScreenRef = useRef(null)
    
    return (
        <>
            <img 
                src={ url }
                alt={ alt }
                onClick={ () => setIsFullScreen(true) }
                className='image'/>

            <CSSTransition
                nodeRef={ fullScreenRef }
                in={ isFullScreen }
                timeout={250}
                classNames='image'
                unmountOnExit
                >
                <div 
                    className='image__fullscreen'
                    ref={ fullScreenRef }
                    onClick={ () => setIsFullScreen(false) }
                >
                    <img 
                        src={ url }
                        alt={ alt }
                        className='image image--disable-hover'/>
                </div>
            </CSSTransition> 
        </>
    )
}