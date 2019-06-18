import App from '../components/App';
import LoginTab from '../components/Login';

export default class Index extends React.Component {
  componentDidMount = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .catch(err => console.error('Service worker registration failed', err));
    } else {
      console.log('Service worker not supported');
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
