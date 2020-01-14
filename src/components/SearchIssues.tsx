import React, { useState } from 'react';
import { Issue } from '../types';
import { shell } from 'electron';

const SearchIssues: React.FC<SearchIssuesProps> = ({ issues, setSelectedIssue }) => {
  const [searching, setSearching] = useState<string>('');

  const openExternal = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.stopPropagation();
    e.preventDefault();
    shell.openExternal(e.currentTarget.href);
  };

  return (
    <div id='search-issues'>
      <input value={searching} onChange={(e) => setSearching(e.target.value)} placeholder='Search issues...' />
      {searching.trim() !== '' &&
      <div id='container-results'>
        <div id='results'>
          {issues.filter((filt) => filt.title.toLowerCase().includes(searching.toLowerCase())).map((i) => 
            <div onClick={() => setSelectedIssue(i)} key={i.id}>
              <div>
                <p>{i.title}</p>
                <a onClick={openExternal} href={i.url}>Open on Github <img src={require('../assets/images/external.png')} alt='link'/></a>
              </div>
            </div>
          )}
          {issues.filter((i) => i.title.toLowerCase().includes(searching.toLowerCase())).length === 0 &&
          <p>None</p>}
        </div>
      </div>}
    </div>
  );
};

export default SearchIssues;

interface SearchIssuesProps {
  /** list of issues */
  issues: Issue[]
  /** change list of users */
  setSelectedIssue: Function
}