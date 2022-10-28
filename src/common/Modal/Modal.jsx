import './Modal.scss';

import {
    forwardRef,
    useImperativeHandle,
    useRef,
} from 'react'
import { createPortal } from 'react-dom'
import { CSSTransition } from 'react-transition-group'
import { useClickAway } from 'react-use'


const Modal = forwardRef(({ isShown, setIsShown, isCloseByClickOutside = true, children, ...rest }, ref) => {
    const modalRef = useRef(null)
    const modalPaneRef = useRef(null)
    const modalRoot = document.getElementById('modal');

    useClickAway(modalPaneRef, () => {
        if (isCloseByClickOutside) {
            setIsShown(false)
        }
    })

    const closeModal = () => {
        setIsShown(false)
    }

    useImperativeHandle(ref, () => { closeModal })

    return createPortal(
        <CSSTransition
            nodeRef={modalRef}
            in={isShown}
            timeout={250}
            classNames='modal'
            unmountOnExit>
            <div ref={modalRef} className='modal' {...rest}>
                <div ref={modalPaneRef} className='modal__pane'>
                    {children}
                </div>
            </div>
        </CSSTransition>,
        modalRoot,
    )
})

export default Modal;
