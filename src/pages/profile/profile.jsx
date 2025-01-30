import { useLocation, Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../services/auth/actions.js';
import { resetError } from '../../services/auth/slice.js';
import Link from '../../components/link/link.jsx';
import Modal from '../../components/modal/modal.jsx';
import { LoadingScreen, ErrorScreen } from '../../components/screens/';
import styles from './profile.module.css';

const links = [
  {
    to: '/profile',
    text: 'Профиль',
    description: 'В этом разделе вы можете изменить свои персональные данные',
  },
  {
    to: '/profile/orders',
    text: 'История заказов',
    description: 'В этом разделе вы можете посмотреть свою историю заказов',
  },
];

export default function ProfilePage() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { request, error } = useSelector(state => state.auth);
  const { description } = links.find(n => n.to === location.pathname) ?? {};
  const onLogout = e => {
    e.preventDefault();
    dispatch(logout());
  };
  const onCloseModal = () => dispatch(resetError());

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <nav className={styles.nav}>
          {links.map(n => (
            <div key={n.to} className={styles.link}>
              <Link to={n.to}>{n.text}</Link>
            </div>
          ))}
          <div className={styles.link}>
            <Link to="" onClick={onLogout}>Выход</Link>
          </div>
        </nav>
        <div className={styles.description}>{description}</div>
      </div>
      <div className={styles.content}>
        <Outlet />
      </div>
      {request && <LoadingScreen />}
      {error && (
        <Modal onClose={onCloseModal}>
          <ErrorScreen transparent>
            <span>Ошибка при выходе</span>
            <span>{error}</span>
          </ErrorScreen>
        </Modal>
      )}
    </div>
  );
}
