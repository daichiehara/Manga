import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Box, Typography, Button, Fade, Paper, InputBase, IconButton, SwipeableDrawer, List, ListItem, ListItemText, ListItemSecondaryAction, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CheckIcon from '@mui/icons-material/Check';
import { debounce } from 'lodash';
import axios from 'axios';
import { SnackbarContext } from '../context/SnackbarContext';
import PropTypes from 'prop-types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshList: () => void;
  apiEndpoint: string;
  placeholder: string;
  completeMessage: string;
  noSelectionMessage: string;
  message1: string;
  message2: string;
  message3: string;
  messageColor: string;
}

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

  return titles;
};

const normalizeTitle = (title: string) => {
  return title.toLowerCase();
};

interface TitleCount {
  Title: string;
  Count: number;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onRefreshList, apiEndpoint, placeholder, completeMessage, noSelectionMessage, message1, message2, message3, messageColor }) => {
  const { showSnackbar } = useContext(SnackbarContext);
  const [query, setQuery] = useState('');
  const [options, setOptions] = useState<string[]>([]);
  const [selectedTitles, setSelectedTitles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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
    const apiUrl = `https://ndlsearch.ndl.go.jp/api/sru?operation=searchRetrieve&recordPacking=xml&query=dpid=${dpid}%20AND%20ndc=${encodedNdc}%20AND%20anywhere=${encodeURIComponent(query)}%20AND%20sortBy=issued_date/sort.ascending`;

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

      setOptions(processedTitles.map(titleCount => titleCount.Title));
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

  const debouncedFetch = useCallback(
    debounce(async (query: string) => {
      if (query) {
        await fetchMangaTitles(query);
      } else {
        setOptions([]);
      }
    }, 600),
    []
  );

  useEffect(() => {
    debouncedFetch(query);
  }, [query, debouncedFetch]);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const handleAddTitle = (title: string) => {
    if (!selectedTitles.includes(title)) {
      setSelectedTitles([...selectedTitles, title]);
    }
  };

  const handleRemoveTitle = (title: string) => {
    setSelectedTitles(selectedTitles.filter(t => t !== title));
  };

  const handleSubmit = async () => {
    if (selectedTitles.length === 0) {
      onClose(); // 選択されたタイトルがない場合はDrawerを閉じる
      showSnackbar(noSelectionMessage, 'error');
      return;
    }

    try {
      const response = await axios.post(
        apiEndpoint,
        selectedTitles,  // 直接配列を送信する
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true
        }
      );
      console.log('Titles added:', response.data);
      showSnackbar(completeMessage);
      onRefreshList(); // リストをリフレッシュ
      onClose();
    } catch (error) {
      console.error('Error adding titles:', error);
      showSnackbar('タイトルを追加できませんでした。', 'error');
    }
  };

  const modalContent = (
    <Box sx={{
      maxWidth: '640px',
      width: '100%',
      height: '85vh',
      bgcolor: 'background.paper',
      borderRadius: `20px`,
      overflow: 'auto',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Box sx={{ p: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Button onClick={onClose} sx={{ pt: 1, justifyContent: 'flex-start' }}>
            <CloseIcon />
          </Button>
          <Button onClick={handleSubmit} sx={{ pt: 1, justifyContent: 'flex-end' }}>
            追加
          </Button>
        </Box>
        <Paper component="form" sx={{
          mt: 2,
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          borderRadius: '50px',
          boxShadow: `none`,
          border: '0.8px solid #bfbfbf',
        }} onSubmit={handleSearch}
        >
          {isLoading ?
            <CircularProgress sx={{ p: '10px' }} size={20} /> :
            <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
              <SearchIcon />
            </IconButton>
          }
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </Paper>
        <List>
          {options.map((option) => (
            <ListItem key={option}>
              <ListItemText primary={option} />
              <ListItemSecondaryAction>
                {selectedTitles.includes(option) ? (
                  <IconButton edge="end" aria-label="remove" onClick={() => handleRemoveTitle(option)}>
                    <CheckIcon sx={{ color: '#0F9ED5' }} />
                  </IconButton>
                ) : (
                  <IconButton edge="end" aria-label="add" onClick={() => handleAddTitle(option)}>
                    <AddCircleIcon />
                  </IconButton>
                )}
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
        <Box sx={{ pt: '25vh', px: '2rem', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', }}>
          <Typography variant='h6' sx={{ color: messageColor, fontWeight: 'bold' }}>
            {message1}
          </Typography>
          <Typography variant='subtitle1' sx={{ pt: 1, fontWeight: 'bold' }}>
            {message2}
          </Typography>
          <Typography variant='subtitle1' sx={{ fontWeight: 'bold' }}>
            {message3}
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <SwipeableDrawer
      disableScrollLock
      anchor='bottom'
      open={isOpen}
      onOpen={() => { }}
      onClose={onClose}
      swipeAreaWidth={0}
      disableSwipeToOpen={false}
      ModalProps={{
        keepMounted: true,
      }}
      sx={{
        '& .MuiDrawer-paper': {
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
          width: '100vw',
          maxWidth: '640px',
          mx: 'auto',
        }
      }}
    >
      <Fade in={isOpen}>
        {modalContent}
      </Fade>
    </SwipeableDrawer>
  );
};

SearchModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onRefreshList: PropTypes.func.isRequired,
  apiEndpoint: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  completeMessage: PropTypes.string.isRequired,
  noSelectionMessage: PropTypes.string.isRequired,
  message1: PropTypes.string.isRequired,
  message2: PropTypes.string.isRequired,
  message3: PropTypes.string.isRequired,
  messageColor: PropTypes.string.isRequired,
};

export default SearchModal;
