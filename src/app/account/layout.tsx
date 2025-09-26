import { ThemeProvider } from '@/styles/components/theme-provider';
import { AccountHeader } from '@/styles/components/account-header';

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="min-h-screen bg-background">
        <AccountHeader />
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </div>
    </ThemeProvider>
  );
}