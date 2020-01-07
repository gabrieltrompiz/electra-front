import React, { useState, useEffect, useRef } from 'react';
import { useApolloClient } from '@apollo/react-hooks';
import { SEARCH } from '../graphql';
import { Profile, Member } from '../types';
import { logError } from '../utils';
import { remove } from 'lodash';

/**
 * Input to search users in the app
 * @visibleName Toolbar
 * @author Gabriel Trompiz (https://github.com/gabrieltrompiz)
 * @author Luis Petrella (https://github.com/Ptthappy)
 */
const SearchUsers: React.FC<SearchUsersProps> = ({ members, setMembers }) => {
  const [toSearch, setToSearch] = useState<string>('');
  const [result, setResult] = useState<Array<Profile>>([]);
  const [searching, setSearching] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [ids, setIds] = useState<Array<number>>([]);

  const resultRef = useRef<HTMLDivElement>(null);

  const timeout = useRef(null);

  const client = useApolloClient();

  useEffect(() => {
    if(toSearch.trim() === '' && resultRef.current) {
      resultRef.current.classList.toggle('opacityIn');
      resultRef.current.classList.toggle('opacityOut');
      setTimeout(() => {
        setShowResults(false);
      }, 300);
    }
    if(toSearch.trim() !== '') {
      setSearching(true);
      setShowResults(true);
    }
    if(timeout.current) {
      clearTimeout(timeout.current);
      timeout.current = null;
    }
    if(toSearch.trim() !== '') timeout.current = setTimeout(() => search(), 1000);
    // eslint-disable-next-line
  }, [toSearch]);

  useEffect(() => {
    setIds(members.map((m) => m.user.id));
  }, [members]);

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
      {showResults && 
      <div className='opacityIn' ref={resultRef}>
        {searching && <p>Searching...</p>}
        {!searching && result.length > 0 && 
        result.map((user) => 
          <div id='user-card' key={user.id} onClick={() => {
            setMembers(ids.includes(user.id) ? remove(members, (m) => m.user.id !== user.id) : [...members, { user, role: 'MEMBER' }]);
            setToSearch('');
          }} >
            <img src={user.pictureUrl} alt='avatar' />
            <div>
              <p>{user.fullName}</p>
              <p>{`@${user.username}`}</p>
            </div>
            {ids.includes(user.id) ? 
              <img src={require('../assets/images/close-dark.png')} alt='delete' /> : <img src={require('../assets/images/plus.png')} alt='add' />}
          </div>
        )}
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

interface SearchUsersProps {
  /** Users that have been added to the list of members */
  members: Array<Member>
  /** Method to modify members */
  setMembers: Function
}