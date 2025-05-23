import React from 'react';
import { RouteObject } from 'react-router-dom';
import { PageType } from '@ovh-ux/manager-react-shell-client';
import NotFound from '@/pages/404';
import { urls } from '@/routes/routes.constant';
import { APP_NAME } from '@/tracking.constant';

const lazyRouteConfig = (importFn: CallableFunction): Partial<RouteObject> => {
  return {
    lazy: async () => {
      const { default: moduleDefault, ...moduleExports } = await importFn();
      return {
        Component: moduleDefault,
        ...moduleExports,
      };
    },
  };
};

export const Routes: any = [
  {
    path: urls.root,
    ...lazyRouteConfig(() => import('@/pages/layout')),
    children: [
      {
        id: 'listing',
        path: urls.listing,
        ...lazyRouteConfig(() => import('@/pages/listing/Listing.page')),
        children: [
          {
            id: 'listing_terminate',
            path: urls.listing_terminate,
            ...lazyRouteConfig(() =>
              import('@/pages/terminate/terminate-hycu'),
            ),
          },
        ],
        handle: {
          tracking: {
            pageType: PageType.listing,
          },
        },
      },
      {
        path: urls.dashboard,
        ...lazyRouteConfig(() => import('@/pages/dashboard/Dashboard.page')),
        children: [
          {
            id: 'dashboard',
            path: '',
            ...lazyRouteConfig(() =>
              import(
                '@/pages/dashboard/general-information/DashboardGeneralInformation.page'
              ),
            ),
            handle: {
              tracking: {
                pageName: 'general_informations',
                pageType: PageType.dashboard,
              },
            },
            children: [
              {
                id: 'activate-license',
                path: urls.activateLicense,
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/dashboard/general-information/activation-license-modal/ActivationLicenseModal.page'
                  ),
                ),
              },
              {
                id: 'regenerate-license',
                path: urls.regenerateLicense,
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/dashboard/general-information/regenerate-license-modal/RegenerateLicenseModal.page'
                  ),
                ),
              },
              {
                id: 'edit-name',
                path: urls.editName,
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/dashboard/general-information/edit-display-name/EditHycuDisplayName.page'
                  ),
                ),
              },
              {
                id: 'dashboard_terminate',
                path: urls.dashboard_terminate,
                ...lazyRouteConfig(() =>
                  import('@/pages/terminate/terminate-hycu'),
                ),
              },
            ],
          },
        ],
      },
      {
        id: 'onboarding',
        path: urls.onboarding,
        ...lazyRouteConfig(() => import('@/pages/onboarding/Onboarding.page')),
        handle: {
          tracking: {
            pageType: PageType.onboarding,
          },
        },
      },
      {
        id: 'order',
        path: urls.order,
        ...lazyRouteConfig(() => import('@/pages/order/Order.page')),
        handle: {
          tracking: {
            pageName: `order_${APP_NAME}`,
            pageType: PageType.funnel,
          },
        },
      },
      {
        id: 'edit-pack',
        path: urls.editPack,
        ...lazyRouteConfig(() => import('@/pages/edit-pack/EditPack.page')),
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
];
