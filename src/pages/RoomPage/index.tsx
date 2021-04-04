import Input from '../../components/Input';
import logo from '../../logo.svg';
import styles from './RoomPage.module.scss';

const RoomPage: React.FC = () => (
  <div className={styles.wrapper}>
    <div className={styles.playerContainer}>Player</div>
    <div className={styles.chatContainer}>
      <div className={styles.brandContainer}>
        <div className={styles.logoContainer}>
          <img alt={"It's cookie o'clock somewhere!"} src={logo} />
        </div>
        <div className={styles.titleContainer}>Cookie Time</div>
      </div>
      <div className={styles.messagesContainer}>
        <div className={styles.messageContainer}>
          <div className={styles.messageOwner}>furkan</div>
          <div className={styles.messageContent}>kumtasi</div>
        </div>
        <div className={styles.messageContainer}>
          <div className={styles.messageOwner}>kurabiye</div>
          <div className={styles.messageContent}>Test mesaji!</div>
        </div>
      </div>
      <div className={styles.newMessageContainer}>
        <Input
          className={styles.newMessage}
          placeholder="Bir mesaj gönder..."
        />
      </div>
    </div>
  </div>
);

export default RoomPage;
