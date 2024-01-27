import { MouseEvent } from "react";
import Modal from "react-modal";

interface CreateModalParams {
    isOpen: boolean
    onRequestClose: React.MouseEventHandler;
    children: React.ReactNode;
  }

export default function CustomModal( { isOpen, onRequestClose, children } : CreateModalParams) {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            ariaHideApp={false}
            className="modal"
        >
            <div className="modal-content">
                {children}
            </div>
        </Modal>
    )
}