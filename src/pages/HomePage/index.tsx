import { useHistory } from 'react-router-dom';

import Button from '../../components/Button';
import Input from '../../components/Input';
import { useAuthContext } from '../../contexts/AuthContext';
import logo from '../../logo.svg';
import styles from './HomePage.module.scss';

const HomePage: React.FC = () => {
  const { auth, setAuth } = useAuthContext();
  const history = useHistory();

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
              placeholder="Oda adı"
              value={auth.room}
            />
          </div>
          <div className={styles.formElementContainer}>
            <Button onClick={() => history.push(`/${auth.room}`)}>Katıl</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
