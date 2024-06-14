import React, { useState, useEffect, useCallback } from 'react';
import { Autocomplete, TextField, CircularProgress, ListItem, InputAdornment } from '@mui/material';
import { debounce } from 'lodash';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';

// XMLレスポンスをパースして必要なデータを抽出する関数
const parseXmlResponse = (xmlString: string) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "application/xml");

  const items = xmlDoc.getElementsByTagName("record");
  const titles: string[] = [];

  for (let i = 0; i < items.length; i++) {
    const titleElement = items[i].getElementsByTagName("dc:title")[0];
    let title = titleElement ? titleElement.textContent : "";
    if (title && title.trim()) {
      title = title.replace(/\.$/, ""); // 末尾のピリオドを削除
      titles.push(title);
    }
  }

  console.log('Parsed Titles:', titles); // 取得したタイトルをログ出力

  return titles;
};

const normalizeTitle = (title: string) => {
  return title.toLowerCase();
};

interface TitleCount {
  Title: string;
  Count: number;
}

interface BookAutocompleteProps {
  inputValue: string;
  onInputChange: (event: React.SyntheticEvent, value: string) => void;
  error?: boolean;
  helperText?: string;
}

const BookAutocomplete: React.FC<BookAutocompleteProps> = ({
  inputValue,
  onInputChange,
  error,
  helperText,
  ...rest
}) => {
  const [options, setOptions] = useState<TitleCount[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [cancelTokenSource, setCancelTokenSource] = useState(axios.CancelToken.source());

  const processTitles = (titles: string[]) => {
    console.log(titles);
    // タイトルをグルーピングして頻度をカウント
    const titleCountsMap: { [key: string]: TitleCount } = titles.reduce((acc, title) => {
      const normalized = normalizeTitle(title);
      if (!acc[normalized]) {
        acc[normalized] = { Title: title, Count: 0 };
      }
      acc[normalized].Count += 1;

      // 既にエントリーが存在する場合、大文字に統一する
      if (title.toUpperCase() === title) {
        acc[normalized].Title = title;
      }
      return acc;
    }, {} as { [key: string]: TitleCount });

    // 出現回数を降順にソート
    const titleCounts = Object.values(titleCountsMap).sort((a, b) => b.Count - a.Count);

    console.log('Sorted Titles:', titleCounts);  // ソートされた結果をログ出力

    return titleCounts;
  };

  const fetchMangaTitles = async (query: string) => {
    const dpid = "iss-ndl-opac-bib";
    const encodedNdc = "726.1";
    const apiUrl = `https://ndlsearch.ndl.go.jp/api/sru?operation=searchRetrieve&recordPacking=xml&query=dpid=${dpid}%20AND%20ndc=${encodedNdc}%20AND%20title=${encodeURIComponent(query)}%20AND%20sortBy=issued_date/sort.ascending`;

    try {
      // 前のリクエストをキャンセル
      if (cancelTokenSource) {
        cancelTokenSource.cancel('Operation canceled due to new request.');
      }

      // 新しいキャンセルトークンを作成
      const newCancelTokenSource = axios.CancelToken.source();
      setCancelTokenSource(newCancelTokenSource);

      setIsLoading(true);
      const response = await axios.get(apiUrl, {
        headers: {
          'Accept': 'application/xml'
        },
        cancelToken: newCancelTokenSource.token,
      });

      // 取得したXMLレスポンスをログ出力
      console.log('XML Response:', response.data);

      const titles = parseXmlResponse(response.data);

      // 取得したデータをコンソールに表示
      console.log('Fetched titles:', titles);

      const processedTitles = processTitles(titles);

      // 処理されたデータを setOptions で設定
      setOptions(processedTitles);
      setIsLoading(false); // データフェッチ完了後にローディングを終了

    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Request canceled', error.message);
      } else {
        console.error('Error fetching manga titles:', error);
        setIsLoading(false);
        setOptions([]); // エラー時に空リストを設定
      }
    }
  };

  // デバウンスを利用した入力処理
  const debouncedFetch = useCallback(
    debounce(async (query: string) => {
      if (query && !isSelected) {
        await fetchMangaTitles(query);
      } else {
        setOptions([]);
        setIsLoading(false); // クエリが空の時にローディングを終了
      }
    }, 600), // 600ミリ秒のデバウンス
    [isSelected]
  );

  useEffect(() => {
    if (!isSelected) {
      debouncedFetch(inputValue);
    }
  }, [inputValue, debouncedFetch]);

  // フィルタリングを無効にするカスタムフィルターを作成
  const filterOptions = (options: TitleCount[]) => options;

  return (
    <>
      <Autocomplete
        {...rest}
        options={options}
        popupIcon={false}
        filterOptions={filterOptions}
        getOptionLabel={(option: TitleCount) => option.Title}
        isOptionEqualToValue={(option: TitleCount, value: TitleCount) =>
          option.Title === value.Title
        }
        renderOption={(props, option: TitleCount) => (
          <ListItem {...props} key={option.Title}>
            {option.Title}
          </ListItem>
        )}
        noOptionsText="作品タイトルを入力してください"
        renderInput={(params) => (
          <TextField
            {...params}
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  {isLoading ? <CircularProgress size={20} /> : <SearchIcon />}
                </InputAdornment>
              ),
            }}
            placeholder='例) ONE PIECE'
            error={error}
            helperText={helperText}
          />
        )}
        inputValue={inputValue}
        onInputChange={(_, newInputValue) => {
          onInputChange(_, newInputValue);
          setIsSelected(false); // 入力が変更されたときにisSelectedをfalseに設定
          if (!newInputValue) {
            setIsLoading(false); // 入力がクリアされたときにローディングを終了
          }
        }}
        onChange={(_, newValue) => {
          onInputChange(_, newValue ? newValue.Title : '');
          setIsSelected(true); // 選択されたときにisSelectedをtrueに設定
        }}
      />
    </>
  );
};

export default BookAutocomplete;
