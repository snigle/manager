import { useMemo } from 'react';
import { Datagrid, useDataGrid } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { paginateResults } from '@/api/data/consumption';
import NoDataMessage from './NoDataMessage.component';
import { TStorage } from '@/api/hook/useConsumption';
import { useArchiveStorageListColumns } from './useArchiveStorageListColumns';

type StorageListProps = {
  storages: TStorage[];
};

export default function ArchiveStorageList({
  storages,
}: Readonly<StorageListProps>) {
  const { t } = useTranslation('consumption/hourly-instance/archive-storage');
  const { pagination, setPagination } = useDataGrid();
  const columns = useArchiveStorageListColumns();

  const paginatedStorages = useMemo(() => {
    const sortedStorages = storages?.sort((a, b) =>
      a.region.localeCompare(b.region),
    );
    return paginateResults(sortedStorages || [], pagination);
  }, [storages, pagination, setPagination]);

  if (paginatedStorages.totalRows === 0) {
    return <NoDataMessage message={t('cpbc_no_consumption_data')} />;
  }

  return (
    <div className="my-3">
      <Datagrid
        columns={columns}
        items={paginatedStorages.rows}
        totalItems={paginatedStorages.totalRows}
        pagination={pagination}
        onPaginationChange={setPagination}
      />
    </div>
  );
}
