import { useTranslation } from 'react-i18next';
import {
  Boxes,
  Clock,
  Cloud,
  Cloudy,
  Cpu,
  HardDrive,
  Hash,
  HelpCircle,
  MemoryStick,
} from 'lucide-react';
import {
  Button,
  Skeleton,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@datatr-ux/uxlib';
import { humanizeEngine } from '@/lib/engineNameHelper';
import * as database from '@/types/cloud/project/database';
import { addStorage, formatStorage } from '@/lib/bytesHelper';
import {
  Engine,
  Flavor,
  ForkSource,
  ForkSourceType,
  Plan,
  Region,
  Version,
} from '@/types/orderFunnel';
import { Network, Subnet } from '@/types/cloud/network';
import FormattedDate from '@/components/formatted-date/FormattedDate.component';
import { EngineIcon } from '@/components/engine-icon/EngineIcon.component';

interface ForkSummaryProps {
  order: {
    source: ForkSource;
    backup?: database.Backup;
    engine: Engine;
    version: Version;
    plan: Plan;
    region: Region;
    flavor: Flavor;
    nodes: number;
    additionalStorage: number;
    name: string;
    ipRestrictions: {
      ip: string;
      description: string;
    }[];
    network: {
      type: database.NetworkTypeEnum;
      network?: Network;
      subnet?: Subnet;
    };
  };
  onSectionClicked?: (target: string) => void;
}

const SourceDetails = ({ order, onSectionClicked }: ForkSummaryProps) => {
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/backups/fork',
  );
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Button
          data-testid="source-section-button"
          type="button"
          onClick={() => onSectionClicked('source')}
          className="p-0 bg-transparent h-auto  hover:bg-transparent font-bold text-primary underline-offset-4 hover:underline"
        >
          {t('summaryFieldSourceLabel')}
        </Button>
        {order.source && (
          <span>{t(`summaryFieldSourceType-${order.source.type}`)}</span>
        )}
      </div>
      {order.source.type !== ForkSourceType.now && (
        <div className="pl-4">
          <Clock className="size-4 inline-block mr-2" />
          {order.source.type === ForkSourceType.pit && (
            <span>
              <FormattedDate
                date={order.source.pointInTime}
                options={{ dateStyle: 'medium', timeStyle: 'medium' }}
              />
            </span>
          )}
          {order.source.type === 'backup' && (
            <span>
              {order.backup ? (
                <span>
                  <FormattedDate
                    date={new Date(order.backup.createdAt)}
                    options={{ dateStyle: 'medium', timeStyle: 'medium' }}
                  />{' '}
                  ({formatStorage(order.backup.size)})
                </span>
              ) : (
                <span className="text-red-500">
                  {t('summaryFieldSourceBackupNone')}
                </span>
              )}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
const NameDetails = ({ order }: ForkSummaryProps) => {
  const { t } = useTranslation('pci-databases-analytics/services/new');
  return (
    <div className="flex items-center gap-2">
      <b>{t('summaryFieldNameLabel')}</b>
      <span>{order.name}</span>
      <Popover>
        <PopoverTrigger>
          <HelpCircle className="size-4" />
        </PopoverTrigger>
        <PopoverContent>
          <p>{t('summaryFieldNameInfo')}</p>
        </PopoverContent>
      </Popover>
    </div>
  );
};
const EngineDetails = ({ order }: ForkSummaryProps) => {
  const { t } = useTranslation('pci-databases-analytics/services/new');
  return (
    <div className="flex flex-col gap-2">
      <div className="">
        <b className="mr-2">{t('summaryFieldEngineLabel')}</b>
        {order.engine && (
          <>
            <span>
              {humanizeEngine(order.engine.name as database.EngineEnum)}
            </span>
            <EngineIcon
              engine={order.engine.name as database.EngineEnum}
              category={order.engine.category}
              iconSize={10}
              className="ml-2 inline-flex w-fit"
            />
          </>
        )}
      </div>
      <div className="flex items-start pl-4 gap-2">
        <Hash className="size-4" />
        {order.version?.name ? (
          <span>
            {t('summaryFieldEngineVersion', { version: order.version?.name })}
          </span>
        ) : (
          <Skeleton className="h-4 w-16" />
        )}
      </div>
    </div>
  );
};
const PlanDetails = ({ order, onSectionClicked }: ForkSummaryProps) => {
  const { t } = useTranslation('pci-databases-analytics/services/new');
  return (
    <div className="flex items-center gap-2">
      <Button
        data-testid="plan-section-button"
        type="button"
        onClick={() => onSectionClicked('plan')}
        className="p-0 bg-transparent h-auto  hover:bg-transparent font-bold text-primary underline-offset-4 hover:underline"
      >
        {t('summaryFieldPlanLabel')}
      </Button>
      {order.plan ? (
        <span className="capitalize">{order.plan.name}</span>
      ) : (
        <Skeleton className="h-4 w-20" />
      )}
    </div>
  );
};
const RegionDetails = ({ order, onSectionClicked }: ForkSummaryProps) => {
  const { t } = useTranslation('pci-databases-analytics/services/new');
  const { t: tRegions } = useTranslation('regions');
  return (
    <div className="flex items-center gap-2">
      <Button
        data-testid="region-section-button"
        type="button"
        onClick={() => onSectionClicked('region')}
        className="p-0 bg-transparent h-auto  hover:bg-transparent font-bold text-primary underline-offset-4 hover:underline"
      >
        {t('summaryFieldRegionLabel')}
      </Button>
      {order.region ? (
        <span>
          {tRegions(`region_${order.region.name}_micro`, {
            micro: order.region.name,
          })}
        </span>
      ) : (
        <Skeleton className="h-4 w-20" />
      )}
    </div>
  );
};
const FlavorDetails = ({ order, onSectionClicked }: ForkSummaryProps) => {
  const { t } = useTranslation('pci-databases-analytics/services/new');
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Button
          data-testid="flavor-section-button"
          type="button"
          onClick={() => onSectionClicked('flavor')}
          className="p-0 bg-transparent h-auto  hover:bg-transparent font-bold text-primary underline-offset-4 hover:underline"
        >
          {t('summaryFieldFlavorLabel')}
        </Button>
        {order.flavor ? (
          <span className="capitalize">{order.flavor.name}</span>
        ) : (
          <Skeleton className="h-4 w-20" />
        )}
      </div>
      {(order.flavor?.vcores > 0 || order.flavor?.ram.value > 0) && (
        <div>
          {order.flavor.vcores > 0 && (
            <div className="flex items-start pl-4 gap-2">
              <Cpu className="size-4" />
              <span>
                {t('summaryFieldFlavorCores', { count: order.flavor.vcores })}
              </span>
            </div>
          )}
          {order.flavor.ram.value > 0 && (
            <div className="flex items-start pl-4 gap-2">
              <MemoryStick className="size-4" />
              <span>
                {t('summaryFieldFlavorMemory', {
                  memory: formatStorage(order.flavor.ram),
                })}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
const ClusterDetails = ({ order, onSectionClicked }: ForkSummaryProps) => {
  const { t } = useTranslation('pci-databases-analytics/services/new');
  const totalStorage = order.flavor?.storage
    ? addStorage(order.flavor.storage.minimum, {
        value: order.additionalStorage,
        unit: 'GB',
      })
    : { unit: 'GB', value: 0 };
  return (
    <div className="flex items-start flex-col gap-2">
      <Button
        data-testid="cluster-section-button"
        type="button"
        onClick={() => onSectionClicked('cluster')}
        className="p-0 bg-transparent h-auto  hover:bg-transparent font-bold text-primary underline-offset-4 hover:underline"
      >
        {t('summaryFieldClusterLabel')}
      </Button>
      <div>
        <div className="flex items-start pl-4 gap-2">
          <Boxes className="size-4" />
          <span>{t('summaryFieldClusterNodes', { count: order.nodes })}</span>
        </div>
        {order.flavor?.storage && (
          <div className="flex items-start pl-4 gap-2">
            <HardDrive className="size-4" />
            {order.additionalStorage > 0 ? (
              <span>
                {t('summaryFieldClusterStorageExtra', {
                  storage: formatStorage(totalStorage),
                  includedStorage: formatStorage(order.flavor.storage.minimum),
                })}
              </span>
            ) : (
              <span>
                {t('summaryFieldClusterStorage', {
                  storage: formatStorage(order.flavor.storage.minimum),
                })}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
const NetworkrDetails = ({ order, onSectionClicked }: ForkSummaryProps) => {
  const { t } = useTranslation('pci-databases-analytics/services/new');
  return (
    <div className="flex items-start flex-col gap-2">
      <div className="divide-x-[0.5rem] divide-transparent">
        <Button
          data-testid="network-section-button"
          type="button"
          onClick={() => onSectionClicked('options')}
          className="p-0 bg-transparent h-auto  hover:bg-transparent font-bold text-primary underline-offset-4 hover:underline"
        >
          {t('summaryFieldNetworkLabel')}
        </Button>
        <span>{t(`summaryFieldNetwork-${order.network.type}`)}</span>
      </div>
      {order.network.type === database.NetworkTypeEnum.private && (
        <div>
          <div className="flex items-start pl-4 gap-2 flex-wrap">
            <Cloud className="size-4" />
            <span>{t('summaryFieldNetworkNetwork')}</span>
            {order.network.network ? (
              <span>{order.network.network.name}</span>
            ) : (
              <span className="text-red-500">
                {t('summaryFieldNetworNone')}
              </span>
            )}
          </div>
          <div className="flex items-start pl-4 gap-2">
            <Cloudy className="size-4" />
            <span>{t('summaryFieldNetworSubnet')}</span>
            {order.network.subnet ? (
              <span>{order.network.subnet.cidr}</span>
            ) : (
              <span className="text-red-500">
                {t('summaryFieldNetworNone')}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
const IpsDetails = ({ order, onSectionClicked }: ForkSummaryProps) => {
  const { t } = useTranslation('pci-databases-analytics/services/new');
  return (
    <div className="flex items-center gap-2">
      <Button
        data-testid="ips-section-button"
        type="button"
        onClick={() => onSectionClicked('options')}
        className="p-0 bg-transparent h-auto  hover:bg-transparent font-bold text-primary underline-offset-4 hover:underline"
      >
        {t('summaryFieldIpsLabel')}
      </Button>
      <span>
        {t(`summaryFieldIps`, {
          count: order.ipRestrictions.length,
          context: `${order.ipRestrictions.length}`,
        })}
      </span>
    </div>
  );
};

const ForkSummary = ({ order, onSectionClicked }: ForkSummaryProps) => {
  return (
    <div className="grid grid-cols-1 gap-2">
      <NameDetails order={order} />
      <SourceDetails order={order} onSectionClicked={onSectionClicked} />
      <EngineDetails order={order} onSectionClicked={onSectionClicked} />
      <PlanDetails order={order} onSectionClicked={onSectionClicked} />
      <RegionDetails order={order} onSectionClicked={onSectionClicked} />
      <FlavorDetails order={order} onSectionClicked={onSectionClicked} />
      <ClusterDetails order={order} onSectionClicked={onSectionClicked} />
      <NetworkrDetails order={order} onSectionClicked={onSectionClicked} />
      <IpsDetails order={order} onSectionClicked={onSectionClicked} />
    </div>
  );
};

export default ForkSummary;
