import { useRequest } from 'src/composes/request.compose';

export function useTaskFindAll() {
  const { data, loading, request } = useRequest({
    method: 'get',
    url: '/api/tasks',
    notifyOnError: true,
    initLoading: true,
    initData: { data: [] },
  });

  async function findAllTask(params) {
    await request({
      params,
    });
  }

  return { data, loading, findAllTask };
}
