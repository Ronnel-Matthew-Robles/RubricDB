import styles from './Logo.module.css';
import { forwardRef } from 'react';

const Logo = forwardRef(function Logo({ href, className }, ref) {
  return (
    <div className={styles.logo_container}>
      <a className={`navbar-brand`} ref={ref} href={href}>
        <b className={`logo-icon`}>
          <img className={styles.logo_icon} src={'/images/lpulogo.png'} />
        </b>
        <span className={`logo-text`}>
          <span className={styles.logo_text}>LPU LAGUNA</span>
        </span>
      </a>
    </div>
  );
});

export default Logo;
