import Image from "next/image";
import Link from "next/link";
import { FaUser, FaBell, FaFacebookMessenger } from "react-icons/fa";
import styles from "./Navbar.module.css"; // Import CSS module
// import styles from "./Navbar.module.css";

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      {/* Left Side - Logo and Brand Name */}
      <div className={styles.navbarLeft}>
        <Image src="/logo.png" alt="Travelwish Logo" width={50} height={50}  priority unoptimized />
        <span className={styles.brandName}>Travelwish</span>
      </div>

      {/* Center - Navigation Links */}
      <div className={styles.navbarCenter}>
        <Link href="#" className={styles.navLink}>Become a <br></br> service Provider </Link>
        <Link href="#" className={styles.navLink}>Categories</Link>
        <Link href="#" className={styles.navLink}>About</Link>
      </div>

      {/* Right Side - Icons and Login/Signup */}
      <div className={styles.navbarRight}>
        <FaUser className={styles.icon} />
        <span className={styles.navLink}>Log in</span>
        <span className={styles.separator}>|</span>
        <span className={styles.navLink}>Sign up</span>
        <FaBell className={styles.icon} />

      </div>
    </nav>
  );
};

export default Navbar;
