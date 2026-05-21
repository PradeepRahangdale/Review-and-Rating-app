import { useEffect, useState } from 'react';
import Modal from './Modal';
import { PinIcon, CalendarIcon } from './Icons';
import { createCompany } from '../services/api';

const initial = {
  name: '',
  location: '',
  city: '',
  foundedOn: '',
  logoColor: '#1a237e',
  logoText: '',
};

export default function AddCompanyModal({ open, onClose, onSuccess, defaultCity = '' }) {
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setForm({ ...initial, city: defaultCity });
      setError('');
    }
  }, [open, defaultCity]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => data.append(key, value));

      await createCompany(data);
      setForm({ ...initial, city: defaultCity });
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} title="Add Company" onClose={onClose}>
      <form className="figma-form" onSubmit={handleSubmit}>
        {error && <p className="form-error">{error}</p>}

        <label className="figma-field">
          <span>Company name</span>
          <input name="name" value={form.name} onChange={handleChange} placeholder="Enter..." required />
        </label>

        <label className="figma-field">
          <span>Location</span>
          <div className="figma-input-icon">
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Select Location"
              required
            />
            <PinIcon className="field-icon" />
          </div>
        </label>

        <label className="figma-field">
          <span>Founded on</span>
          <div className="figma-input-icon">
            <input
              type="date"
              name="foundedOn"
              value={form.foundedOn}
              onChange={handleChange}
              required
            />
            <CalendarIcon className="field-icon" />
          </div>
        </label>

        <label className="figma-field">
          <span>City</span>
          <input name="city" value={form.city} onChange={handleChange} placeholder="Enter..." required />
        </label>

        <button type="submit" className="btn btn-save" disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </button>
      </form>
    </Modal>
  );
}
