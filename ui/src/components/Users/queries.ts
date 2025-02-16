import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { MRT_ColumnFiltersState, MRT_PaginationState, MRT_SortingState } from 'material-react-table';
import { getUsers, getAllTasks, validateTask } from '../../api/client';
import { UserApiResponse, Task } from '../../api/types';
import { TaskStatus } from '../../api/types';

export const useTasks = (authToken: string) => useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: async () => getAllTasks(authToken)
});


export const useUsers = (queryKey: Array<unknown>, columnFilters: MRT_ColumnFiltersState, globalFilter: string, pagination: MRT_PaginationState, sorting: MRT_SortingState, authToken: string) => {
    return useQuery<UserApiResponse>({
        queryKey,
        queryFn: async () => {
            return getUsers(authToken, columnFilters, globalFilter, sorting, pagination);
        },
        placeholderData: keepPreviousData, //don't go to 0 rows when refetching or paginating to next page
    });
}

export const useValidateUserTaskStatus = (accessToken: string, queryKey: Array<unknown>, onSuccess: () => void, onError: (error: string) => void) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (props: { taskStatusId: number, approve: boolean, rejectReason?: string }) => {
            const result = await validateTask(accessToken, props.taskStatusId, props.approve, props.rejectReason)
            return result;
        },
        onSuccess: async ({ id, status }: { id: number, status: TaskStatus["status"] }) => {
            await queryClient.cancelQueries({ queryKey: queryKey });

            queryClient.setQueryData(queryKey, (oldUsers: UserApiResponse) => {
                const newUsers = { ...oldUsers };
                newUsers.data = newUsers.data.map(u => {
                    u.tasks = u.tasks.map(t => t.id === id ? { ...t, status: status } : t);
                    return { ...u };
                })
                return newUsers;
            });

            queryClient.invalidateQueries({ queryKey });

            onSuccess();
        },
        onError: (err) => onError(err.message)
    });
};