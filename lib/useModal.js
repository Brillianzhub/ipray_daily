import { useState } from 'react';

const useModal = () => {
    const [modalVisible, setModalVisible] = useState(false);

    const showModal = () => setModalVisible(true);
    const hideModal = () => setModalVisible(false);

    return {
        modalVisible,
        showModal,
        hideModal,
    };
};

export default useModal;
