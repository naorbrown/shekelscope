import { loadTaxData, loadContentData } from '@/modules/data/loader';
import { TAX_YEAR } from '@/lib/constants';
import { AppShell } from '@/components/app-shell';

export default function Home() {
  const taxData = loadTaxData(TAX_YEAR);
  const contentData = loadContentData(TAX_YEAR);

  return (
    <main className="min-h-screen pb-16">
      <AppShell taxData={taxData} contentData={contentData} />
    </main>
  );
}
