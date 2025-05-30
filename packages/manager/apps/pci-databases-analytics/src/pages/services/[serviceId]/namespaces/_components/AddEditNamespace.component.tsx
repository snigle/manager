import { useTranslation } from 'react-i18next';
import { useState } from 'react';

import { ChevronDown, ChevronRight, HelpCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  RadioGroup,
  RadioGroupItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Switch,
  useToast,
  ScrollArea,
} from '@datatr-ux/uxlib';

import { useNamespaceForm } from './formNamespace/useNamespaceForm.hook';

import * as database from '@/types/cloud/project/database';
import { convertDurationStringToISODuration } from '@/lib/durationHelper';
import { TOAST } from '@/configuration/toast.constants';
import {
  UseAddNamespace,
  useAddNamespace,
} from '@/hooks/api/database/namespace/useAddNamespace.hook';
import { useEditNamespace } from '@/hooks/api/database/namespace/useEditNamespace.hook';
import { getCdbApiErrorMessage } from '@/lib/apiHelper';
import RouteModal from '@/components/route-modal/RouteModal';

interface AddEditNamespaceModalProps {
  editedNamespace?: database.m3db.Namespace;
  namespaces: database.m3db.Namespace[];
  service: database.Service;
}
const AddEditNamespace = ({
  editedNamespace,
  namespaces,
  service,
}: AddEditNamespaceModalProps) => {
  const isEdition = !!editedNamespace?.id;
  const [advancedConfiguration, setAdvancedConfiguration] = useState(
    isEdition &&
      (editedNamespace.snapshotEnabled ||
        editedNamespace.writesToCommitLogEnabled ||
        editedNamespace.retention.blockDataExpirationDuration ||
        editedNamespace.retention.blockSizeDuration ||
        editedNamespace.retention.bufferFutureDuration ||
        editedNamespace.retention.bufferPastDuration),
  );
  const navigate = useNavigate();
  const { projectId } = useParams();
  const { form } = useNamespaceForm({
    editedNamespace,
    existingNamespaces: namespaces,
  });

  const { t } = useTranslation(
    'pci-databases-analytics/services/service/namespaces',
  );
  const prefix = isEdition ? 'edit' : 'add';
  const toast = useToast();

  const NamespaceMutationProps: UseAddNamespace = {
    onError(err) {
      toast.toast({
        title: t(`${prefix}NamespaceToastErrorTitle`),
        variant: 'destructive',
        description: getCdbApiErrorMessage(err),
        duration: TOAST.ERROR_DURATION,
      });
    },
    onSuccess(ns) {
      form.reset();
      setAdvancedConfiguration(false);
      toast.toast({
        title: t('formNamespaceToastSuccessTitle'),
        description: t(`${prefix}NamespaceToastSuccessDescription`, {
          name: ns.name,
        }),
      });
      navigate('../');
    },
  };

  const { addNamespace, isPending: isPendingAddNamespace } = useAddNamespace(
    NamespaceMutationProps,
  );

  const { editNamespace, isPending: isPendingEditNamespace } = useEditNamespace(
    NamespaceMutationProps,
  );

  const onSubmit = form.handleSubmit((formValues) => {
    const retentionFormValues = {
      periodDuration: convertDurationStringToISODuration(
        formValues.periodDuration,
      ),
      blockDataExpirationDuration: formValues.blockDataExpirationDuration
        ? convertDurationStringToISODuration(
            formValues.blockDataExpirationDuration,
          )
        : null,
      bufferFutureDuration: formValues.bufferFutureDuration
        ? convertDurationStringToISODuration(formValues.bufferFutureDuration)
        : null,
      bufferPastDuration: formValues.bufferPastDuration
        ? convertDurationStringToISODuration(formValues.bufferPastDuration)
        : null,
    } as database.m3db.namespace.Retention;

    if (isEdition) {
      if (Object.entries(form.formState.dirtyFields).length === 0) {
        return;
      }

      editNamespace({
        projectId,
        engine: service.engine,
        serviceId: service.id,
        namespace: {
          id: editedNamespace.id,
          retention: retentionFormValues,
          snapshotEnabled: formValues.snapshotEnabled,
          writesToCommitLogEnabled: formValues.writesToCommitLogEnabled,
          resolution: formValues.resolution
            ? convertDurationStringToISODuration(formValues.resolution)
            : null,
        },
      });
    } else {
      retentionFormValues.blockSizeDuration = formValues.blockSizeDuration
        ? convertDurationStringToISODuration(formValues.blockSizeDuration)
        : null;
      addNamespace({
        projectId,
        engine: service.engine,
        serviceId: service.id,
        namespace: {
          name: formValues.name,
          retention: retentionFormValues,
          resolution: formValues.resolution
            ? convertDurationStringToISODuration(formValues.resolution)
            : null,
          type: formValues.type,
          snapshotEnabled: formValues.snapshotEnabled,
          writesToCommitLogEnabled: formValues.writesToCommitLogEnabled,
        },
      });
    }
  });

  return (
    <RouteModal>
      <DialogContent className="px-0 sm:max-w-2xl">
        <ScrollArea className="max-h-[80vh] px-6">
          <DialogHeader>
            <DialogTitle data-testid="add-edit-namespaces-modal">
              {t(`${prefix}NamespaceTitle`)}
            </DialogTitle>
            {!isEdition && (
              <DialogDescription>
                {t('addNamespaceDescription')}
              </DialogDescription>
            )}
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={onSubmit} className="flex flex-col gap-2">
              {/* NamespaceName */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('formNamespaceFieldNameLabel')}</FormLabel>
                    <FormControl>
                      <Input
                        data-testid="add-edit-namespaces-name-input"
                        placeholder="name"
                        disabled={
                          isEdition ||
                          isPendingAddNamespace ||
                          isPendingEditNamespace
                        }
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Namespace type */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1 mt-2">
                    <div className="flex items-center space-x-2">
                      <FormLabel>{t('formNamespaceFieldTypeLabel')}</FormLabel>
                      <FormControl>
                        <RadioGroup value={field.value} ref={field.ref}>
                          <FormItem className="flex items-center gap-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value={field.value} />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {t(`formNamespaceField${field.value}TypeLabel`)}
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <Popover>
                        <PopoverTrigger>
                          <HelpCircle className="size-4" />
                        </PopoverTrigger>
                        <PopoverContent>
                          <p>{t('formNamespaceFieldTypeDescription')}</p>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Retention */}
              <FormField
                control={form.control}
                name="periodDuration"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center space-x-2 mt-2">
                      <FormLabel>
                        {t('formNamespaceFieldPeriodDurationLabel')}
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger>
                          <HelpCircle className="size-4" />
                        </PopoverTrigger>
                        <PopoverContent>
                          <p>
                            {t('formNamespaceFieldPeriodDurationDescription')}
                          </p>
                          <p>{t('formNamespaceFieldDurationDescription')}</p>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <FormControl>
                      <Input
                        data-testid="add-edit-namespaces-retention-input"
                        placeholder={t(
                          'formNamespaceFieldPeriodDurationPlaceholder',
                        )}
                        disabled={
                          isPendingAddNamespace || isPendingEditNamespace
                        }
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Resolution */}
              {form.getValues('type') ===
                database.m3db.namespace.TypeEnum.aggregated && (
                <FormField
                  control={form.control}
                  name="resolution"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center space-x-2 mt-2">
                        <FormLabel>
                          {t('formNamespaceFieldResolutionLabel')}
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger>
                            <HelpCircle className="size-4" />
                          </PopoverTrigger>
                          <PopoverContent>
                            <p>
                              {t('formNamespaceFieldResolutionDescription')}
                            </p>
                            <p>{t('formNamespaceFieldDurationDescription')}</p>
                          </PopoverContent>
                        </Popover>
                      </div>
                      <FormControl>
                        <Input
                          data-testid="add-edit-namespaces-resolution-input"
                          placeholder={t(
                            'formNamespaceFieldResolutionPlaceholder',
                          )}
                          disabled={
                            isPendingAddNamespace || isPendingEditNamespace
                          }
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {/* Advanced configuration */}
              <div className="w-full rounded-md border-2 mt-2">
                <Button
                  type="button"
                  mode={'ghost'}
                  className="flex flex-row justify-between w-full font-semibold hover:text-primary"
                  onClick={() =>
                    setAdvancedConfiguration(!advancedConfiguration)
                  }
                >
                  {t('formNamespaceButtonAdvancedConfiguration')}
                  {advancedConfiguration ? (
                    <ChevronDown className="h-5 w-5" />
                  ) : (
                    <ChevronRight className="h-5 w-5" />
                  )}
                </Button>
                {advancedConfiguration && (
                  <div className="mx-3 mt-2 mb-4">
                    {/* WritesToCommitLogEnabled */}
                    <FormField
                      control={form.control}
                      name="writesToCommitLogEnabled"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <FormLabel>writesToCommitLogEnabled</FormLabel>
                              <Popover>
                                <PopoverTrigger>
                                  <HelpCircle className="size-4" />
                                </PopoverTrigger>
                                <PopoverContent>
                                  <p>
                                    {t(
                                      'formNamespaceFieldWritesToCommitLogEnabledDescription',
                                    )}
                                  </p>
                                </PopoverContent>
                              </Popover>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                ref={field.ref}
                              />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                    {/* Snapshot */}
                    <FormField
                      control={form.control}
                      name="snapshotEnabled"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center mt-2 justify-between">
                            <div className="flex items-center space-x-2">
                              <FormLabel>snapshotEnabled</FormLabel>
                              <Popover>
                                <PopoverTrigger>
                                  <HelpCircle className="size-4" />
                                </PopoverTrigger>
                                <PopoverContent>
                                  <p>
                                    {t(
                                      'formNamespaceFieldSnapshotEnabledDescription',
                                    )}
                                  </p>
                                </PopoverContent>
                              </Popover>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                ref={field.ref}
                              />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                    {/* blockSizeDuration Retention */}
                    <FormField
                      control={form.control}
                      name="blockSizeDuration"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center space-x-2 mt-2">
                            <FormLabel>retention.blockSizeDuration</FormLabel>
                            <Popover>
                              <PopoverTrigger>
                                <HelpCircle className="size-4" />
                              </PopoverTrigger>
                              <PopoverContent>
                                <p>
                                  {t(
                                    'formNamespaceFieldBlockSizeDurationDescription',
                                  )}
                                </p>
                                <p>
                                  {t('formNamespaceFieldDurationDescription')}
                                </p>
                              </PopoverContent>
                            </Popover>
                          </div>
                          <FormControl>
                            <Input
                              placeholder={t(
                                'formNamespaceFieldDurationPlaceholder',
                              )}
                              disabled={
                                isEdition ||
                                isPendingAddNamespace ||
                                isPendingEditNamespace
                              }
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* bufferPastDuration */}
                    <FormField
                      control={form.control}
                      name="bufferPastDuration"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center space-x-2 mt-2">
                            <FormLabel>retention.bufferPastDuration</FormLabel>
                            <Popover>
                              <PopoverTrigger>
                                <HelpCircle className="size-4" />
                              </PopoverTrigger>
                              <PopoverContent>
                                <p>
                                  {t(
                                    'formNamespaceFieldBufferPastDurationDescription',
                                  )}
                                </p>
                                <p>
                                  {t('formNamespaceFieldDurationDescription')}
                                </p>
                              </PopoverContent>
                            </Popover>
                          </div>
                          <FormControl>
                            <Input
                              placeholder={t(
                                'formNamespaceFieldDurationPlaceholder',
                              )}
                              disabled={
                                isPendingAddNamespace || isPendingEditNamespace
                              }
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* bufferFutureDuration */}
                    <FormField
                      control={form.control}
                      name="bufferFutureDuration"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center space-x-2 mt-2">
                            <FormLabel>
                              retention.bufferFutureDuration
                            </FormLabel>
                            <Popover>
                              <PopoverTrigger>
                                <HelpCircle className="size-4" />
                              </PopoverTrigger>
                              <PopoverContent>
                                <p>
                                  {t(
                                    'formNamespaceFieldBufferFutureDurationDescription',
                                  )}
                                </p>
                                <p>
                                  {t('formNamespaceFieldDurationDescription')}
                                </p>
                              </PopoverContent>
                            </Popover>
                          </div>
                          <FormControl>
                            <Input
                              placeholder={t(
                                'formNamespaceFieldDurationPlaceholder',
                              )}
                              disabled={
                                isPendingAddNamespace || isPendingEditNamespace
                              }
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* blockDataExpirationDuration */}
                    <FormField
                      control={form.control}
                      name="blockDataExpirationDuration"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center space-x-2 mt-2">
                            <FormLabel>
                              retention.blockDataExpirationDuration
                            </FormLabel>
                            <Popover>
                              <PopoverTrigger>
                                <HelpCircle className="size-4" />
                              </PopoverTrigger>
                              <PopoverContent>
                                <p>
                                  {t(
                                    'formNamespaceFieldDataExpirationDurationDescription',
                                  )}
                                </p>
                                <p>
                                  {t('formNamespaceFieldDurationDescription')}
                                </p>
                              </PopoverContent>
                            </Popover>
                          </div>
                          <FormControl>
                            <Input
                              data-testid="add-edit-namespaces-blockDataExpirationDuration-input"
                              placeholder={t(
                                'formNamespaceFieldDurationPlaceholder',
                              )}
                              disabled={
                                isPendingAddNamespace || isPendingEditNamespace
                              }
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>
              <DialogFooter className="flex justify-end mt-4">
                <DialogClose asChild>
                  <Button
                    data-testid="add-edit-namespaces-cancel-button"
                    type="button"
                    mode="outline"
                  >
                    {t('formNamespaceButtonCancel')}
                  </Button>
                </DialogClose>
                <Button
                  data-testid="add-edit-namespaces-submit-button"
                  type="submit"
                  disabled={isPendingAddNamespace || isPendingEditNamespace}
                >
                  {t(`${prefix}NamespaceButtonConfirm`)}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </RouteModal>
  );
};

export default AddEditNamespace;
