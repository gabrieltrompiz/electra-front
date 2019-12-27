import React from 'react';
import './styles/App.scss';
import Authentication from './views/Authentication';
import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';
import { Provider } from 'react-redux';
import store from './redux/store';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/** Apollo Client that will communicate with Apollo Server. Instance is shared across all app through ApolloProvider
 * @type {ApolloClient} @constant
*/

const client: ApolloClient<unknown> = new ApolloClient({
  uri: `${process.env.REACT_APP_SERVER_URL}/graphql`,
  name: 'Electra',
  version: '1.0.0'
});

toast.configure({
  bodyClassName: 'toast-body',
  position: 'bottom-left', 
  pauseOnHover: false
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
