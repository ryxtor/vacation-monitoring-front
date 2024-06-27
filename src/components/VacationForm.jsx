import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from '../api/axios';
import { TextField, Button, Box, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { toast } from 'react-toastify';

const VacationForm = ({ open, handleClose, vacation, fetchVacations }) => {
  const [formData, setFormData] = useState({
    collaborator_id: '',
    start_date: '',
    end_date: '',
    vacation_type: '',
    status: '',
    reason: ''
  });
  const [collaborators, setCollaborators] = useState([]);

  const vacationTypes = {
    incapacidad: 'Incapacidad',
    vacaciones: 'Vacaciones'
  };

  const statusOptions = {
    pendiente: 'Pendiente',
    aprobado: 'Aprobado',
    rechazado: 'Rechazado'
  };

  useEffect(() => {
    setFormData(vacation || {
      collaborator_id: '',
      start_date: '',
      end_date: '',
      vacation_type: '',
      status: '',
      reason: ''
    });
  }, [vacation]);

  useEffect(() => {
    const fetchCollaborators = async () => {
      try {
        const response = await axios.get('api/v1/collaborators');
        setCollaborators(response.data);
      } catch (error) {
        console.error('Failed to fetch collaborators', error);
        toast.error('Failed to fetch collaborators');
      }
    };
    fetchCollaborators();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (vacation) {
        await axios.put(`api/v1/vacations/${vacation.id}`, { vacation: formData });
        toast.success('Vacation updated successfully');
      } else {
        await axios.post('api/v1/vacations', { vacation: formData });
        toast.success('Vacation added successfully');
      }
      fetchVacations();
      handleClose();
    } catch (error) {
      console.error('Failed to save vacation', error);
      toast.error('Failed to save vacation');
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{vacation ? 'Edit Vacation' : 'Add Vacation'}</DialogTitle>
      {/* add padding top */}
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ pt: 2 }}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Collaborator</InputLabel>
            <Select
              label="Collaborator"
              name="collaborator_id"
              value={formData.collaborator_id}
              onChange={handleChange}
            >
              {collaborators.map((collaborator) => (
                <MenuItem key={collaborator.id} value={collaborator.id}>
                  {collaborator.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Start Date"
            name="start_date"
            type="date"
            variant="outlined"
            fullWidth
            value={formData.start_date}
            onChange={handleChange}
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="End Date"
            name="end_date"
            type="date"
            variant="outlined"
            fullWidth
            value={formData.end_date}
            onChange={handleChange}
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Type</InputLabel>
            <Select
              label="Type"
              name="vacation_type"
              value={formData.vacation_type}
              onChange={handleChange}
            >
              {Object.entries(vacationTypes).map(([key, value]) => (
                <MenuItem key={key} value={key}>
                  {value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              {Object.entries(statusOptions).map(([key, value]) => (
                <MenuItem key={key} value={key}>
                  {value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Reason"
            name="reason"
            variant="outlined"
            fullWidth
            value={formData.reason}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              {vacation ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

VacationForm.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  vacation: PropTypes.shape({
    id: PropTypes.number,
    collaborator_id: PropTypes.number,
    start_date: PropTypes.string,
    end_date: PropTypes.string,
    vacation_type: PropTypes.string,
    status: PropTypes.string,
    reason: PropTypes.string,
  }),
  fetchVacations: PropTypes.func.isRequired,
};

export default VacationForm;
