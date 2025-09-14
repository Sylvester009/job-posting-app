import {ThemeProvider} from '@/styles/components/theme-provider';
import type {Metadata} from 'next';
import {AppSidebar} from '@/styles/components/app-sidebar';
import {SidebarProvider} from '@/styles/components/ui/sidebar';
import '../globals.css';

export const metadata: Metadata = {
  title: 'WorkNest',
  description: 'Created By NineStarx',
};

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider
            style={
              {
                '--sidebar-width': 'calc(var(--spacing) * 72)',
                '--header-height': 'calc(var(--spacing) * 12)',
              } as React.CSSProperties
            }
          >
            <AppSidebar variant="inset" />
            {children}
          </SidebarProvider>
        </ThemeProvider>
     
  );
}
