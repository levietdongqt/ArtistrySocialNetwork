import { useState } from "react";
import Modal from "react-modal";

interface CreateModalParams {
    isOpen: boolean;
    children: React.ReactNode;
  }
  const customStyles = {
    content: {
        marginTop: '10%',
        marginLeft: 'auto',
        marginRight: 'auto',
        border: '2px solid #ccc',
        width: 'auto', // Chiều rộng tự động theo nội dung
        maxWidth: '60%',
    },
  };

export default function CustomModal( {isOpen,children } : CreateModalParams) {
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const handleCloseModal = () => {
        setModalIsOpen(false);
    };
    return (
        <Modal
            isOpen={modalIsOpen}
            onRequestClose={handleCloseModal}
            ariaHideApp={false}
            className="modal"
            style={customStyles}
        >
            <div className="modal-content">
                {children}
            </div>
        </Modal>
    )
}