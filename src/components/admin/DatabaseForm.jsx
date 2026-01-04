import { useState } from 'react';
import PropTypes from 'prop-types';
import { Server, X } from 'lucide-react';
import { DEFAULT_DATABASE_PORT } from '../../config/constants';
import { validateDatabaseConfig, getFirstError } from '../../utils/validation';
import toast from 'react-hot-toast';

const initialFormState = {
  databaseName: '',
  host: '',
  port: DEFAULT_DATABASE_PORT,
  username: '',
  password: '',
  description: '',
};

export default function DatabaseForm({ onSubmit, onCancel, isLoading }) {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validation = validateDatabaseConfig(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      toast.error(getFirstError(validation.errors));
      return;
    }

    onSubmit(formData);
  };

  return (
    <div className="card">
      <div className="card-header flex items-center justify-between">
        <h2 className="section-title">
          <Server className="section-title-icon" />
          Add New Database
        </h2>
        <button onClick={onCancel} className="btn-ghost p-1.5 rounded-lg">
          <X className="w-4 h-4" />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="card-body">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          <div className="space-y-2">
            <label className="input-label">Database Name</label>
            <input
              type="text"
              value={formData.databaseName}
              onChange={(e) => handleChange('databaseName', e.target.value)}
              className={`input-field ${errors.databaseName ? 'input-field-error' : ''}`}
              placeholder="my_database"
            />
            {errors.databaseName && <p className="input-error">{errors.databaseName}</p>}
          </div>

          <div className="space-y-2">
            <label className="input-label">Host</label>
            <input
              type="text"
              value={formData.host}
              onChange={(e) => handleChange('host', e.target.value)}
              className={`input-field ${errors.host ? 'input-field-error' : ''}`}
              placeholder="localhost or IP address"
            />
            {errors.host && <p className="input-error">{errors.host}</p>}
          </div>

          <div className="space-y-2">
            <label className="input-label">Port</label>
            <input
              type="number"
              value={formData.port}
              onChange={(e) => handleChange('port', parseInt(e.target.value, 10) || '')}
              className={`input-field ${errors.port ? 'input-field-error' : ''}`}
              min="1"
              max="65535"
              placeholder="5432"
            />
            {errors.port && <p className="input-error">{errors.port}</p>}
          </div>

          <div className="space-y-2">
            <label className="input-label">Username</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => handleChange('username', e.target.value)}
              className={`input-field ${errors.username ? 'input-field-error' : ''}`}
              placeholder="postgres"
            />
            {errors.username && <p className="input-error">{errors.username}</p>}
          </div>

          <div className="space-y-2">
            <label className="input-label">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              className={`input-field ${errors.password ? 'input-field-error' : ''}`}
              placeholder="Enter password"
            />
            {errors.password && <p className="input-error">{errors.password}</p>}
          </div>

          <div className="space-y-2">
            <label className="input-label">
              Description <span className="text-secondary-400 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="input-field"
              placeholder="Production database"
            />
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-3 mt-6 pt-4 border-t border-secondary-100">
          <button type="button" onClick={onCancel} className="btn-secondary flex-1 sm:flex-none">
            Cancel
          </button>
          <button type="submit" disabled={isLoading} className="btn-primary flex-1 sm:flex-none">
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="loading-spinner w-4 h-4" />
                Adding...
              </span>
            ) : (
              'Add Database'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

DatabaseForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

DatabaseForm.defaultProps = {
  isLoading: false,
};
