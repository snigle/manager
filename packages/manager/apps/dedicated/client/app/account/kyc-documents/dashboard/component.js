import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    user: '<',
    resource: '<',
    isDisabled: '<',
    supportLink: '<',
    hubLink: '<',
    isSupportWithExternalLinks: '<',
  },
  controller,
  template,
};
