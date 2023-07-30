import { useRequest } from 'src/composes/request.compose';

export function useTaskFindOne() {
  const {
    data: task,
    request,
    url,
    loading,
    error,
  } = useRequest({
    method: 'get',
    url: '/api/tasks',
    initData: {},
  });

  async function findOneTask(id, params) {
    url.value = `/api/tasks/${id}`;

    return await request({
      params,
    });
  }

  return { loading, error, task, findOneTask };
}
