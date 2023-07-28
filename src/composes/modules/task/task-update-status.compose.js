import { useRequest } from 'src/composes/request.compose';
import { isAllChildrenDone } from 'src/helpers/modules/task.helper.js';
import { TaskUnfinishedException } from 'src/exceptions/modules/task/task-unfinished.exception';

export function useTaskUpdateStatus(options = {}) {
  const ignoreUnfinished = options.ignoreUnfinished ?? false;

  const { url, loading, request } = useRequest({
    method: 'patch',
    url: '/api/tasks',
    notifyOnError: true,
  });

  async function updateTaskStatus(task, value) {
    if (!ignoreUnfinished && value === 'done' && !isAllChildrenDone(task)) {
      return [null, new TaskUnfinishedException()];
    }

    url.value = `/api/tasks/${task.id}/status`;

    return await request({
      status: value,
    });
  }

  return { loading, updateTaskStatus };
}
