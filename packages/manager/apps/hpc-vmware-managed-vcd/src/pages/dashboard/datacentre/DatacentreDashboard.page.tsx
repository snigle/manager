import { useNavigate, useParams, useResolvedPath } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  useVcdOrganization,
  useVcdDatacentre,
  getVcdDatacentreListQueryKey,
} from '@ovh-ux/manager-module-vcd-api';
import { ChangelogButton } from '@ovh-ux/manager-react-components';
import { BreadcrumbItem } from '@/hooks/breadcrumb/useBreadcrumb';
import VcdDashboardLayout, {
  DashboardTab,
} from '@/components/dashboard/layout/VcdDashboardLayout.component';
import { COMPUTE_LABEL, STORAGE_LABEL } from './datacentreDashboard.constants';
import { subRoutes, urls } from '@/routes/routes.constant';
import { useAutoRefetch } from '@/data/hooks/useAutoRefetch';
import { isUpdatingTargetSpec } from '@/utils/refetchConditions';
import { CHANGELOG_LINKS } from '@/utils/changelog.constants';
import { TRACKING_TABS_ACTIONS } from '@/tracking.constants';
import { VIRTUAL_DATACENTERS_LABEL } from '../organization/organizationDashboard.constants';

function DatacentreDashboardPage() {
  const { id, vdcId } = useParams();
  const { t } = useTranslation('dashboard');
  const { data: vcdDatacentre } = useVcdDatacentre(id, vdcId);
  const { data: vcdOrganization } = useVcdOrganization({ id });
  const navigate = useNavigate();
  useAutoRefetch({
    queryKey: getVcdDatacentreListQueryKey(id),
    enabled: isUpdatingTargetSpec(vcdDatacentre?.data),
    interval: 4000,
  });

  const tabsList: DashboardTab[] = [
    {
      name: 'general_information',
      title: t('managed_vcd_dashboard_general_information'),
      to: useResolvedPath('').pathname,
      trackingActions: TRACKING_TABS_ACTIONS.datacentreDashboard,
    },
    {
      name: 'compute',
      title: COMPUTE_LABEL,
      to: useResolvedPath('compute').pathname,
      trackingActions: TRACKING_TABS_ACTIONS.compute,
    },
    {
      name: 'storage',
      title: STORAGE_LABEL,
      to: useResolvedPath('storage').pathname,
      trackingActions: TRACKING_TABS_ACTIONS.storage,
    },
  ];

  const serviceName = vcdDatacentre?.data?.currentState?.description ?? vdcId;
  const hasServiceRenamed = vdcId !== serviceName;

  const header = hasServiceRenamed
    ? {
        description: vdcId,
        title: serviceName,
        changelogButton: <ChangelogButton links={CHANGELOG_LINKS} />,
      }
    : {
        title: vdcId,
        changelogButton: <ChangelogButton links={CHANGELOG_LINKS} />,
      };

  const breadcrumbItems: BreadcrumbItem[] = [
    {
      id,
      label: vcdOrganization?.data?.currentState?.fullName,
    },
    {
      id: subRoutes.virtualDatacenters,
      label: VIRTUAL_DATACENTERS_LABEL,
    },
    {
      id: vdcId,
      label: serviceName,
    },
  ];

  return (
    <VcdDashboardLayout
      tabs={tabsList}
      breadcrumbItems={breadcrumbItems}
      header={header}
      backLinkLabel={t('managed_vcd_dashboard_back_link')}
      onClickReturn={() =>
        navigate(urls.datacentres.replace(subRoutes.dashboard, id))
      }
    />
  );
}

export default DatacentreDashboardPage;
