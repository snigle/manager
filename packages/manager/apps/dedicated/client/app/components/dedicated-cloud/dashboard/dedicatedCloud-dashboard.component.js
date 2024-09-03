import template from './dedicatedCloud-dashboard.html';

export default {
  bindings: {
    currentDrp: '<',
    currentService: '<',
    currentUser: '<',
    datacenterList: '<',
    deleteDrp: '<',
    disableVmwareOption: '<',
    drpAvailability: '<',
    drpGlobalStatus: '<',
    editDetails: '<',
    goToDrp: '<',
    goToVcdOrder: '<',
    goToDatacenter: '<',
    goToDrpDatacenterSelection: '<',
    goToVpnConfiguration: '<',
    isDrpActionPossible: '<',
    isLv1Lv2BannerAvailable: '<',
    isMailingListSubscriptionAvailable: '<',
    onUpgradeVersion: '<',
    associateIpBlockLink: '<',
    onExecutionDateChange: '<',
    onMlSubscribe: '<',
    onTerminate: '<',
    onBasicOptionsUpgrade: '<',
    onCertificationUpgrade: '<',
    onConfigurationOnlyUpgrade: '<',
    orderSecurityOption: '<',
    orderVmwareOption: '<',
    pccType: '<',
    productId: '<',
    setMessage: '<',
    trackingPrefix: '<',
    dedicatedCloudDescription: '<',
    managedVCDAvailability: '<',
  },
  template,
};
