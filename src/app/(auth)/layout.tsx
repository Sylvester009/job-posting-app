import {ThemeProvider} from '@/styles/components/theme-provider';
import type {Metadata} from 'next';
import '../globals.css';


export const metadata: Metadata = {
  title: 'WorkNest',
  description: 'Created By NineStarx',
};

export default function AuthLayout({
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
          
            {children}
          
        </ThemeProvider>
     
  );
}
