import App from '../components/App';
import LoginTab from '../components/Login';

export default class Index extends React.Component {
  componentDidMount = () => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function() {
        navigator.serviceWorker
          .register('/sw.js')
          .then(function(registration) {
            console.log(
              'Service worker successfully registered on scope',
              registration.scope
            );
          })
          .catch(function(error) {
            console.log('Service worker failed to register');
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
