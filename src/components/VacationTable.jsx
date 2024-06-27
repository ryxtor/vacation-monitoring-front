import { useState } from 'react';
import { useQuery } from 'react-query';
import axios from '../api/axios';
import { Table, TableBody, TableCell, TableHead, TableRow, TablePagination, TextField, Box, Button, IconButton, TableSortLabel, FormControl, Select, MenuItem, InputLabel, Paper, Toolbar } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VacationForm from './VacationForm';
import { toast } from 'react-toastify';

const fetchVacations = async ({ queryKey }) => {
  // eslint-disable-next-line no-unused-vars
  const [ _key, { page, query, order }] = queryKey;
  const { data } = await axios.get('api/v1/vacations', {
    params: { page, per_page: 10, q: { ...query }, order },
  });
  return data;
};

const VacationTable = () => {
  const [page, setPage] = useState(0);
  const [query, setQuery] = useState({});
  const [order, setOrder] = useState({ field: 'created_at', direction: 'desc' });
  const [open, setOpen] = useState(false);
  const [selectedVacation, setSelectedVacation] = useState(null);

  const { data, isLoading, isError, refetch } = useQuery(['vacations', { page: page + 1, query, order }], fetchVacations, {
    keepPreviousData: true,
  });

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    refetch();
  };

  const handleFilterChange = (e) => {
    setQuery({ ...query, [e.target.name]: e.target.value });
    refetch();
  };

  const handleSort = (field) => {
    const isAsc = order.field === field && order.direction === 'asc';
    setOrder({ field, direction: isAsc ? 'desc' : 'asc' });
    refetch();
  };

  const handleEdit = (vacation) => {
    setSelectedVacation(vacation);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`api/v1/vacations/${id}`);
      toast.success('Vacation deleted');
      refetch();
    } catch (error) {
      toast.error('Failed to delete vacation');
      console.error('Failed to delete vacation', error);
    }
  };

  const handleAdd = () => {
    setSelectedVacation(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading data</div>;

  return (
    <Box>
        <Toolbar>
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAdd}>
            Add Vacation
          </Button>
        </Toolbar>
      <Paper elevation={3} sx={{ mt: 2, p: 2 }}>
        <Box sx={{ display: 'flex', mb: 2 }}>
          <FormControl fullWidth sx={{ mr: 2 }}>
            <TextField
              label="Collaborator"
              name="collaborator_name_cont"
              variant="outlined"
              onChange={handleFilterChange}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mr: 2 }}>
            <InputLabel>Type</InputLabel>
            <Select
              name="vacation_type_eq"
              value={query.vacation_type_eq || ''}
              onChange={handleFilterChange}
              label="Type"
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="0">Incapacidad</MenuItem>
              <MenuItem value="1">Vacaciones</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              name="status_eq"
              value={query.status_eq || ''}
              onChange={handleFilterChange}
              label="Status"
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="0">Pendiente</MenuItem>
              <MenuItem value="1">Aprobado</MenuItem>
              <MenuItem value="2">Rechazado</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                  Collaborator
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={order.field === 'vacation_days'}
                  direction={order.direction}
                  onClick={() => handleSort('vacation_days')}
                >
                  Vacation Days
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={order.field === 'start_date'}
                  direction={order.direction}
                  onClick={() => handleSort('start_date')}
                >
                  Start Date
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={order.field === 'end_date'}
                  direction={order.direction}
                  onClick={() => handleSort('end_date')}
                >
                  End Date
                </TableSortLabel>
              </TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.vacations.map((vacation) => (
              <TableRow key={vacation.id}>
                <TableCell>{vacation.collaborator.name}</TableCell>
                <TableCell>{vacation.vacation_days}</TableCell>
                <TableCell>{vacation.start_date}</TableCell>
                <TableCell>{vacation.end_date}</TableCell>
                <TableCell>{vacation.vacation_type}</TableCell>
                <TableCell>{vacation.status}</TableCell>
                <TableCell>{vacation.reason}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleEdit(vacation)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => handleDelete(vacation.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={data.meta.total_count}
          page={page}
          onPageChange={handlePageChange}
          rowsPerPage={10}
          rowsPerPageOptions={[10]}
        />
      </Paper>
      <VacationForm open={open} handleClose={handleClose} vacation={selectedVacation} fetchVacations={refetch} />
    </Box>
  );
};

export default VacationTable;
