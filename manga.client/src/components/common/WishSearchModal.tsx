import React from 'react';
import SearchModal from './SearchModal';

interface WishSearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onRefreshWishList: () => void;  // ウィッシュリストをリフレッシュするためのコールバック関数
    currentBooks: { itemId: number; title: string }[];
}

const WishSearchModal: React.FC<WishSearchModalProps> = ({ isOpen, onClose, onRefreshWishList, currentBooks }) => {
    return (
        <SearchModal
            isOpen={isOpen}
            onClose={onClose}
            onRefreshList={onRefreshWishList}
            apiEndpoint="https://localhost:7103/api/WishLists"
            placeholder="タイトルまたは作者で検索"
            completeMessage="タイトルがウィッシュリストに追加されました。"
            noSelectionMessage="タイトルが選択されていません。"
            message1='欲しい漫画を登録しよう!'
            message2='出品した漫画に対して、登録した漫画との'
            message3='交換リクエストが来ます。'
            messageColor='blue'
            currentList={currentBooks}
        />
    );
};

export default WishSearchModal;
