'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet';

const NAV_LINKS = [
  { key: 'calculator', href: '' },
  { key: 'results', href: '/results' },
  { key: 'learn', href: '/learn' },
] as const;

export function Header() {
  const appT = useTranslations('app');
  const navT = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    const fullPath = `/${locale}${href}`;
    if (href === '') {
      // Home page: exact match only
      return pathname === `/${locale}` || pathname === `/${locale}/`;
    }
    return pathname.startsWith(fullPath);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-lg font-bold">₪</span>
          <span className="text-xl font-bold text-primary">{appT('name')}</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.key}
              href={`/${locale}${link.href}`}
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

        {/* Right side: mobile hamburger */}
        <div className="flex items-center gap-2">
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
                    href={`/${locale}${link.href}`}
                    onClick={() => setMobileOpen(false)}
                    className={`rounded-md px-3 py-2 text-sm font-medium text-start transition-colors ${
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
