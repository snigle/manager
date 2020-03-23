import get from 'lodash/get';
import set from 'lodash/set';

import { Environment } from '@ovh-ux/manager-config';
import VpsConfigurationTile from '../service';
import { ORDER_TRACKING_URLS } from './constants';

import component from './component';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vps.detail.dashboard.configuration.upgrade', {
    url: '/upgrade/{upgradeType:memory|storage}?upgradeStatus&upgradeOrderId',
    layout: 'ouiModal',
    redirectTo: (transition) => {
      const $q = transition.injector().get('$q');
      const upgradeTypePromise = transition.injector().getAsync('upgradeType');
      const configurationTilePromise = transition
        .injector()
        .getAsync('configurationTile');

      return $q
        .all({
          upgradeType: upgradeTypePromise,
          configurationTile: configurationTilePromise,
        })
        .then(({ upgradeType, configurationTile }) => {
          const upgradeToPlan = get(
            configurationTile,
            `upgrades[${upgradeType}].plan`,
          );

          // check if the upgrade is available
          if (!upgradeToPlan) {
            return 'vps.detail.dashboard';
          }

          const upgradeModelPlan = get(
            configurationTile,
            `model[${upgradeType}]`,
          );

          // check if the model is setted correctly => if we access to the state
          // directly (without clicking on oui-radio in dashboard state)
          if (upgradeModelPlan.planCode !== upgradeToPlan.planCode) {
            set(configurationTile.model, upgradeType, upgradeToPlan);
          }

          return null;
        });
    },
    onExit: (transition) => {
      const configurationTilePromise = transition
        .injector()
        .getAsync('configurationTile');

      return configurationTilePromise.then((configurationTile) => {
        set(
          configurationTile.model,
          'memory',
          VpsConfigurationTile.currentPlan,
        );
        set(
          configurationTile.model,
          'storage',
          VpsConfigurationTile.currentPlan,
        );
      });
    },
    component: component.name,
    resolve: {
      upgradeType: /* @ngInject */ ($transition$) =>
        $transition$.params().upgradeType,

      upgradeStatus: /* @ngInject */ ($transition$) =>
        $transition$.params().upgradeStatus,

      upgradeOrderId: /* @ngInject */ ($transition$) =>
        $transition$.params().upgradeOrderId,

      redirectTo: () => 'vps.detail.dashboard',

      upgradeInfo: /* @ngInject */ (
        configurationTile,
        serviceName,
        upgradeStatus,
        upgradeType,
        vpsUpgrade,
      ) => {
        if (upgradeStatus === 'success') {
          return true;
        }

        return vpsUpgrade.getUpgrade(
          serviceName,
          get(configurationTile.upgrades, `${upgradeType}.plan.planCode`),
          { quantity: 1 },
        );
      },

      hasDefaultPaymentMethod: /* @ngInject */ (ovhPaymentMethod) =>
        ovhPaymentMethod.hasDefaultPaymentMethod(),

      loaders: () => ({
        upgrade: false,
      }),

      /* ----------  ouiModal layout resolves  ---------- */

      type: /* @ngInject */ (upgradeStatus) => upgradeStatus,

      heading: /* @ngInject */ (
        $translate,
        stateVps,
        upgradeStatus,
        upgradeType,
        vps,
      ) => {
        if (upgradeStatus === 'success') {
          return $translate.instant(
            'vps_dashboard_tile_configuration_upgrade_success_title',
          );
        }

        const translationKey = `vps_dashboard_tile_configuration_upgrade_${upgradeType}_action_title`;
        const translationValues =
          upgradeType === 'memory'
            ? {
                currentMemory: vps.ram.value,
                nextMemory: vps.ram.value * 2,
              }
            : {
                currentStorage: stateVps.model.disk,
                nextStorage: stateVps.model.disk * 2,
              };

        return $translate.instant(translationKey, translationValues);
      },

      primaryLabel: /* @ngInject */ ($translate, upgradeStatus) => {
        const translationKey =
          upgradeStatus === 'success'
            ? 'vps_dashboard_tile_configuration_upgrade_success_follow_order'
            : 'vps_dashboard_tile_configuration_upgrade_action_validate_and_pay';

        return $translate.instant(translationKey);
      },

      primaryAction: /* @ngInject */ (
        $state,
        $translate,
        $window,
        configurationTile,
        goBack,
        goToUpgradeSuccess,
        hasDefaultPaymentMethod,
        loaders,
        serviceName,
        upgradeOrderId,
        upgradeStatus,
        upgradeType,
        vpsUpgrade,
      ) => () => {
        if (upgradeStatus === 'success') {
          return $window.location.replace(
            `${get(
              ORDER_TRACKING_URLS,
              Environment.getRegion(),
            )}/${upgradeOrderId}`,
          );
        }

        // launch the upgrade
        set(loaders, 'upgrade', true);
        return vpsUpgrade
          .startUpgrade(
            serviceName,
            get(configurationTile.upgrades, `${upgradeType}.plan.planCode`),
            {
              quantity: 1,
              autoPayWithPreferredPaymentMethod: hasDefaultPaymentMethod,
            },
          )
          .then(({ order }) => {
            if (!hasDefaultPaymentMethod) {
              return $window.location.replace(order.url);
            }

            return goToUpgradeSuccess({
              upgradeStatus: 'success',
              upgradeOrderId: order.orderId,
            }, {
              location: false,
              reload: 'vps.detail.dashboard',
            });
          })
          .catch((error) =>
            goBack(
              $translate.instant(
                'vps_dashboard_tile_configuration_upgrade_error',
              ),
              'error',
              error,
            ),
          )
          .finally(() => {
            set(loaders, 'upgrade', false);
          });
      },

      secondaryLabel: /* @ngInject */ ($translate, upgradeStatus) =>
        !upgradeStatus
          ? $translate.instant(
              'vps_dashboard_tile_configuration_upgrade_action_cancel',
            )
          : null,

      secondaryAction: /* @ngInject */ (goBack) => () => goBack(),

      loading: /* @ngInject */ (loaders) => () => loaders.upgrade,
    },
  });
};
