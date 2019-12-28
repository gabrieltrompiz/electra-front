import React from 'react';
import './styles/App.scss';
import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';
import { Provider } from 'react-redux';
import store from './redux/store';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavController from './views/NavController';

/** Apollo Client that will communicate with Apollo Server. Instance is shared across all app through ApolloProvider
 * @type {ApolloClient} @constant
*/
const client: ApolloClient<unknown> = new ApolloClient({
  uri: `${process.env.REACT_APP_SERVER_URL}/graphql`,
  name: 'Electra',
  version: '1.0.0'
});

/** Built-in configuration of toast notifications with react-toastify */
toast.configure({
  bodyClassName: 'toast-body',
  position: 'bottom-left', 
  pauseOnHover: false,
  pauseOnFocusLoss: false
});

/**
 * Root component of the whole app
 * @visibleName App
 * @author Gabriel Trompiz (https://github.com/gabrieltrompiz)
 * @author Luis Petrella (https://github.com/Ptthappy)
*/
const App: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <NavController />
      </Provider>
    </ApolloProvider>
  );
}

export default App;
