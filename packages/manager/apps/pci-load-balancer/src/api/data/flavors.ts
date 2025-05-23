import { v6 } from '@ovh-ux/manager-core-api';
import { TFlavor } from '@/api/data/load-balancer';

export const getFlavors = async (
  projectId: string,
  regionName: string,
): Promise<TFlavor[]> => {
  const { data } = await v6.get<TFlavor[]>(
    `/cloud/project/${projectId}/region/${regionName}/loadbalancing/flavor`,
  );

  return data;
};
