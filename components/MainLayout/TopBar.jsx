import { Avatar } from '@/components/Avatar';
import { Button, ButtonLink } from '@/components/Button';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { Logo } from '@/components/Logo';
import Link from 'next/link';
import toast from 'react-hot-toast';
import Spacer from '@/components/Layout/Spacer';
import SearchBar from './Search';
import Container from '@/components/Layout/Container';
import { fetcher } from '@/lib/fetch';
import { useCurrentUser } from '@/lib/user';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';
import styles from '@/components/Layout/Nav.module.css';

const UserMenu = ({ user, mutate }) => {
  const menuRef = useRef();
  const avatarRef = useRef();

  const [visible, setVisible] = useState(false);

  const router = useRouter();
  useEffect(() => {
    const onRouteChangeComplete = () => setVisible(false);
    router.events.on('routeChangeComplete', onRouteChangeComplete);
    return () =>
      router.events.off('routeChangeComplete', onRouteChangeComplete);
  });

  useEffect(() => {
    // detect outside click to close menu
    const onMouseDown = (event) => {
      if (
        !menuRef.current.contains(event.target) &&
        !avatarRef.current.contains(event.target)
      ) {
        setVisible(false);
      }
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => {
      document.removeEventListener('mousedown', onMouseDown);
    };
  }, []);

  const onSignOut = useCallback(async () => {
    try {
      await fetcher('/api/auth', {
        method: 'DELETE',
      });
      toast.success('You have been signed out');
      mutate({ user: null });
    } catch (e) {
      toast.error(e.message);
    }
  }, [mutate]);

  return (
    <div className={styles.user}>
      <button
        className={styles.trigger}
        ref={avatarRef}
        onClick={() => setVisible(!visible)}
      >
        <Avatar size={32} username={user.username} url={user.profilePicture} />
      </button>
      <div
        ref={menuRef}
        role="menu"
        aria-hidden={visible}
        className={styles.popover}
      >
        {visible && (
          <div className={styles.menu}>
            <Link passHref href={`/dashboard`}>
              <a className={styles.item}>Dashboard</a>
            </Link>
            <Link passHref href={`/user/${user.username}`}>
              <a className={styles.item}>Profile</a>
            </Link>
            <Link passHref href="/settings">
              <a className={styles.item}>Settings</a>
            </Link>
            <div className={styles.item} style={{ cursor: 'auto' }}>
              <Container alignItems="center">
                <span>Theme</span>
                <Spacer size={0.5} axis="horizontal" />
                <ThemeSwitcher />
              </Container>
            </div>
            <button onClick={onSignOut} className={styles.item}>
              Sign out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const TopBar = () => {
  const { data: { user } = {}, mutate } = useCurrentUser();

  return (
    <header className={`topbar`} data-navbarbg="skin6">
      <nav className={`navbar top-navbar navbar-expand-md`}>
        <div className={`navbar-header`} data-logobg={`skin6`}>
          <Link href="/dashboard" passHref>
            <Logo></Logo>
          </Link>
          <a
            className={`nav-toggler waves-effect waves-light d-block d-md-none`}
            href={undefined}
          >
            <i className={`mdi mdi-menu`}></i>
          </a>
        </div>
        <div
          className={`navbar-collapse collapse`}
          id={`navbarSupportedContent`}
          data-navbarbg={`skin5`}
        >
          {/* Search */}
          <ul className={`navbar-nav float-start me-auto`}>
            <SearchBar />
          </ul>
          <ul className={`navbar-nav float-end`}>
            <Container>
              {user ? (
                <>
                  <UserMenu user={user} mutate={mutate} />
                  <Spacer axis="horizontal" size={0.5} />
                </>
              ) : (
                <>
                  <Link passHref href="/login">
                    <ButtonLink
                      size="small"
                      type="success"
                      variant="ghost"
                      color="link"
                    >
                      Log in
                    </ButtonLink>
                  </Link>
                  <Spacer axis="horizontal" size={0.25} />
                  <Link passHref href="/sign-up">
                    <Button size="small" type="success">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </Container>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default TopBar;
