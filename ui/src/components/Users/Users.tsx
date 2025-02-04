import { ReactNode, useContext, useMemo, useState } from 'react';
import {
  MRT_Row,
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_ColumnFiltersState,
  type MRT_PaginationState,
  type MRT_SortingState,
} from 'material-react-table';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
  QueryClient,
  QueryClientProvider,
  keepPreviousData,
  useQuery,
} from '@tanstack/react-query'; //note: this is TanStack React Query V5
import { Button, TextField, Stack } from "@mui/material"
import { getAllTasks, getUsers, sendPushForAll } from '../../api/client';
import { AuthContext } from '../../state/authContext';
import { Task, User, UserApiResponse } from '../../api/types';
import ApproveDialog from '../ApproveDialog/ApproveDialog';





const Example = () => {
  const authToken = useContext(AuthContext) as string;

  //manage our own state for stuff we want to pass to the API
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
    [],
  );
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [open, setOpen] = useState(false);
  const [fileName, setFileName] = useState('');
  const [description, setDescription] = useState('');

  //consider storing this code in a custom hook (i.e useFetchUsers)
  const {
    data: { data = [], cunt } = {}, //your data and api response will probably be different
    isError,
    isRefetching,
    isLoading,
    refetch,
  } = useQuery<UserApiResponse>({
    queryKey: [
      'users',
      columnFilters, //refetch when columnFilters changes
      globalFilter, //refetch when globalFilter changes
      pagination.pageIndex, //refetch when pagination.pageIndex changes
      pagination.pageSize, //refetch when pagination.pageSize changes
      sorting, //refetch when sorting changes
    ],
    queryFn: async () => {
      return getUsers(authToken, columnFilters, globalFilter, sorting, pagination);
    },
    placeholderData: keepPreviousData, //don't go to 0 rows when refetching or paginating to next page
  });

  const tasksData = useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: async () => getAllTasks(authToken)
  });



  const columns = useMemo<MRT_ColumnDef<User>[]>(
    () => [
      {
        accessorKey: 'id', //access nested data with dot notation
        header: 'Id',
        size: 150,
      },
      {
        accessorKey: 'fullName',
        header: 'Full Name',
        size: 150,
      },
      {
        accessorKey: 'email',
        header: 'Email',
        size: 150,
      },
      {
        accessorKey: 'gender',
        header: 'Gender',
        size: 150,
      },
      {
        accessorKey: 'username',
        header: 'Username',
        size: 150,
      },
      {
        accessorKey: 'password',
        header: 'Password',
        size: 150,
      },
      {
        accessorKey: 'rankId',
        header: 'Rank Id',
        size: 150,
      },
      {
        accessorKey: 'createdAt',
        header: 'Created At',
        size: 150,
      },
      {
        accessorKey: 'updatedAt',
        header: 'Updated At',
        size: 150,


      },
      ...(tasksData.data || []).map(tx => ({
        accessorFn: (user: User) => {
          const task = user.tasks.find(t => t.taskId === tx.id);
          if (!task) return 'Not started';

          if (task.status === 'Unknown') return 'Not started';
          if (task.status === 'Done') return 'Completed';
          if (task.status === 'Working') return 'In progress';
          return 'Pending';
        },
        Cell: ({ row, renderedCellValue }: { row: MRT_Row<User>; renderedCellValue: ReactNode }) => {
          const task = row.original.tasks.find(t => t.taskId === tx.id);
          if (task?.status !== 'Pending') return renderedCellValue;

          return <Stack direction="row" alignItems="center" spacing={1}>
            <Typography>{renderedCellValue}</Typography>
            <Button onClick={() => {
              setFileName(task.fileName);
              setDescription(tx.description);
              setOpen(true);
            }}>review</Button>
          </Stack>
        },
        header: tx.description,
        size: 200
      }))
    ],
    [tasksData.data, setFileName, setDescription, setOpen],
  );

  const table = useMaterialReactTable({
    columns,
    data,
    initialState: { showColumnFilters: false },
    manualFiltering: false, //turn off built-in client-side filtering
    manualPagination: false, //turn off built-in client-side pagination
    manualSorting: false, //turn off built-in client-side sorting
    muiToolbarAlertBannerProps: isError
      ? {
        color: 'error',
        children: 'Error loading data',
      }
      : undefined,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    renderTopToolbarCustomActions: () => (
      <Tooltip arrow title="Refresh Data">
        <IconButton onClick={() => refetch()}>
          <RefreshIcon />
        </IconButton>
      </Tooltip>
    ),
    rowCount: cunt ?? 0,
    state: {
      columnFilters,
      globalFilter,
      isLoading,
      pagination,
      showAlertBanner: isError,
      showProgressBars: isRefetching,
      sorting,
    },
  });

  return <>
    <MaterialReactTable table={table} />;
    <ApproveDialog open={open} handleClose={() => setOpen(false)} filename={fileName} taskDescription={description} accessToken={authToken} />
  </>
};

const queryClient = new QueryClient();

const SendPushForAllButt = () => {
  const authToken = useContext(AuthContext) as string;
  const [tokenText, setTokenText] = useState('');
  return <Stack spacing={2}>
    <TextField value={tokenText} onChange={(e) => setTokenText(e.target.value)} />
    <Button onClick={() => { sendPushForAll(authToken, 'KarmaApp', tokenText) }}>Send Push For All</Button>
  </Stack>
};

const ExampleWithReactQueryProvider = () => (
  //App.tsx or AppProviders file. Don't just wrap this component with QueryClientProvider! Wrap your whole App!
  <QueryClientProvider client={queryClient}>
    <Example />
    <SendPushForAllButt />
  </QueryClientProvider>
);

export default ExampleWithReactQueryProvider;