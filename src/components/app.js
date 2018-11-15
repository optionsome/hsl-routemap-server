import React, { Component } from 'react';

import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from 'react-apollo';

import RouteMap from 'components/routeMap/routeMapContainer';
import renderQueue from 'util/renderQueue';

const client = new ApolloClient({
  link: createHttpLink({ uri: 'http://dev-kartat.hsldev.com/jore/graphql' }),
  cache: new InMemoryCache(),
});

class App extends Component {
  static handleError(error) {
    if (window.callPhantom) {
      window.callPhantom({ error: error.message });
      return;
    }
    console.error(error); // eslint-disable-line no-console
  }

  componentDidMount() {
    if (this.root) {
      renderQueue.onEmpty(error => {
        if (error) {
          App.handleError(error);
          return;
        }
        if (window.callPhantom) {
          window.callPhantom({
            width: this.root.offsetWidth,
            height: this.root.offsetHeight,
          });
        }
      });
    }
  }

  // eslint-disable-next-line class-methods-use-this
  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.log(info);
    App.handleError(error);
  }

  render() {
    let props;

    try {
      const params = new URLSearchParams(window.location.search.substring(1));

      props = JSON.parse(params.get('props'));
    } catch (error) {
      App.handleError(new Error('Failed to parse url fragment'));
      return null;
    }

    if (!props) {
      App.handleError(new Error('Invalid props'));
      return null;
    }

    const rootStyle = {
      display: 'inline-block',
      width: props.mapOptions.width,
      height: props.mapOptions.height,
    };

    return (
      <div
        style={rootStyle}
        ref={ref => {
          this.root = ref;
        }}>
        <ApolloProvider client={client}>
          <RouteMap {...props} />
        </ApolloProvider>
      </div>
    );
  }
}

export default App;
