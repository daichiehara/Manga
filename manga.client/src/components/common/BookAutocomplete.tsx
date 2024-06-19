import React, { useState, useEffect, useCallback } from 'react';
import { Autocomplete, TextField, CircularProgress, ListItem, InputAdornment } from '@mui/material';
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
      title = title.replace(/★/g, "・").replace(/☆/g, "・");
      titles.push(title);
    }
  }

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

const famousTitles = [
    { Title: 'ONE PIECE', Count: 1 },
    { Title: '呪術廻戦', Count: 1 },
    { Title: '鬼滅の刃', Count: 1 },
    { Title: 'ダンジョン飯', Count: 1 },
    { Title: '転生したらスライムだった件', Count: 1 },
    { Title: '美味しんぼ', Count: 1 },
    { Title: '花より男子', Count: 1 },
  ];
  

const BookAutocomplete: React.FC<BookAutocompleteProps> = ({
  inputValue,
  onInputChange,
  error,
  helperText,
  ...rest
}) => {
  const [options, setOptions] = useState<TitleCount[]>(famousTitles);
  const [isLoading, setIsLoading] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [cancelTokenSource, setCancelTokenSource] = useState(axios.CancelToken.source());

  const processTitles = (titles: string[]) => {
    const titleCountsMap: { [key: string]: TitleCount } = titles.reduce((acc, title) => {
      const normalized = normalizeTitle(title);
      if (!acc[normalized]) {
        acc[normalized] = { Title: title, Count: 0 };
      }
      acc[normalized].Count += 1;

      if (title.toUpperCase() === title) {
        acc[normalized].Title = title;
      }
      return acc;
    }, {} as { [key: string]: TitleCount });

    const titleCounts = Object.values(titleCountsMap).sort((a, b) => b.Count - a.Count);

    return titleCounts;
  };

  const fetchMangaTitles = async (query: string) => {
    const dpid = "iss-ndl-opac-bib";
    const encodedNdc = "726.1";
    const apiUrl = `https://ndlsearch.ndl.go.jp/api/sru?operation=searchRetrieve&recordPacking=xml&query=dpid=${dpid}%20AND%20ndc=${encodedNdc}%20AND%20title=${encodeURIComponent(query)}%20AND%20sortBy=issued_date/sort.ascending`;

    try {
      if (cancelTokenSource) {
        cancelTokenSource.cancel('Operation canceled due to new request.');
      }

      const newCancelTokenSource = axios.CancelToken.source();
      setCancelTokenSource(newCancelTokenSource);

      setIsLoading(true);
      const response = await axios.get(apiUrl, {
        headers: {
          'Accept': 'application/xml'
        },
        cancelToken: newCancelTokenSource.token,
      });

      const titles = parseXmlResponse(response.data);

      const processedTitles = processTitles(titles);

      setOptions(processedTitles);
      setIsLoading(false);

    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Request canceled', error.message);
      } else {
        console.error('Error fetching manga titles:', error);
        setIsLoading(false);
        setOptions([]);
      }
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      fetchMangaTitles(inputValue);
    }
  };

  const handleFocus = () => {
    if (!inputValue) {
      setOptions(famousTitles);
    }
  };

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
        noOptionsText="作品タイトルを選択してください"
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
              sx: {
                borderRadius: 50, // 角を丸める
                '& input[type=search]::-webkit-search-cancel-button': {
                  '-webkit-appearance': 'none', // デフォルトの検索キャンセルボタンを非表示
                  display: 'none',
                },
                '& input[type=search]::-webkit-search-decoration': {
                  '-webkit-appearance': 'none', // デフォルトの検索デコレーションを非表示
                  display: 'none',
                },
              },
              onKeyDown: handleKeyDown,
              onFocus: handleFocus,
            }}
            placeholder='例) ONE PIECE'
            type='search'
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
            setOptions(famousTitles);
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
