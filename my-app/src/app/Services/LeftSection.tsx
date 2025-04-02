import styles from "./LeftSection.module.css";

const LeftSection = () => {
  return (
    <div className={styles.left}>
      <div className={styles.profile}>
        <img src="/propic.png" alt="Profile" className={styles.profilePic} />
        <span className={styles.username}>User Name</span>
      </div>
      <hr className={styles.divider} />
      <ul className={styles.menu}>
        <li>My profile</li>
        <li>Notification</li>
        <li>Massage</li>
        <li>Feedback</li>
        <li>Help</li>
        <li>Orders</li>
        <li>Booking</li>
        <li>Payments</li>
        <li>Setting</li>
        <li>Updates</li>
        <li>Other service</li>
        <li className={styles.logout}>Log out</li>
      </ul>
    </div>
  );
};

export default LeftSection;
