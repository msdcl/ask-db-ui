import { useState } from 'react';
import PropTypes from 'prop-types';
import { Check, X } from 'lucide-react';

export function TableDescriptionEditor({ initialDescription, onSave, onCancel }) {
  const [description, setDescription] = useState(initialDescription);

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="input-field flex-1"
        placeholder="Enter table description..."
        autoFocus
        onKeyDown={(e) => {
          if (e.key === 'Enter') onSave(description);
          if (e.key === 'Escape') onCancel();
        }}
      />
      <button
        onClick={() => onSave(description)}
        className="btn-primary btn-sm px-3"
        aria-label="Save description"
      >
        <Check className="w-4 h-4" />
      </button>
      <button
        onClick={onCancel}
        className="btn-secondary btn-sm px-3"
        aria-label="Cancel editing"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

TableDescriptionEditor.propTypes = {
  initialDescription: PropTypes.string,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

TableDescriptionEditor.defaultProps = {
  initialDescription: '',
};

export function ColumnDescriptionEditor({ initialDescription, onSave, onCancel }) {
  const [description, setDescription] = useState(initialDescription);

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="input-field text-sm py-1.5 px-3 flex-1"
        placeholder="Enter description..."
        autoFocus
        onKeyDown={(e) => {
          if (e.key === 'Enter') onSave(description);
          if (e.key === 'Escape') onCancel();
        }}
      />
      <button
        onClick={() => onSave(description)}
        className="btn-success btn-sm px-2 py-1"
        aria-label="Save description"
      >
        <Check className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={onCancel}
        className="btn-secondary btn-sm px-2 py-1"
        aria-label="Cancel editing"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

ColumnDescriptionEditor.propTypes = {
  initialDescription: PropTypes.string,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

ColumnDescriptionEditor.defaultProps = {
  initialDescription: '',
};
