import App, { Container } from 'next/app';
import React from 'react';
import Head from 'next/head';
import withApolloClient from '../lib/with-apollo-client';
import { ApolloProvider } from 'react-apollo';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import JssProvider from 'react-jss/lib/JssProvider';
import getPageContext from '../src/getPageContext';
import indigo from '@material-ui/core/colors/indigo';

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#b9ccd0',
      main: '#004655',
      dark: '#002027',
      contrastText: '#fff',
    },
    secondary: indigo,
    android: {
      colorBackground: '#004655',
      statusBarColor: '#004655',
      navigationBarColor: '#004655',
    },
  },
});

class MyApp extends App {
  constructor() {
    super();
    this.pageContext = getPageContext();
  }

  componentDidMount() {
    //poistaa tokenin kun selain suljetaan
    //window.localStorage.removeItem('jwtToken')
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }

  render() {
    const { Component, pageProps, apolloClient } = this.props;
    return (
      <Container>
        <Head>
          <title>Borrowd - Lainausjärjestelmä</title>
        </Head>

        {/* Wrap every page in Jss and Theme providers */}
        <JssProvider
          registry={this.pageContext.sheetsRegistry}
          generateClassName={this.pageContext.generateClassName}
        >
          {/* MuiThemeProvider makes the theme available down the React
              tree thanks to React context. */}
          <MuiThemeProvider
            theme={theme}
            sheetsManager={this.pageContext.sheetsManager}
          >
            {/* Pass pageContext to the _document though the renderPage enhancer
                to render collected styles on server-side. */}
            <ApolloProvider client={apolloClient}>
              <Component pageContext={this.pageContext} {...pageProps} />
            </ApolloProvider>
          </MuiThemeProvider>
        </JssProvider>
      </Container>
    );
  }
}

export default withApolloClient(MyApp);
