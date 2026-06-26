import { Button, IconButton, Stack, Tooltip } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { MaterialReactTable } from 'material-react-table';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import PendingActionsRoundedIcon from '@mui/icons-material/PendingActionsRounded';
import CampaignRoundedIcon from '@mui/icons-material/CampaignRounded';
import TableRowsRoundedIcon from '@mui/icons-material/TableRowsRounded';
import FilterAltOffRoundedIcon from '@mui/icons-material/FilterAltOffRounded';

import { DashboardLayout } from '../Layout/DashboardLayout';
import { Panel, Reveal, SpinningRefresh, StatCard } from '../ui';
import ApproveDialog from '../ApproveDialog/ApproveDialog';
import { Broadcast } from './Broadcast';
import { useUsersTable } from './useUsersTable';

const StatGrid = styled('div')(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(2.5),
  gridTemplateColumns: '1fr',
  [theme.breakpoints.up('sm')]: { gridTemplateColumns: 'repeat(3, 1fr)' },
}));

const Sections = styled(Stack)(({ theme }) => ({ gap: theme.spacing(3), [theme.breakpoints.down('sm')]: { gap: theme.spacing(2.5) } }));

const BroadcastButton = styled(Button)(({ theme }) => ({ [theme.breakpoints.down('sm')]: { display: 'none' } }));

function Dashboard() {
  const { palette } = useTheme();
  const { table, refetch, isRefetching, isLoading, stats, dialog, view, applyView } = useUsersTable();

  const scrollToBroadcast = () => document.getElementById('broadcast')?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const actions = (
    <>
      <Tooltip title="Refresh data" arrow>
        <IconButton onClick={() => refetch()} aria-label="Refresh data">
          <SpinningRefresh spinning={isRefetching} />
        </IconButton>
      </Tooltip>
      <BroadcastButton variant="contained" startIcon={<CampaignRoundedIcon />} onClick={scrollToBroadcast}>
        Broadcast
      </BroadcastButton>
    </>
  );

  const viewSubtitle =
    view === 'pending'
      ? 'Filtered to members with pending deeds'
      : view === 'active'
        ? 'Filtered to members with ongoing deeds'
        : 'Search, filter, and review submitted deeds';

  const clearFilter = view !== 'all' && (
    <Button size="small" variant="outlined" startIcon={<FilterAltOffRoundedIcon />} onClick={() => applyView('all')}>
      Clear filter
    </Button>
  );

  return (
    <DashboardLayout title="Members" subtitle="Review member deeds, confer rank, and keep everyone moving." actions={actions}>
      <Sections>
        <StatGrid>
          <Reveal delay={0.02}>
            <StatCard label="Members" value={stats.members.toLocaleString()} hint="show all" icon={<GroupsRoundedIcon />} accent={palette.brand.azure} gradientIcon loading={isLoading} onClick={() => applyView('all')} active={view === 'all'} />
          </Reveal>
          <Reveal delay={0.08}>
            <StatCard label="Active deeds" value={stats.tasks} hint="filter ongoing" icon={<AutoAwesomeRoundedIcon />} accent={palette.brand.cyanDark} loading={isLoading} onClick={() => applyView(view === 'active' ? 'all' : 'active')} active={view === 'active'} />
          </Reveal>
          <Reveal delay={0.14}>
            <StatCard label="Pending review" value={stats.pending} hint="filter pending" icon={<PendingActionsRoundedIcon />} accent={palette.status.Pending.dot} loading={isLoading} onClick={() => applyView(view === 'pending' ? 'all' : 'pending')} active={view === 'pending'} />
          </Reveal>
        </StatGrid>

        <Reveal delay={0.18}>
          <Panel title="Members directory" subtitle={viewSubtitle} icon={<TableRowsRoundedIcon />} padded={false} actions={clearFilter || undefined}>
            <MaterialReactTable table={table} />
          </Panel>
        </Reveal>

        <Reveal id="broadcast" delay={0.24}>
          <Broadcast />
        </Reveal>
      </Sections>

      <ApproveDialog {...dialog} />
    </DashboardLayout>
  );
}

export default Dashboard;
