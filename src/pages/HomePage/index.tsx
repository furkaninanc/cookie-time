import { useHistory } from 'react-router-dom';

import Button from '../../components/Button';
import Input from '../../components/Input';
import { useAuthContext } from '../../contexts/AuthContext';
import logo from '../../logo.svg';
import styles from './HomePage.module.scss';

const HomePage: React.FC = () => {
  const history = useHistory();
  const { auth, setAuth } = useAuthContext();

  const joinRoom = () => history.push(`/${auth.room}`);
  const onKeyDown = (event: any) => {
    if (event.keyCode === 13) {
      joinRoom();
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.brandContainer}>
          <div className={styles.logoContainer}>
            <img alt={"It's cookie o'clock somewhere!"} src={logo} />
          </div>
          <div className={styles.titleContainer}>Cookie Time</div>
        </div>
        <div className={styles.formContainer}>
          <div className={styles.formElementContainer}>
            <Input
              onChange={(event) => {
                setAuth({ ...auth, username: event.target.value });
                localStorage.setItem('username', event.target.value);
              }}
              onKeyDown={onKeyDown}
              placeholder="Kullanıcı adı"
              value={auth.username}
            />
          </div>
          <div className={styles.formElementContainer}>
            <Input
              onChange={(event) => {
                setAuth({ ...auth, room: event.target.value });
                localStorage.setItem('room', event.target.value);
              }}
              onKeyDown={onKeyDown}
              placeholder="Oda adı"
              value={auth.room}
            />
          </div>
          <div className={styles.formElementContainer}>
            <Button onClick={() => joinRoom()}>Katıl</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
