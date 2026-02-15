import { redirect } from 'next/navigation';

export default async function ActionPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect(`/${locale}#action`);
}
