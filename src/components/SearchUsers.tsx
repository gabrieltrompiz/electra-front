import React, { useState, useEffect, useRef } from 'react';
import { useApolloClient } from '@apollo/react-hooks';
import { SEARCH } from '../graphql';
import { Profile } from '../types';
import { logError } from '../utils';

/**
 * Input to search users in the app
 * @visibleName Toolbar
 * @author Gabriel Trompiz (https://github.com/gabrieltrompiz)
 * @author Luis Petrella (https://github.com/Ptthappy)
 */
const SearchUsers: React.FC = () => {
  const [toSearch, setToSearch] = useState<string>('');
  const [result, setResult] = useState<Array<Profile>>([]);
  const [searching, setSearching] = useState<boolean>(false);

  const timeout = useRef(null);

  const client = useApolloClient();

  useEffect(() => {
    if(toSearch.trim() !== '') setSearching(true);
    if(timeout.current) {
      clearTimeout(timeout.current);
      timeout.current = null;
    }
    if(toSearch.trim() !== '') timeout.current = setTimeout(() => search(), 1000);
    // eslint-disable-next-line
  }, [toSearch]);

  const search = async () => {
    setSearching(true);
    const result = await client.query<SearchPayload, SearchVars>({ variables: { search: toSearch }, query: SEARCH, errorPolicy: 'all' })
    .finally(() => setSearching(false));
    if(result.data && result.data.users) {
      setResult(result.data.users);
    }
    if(result.errors) result.errors.forEach((e) => logError(e.message));
  };

  return (
    <div id='seach-users'>
      <input value={toSearch} onChange={(e) => setToSearch(e.target.value)} />
      <img src={require('../assets/images/search.png')} alt='search' />
      {toSearch.trim() !== '' && 
      <div>
        {searching && <p>Searching...</p>}
        {!searching && result.length > 0 && 
        <div id='user-card'>

        </div>}
        {!searching && result.length === 0 && <div>No results</div>}
      </div>}
    </div>
  );
};

export default SearchUsers;

interface SearchPayload {
  /** Result from the query */
  users: Array<Profile>
}

interface SearchVars {
  /** Value that will be used to search */
  search: string
}