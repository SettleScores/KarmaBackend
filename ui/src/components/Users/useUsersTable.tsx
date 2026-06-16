import { useCallback, useContext, useMemo, useState } from 'react';
import {
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_ColumnFiltersState,
  type MRT_PaginationState,
  type MRT_SortingState,
} from 'material-react-table';
import { Button, Stack, Typography } from '@mui/material';

import { AuthContext } from '../../state/authContext';
import { Task, TaskStatus, User } from '../../api/types';
import { STATUS_LABEL } from '../../constants/status';
import { StatusChip } from '../ui';
import { Mono, MemberCell, SoftTag, RankBadge, formatDate } from './cells';
import { useTasks, useUsers, useValidateUserTaskStatus } from './queries';

export type DeedView = 'all' | 'pending' | 'active';

const DETAIL_COLUMNS = ['email', 'gender', 'username', 'rankId', 'createdAt', 'updatedAt'];

export function useUsersTable() {
  const authToken = useContext(AuthContext) as string;

  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({ pageIndex: 0, pageSize: 10 });

  const [open, setOpen] = useState(false);
  const [activeTask, setActiveTask] = useState<(Task & TaskStatus) | null>(null);

  const [view, setView] = useState<DeedView>('all');
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({});

  const queryKey = ['users'];

  const {
    data: { data = [], count } = {},
    isError,
    isRefetching,
    isLoading,
    refetch,
  } = useUsers(authToken);

  const tasksData = useTasks(authToken);

  const validateTaskStatus = useValidateUserTaskStatus(
    authToken,
    queryKey,
    () => setOpen(false),
    (err) => {
      setOpen(false);
      alert(err);
    },
  );

  const columns = useMemo<MRT_ColumnDef<User>[]>(
    () => [
      { accessorKey: 'id', header: 'ID', size: 84, Cell: ({ renderedCellValue }) => <Mono>{renderedCellValue}</Mono> },
      { accessorKey: 'fullName', header: 'Member', size: 240, Cell: ({ row }) => <MemberCell user={row.original} /> },
      {
        accessorKey: 'email',
        header: 'Email',
        size: 230,
        Cell: ({ renderedCellValue }) => (
          <Typography variant="body2" color="text.secondary">
            {renderedCellValue || '—'}
          </Typography>
        ),
      },
      { accessorKey: 'gender', header: 'Gender', size: 116, Cell: ({ cell }) => <SoftTag value={cell.getValue<string>()} /> },
      { accessorKey: 'username', header: 'Username', size: 156, Cell: ({ renderedCellValue }) => <Mono>{renderedCellValue}</Mono> },
      { accessorKey: 'rankId', header: 'Rank', size: 96, Cell: ({ cell }) => <RankBadge value={cell.getValue<number>()} /> },
      { accessorKey: 'createdAt', header: 'Created', size: 140, Cell: ({ cell }) => <Mono>{formatDate(cell.getValue<string>())}</Mono> },
      { accessorKey: 'updatedAt', header: 'Updated', size: 140, Cell: ({ cell }) => <Mono>{formatDate(cell.getValue<string>())}</Mono> },
      ...(tasksData.data || []).map(
        (task): MRT_ColumnDef<User> => ({
          id: `task-${task.id}`,
          header: task.description,
          size: 190,
          accessorFn: (user) => STATUS_LABEL[user.tasks.find((t) => t.taskId === task.id)?.status ?? 'Unknown'],
          Cell: ({ row }) => {
            const taskStatus = row.original.tasks.find((t) => t.taskId === task.id);
            const raw = taskStatus?.status ?? 'Unknown';
            if (raw === 'Pending' && taskStatus) {
              return (
                <Stack direction="row" alignItems="center" spacing={0.75}>
                  <StatusChip status="Pending" size="sm" />
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => {
                      setActiveTask({ ...task, ...taskStatus });
                      setOpen(true);
                    }}
                  >
                    Review
                  </Button>
                </Stack>
              );
            }
            return <StatusChip status={raw} size="sm" />;
          },
        }),
      ),
    ],
    [tasksData.data],
  );

  const displayedData = useMemo(() => {
    if (view === 'pending') return data.filter((u) => u.tasks.some((t) => t.status === 'Pending'));
    if (view === 'active') return data.filter((u) => u.tasks.some((t) => t.status === 'Working' || t.status === 'Pending'));
    return data;
  }, [data, view]);

  const applyView = useCallback(
    (next: DeedView) => {
      setView(next);
      if (next === 'all') {
        setColumnVisibility({});
        return;
      }
      const vis: Record<string, boolean> = {};
      DETAIL_COLUMNS.forEach((c) => (vis[c] = false));
      if (next === 'pending') {
        (tasksData.data || []).forEach((task) => {
          vis[`task-${task.id}`] = data.some((u) => u.tasks.some((t) => t.taskId === task.id && t.status === 'Pending'));
        });
      }
      setColumnVisibility(vis);
    },
    [data, tasksData.data],
  );

  const table = useMaterialReactTable({
    columns,
    data: displayedData,
    initialState: { showColumnFilters: false, density: 'comfortable' },
    enableStickyHeader: true,
    manualFiltering: false,
    manualPagination: false,
    manualSorting: false,
    positionGlobalFilter: 'left',
    muiToolbarAlertBannerProps: isError ? { color: 'error', children: 'Error loading data' } : undefined,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnFilters,
      columnVisibility,
      globalFilter,
      isLoading,
      pagination,
      showAlertBanner: isError,
      showProgressBars: isRefetching,
      sorting,
    },
    muiSearchTextFieldProps: { placeholder: 'Search members…', variant: 'outlined', size: 'small', sx: { minWidth: { xs: 180, sm: 280 } } },
    muiTablePaperProps: { sx: { borderRadius: 0, boxShadow: 'none', backgroundColor: 'transparent' } },
    muiTopToolbarProps: { sx: { backgroundColor: 'transparent', px: { xs: 1, md: 1.5 } } },
    muiBottomToolbarProps: { sx: { backgroundColor: 'transparent', '& .MuiTablePagination-root': { color: 'text.secondary' } } },
    muiTableContainerProps: { sx: { maxHeight: 'clamp(420px, 60vh, 760px)' } },
    muiTableHeadCellProps: {
      sx: {
        backgroundColor: 'surface.alt',
        color: 'text.secondary',
        fontWeight: 800,
        fontSize: '0.72rem',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        borderColor: 'divider',
        py: 1.4,
      },
    },
    muiTableBodyCellProps: { sx: { fontSize: '0.875rem', color: 'text.primary', borderColor: 'divider', py: 1.1 } },
    muiTableBodyRowProps: { sx: { '&:hover td': { backgroundColor: 'action.hover' } } },
    muiPaginationProps: { rowsPerPageOptions: [10, 25, 50, 100], showFirstButton: true, showLastButton: true },
    muiLinearProgressProps: { color: 'primary' },
  });

  const pending = useMemo(
    () => data.reduce((acc, u) => acc + u.tasks.filter((t) => t.status === 'Pending').length, 0),
    [data],
  );

  return {
    table,
    refetch,
    isRefetching,
    isLoading,
    isError,
    view,
    applyView,
    stats: { members: count ?? data.length, tasks: tasksData.data?.length ?? 0, pending },
    dialog: {
      open,
      task: activeTask,
      accessToken: authToken,
      handleClose: () => setOpen(false),
      handleValidate: (approve: boolean, rejectReason?: string) => {
        if (!activeTask) return;
        validateTaskStatus.mutate({ taskStatusId: activeTask.id, approve, rejectReason, userId: activeTask.userId });
      },
    },
  };
}
