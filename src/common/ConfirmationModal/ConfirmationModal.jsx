import './ConfirmationModal.scss'

import { useRef } from 'react'

import { Modal, Notificator } from '@/common'
import { ErrorHandler } from '@/helpers';

import Button from '@mui/material/Button';

export default function ConfirmationModal({ isOpen, setIsOpen, action, message }) {
    const confirmModalRef = useRef(null);

    const cancel = () => {
        setIsOpen(false)
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        try {
            await action()

            setIsOpen(false)

            if (!message) return

            Notificator.success(message)

        } catch (error) {
            ErrorHandler.process(error)
        }
    }

    return (
        <Modal isShown={isOpen} setIsShown={setIsOpen} ref={confirmModalRef}>
            <div className='confirmation-modal'>
                <h1>Are you sure?</h1>
                <form onSubmit={onSubmit} className='confirmation-modal__actions'>
                    <Button
                        color='error'
                        variant='contained'
                        onClick={cancel}
                        size="large">No</Button>
                    <Button
                        color='success'
                        variant='contained'
                        type='submit'
                        size="large">Yes</Button>
                </form>
            </div>
        </Modal>
    )
}