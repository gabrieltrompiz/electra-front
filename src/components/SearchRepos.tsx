import React, { useState, useEffect, Fragment } from 'react';
import { Repository } from 'electra';
import { useApolloClient } from '@apollo/react-hooks';
import { GET_USER_REPOS } from '../graphql';
import { logError } from '../utils';
import { shell } from 'electron';

const SearchRepos: React.FC<SearchReposProps> = ({ selectedRepo, setSelectedRepo }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [repos, setRepos] = useState<(Repository & { owner: { login: string } })[]>([]);
  const [searching, setSearching] = useState<string>('');
  const [results, setResults] = useState<(Repository & { owner: { login: string } })[]>([]);

  const client = useApolloClient();

  useEffect(() => {
    getRepos();
  // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if(searching.trim() !== '') { 
      setResults(repos.filter((r) => r.name.toLowerCase().includes(searching.toLowerCase().trim())));
    } else {
      setResults([]);
    }
  // eslint-disable-next-line
  }, [searching]);

  const getRepos = async () => {
    setLoading(true);
    const result = await client.query<SearchPayload>({ query: GET_USER_REPOS, errorPolicy: 'all', fetchPolicy: 'no-cache' })
      .finally(() => setLoading(false));
    if(result.data && result.data.viewer && result.data.viewer.repositories) {
      setRepos(result.data.viewer.repositories.nodes);
    }
    if(result.errors) result.errors.map((e) => logError(e.message));
  };

  const openExternal = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.stopPropagation();
    e.preventDefault();
    shell.openExternal(e.currentTarget.href);
  };

  return (
    <div id='search-repos'>
      {loading && <p>Loading repositories...</p>}
      {!loading && repos.length === 0 && <p>You don't have any public repositories.</p>}
      {!loading && repos.length && !selectedRepo &&
      <Fragment>
        <input value={searching} onChange={(e) => setSearching(e.target.value)} placeholder='Search your repositories...' />
        {results.length > 0 && 
        <div id='container-results'>
          <div id='results'>
            {results.map((r) =>
              <div onClick={() => setSelectedRepo(r)} key={r.id}>
                <img src={require('../assets/images/branch.png')} alt='gh' />
                <div>
                  <p>{`${r.owner.login}/${r.name}`}</p>
                  <a onClick={openExternal} href={r.url}>Open on Github <img src={require('../assets/images/external.png')} alt='link'/></a>
                </div>
              </div>
            )}
          </div>
        </div>}
      </Fragment>}
      {!loading && selectedRepo &&
      <div id='selected-repo'>
        {`${selectedRepo.owner.login}/${selectedRepo.name}`}
        <img src={require('../assets/images/close-dark.png')} alt='delete' onClick={() => { setSelectedRepo(null); setSearching(''); }}/>
      </div>}
    </div>
  );
};

export default SearchRepos;

interface SearchReposProps {
  /** Selected repo */
  selectedRepo: Repository & { owner: { login: string } }
  /** Method to change selected repo */
  setSelectedRepo: Function
}

interface SearchPayload {
  /** user container */
  viewer: {
    /** list of repositories */
    repositories: {
      /** nodes of repositories */
      nodes: (Repository & { owner: { login: string } })[]
    }
  }
}

