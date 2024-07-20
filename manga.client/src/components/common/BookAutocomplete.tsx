import React, { useState, useEffect, useCallback } from 'react';
import { Autocomplete, TextField, CircularProgress, ListItem, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { debounce } from 'lodash';
import axios from 'axios';

interface BookAutocompleteProps {
  inputValue: string;
  onInputChange: (event: React.SyntheticEvent, value: string) => void;
  value: string;
  onChange: (event: React.SyntheticEvent, value: string | null) => void;
  error?: boolean;
  helperText?: string;
}

const famousTitles = [
  'ONE PIECE',
  '呪術廻戦',
  '鬼滅の刃',
  'ダンジョン飯',
  '転生したらスライムだった件',
  '美味しんぼ',
  '花より男子',
];

const BookAutocomplete: React.FC<BookAutocompleteProps> = ({
  inputValue,
  onInputChange,
  value,
  onChange,
  error,
  helperText,
  ...rest
}) => {
  const [options, setOptions] = useState<string[]>(famousTitles);
  const [isLoading, setIsLoading] = useState(false);
  const [cancelTokenSource, setCancelTokenSource] = useState(axios.CancelToken.source());

  const fetchMangaTitles = useCallback(async (query: string) => {
    if (cancelTokenSource) {
      cancelTokenSource.cancel('Operation canceled due to new request.');
    }

    const newCancelTokenSource = axios.CancelToken.source();
    setCancelTokenSource(newCancelTokenSource);

    setIsLoading(true);
    try {
      const response = await axios.get(`https://localhost:7103/api/Sells/Title?query=${encodeURIComponent(query)}`, {
        cancelToken: newCancelTokenSource.token,
      });

      setOptions(response.data);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Request canceled', error.message);
      } else {
        console.error('Error fetching manga titles:', error);
        setOptions([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // debounceを適用したfetchMangaTitles
  const debouncedFetchMangaTitles = useCallback(
    debounce((query: string) => {
      if (query.length > 1) {
        fetchMangaTitles(query);
      } else if (query.length === 0) {
        setOptions(famousTitles);
      }
    }, 300),
    [fetchMangaTitles]
  );

  useEffect(() => {
    debouncedFetchMangaTitles(inputValue);
    // コンポーネントのアンマウント時にデバウンス関数をキャンセル
    return () => debouncedFetchMangaTitles.cancel();
  }, [inputValue, debouncedFetchMangaTitles]);

  useEffect(() => {
    if (value && !options.includes(value)) {
      setOptions(prevOptions => Array.from(new Set([...prevOptions, value])));
    }
  }, [value, options]);
  return (
    <Autocomplete
      {...rest}
      options={options}
      popupIcon={false}
      filterOptions={(options, params) => {
        const filtered = options.filter(option => 
          option.toLowerCase().includes(params.inputValue.toLowerCase())
        );
        if (params.inputValue !== '' && !filtered.includes(params.inputValue)) {
          filtered.push(params.inputValue);
        }
        return filtered;
      }}
      getOptionLabel={(option) => option}
      renderOption={(props, option) => (
        <ListItem {...props} key={option}>
          {option}
        </ListItem>
      )}
      noOptionsText="作品タイトルを選択してください"
      renderInput={(params) => (
        <TextField
          {...params}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start" sx={{pl: 1}}>
                {isLoading ? <CircularProgress size={24} /> : <SearchIcon />}
              </InputAdornment>
            ),
            sx: {
              borderRadius: 50,
              '& input[type=search]::-webkit-search-cancel-button': {
                WebkitAppearance: 'none',
                display: 'none',
              },
              '& input[type=search]::-webkit-search-decoration': {
                WebkitAppearance: 'none',
                display: 'none',
              },
            }
          }}
          placeholder='例) ONE PIECE'
          type='search'
          error={error}
          helperText={helperText}
        />
      )}
      value={options.includes(value) ? value : null}
      inputValue={inputValue}
      onInputChange={onInputChange}
      onChange={onChange}
      isOptionEqualToValue={(option, value) => 
        option.toLowerCase() === (typeof value === 'string' ? value.toLowerCase() : '')
      }
    />
  );
};

export default BookAutocomplete;