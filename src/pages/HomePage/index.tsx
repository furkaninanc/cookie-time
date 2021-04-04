import Button from '../../components/Button';
import Input from '../../components/Input';
import logo from '../../logo.svg';
import styles from './HomePage.module.scss';

const HomePage: React.FC = () => (
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
          <Input placeholder="Kullanıcı adı" />
        </div>
        <div className={styles.formElementContainer}>
          <Input placeholder="Oda adı" />
        </div>
        <div className={styles.formElementContainer}>
          <Button>Katıl</Button>
        </div>
      </div>
    </div>
  </div>
);

export default HomePage;
