import { NavLink } from '@/components/Button';
import Link from 'next/link';
import toast from 'react-hot-toast';
import Spacer from '@/components/Layout/Spacer';

import { useCurrentUser } from '@/lib/user';

const LeftSidebar = () => {
  const { data: { user } = {}, mutate } = useCurrentUser();

  return (
    <aside className={`left-sidebar`} data-sidebarbg={`skin6`}>
      {/* Sidebar scroll */}
      <div className={`scroll-sidebar`}>
        {/* Sidebar navigation */}
        <nav className={`sidebar-nav`}>
          <ul id={`sidebarnav`}>
            <Link passHref href="/dashboard">
              <NavLink iconName="mdi-view-dashboard">Home</NavLink>
            </Link>
            {user && user.isAdmin ? (
              <>
                <Link passHref href="/admin/new-submissions">
                  <NavLink iconName="mdi-new-box">New Submissions</NavLink>
                </Link>
                <Link passHref href="/admin/approved-submissions">
                  <NavLink iconName="mdi-checkbox-marked-circle">
                    Approved
                  </NavLink>
                </Link>
                <Link passHref href="/admin/rejected-submissions">
                  <NavLink iconName="mdi-close-circle">Rejected</NavLink>
                </Link>
                <hr />
              </>
            ) : undefined}
            <Link passHref href="/rubrics">
              <NavLink iconName="mdi-magnify">Browse Rubrics</NavLink>
            </Link>
            {user && !user.isAdmin ? (
              <>
                <Link passHref href="/create-rubric">
                  <NavLink iconName="mdi-border-all">Create Rubric</NavLink>
                </Link>
                <Link passHref href="/submit-criteria">
                  <NavLink iconName="mdi-send">Submit Criterion</NavLink>
                </Link>
                <hr/>
                <Link passHref href={`/user/${user.username}/rubrics`}>
                  <NavLink iconName="mdi-file">
                    My Rubrics
                  </NavLink>
                </Link>
                <Link passHref href={`/user/${user.username}/criteria`}>
                  <NavLink iconName="mdi-format-list-bulleted">
                    My Criteria
                  </NavLink>
                </Link>
              </>
            ) : undefined}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default LeftSidebar;
