import { Container } from '@/components/layout';
import { Sidebar } from '@/app/user/_components';
import { SettingsForm } from '@/app/user/settings/_components';

export default function SettingsPage() {
  return (
    <Container className='max-1600:py-28 max-1360:pt-25 max-990:pb-24 max-640:pb-20 relative min-h-[calc(100dvh-400px)] py-40'>
      <div className='max-1120:flex-col max-1360:gap-8 max-1120:gap-8 max-990:gap-6 relative z-3 mx-auto flex max-w-410 items-start justify-between gap-10 px-5'>
        <Sidebar />
        <div className='w-full grow'>
          <SettingsForm />
        </div>
      </div>
    </Container>
  );
}
