import App from '../components/App';
import LoginTab from '../components/Login';
import { NODE_ENV } from '../lib/environment';

export default class Index extends React.Component {
  componentDidMount = () => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function() {
        navigator.serviceWorker
          .register('/sw.js')
          .then(function(registration) {
            if (NODE_ENV !== 'production') {
              console.log(
                'Service worker successfully registered on scope',
                registration.scope
              );
            }
          })
          .catch(function(error) {
            if (NODE_ENV !== 'production') {
              console.log('Service worker failed to register');
            }
          });
      });
    }
  };

  render() {
    return (
      <App>
        <LoginTab />
      </App>
    );
  }
}
