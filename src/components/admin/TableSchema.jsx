import { useState } from 'react';
import PropTypes from 'prop-types';
import { Edit3, FileText } from 'lucide-react';
import { TableDescriptionEditor, ColumnDescriptionEditor } from './DescriptionEditor';

export default function TableSchema({
  schema,
  onUpdateTableDescription,
  onUpdateColumnDescription,
}) {
  const [editingTable, setEditingTable] = useState(false);
  const [editingColumn, setEditingColumn] = useState(null);

  const handleSaveTableDescription = (description) => {
    onUpdateTableDescription(description);
    setEditingTable(false);
  };

  const handleSaveColumnDescription = (columnName, description) => {
    onUpdateColumnDescription(columnName, description);
    setEditingColumn(null);
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-5 h-5 text-primary-500 flex-shrink-0" />
              <h2 className="text-lg font-semibold text-secondary-800 truncate">
                {schema.table_name}
              </h2>
            </div>
            {!editingTable && schema.table_description && (
              <p className="text-sm text-secondary-500 ml-7">{schema.table_description}</p>
            )}
          </div>
          <button
            onClick={() => setEditingTable(!editingTable)}
            className="btn-secondary btn-sm flex-shrink-0"
          >
            <Edit3 className="w-4 h-4" />
            {editingTable ? 'Cancel' : 'Edit Description'}
          </button>
        </div>

        {editingTable && (
          <div className="mt-4">
            <TableDescriptionEditor
              initialDescription={schema.table_description || ''}
              onSave={handleSaveTableDescription}
              onCancel={() => setEditingTable(false)}
            />
          </div>
        )}
      </div>

      <div className="card-body">
        <h3 className="text-sm font-semibold text-secondary-700 uppercase tracking-wider mb-4">
          Columns
        </h3>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Column Name</th>
                <th className="hidden sm:table-cell">Data Type</th>
                <th className="hidden md:table-cell">Nullable</th>
                <th>Description</th>
                <th className="w-12">Edit</th>
              </tr>
            </thead>
            <tbody>
              {schema.columns?.filter((col) => col.column_name).map((column, index) => (
                <tr key={column.column_name} className="animate-fade-in" style={{ animationDelay: `${index * 30}ms` }}>
                  <td>
                    <div>
                      <span className="font-medium text-secondary-800">{column.column_name}</span>
                      <div className="sm:hidden text-xs text-secondary-500 mt-0.5">
                        {column.data_type}
                      </div>
                    </div>
                  </td>
                  <td className="hidden sm:table-cell">
                    <span className="code-inline">{column.data_type}</span>
                  </td>
                  <td className="hidden md:table-cell">
                    <span
                      className={`badge ${
                        column.is_nullable ? 'badge-success' : 'badge-warning'
                      }`}
                    >
                      {column.is_nullable ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td>
                    {editingColumn === column.column_name ? (
                      <ColumnDescriptionEditor
                        initialDescription={column.column_description || ''}
                        onSave={(desc) =>
                          handleSaveColumnDescription(column.column_name, desc)
                        }
                        onCancel={() => setEditingColumn(null)}
                      />
                    ) : (
                      <span className="text-secondary-600 text-sm">
                        {column.column_description || (
                          <span className="text-secondary-400 italic">No description</span>
                        )}
                      </span>
                    )}
                  </td>
                  <td>
                    <button
                      onClick={() =>
                        setEditingColumn(
                          editingColumn === column.column_name ? null : column.column_name
                        )
                      }
                      className="btn-icon p-2"
                      aria-label={`Edit ${column.column_name} description`}
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

TableSchema.propTypes = {
  schema: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    table_name: PropTypes.string.isRequired,
    table_description: PropTypes.string,
    columns: PropTypes.arrayOf(
      PropTypes.shape({
        column_name: PropTypes.string,
        data_type: PropTypes.string,
        is_nullable: PropTypes.bool,
        column_description: PropTypes.string,
      })
    ),
  }).isRequired,
  onUpdateTableDescription: PropTypes.func.isRequired,
  onUpdateColumnDescription: PropTypes.func.isRequired,
};
