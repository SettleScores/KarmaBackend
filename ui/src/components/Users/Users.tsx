import { useContext, useMemo, useState } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_ColumnFiltersState,
  type MRT_PaginationState,
  type MRT_SortingState,
} from 'material-react-table';
import { IconButton, Tooltip } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
  QueryClient,
  QueryClientProvider,
  keepPreviousData,
  useQuery,
} from '@tanstack/react-query'; //note: this is TanStack React Query V5
import { Button } from "@mui/material"
import { getUsers, sendPushForAll } from '../../api/client';
import { AuthContext } from '../../state/authContext';

export type UserApiResponse = {
    data: Array<User>;

    cunt: number;
};

type User = {
    id: number;
    fullName: string;
    email: string;
    gender: string;
    username: string;
    password: string;
    rankId: number;
    createdAt: string;
    updatedAt: string;
};

const Example = () => {
    const authToken = useContext (AuthContext) as string;

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
        ],
        [],
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
  
    return <MaterialReactTable table={table} />;
  };
  
  const queryClient = new QueryClient();

  const SendPushForAllButt = () => {
    const authToken = useContext (AuthContext) as string;
    return <Button onClick={()=>{ sendPushForAll(authToken, 'KarmaApp', 'Are you ready to complete your first task?! qqq') }}>Send Push For All</Button>
  };
  
  const ExampleWithReactQueryProvider = () => (
    //App.tsx or AppProviders file. Don't just wrap this component with QueryClientProvider! Wrap your whole App!
    <QueryClientProvider client={queryClient}>
      <Example />
      <SendPushForAllButt />
    </QueryClientProvider>
  );
  
  export default ExampleWithReactQueryProvider;