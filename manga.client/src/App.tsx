import SearchBar from './components/SearchBar';
import MangaListItem from './components/MangaListItem';
import MyBottomNavigation from './components/MyBottomNavigation';

function App() {
  return (
    <div>
      <SearchBar onSearch={(query) => console.log(query)} />
      {/* ここにダミーデータを使って MangaListItem をいくつか表示する */}
      <MangaListItem
        imageUrl="url_to_some_image"
        title="マンガのタイトル"
        description="簡単な説明"
      />
      {/* 他の MangaListItem コンポーネントも同様に追加 */}
      <MyBottomNavigation />
    </div>
  );
}

export default App;
