import Link from 'next/link';
import { withRouter } from 'next/router';

const Header = ({ router: { pathname } }) => (
  <header>
    <Link prefetch href="/">
      <a className={pathname === '/' ? 'is-active' : ''}>Home</a>
    </Link>
    <Link prefetch href="/equipments">
      <a className={pathname === '/equipments' ? 'is-active' : ''}>
        Equipments
      </a>
    </Link>
    <Link prefetch href="/category">
      <a className={pathname === '/category' ? 'is-active' : ''}>Category</a>
    </Link>
    <Link prefetch href="/loans">
      <a className={pathname === '/loans' ? 'is-active' : ''}>Loans</a>
    </Link>
    <Link prefetch href="/users">
      <a className={pathname === '/users' ? 'is-active' : ''}>Users</a>
    </Link>
    <Link prefetch href="/login">
      <a className={pathname === '/login' ? 'is-active' : ''}>Login</a>
    </Link>
    <style jsx>{`
      header {
        margin-bottom: 25px;
      }
      a {
        font-size: 14px;
        margin-right: 15px;
        text-decoration: none;
      }
      .is-active {
        text-decoration: underline;
      }
    `}</style>
  </header>
);

export default withRouter(Header);
