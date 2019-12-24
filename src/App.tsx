import React from 'react';
import './styles/App.scss';
import Authentication from './views/Authentication';
import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';
import { Provider } from 'react-redux';
import store from './redux/store';

/** Apollo Client that will communicate with Apollo Server. Instance is shared across all app through ApolloProvider
 * @type {ApolloClient} @constant
*/
const client: ApolloClient<unknown> = new ApolloClient({
  uri: 'http://localhost:5000/graphql',
  name: 'Electra',
  version: '1.0.0'
});

const App: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <div id='container'>
          <Authentication />
        </div>
      </Provider>
    </ApolloProvider>
  );
}

export default App;
