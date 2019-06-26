import App from '../components/App';
import LoginTab from '../components/Login';
import { NODE_ENV } from '../lib/environment';

export default class Index extends React.Component {
  componentDidMount = () => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function() {
        navigator.serviceWorker
          .register('/sw.js')
          .then(function(registration) {})
          .catch(function(error) {});
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
