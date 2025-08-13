import { ComponentTest } from '@/pages/ComponentTest';
import { DashboardPage } from '@/shared/components/PageLayout';

export function ComponentTestPage() {
  return (
    <DashboardPage
      title="Component Test"
      description="Test and showcase UI components"
    >
      <ComponentTest />
    </DashboardPage>
  );
}
