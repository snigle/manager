import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
  useOutletContext,
  useParams,
} from 'react-router-dom';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import {
  BaseLayout,
  ErrorBanner,
  Notifications,
} from '@ovh-ux/manager-react-components';
import { queryClient } from '@ovh-ux/manager-react-core-application';
import { OdsTabs, OdsTab } from '@ovhcloud/ods-components/react';
import {
  getOkmsCredentialQueryKey,
  useOkmsCredentialById,
} from '@/data/hooks/useOkmsCredential';
import Loading from '@/components/Loading/Loading';
import { ROUTES_URLS } from '@/routes/routes.constants';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import KmsGuidesHeader from '@/components/Guide/KmsGuidesHeader';
import { BreadcrumbItem } from '@/hooks/breadcrumb/useBreadcrumb';
import { useOkmsById } from '@/data/hooks/useOkms';
import { OKMS } from '@/types/okms.type';
import { OkmsCredential } from '@/types/okmsCredential.type';

export type CredentialContextType = {
  okms: OKMS;
  credential: OkmsCredential;
};

export function useOutletCredential() {
  return useOutletContext<CredentialContextType>();
}

const CredentialDashboard = () => {
  const { trackClick } = useOvhTracking();
  const navigate = useNavigate();
  const { t } = useTranslation('key-management-service/credential');
  const location = useLocation();
  const { okmsId, credentialId } = useParams();

  const { data: okms, isLoading: isLoadingKms, error: errorKms } = useOkmsById(
    okmsId,
  );

  const {
    data,
    isLoading: isLoadingCredential,
    error: errorCredential,
  } = useOkmsCredentialById({
    okmsId,
    credentialId,
  });

  if (isLoadingCredential || isLoadingKms) return <Loading />;

  if (errorCredential || errorKms) {
    return (
      <ErrorBanner
        error={errorKms?.response || errorCredential?.response}
        onRedirectHome={() => navigate(ROUTES_URLS.listing)}
        onReloadPage={() =>
          queryClient.refetchQueries({
            queryKey: getOkmsCredentialQueryKey({ okmsId, credentialId }),
          })
        }
      />
    );
  }

  const credential = data.data;

  const breadcrumbItems: BreadcrumbItem[] = [
    {
      id: okmsId,
      label: okms.data.iam.displayName,
      navigateTo: `/${okmsId}`,
    },
    {
      id: ROUTES_URLS.credentials,
      label: t('key_management_service_credential'),
      navigateTo: `/${okmsId}/${ROUTES_URLS.credentials}`,
    },
    {
      id: credentialId,
      label: credential.name,
      navigateTo: `/${okmsId}/${ROUTES_URLS.credentials}/${credentialId}`,
    },
    {
      id: ROUTES_URLS.credentialIdentities,
      label: t('key_management_service_credential_identities'),
      navigateTo: `/${okmsId}/${ROUTES_URLS.credentials}/${credentialId}/${ROUTES_URLS.credentialIdentities}`,
    },
  ];

  return (
    <Suspense fallback={<Loading />}>
      <BaseLayout
        breadcrumb={<Breadcrumb items={breadcrumbItems} />}
        header={{
          title: credential.name || credential.id,
          headerButton: <KmsGuidesHeader />,
        }}
        backLinkLabel={t(
          'key_management_service_credential_dashboard_backlink',
        )}
        message={<Notifications />}
        onClickReturn={() => {
          navigate(`/${okmsId}/${ROUTES_URLS.credentials}`);
          trackClick({
            location: PageLocation.page,
            buttonType: ButtonType.link,
            actionType: 'navigation',
            actions: ['return_listing_page'],
          });
        }}
        tabs={
          <OdsTabs>
            <OdsTab
              isSelected={
                location.pathname ===
                `/${okmsId}/${ROUTES_URLS.credentials}/${credentialId}`
              }
            >
              <NavLink
                to={`/${okmsId}/${ROUTES_URLS.credentials}/${credentialId}`}
                className="flex no-underline"
                onClick={() => {
                  trackClick({
                    location: PageLocation.page,
                    buttonType: ButtonType.tab,
                    actionType: 'navigation',
                    actions: ['general-informations'],
                  });
                }}
              >
                {t(
                  'key_management_service_credential_dashboard_tab_informations',
                )}
              </NavLink>
            </OdsTab>
            <OdsTab
              isSelected={
                location.pathname ===
                `/${okmsId}/${ROUTES_URLS.credentials}/${credentialId}/${ROUTES_URLS.credentialIdentities}`
              }
            >
              <NavLink
                to={`/${okmsId}/${ROUTES_URLS.credentials}/${credentialId}/${ROUTES_URLS.credentialIdentities}`}
                className="flex no-underline"
                onClick={() => {
                  trackClick({
                    location: PageLocation.page,
                    buttonType: ButtonType.tab,
                    actionType: 'navigation',
                    actions: ['identities'],
                  });
                }}
              >
                {t(
                  'key_management_service_credential_dashboard_tab_identities',
                )}
              </NavLink>
            </OdsTab>
          </OdsTabs>
        }
      >
        <Outlet
          context={{ credential, okms: okms.data } as CredentialContextType}
        />
      </BaseLayout>
    </Suspense>
  );
};

export default CredentialDashboard;
