import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { useApolloClient } from '@apollo/react-hooks';
import { SEARCH } from '../graphql';
import { Profile, Member, State } from 'electra';
import { logError } from '../utils';
import { remove } from 'lodash';

/**
 * Input to search users in the app
 * @visibleName Toolbar
 * @author Gabriel Trompiz (https://github.com/gabrieltrompiz)
 * @author Luis Petrella (https://github.com/Ptthappy)
 */
const SearchUsers: React.FC<SearchUsersProps> = ({ members, setMembers, toFilter, userId, showSelf = false, exclude }) => {
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
    if(timeout.current && !toFilter) {
      clearTimeout(timeout.current);
      timeout.current = null;
    }
    if(toSearch.trim() !== '' && !toFilter) timeout.current = setTimeout(() => search(), 1000);
    if(toSearch.trim() !== '' && toFilter) search();
    // eslint-disable-next-line
  }, [toSearch]);

  useEffect(() => {
    setIds(members.map((m) => m.user.id));
  }, [members]);

  const search = async () => {
    if(!toFilter) {
      setSearching(true);
      const result = await client.query<SearchPayload, SearchVars>({ variables: { search: toSearch }, query: SEARCH, errorPolicy: 'all' })
      .finally(() => setSearching(false));
      if(result.data && result.data.users) {
        if(exclude) {
          setResult(result.data.users.filter((u) => !exclude.includes(u.id)))
        } else {
          setResult(result.data.users);
        }
      }
      if(result.errors) result.errors.forEach((e) => logError(e.message));
    } else {
      const result = toFilter.filter((m) => (
        (m.user.email.toLowerCase().includes(toSearch.toLowerCase()) ||
         m.user.fullName.toLowerCase().includes(toSearch.toLowerCase()) ||
         m.user.username.toLowerCase().includes(toSearch.toLowerCase())) 
         && (!showSelf ? m.user.id !== userId : true)
      ));
      setResult(result.map((r) => r.user));
      setSearching(false);
      setShowResults(true);
    }
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
          }}>
            <img src={user.pictureUrl} alt='avatar' />
            <div>
              <p>{user.fullName}</p>
              <p>{`@${user.username}`}</p>
            </div>
            {ids.includes(user.id) ? 
              <img src={require('../assets/images/close-dark.png')} alt='delete' style={{ width: '15px', height: '15px', marginRight: '22.5px' }} /> : 
              <img src={require('../assets/images/plus.png')} alt='add' />}
          </div>
        )}
        {!searching && result.length === 0 && <div>No results</div>}
      </div>}
    </div>
  );
};

const mapStateToProps = (state: State) => {
  const { userReducer } = state;
  return {
    userId: userReducer.user.id
  };
};

export default connect(mapStateToProps)(SearchUsers);

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
  /** Wether the users should be filtered from a list or be fetched from the server */
  toFilter?: Array<Member>
  /** logged user id */
  userId: number
  /** Wether to show self user or not */
  showSelf?: boolean
  /** Users to be excluded from search */
  exclude?: number[]
}