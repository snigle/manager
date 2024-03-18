import find from 'lodash/find';
import filter from 'lodash/filter';
import get from 'lodash/get';
import includes from 'lodash/includes';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import has from 'lodash/has';
import some from 'lodash/some';
import sortBy from 'lodash/sortBy';

import Quota from '../../../../components/project/instance/quota/quota.class';
import { PATTERN } from '../../../../components/project/instance/name/constants';
import Instance from '../../../../components/project/instance/instance.class';
import { getAutoGeneratedName } from '../../../../components/auto-generate-name/auto-generate-name';
import { FLOATING_IP_HOURLY_PLAN_CODE } from '../../additional-ips/additional-ips.constants';
import { TAGS_BLOB } from '../../../../constants';

import {
  BANDWIDTH_OUT,
  AVAILABLE_SUBNET,
  INSTANCE_MODES_ENUM,
  INSTANCE_READ_MORE_GUIDE,
  FLOATING_IP_AVAILABILITY_INFO_LINK,
  WINDOWS_PRIVATE_MODE_LICENSE_GUIDE,
  FILTER_PRIVATE_NETWORK_BAREMETAL,
  FLAVORS_BAREMETAL,
  PUBLIC_NETWORK,
  PUBLIC_NETWORK_BAREMETAL,
  LOCAL_ZONE_REGION,
} from './add.constants';

import { INSTANCE_PRICING_LINKS } from '../instances.constants';

