import { ButtonLink } from '@/components/Button';
import { Container, Spacer, Wrapper } from '@/components/Layout';
import Link from 'next/link';
import styles from './Hero.module.css';

const Hero = () => {
  return (
    <Wrapper>
      <div>
        <h1 className={styles.title}>
          <span className={styles.nextjs}>Simplify</span>
          <span className={styles.mongodb}>Evaluating</span>
          <span>Tasks</span>
        </h1>
        <Container justifyContent="center" className={styles.buttons}>
          <Container>
            <Link passHref href="/dashboard">
              <ButtonLink className={styles.button}>Go to app</ButtonLink>
            </Link>
          </Container>
          <Spacer axis="horizontal" size={1} />
          <Container>
            <ButtonLink
              href="https://github.com/Ronnel-Matthew-Robles"
              type="secondary"
              className={styles.button}
            >
              GitHub
            </ButtonLink>
          </Container>
        </Container>
        <p className={styles.subtitle}>
          A way for teachers to organize and easily retrieve approved rubrics to be used in class.
        </p>
      </div>
    </Wrapper>
  );
};

export default Hero;
