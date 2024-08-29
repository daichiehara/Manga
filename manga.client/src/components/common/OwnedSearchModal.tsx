import React from 'react';
import SearchModal from './SearchModal';

interface OwnedSearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onRefreshOwnedList: () => void;  // 所有リストをリフレッシュするためのコールバック関数
    currentBooks: { itemId: number; title: string }[];
}

const OwnedSearchModal: React.FC<OwnedSearchModalProps> = ({ isOpen, onClose, onRefreshOwnedList, currentBooks }) => {
    return (
        <SearchModal
            isOpen={isOpen}
            onClose={onClose}
            onRefreshList={onRefreshOwnedList}
            apiEndpoint="https://localhost:7103/api/OwnedLists"
            placeholder="タイトルまたは作者で検索"
            completeMessage="タイトルが所有リストに追加されました。"
            noSelectionMessage="タイトルが選択されていません。"
            message1='全巻持っている漫画を追加しよう!'
            message2='検索であなたの漫画を欲しい人が'
            message3='見つかりやすくなります!'
            messageColor='red'
            currentList={currentBooks}
        />
    );
};

export default OwnedSearchModal;
