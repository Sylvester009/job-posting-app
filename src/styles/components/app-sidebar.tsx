'use client';

import * as React from 'react';
import {
  IconChartBar,
  IconDashboard,
  IconInnerShadowTop,
  IconListDetails,
  IconSearch,
  IconUsers,
  IconBriefcase,
  IconBookmark,
  IconMessage,
  IconUserPlus,
  IconFileText,
  IconBell,
} from '@tabler/icons-react';

import {NavMain} from '@/styles/components/nav-main';
import {NavSecondary} from '@/styles/components/nav-secondary';
import {NavUser} from '@/styles/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/styles/components/ui/sidebar';
import {usePathname} from 'next/navigation';

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: {
    seeker: [
      {
        title: 'Dashboard',
        url: '/dashboard',
        icon: IconDashboard,
      },
      {
        title: 'Job Search',
        url: '/jobs',
        icon: IconSearch,
      },
      {
        title: 'Applications',
        url: '/applications',
        icon: IconBriefcase,
      },
      {
        title: 'Saved Jobs',
        url: '/saved-jobs',
        icon: IconBookmark,
      },
      {
        title: 'Messages',
        url: '/messages',
        icon: IconMessage,
      },
      {
        title: 'Profile',
        url: '/profile',
        icon: IconFileText,
      },
    ],

    recruiter: [
      {
        title: 'Dashboard',
        url: '/recruiter/dashboard',
        icon: IconDashboard,
      },
      {
        title: 'Job Postings',
        url: '/recruiter/job-postings',
        icon: IconListDetails,
      },
      {
        title: 'Applications',
        url: '/recruiter/applications',
        icon: IconBriefcase,
      },
      {
        title: 'Candidates',
        url: '/recruiter/candidates',
        icon: IconUsers,
      },

      {
        title: 'Team',
        url: '/recruiter/team',
        icon: IconUserPlus,
      },
      {
        title: 'Analytics',
        url: '/recruiter/analytics',
        icon: IconChartBar,
      },
    ],
  },
  navSecondary: {
    seeker: [
      {
        title: 'Notifications',
        url: '/notifications',
        icon: IconBell,
      },
      {
        title: 'Search',
        url: '#',
        icon: IconSearch,
      },
    ],
    recruiter: [
      {
        title: 'Messages',
        url: '/recruiter/messages',
        icon: IconMessage,
      },
      {
        title: 'Search',
        url: '#',
        icon: IconSearch,
      },
    ],
  },
};

export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  const userRole = pathname.includes('recruiter') ? 'recruiter' : '';

  const navMains = userRole ? data?.navMain?.recruiter : data?.navMain?.seeker;
  const navSecondaries = userRole
    ? data?.navSecondary?.recruiter
    : data?.navSecondary?.seeker;

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">WorkNest.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMains} />
        <NavSecondary items={navSecondaries} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
