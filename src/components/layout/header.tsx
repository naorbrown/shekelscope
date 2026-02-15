'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet';

const NAV_LINKS = [
  { key: 'calculator', href: '/' },
  { key: 'dashboard', href: '/dashboard' },
  { key: 'insights', href: '/insights' },
  { key: 'why', href: '/why' },
  { key: 'action', href: '/action' },
] as const;

export function Header() {
  const appT = useTranslations('app');
  const navT = useTranslations('nav');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const localePrefix = locale === 'en' ? '' : `/${locale}`;

  const toggleLocale = () => {
    const newLocale = locale === 'en' ? 'he' : 'en';
    const segments = pathname.split('/');
    if (segments[1] === 'en' || segments[1] === 'he') {
      segments[1] = newLocale;
    } else {
      segments.splice(1, 0, newLocale);
    }
    router.push(segments.join('/') || `/${newLocale}`);
  };

  /** Check if a nav link is the active route */
  const isActive = (href: string) => {
    const fullHref = localePrefix + href;
    if (href === '/') {
      return pathname === '/' || pathname === `/${locale}`;
    }
    return pathname.startsWith(fullHref);
  };

  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href={`${localePrefix}/`} className="flex items-center gap-2">
          <span className="text-xl font-bold text-primary">{appT('name')}</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.key}
              href={`${localePrefix}${link.href}`}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              {navT(link.key)}
            </Link>
          ))}
        </nav>

        {/* Right side: language toggle + mobile hamburger */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleLocale}
            className="rounded-md border border-border px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            {locale === 'en' ? 'עברית' : 'English'}
          </button>

          {/* Mobile hamburger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button
                className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground md:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <nav className="mt-8 flex flex-col gap-2">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.key}
                    href={`${localePrefix}${link.href}`}
                    onClick={() => setMobileOpen(false)}
                    className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      isActive(link.href)
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    }`}
                  >
                    {navT(link.key)}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