export default class PciInstancesAddController {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    coreConfig,
    $timeout,
    CucCloudMessage,
    cucUcentsToCurrencyFilter,
    PciProjectsProjectInstanceService,
    PciPublicGatewaysService,
    PciProjectAdditionalIpService,
    atInternet,
    PciProject,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.$timeout = $timeout;
    this.coreConfig = coreConfig;
    this.user = coreConfig.getUser();
    this.CucCloudMessage = CucCloudMessage;
    this.cucUcentsToCurrencyFilter = cucUcentsToCurrencyFilter;
    this.PciProjectsProjectInstanceService = PciProjectsProjectInstanceService;
    this.PciPublicGatewaysService = PciPublicGatewaysService;
    this.atInternet = atInternet;
    this.availableSubnet = AVAILABLE_SUBNET;
    this.instanceReadMoreUrl =
      INSTANCE_READ_MORE_GUIDE.ALL_GUIDE[this.user.ovhSubsidiary] ||
      INSTANCE_READ_MORE_GUIDE.ALL_GUIDE.DEFAULT;
    this.windowsPrivateModeLicenseGuideUrl =
      WINDOWS_PRIVATE_MODE_LICENSE_GUIDE[this.user.ovhSubsidiary] ||
      WINDOWS_PRIVATE_MODE_LICENSE_GUIDE.DEFAULT;
    this.instanceModeEnum = INSTANCE_MODES_ENUM;
    this.currency = coreConfig.getUser().currency.symbol;
    this.PciProjectAdditionalIpService = PciProjectAdditionalIpService;
    this.FLOATING_IP_AVAILABILITY_INFO_LINK = FLOATING_IP_AVAILABILITY_INFO_LINK;
    this.LOCAL_ZONE_REGION = LOCAL_ZONE_REGION;
    this.PciProject = PciProject;
    this.instancePricesLink =
      INSTANCE_PRICING_LINKS[this.user.ovhSubsidiary] ||
      INSTANCE_PRICING_LINKS.DEFAULT;
  }

  $onInit() {
    this.instance = new Instance({
      monthlyBilling: false,
    });

    this.isLoading = false;
    this.defaultInstanceName = '';

    this.showUserData = false;
    this.showNonAvailableRegions = false;

    this.quota = null;
    this.flavor = null;
    this.disableNetwork = false;

    this.loadMessages();

    this.globalRegionsUrl = this.PciProject.getDocumentUrl('GLOBAL_REGIONS');
    this.localZoneUrl = this.PciProject.getDocumentUrl('LOCAL_ZONE');

    this.model = {
      flavorGroup: null,
      image: null,
      isImageCompatible: false,
      number: 1,
      location: null,
      datacenter: null,
      sshKey: null,
      isInstanceFlex: false,
    };
    this.osTypes = [];
    this.selectedCategory = null;

    this.instanceNamePattern = PATTERN;

    this.defaultPrivateNetwork = this.getDefaultSelectValue(
      'pci_projects_project_instances_add_privateNetwork_none',
    );
    this.selectedPrivateNetwork = this.defaultPrivateNetwork;
    this.availablePrivateNetworks = [this.defaultPrivateNetwork];
    this.automatedBackup = {
      selected: false,
      schedule: null,
      price: null,
    };
    this.addInstanceSuccessMessage =
      this.addInstanceSuccessMessage ||
      'pci_projects_project_instances_add_success_message';
    this.addInstancesSuccessMessage =
      this.addInstancesSuccessMessage ||
      'pci_projects_project_instances_add_success_multiple_message';

    this.availableLocalPrivateNetworks = [this.defaultPrivateNetwork];
    this.modes = this.instanceModeEnum.map(({ mode }) => {
      return {
        name: mode,
        label: this.$translate.instant(
          `pci_projects_project_instances_add_privateNetwork_${mode}`,
        ),
        description1: this.$translate.instant(
          `pci_projects_project_instances_add_privateNetwork_${mode}_description1`,
        ),
        description2: this.$translate.instant(
          `pci_projects_project_instances_add_privateNetwork_${mode}_description2`,
        ),
      };
    });

    this.selectedFloatingIP = null;
    this.loadMessages();
    [this.selectedMode] = this.modes;
    this.showAddPrivateNetworkModalForm = false;
    this.isAttachFloatingIP = false;
    this.isAttachPublicNetwork = false;
    this.isCreateFloatingIPClicked = false;
    this.subnetGateways = [];
    this.isCustomNetwork = false;
    this.isGatewayLoading = false;
    this.isLoadBillingStep = false;
    this.floatingIps = null;
    this.addons = [];
    this.getSmallestGatewayInfo();
    this.defaultFloatingIp = this.getProductCatalog;
    this.isIpLoading = false;
  }

  getSmallestGatewayInfo() {
    return this.PciPublicGatewaysService.getSmallestGatewayInfo(
      this.user.ovhSubsidiary,
    ).then((data) => {
      this.defaultGateway = data;
    });
  }

  getDefaultSelectValue(transKey) {
    return {
      id: '',
      name: this.$translate.instant(transKey),
    };
  }

  getFilteredRegions() {
    this.availableRegions = {};
    this.unavailableRegions = {};

    const planCode = `${this.model.flavorGroup.name}.consumption`;

    return this.PciProjectsProjectInstanceService.getProductAvailability(
      this.projectId,
      planCode,
      this.coreConfig.getUser().ovhSubsidiary,
    ).then((productCapability) => {
      const productRegionsAllowed = productCapability?.plans[0]?.regions;
      Object.entries(this.regions).forEach(([continent, locationsMap]) => {
        // Create datacenters continent groups
        this.availableRegions[continent] = {};
        this.unavailableRegions[continent] = {};
        Object.entries(locationsMap).forEach(([location, datacenters]) => {
          // Create datacenters location sub groups
          this.availableRegions[continent][location] = [];
          this.unavailableRegions[continent][location] = [];
          // Fill datacenters groups: a datacenter is considered available if
          // it is in a region where we have the capability to add an instance
          // and the selected flavor is available for the datacenter region
          datacenters.forEach((datacenter) => {
            // If productAvailibility of the Product is not enabled it means Product is not activated in that region
            // in this case Enabled = false and we need to skip checking available regions from flavorGroup
            const isDatacenterAvailable = !!productRegionsAllowed.find(
              (productRegion) =>
                productRegion.name === datacenter.name &&
                (this.model.flavorGroup.availableRegions.includes(
                  productRegion.name,
                ) ||
                  !productRegion.enabled),
            );
            if (isDatacenterAvailable) {
              this.availableRegions[continent][location].push(datacenter);
            } else {
              this.unavailableRegions[continent][location].push(datacenter);
            }
          });
        });
      });
    });
  }

  static hasRegions(locations) {
    return some(locations, (datacenters) => datacenters.length);
  }

  loadMessages() {
    this.messageHandler = this.CucCloudMessage.subscribe(
      'pci.projects.project.instances.add',
      { onMessage: () => this.refreshMessages() },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  onFlavorFocus() {
    this.displaySelectedFlavor = false;
  }

  onFlavorChange() {
    this.displaySelectedFlavor = true;
    this.getFilteredRegions();
  }

  displayFlavorSelectionHeader() {
    if (this.currentStep > 0) {
      // if the flavor doesn't have a monthly plan
      if (this.model.flavorGroup?.tagsBlob?.includes(TAGS_BLOB.COMING_SOON)) {
        return this.$translate.instant(
          'pci_projects_project_instances_add_flavor_selected_title_without_price',
          {
            model: this.model?.flavorGroup?.name.toUpperCase(),
          },
        );
      }

      // if the flavor does have a monthly plan
      return this.$translate.instant(
        'pci_projects_project_instances_add_flavor_selected_title',
        {
          model: this.model?.flavorGroup?.name.toUpperCase(),
          price: this.model?.flavorGroup?.prices?.monthly?.text,
        },
      );
    }
    // current step is the flavor selection step
    return this.$translate.instant(
      'pci_projects_project_instances_add_flavor_title',
    );
  }

  IsComingSoonPricingBannerDisplayed() {
    return this.model.flavorGroup?.tagsBlob?.includes(TAGS_BLOB.COMING_SOON);
  }

  onFlavorCategorySelect(flavor, category) {
    this.selectedCategory = category;
    if (flavor.legacy) {
      this.CucCloudMessage.warning(
        this.$translate.instant(
          'pci_projects_project_instances_add_flavor_selected_legacy',
        ),
        'pci.projects.project.instances.add',
      );
    } else {
      this.messages = [];
    }
  }

  onRegionFocus() {
    this.displaySelectedRegion = false;
  }

  onRegionChange() {
    this.displaySelectedRegion = true;
    this.instance.region = this.model.datacenter.name;
    // Retrieve list of os types availables for the selected region
    this.osTypes = this.model.flavorGroup.getOsTypesByRegion(
      this.model.datacenter.name,
    );
    this.availablePrivateNetworks = [
      this.defaultPrivateNetwork,
      ...sortBy(
        map(
          filter(this.privateNetworks, (network) =>
            find(network.regions, {
              region: this.instance.region,
              status: 'ACTIVE',
            }) &&
            // For metal instances we only have vlan 0 available
            this.model.flavorGroup.type === FILTER_PRIVATE_NETWORK_BAREMETAL
              ? network.vlanId === 0
              : network.vlanId !== null,
          ),
          (privateNetwork) => {
            return {
              ...privateNetwork,
              name: `${privateNetwork.vlanId.toString().padStart(4, '0')} - ${
                privateNetwork.name
              }`,
            };
          },
        ),
        ['name'],
      ),
    ];

    if (!includes(this.availablePrivateNetworks, this.selectedPrivateNetwork)) {
      this.selectedPrivateNetwork = this.defaultPrivateNetwork;
    }
    this.getPrivateNetworkSubnet();
    if (this.isLocalZone()) {
      this.PciProjectsProjectInstanceService.getLocalPrivateNetworks(
        this.projectId,
        this.model.datacenter.name,
      )
        .then((network) => {
          this.availableLocalPrivateNetworks = network;
          this.getLocalPrivateNetworkSubnet();
        })
        .catch((error) =>
          this.CucCloudMessage.error(get(error, 'data.message')),
        );
    }
  }

  getPrivateNetworkSubnet() {
    return this.$q
      .all(
        this.availablePrivateNetworks.map((privateNetwork) => {
          if (privateNetwork.id) {
            return this.PciProjectsProjectInstanceService.getSubnets(
              this.projectId,
              privateNetwork.id,
            ).then((data) => {
              return {
                ...privateNetwork,
                subnet: data.filter(
                  (subnet) => subnet.ipPools[0].region === this.instance.region,
                ),
              };
            });
          }
          return privateNetwork;
        }),
      )
      .then((data) => {
        this.availablePrivateNetworks = [
          this.defaultPrivateNetwork,
          ...data.filter(({ subnet }) => subnet?.length > 0),
        ];
        return this.availablePrivateNetworks;
      });
  }

  onImageFocus() {
    this.displaySelectedImage = false;
  }

  onImageChange() {
    this.displaySelectedImage = true;
    if (this.model.image.isBackup()) {
      this.instance.imageId = this.model.image.id;
    } else {
      this.instance.imageId = this.model.image.getIdByRegion(
        this.instance.region,
      );
    }

    this.onFlexChange(false);

    if (!this.isLinuxImageType()) {
      this.model.sshKey = null;
      this.instance.sshKeyId = null;
    } else {
      this.instance.sshKeyId = get(this.model.sshKey, 'id');
    }
  }

  isLinuxImageType() {
    return this.model.image?.type?.includes('linux');
  }

  isWindowsImageType() {
    return this.model.image?.type?.includes('windows');
  }

  getBackupPrice() {
    return this.PciProjectsProjectInstanceService.getSnapshotMonthlyPrice(
      this.projectId,
      this.instance,
    );
  }

  showImageNavigation() {
    return (
      this.model.image &&
      this.model.isImageCompatible &&
      (!this.isLinuxImageType() || this.model.sshKey)
    );
  }

  onInstanceFocus() {
    if (this.isLocalZone() && !this.selectedPrivateNetwork.id) {
      // Display default selection for local private mode
      this.selectedPrivateNetwork = {
        id: '',
        name: this.$translate.instant(
          'pci_projects_project_instances_add_localPrivateNetwork_placeholder',
        ),
      };
    }
    if (!isEmpty(this.model.datacenter)) {
      this.disableNetwork = this.isLocalZone();
      this.quota = new Quota(this.model.datacenter.quota.instance);
      this.generateInstanceName();
      if (
        this.PciProjectsProjectInstanceService.automatedBackupIsAvailable(
          this.flavor.type,
        )
      ) {
        this.automatedBackup.selected = false;
        this.automatedBackup.schedule = null;
        return this.getBackupPrice().then((price) => {
          this.automatedBackup.price = price;
        });
      }
    }
    return this.$q.when();
  }

  getLocalPrivateNetworkSubnet() {
    return this.$q
      .all(
        this.availableLocalPrivateNetworks.map((privateNetwork) => {
          if (privateNetwork.id) {
            return this.PciProjectsProjectInstanceService.getLocalPrivateNetworkSubnets(
              this.projectId,
              this.model.datacenter.name,
              privateNetwork.id,
            ).then((data) => {
              return {
                ...privateNetwork,
                subnet: [
                  {
                    ...data,
                    ipPools: data.allocationPools,
                  },
                ],
              };
            });
          }
          return privateNetwork;
        }),
      )
      .then((data) => {
        this.availableLocalPrivateNetworks = [
          this.defaultPrivateNetwork,
          ...data.filter(({ subnet }) => subnet?.length > 0),
        ];
      });
  }

  generateInstanceName() {
    if (
      !has(this.instance, 'name') ||
      get(this.instance, 'name') === this.defaultInstanceName
    ) {
      this.defaultInstanceName = `${this.flavor.name}-${this.instance.region}`.toLowerCase();
      this.instance.name = this.defaultInstanceName;
    }
  }

  onFlexChange(isFlex) {
    this.flavor = this.model.flavorGroup.getFlavorByOsType(
      this.model.image.type,
      isFlex,
    );

    this.instance.flavorId = this.model.flavorGroup.getFlavorId(
      this.model.image.type,
      this.instance.region,
      isFlex,
    );
    this.generateInstanceName();
  }

  isRegionAvailable(datacenter) {
    return (
      datacenter.isAvailable() &&
      datacenter.hasEnoughQuotaForFlavors(this.model.flavorGroup)
    );
  }

  isRegionActive(datacenter) {
    return this.availableRegions.includes(datacenter.name);
  }

  createQuota() {
    if (!isEmpty(this.model.datacenter)) {
      this.quota = new Quota(this.model.datacenter.quota.instance);
    }
  }

  getUnavailabilityReason(datacenter) {
    if (!datacenter.isAvailable()) {
      return 'INACTIVE';
    }

    if (has(datacenter, 'quota.instance')) {
      if (!datacenter.checkInstancesNumber()) {
        return 'INSTANCE';
      }

      if (!datacenter.checkRamQuota(this.model.flavorGroup)) {
        return 'RAM';
      }

      if (!datacenter.checkCoresQuota(this.model.flavorGroup)) {
        return 'VCPUS';
      }
    }

    return 'UNKWOWN';
  }

  onCancel() {
    this.trackAddInstance(`add::create-private-network::cancel`);
    this.showAddPrivateNetworkModalForm = false;
  }

  trackCreate() {
    const mode = this.instance.monthlyBilling ? 'monthly' : 'hourly';
    const [networkMode] = this.selectedMode.name.split('_');
    this.trackAddInstance(
      `instances_create_${
        this.selectedCategory
      }_${mode}_${this.instance.region.toLowerCase()}_${
        this.model.flavorGroup.name
      }_${networkMode}`,
      'action',
      false,
    );
  }

  onModeFocus() {
    this.displaySelectedMode = false;
    this.isFloatingIpAvailable = false;
    this.PciProjectAdditionalIpService.getRegions(
      this.projectId,
      this.user.ovhSubsidiary,
      FLOATING_IP_HOURLY_PLAN_CODE,
    ).then((regions) => {
      this.isFloatingIpAvailable = regions.some(
        ({ name }) => name === this.model.datacenter.name,
      );
      if (!this.isFloatingIpAvailable) {
        this.isAttachFloatingIP = false;
      }
    });
  }

  onModeChange() {
    this.displaySelectedMode = true;
  }

  onAttachIPChange(value) {
    if (value) {
      if (!this.floatingIps) {
        this.getFloatingIps();
      }
      if (this.isCreateFloatingIPClicked) {
        this.isCreateFloatingIPClicked = false;
      }
      this.trackAddInstance(`add::enable-attach-floating-ip`);
    } else {
      this.trackAddInstance(`add::disable-attach-floating-ip`);
    }
    return this.floatingIps;
  }

  onSelectedModeChange(mode) {
    this.selectedMode = mode;
    this.selectedPrivateNetwork = {
      id: '',
      name: this.$translate.instant(
        'pci_projects_project_instances_add_privateNetwork_none',
      ),
    };
    if (this.subnetGateways) {
      this.subnetGateways = [];
    }
    if (this.isPrivateMode()) {
      this.isCreateFloatingIPClicked = false;
      this.isAttachFloatingIP = false;
      this.selectedPrivateNetwork = {
        id: '',
        name: this.$translate.instant(
          'pci_projects_project_instances_add_privateNetwork_placeholder',
        ),
      };
    }
    if (this.isLocalPrivateMode()) {
      this.isAttachPublicNetwork = false;
      this.selectedPrivateNetwork = {
        id: '',
        name: this.$translate.instant(
          'pci_projects_project_instances_add_localPrivateNetwork_placeholder',
        ),
      };
    }
  }

  isPrivateMode() {
    return this.selectedMode.name === this.instanceModeEnum[1].mode;
  }

  isLocalPrivateMode() {
    return this.selectedMode.name === this.instanceModeEnum[2].mode;
  }

  isLocalZone() {
    return this.model?.datacenter?.type === this.LOCAL_ZONE_REGION;
  }

  onFloatingIpChange(value) {
    if (value !== null && !value?.id) {
      this.isCreateFloatingIPClicked = true;
      this.trackAddInstance(`add::create-floating-ip`);
    } else {
      this.selectedFloatingIP = value;
      this.isCreateFloatingIPClicked = false;
    }
  }

  getPrivateNetworkOnChange() {
    if (get(this.selectedPrivateNetwork, 'id')) {
      this.instance.networks = [
        {
          networkId: get(this.selectedPrivateNetwork, 'id'),
        },
      ];
      if (!this.isPrivateMode() && !this.isLocalPrivateMode()) {
        this.instance.networks = [
          ...this.instance.networks,
          {
            networkId: this.publicNetwork.find((network) => {
              if (FLAVORS_BAREMETAL.test(this.flavor.type)) {
                return network.name === PUBLIC_NETWORK_BAREMETAL;
              }
              return network.name === PUBLIC_NETWORK;
            })?.id,
          },
        ];
      }
    } else {
      this.instance.networks = [];
    }
  }

  onPrivateNetworkChange(modelValue) {
    this.getPrivateNetworkOnChange();
    if (
      modelValue &&
      modelValue.subnet &&
      this.selectedMode.name !== this.instanceModeEnum[1].mode &&
      !this.isLocalZone()
    ) {
      this.getSubnetGateways(modelValue.subnet[0].id)
        .then((data) => {
          this.subnetGateways = data;
        })
        .catch(() => {
          this.subnetGateways = [];
        });
    }
    this.subnetGateways = [];
  }

  getFloatingIps() {
    this.isIpLoading = true;
    return this.PciProjectsProjectInstanceService.getFloatingIps(
      this.projectId,
      this.model.datacenter.name,
    )
      .then((data) => {
        this.floatingIps = data;
        this.floatingIps.push({
          id: '',
          isCustom: true,
          ip: this.$translate.instant(
            'pci_projects_project_instances_add_create_floating_ip_action',
          ),
        });
      })
      .catch((err) => {
        this.handleError(err);
      })
      .finally(() => {
        this.isIpLoading = false;
      });
  }

  getSubnetGateways(id) {
    this.isGatewayLoading = true;
    return this.PciProjectsProjectInstanceService.getSubnetGateways(
      this.projectId,
      this.model.datacenter.name,
      id,
    )
      .then((data) => data)
      .finally(() => {
        this.isGatewayLoading = false;
      });
  }

  onModeSubmit() {
    this.addons = [];
    if (
      this.isPrivateMode() &&
      this.isAttachFloatingIP &&
      this.selectedPrivateNetwork
    ) {
      this.isLoadBillingStep = true;
      if (this.selectedPrivateNetwork.subnet?.[0]) {
        return this.getSubnetGateways(this.selectedPrivateNetwork.subnet[0].id)
          .then((data) => {
            this.subnetGateways = data;
            this.addPricing();
            if (
              this.subnetGateways.length > 0 &&
              this.selectedPrivateNetwork.subnet[0]?.gatewayIp === null
            ) {
              this.enableDhcp();
            }
            this.isGatewayLoading = false;
          })
          .catch((err) => {
            this.handleError(err);
          })
          .finally(() => {
            this.isLoadBillingStep = false;
          });
      }
    }
    return null;
  }

  showNetworkNavigation() {
    if (this.isPrivateMode()) {
      return (
        this.selectedPrivateNetwork.id !== '' &&
        (!this.isAttachFloatingIP || this.selectedFloatingIP)
      );
    }

    if (this.isLocalPrivateMode()) {
      return this.selectedPrivateNetwork.id !== '';
    }

    if (
      this.isLocalZone() &&
      !(this.isPrivateMode() || this.isLocalPrivateMode())
    ) {
      return false;
    }

    return (
      !this.isGatewayLoading &&
      this.subnetGateways &&
      this.subnetGateways.length === 0
    );
  }

  addPricing() {
    if (
      this.isAttachFloatingIP &&
      this.subnetGateways.length === 0 &&
      this.selectedFloatingIP.id
    ) {
      this.addons = [...this.addons, { gateway: this.defaultGateway }];
    }
    if (
      this.isAttachFloatingIP &&
      this.subnetGateways.length === 0 &&
      !this.selectedFloatingIP.id
    ) {
      this.addons = [
        ...this.addons,
        { gateway: this.defaultGateway },
        { floatingIp: this.getProductCatalog },
      ];
    } else if (
      this.isAttachFloatingIP &&
      !this.selectedFloatingIP.id &&
      this.subnetGateways.length > 0
    ) {
      this.addons = [...this.addons, { floatingIp: this.defaultFloatingIp }];
    }
  }

  enableDhcp() {
    this.dhcpModel = {
      dhcp: true,
      noGateway: false,
      start: this.selectedPrivateNetwork.subnet[0].ipPools[0].start,
      end: this.selectedPrivateNetwork.subnet[0].ipPools[0].end,
      network: this.selectedPrivateNetwork.subnet[0].ipPools[0].network,
      region: this.selectedPrivateNetwork.subnet[0].ipPools[0].region,
    };
    return this.PciProjectsProjectInstanceService.enableDhcp(
      this.projectId,
      this.selectedPrivateNetwork.id,
      this.dhcpModel,
    )
      .then((data) => data)
      .catch((err) => {
        this.isLoading = false;
        return this.handleError(err);
      });
  }

  onCreateFormStepperSubmit() {
    if (this.isPrivateMode()) {
      this.confirmPrivateInstanceCreation = true;
      return null;
    }
    return this.create();
  }

  onCancelCreateInstanceConfirmation() {
    this.confirmPrivateInstanceCreation = false;
  }

  create() {
    this.isLoading = true;
    this.trackCreate();

    if (!this.isLinuxImageType()) {
      this.instance.userData = null;
    }
    if (this.isLocalPrivateMode()) {
      const publicNetworkAlreadyExist = this.instance.networks.some(
        (instanceNetwork) => {
          return this.publicNetwork?.find(
            (network) => network.id === instanceNetwork.networkId,
          );
        },
      );
      if (this.isAttachPublicNetwork && !publicNetworkAlreadyExist) {
        // if attach check box is ticked, add public network if not added one
        this.instance.networks = [
          ...this.instance.networks,
          {
            networkId: this.publicNetwork?.find(
              (network) => network.name === PUBLIC_NETWORK,
            )?.id,
          },
        ];
      }
      if (!this.isAttachPublicNetwork && publicNetworkAlreadyExist) {
        // if attach check box is not ticked, remove public network if already added one
        this.instance.networks = this.instance.networks.filter(
          (instanceNetwork) => {
            return !this.publicNetwork?.find(
              (network) => network.id === instanceNetwork.networkId,
            );
          },
        );
      }
    }

    if (
      this.PciProjectsProjectInstanceService.automatedBackupIsAvailable(
        this.flavor.type,
      ) &&
      this.automatedBackup.selected
    ) {
      const { schedule } = this.automatedBackup;
      this.instance.autobackup = {
        cron: `${schedule.cronPattern.minutes} ${schedule.cronPattern.hour} ${schedule.cronPattern.dom} ${schedule.cronPattern.month} ${schedule.cronPattern.dow}`,
        rotation: schedule.rotation,
      };
    }

    // @TODO: GS Use post /cloud/project/{serviceName}/region/{regionName}/instance
    // for local zone instance creation
    return this.PciProjectsProjectInstanceService.save(
      this.projectId,
      this.instance,
      this.model.number,
      this.isPrivateMode(),
    )
      .then(({ id: instanceId, ipAddresses: ips }) => {
        const message =
          this.model.number === 1
            ? this.$translate.instant(this.addInstanceSuccessMessage, {
                instance: this.instance.name,
              })
            : this.$translate.instant(this.addInstancesSuccessMessage);
        if (!this.isPrivateMode()) {
          return this.goBack(message, 'success');
        }
        if (this.subnetGateways?.length === 0 && this.isAttachFloatingIP) {
          return this.createGateway(instanceId, ips, message);
        }
        return this.onCreateInstanceSuccess(instanceId, ips, message);
      })
      .catch((error) => {
        this.createInstanceError(error);
      })
      .finally(() => {
        if (!this.isPrivateMode()) {
          this.isLoading = false;
        } else {
          this.confirmPrivateInstanceCreation = false;
        }
      });
  }

  onCreateInstanceSuccess(instanceId, ips, message) {
    const filteredIp = ips.find(({ version: ipv4 }) => ipv4 === 4);
    if (this.isAttachFloatingIP && filteredIp) {
      if (this.isCreateFloatingIPClicked && !this.selectedFloatingIP.id) {
        return this.createAndAttachFloatingIp(
          instanceId,
          filteredIp.ip,
          message,
        );
      }
      if (this.selectedFloatingIP) {
        return this.associateFloatingIp(
          instanceId,
          this.selectedFloatingIP.id,
          filteredIp.ip,
          message,
        );
      }
    }
    return this.goBack(message, 'success');
  }

  createGateway(instanceId, ips, message) {
    this.gatewayName = getAutoGeneratedName(
      `gateway-${this.model.datacenter.name.toLowerCase()}`,
    );
    return this.PciPublicGatewaysService.getSmallestGatewayInfo(
      this.user.ovhSubsidiary,
    )
      .then((data) => {
        this.selectedGatewaySize = data.size;
        this.gatewayModel = {
          name: this.gatewayName,
          model: this.selectedGatewaySize,
        };
        const network = this.selectedPrivateNetwork.regions.find(
          (networkRegion) =>
            networkRegion.region === this.model.datacenter.name,
        );
        return this.PciProjectsProjectInstanceService.createGateway(
          this.projectId,
          this.model.datacenter.name,
          network.openstackId,
          this.selectedPrivateNetwork?.subnet[0]?.id,
          this.gatewayModel,
        );
      })
      .then(() => this.onCreateInstanceSuccess(instanceId, ips, message))
      .catch((err) => {
        this.isLoading = false;
        return this.handleError(err);
      });
  }

  createInstanceError(error) {
    let message;
    if (this.model.number === 1) {
      message = this.$translate.instant(
        'pci_projects_project_instances_add_error_save',
        {
          instance: this.instance.name,
          message: get(error, 'data.message', null),
        },
      );
    } else {
      message = this.$translate.instant(
        'pci_projects_project_instances_add_error_multiple_save',
        {
          message: get(error, 'data.message', null),
        },
      );
    }

    this.CucCloudMessage.error(message, 'pci.projects.project.instances.add');
    this.$timeout(() => {
      document
        .getElementById('create-instance-error-container')
        .scrollIntoView(true);
    });
  }

  handleError(err) {
    this.CucCloudMessage.error(
      this.$translate.instant(
        'pci_projects_project_instances_add_common_error',
        { message: get(err, 'data.message', '') },
      ),
    );
  }

  createAndAttachFloatingIp(instanceId, ip, message) {
    this.isLoading = true;
    this.floatingIpModel = {
      ip,
    };
    return this.PciProjectsProjectInstanceService.createAndAttachFloatingIp(
      this.projectId,
      this.model.datacenter.name,
      instanceId,
      this.floatingIpModel,
    )
      .then(() => this.goBack(message, 'success'))
      .catch((err) => {
        this.handleError(err);
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  associateFloatingIp(instanceId, floatingIpId, ip, message) {
    this.isLoading = true;
    this.floatingIpModel = {
      floatingIpId,
      ip,
    };
    return this.PciProjectsProjectInstanceService.associateFloatingIp(
      this.projectId,
      this.model.datacenter.name,
      instanceId,
      this.floatingIpModel,
    )
      .then(() => this.goBack(message, 'success'))
      .catch((err) => {
        this.handleError(err);
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  cancel() {
    this.trackAddInstance(`instances_add_cancel_creation`, 'action', false);
    return this.goBack();
  }

  getBandwidthExtraCost(region) {
    return this.cucUcentsToCurrencyFilter(
      get(this.prices, `${BANDWIDTH_OUT}.${region.name}`).price,
    );
  }

  displayNetwork(mode, type) {
    if (type === this.LOCAL_ZONE_REGION) return mode !== 'public_mode';
    if (type !== this.LOCAL_ZONE_REGION) return mode !== 'local_private_mode';
    return true;
  }
}
