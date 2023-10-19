import { Text, TextLink } from '@/components/Text';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import Spacer from '@/components/Layout//Spacer';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
        <Text color="accents-7">
          Copyright {' '}
          <TextLink href="https://hoangvvo.com/" color="link">
            LPU-Laguna
          </TextLink>
          .
        </Text>
        <Spacer size={1} axis="vertical" />
        <ThemeSwitcher />
    </footer>
  );
};

export default Footer;
