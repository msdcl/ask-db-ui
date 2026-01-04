import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import {
  Database,
  Plus,
  RefreshCw,
  LogOut,
  Table,
  Edit,
  Check,
  X,
  Server
} from 'lucide-react';
import api from '../services/api';

export default function AdminDashboard() {
  const [databases, setDatabases] = useState([]);
  const [selectedDatabase, setSelectedDatabase] = useState(null);
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [tableSchema, setTableSchema] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddDatabase, setShowAddDatabase] = useState(false);
  const [isIndexing, setIsIndexing] = useState(false);
  const [editingColumn, setEditingColumn] = useState(null);
  const [editingTable, setEditingTable] = useState(false);

  const [newDatabase, setNewDatabase] = useState({
    databaseName: '',
    host: '',
    port: 5432,
    username: '',
    password: '',
    description: ''
  });

  const navigate = useNavigate();
  const { logout } = useAuthStore();

  useEffect(() => {
    fetchDatabases();
  }, []);

  useEffect(() => {
    if (selectedDatabase) {
      fetchTables();
    }
  }, [selectedDatabase]);

  useEffect(() => {
    if (selectedTable && selectedDatabase) {
      fetchTableSchema();
    }
  }, [selectedTable, selectedDatabase]);

  const fetchDatabases = async () => {
    try {
      const response = await api.get('/database-configs');
      setDatabases(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch databases');
    }
  };

  const fetchTables = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/database-configs/${selectedDatabase.id}/tables`);
      setTables(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch tables');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTableSchema = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(
        `/database-configs/${selectedDatabase.id}/tables/${selectedTable}/schema`
      );
      setTableSchema(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch table schema');
      setTableSchema(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddDatabase = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.post('/database-configs', newDatabase);
      toast.success('Database added successfully!');
      setShowAddDatabase(false);
      setNewDatabase({
        databaseName: '',
        host: '',
        port: 5432,
        username: '',
        password: '',
        description: ''
      });
      fetchDatabases();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to add database');
    } finally {
      setIsLoading(false);
    }
  };

  const handleIndexDatabase = async () => {
    if (!selectedDatabase) return;

    setIsIndexing(true);
    try {
      const response = await api.post(`/database-configs/${selectedDatabase.id}/index`);
      toast.success(response.data.message);
      fetchTables();
    } catch (error) {
      toast.error('Failed to index database');
    } finally {
      setIsIndexing(false);
    }
  };

  const handleUpdateTableDescription = async (description) => {
    if (!tableSchema) return;

    try {
      await api.put(`/database-configs/tables/${tableSchema.id}/description`, {
        description
      });
      toast.success('Table description updated');
      setEditingTable(false);
      fetchTableSchema();
    } catch (error) {
      toast.error('Failed to update table description');
    }
  };

  const handleUpdateColumnDescription = async (columnName, description) => {
    if (!tableSchema) return;

    try {
      await api.put(
        `/database-configs/tables/${tableSchema.id}/columns/${columnName}/description`,
        { description }
      );
      toast.success('Column description updated');
      setEditingColumn(null);
      fetchTableSchema();
    } catch (error) {
      toast.error('Failed to update column description');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">Admin Dashboard</h1>
            <p className="text-secondary-600">Manage organization databases and tables</p>
          </div>
          <button
            onClick={handleLogout}
            className="btn-secondary flex items-center gap-2"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>

        {/* Add Database Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowAddDatabase(!showAddDatabase)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Database
          </button>
        </div>

        {/* Add Database Form */}
        {showAddDatabase && (
          <div className="card mb-6">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-secondary-800 flex items-center gap-2">
                <Server className="w-5 h-5 text-primary-600" />
                Add New Database
              </h2>
            </div>
            <form onSubmit={handleAddDatabase} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Database Name
                  </label>
                  <input
                    type="text"
                    value={newDatabase.databaseName}
                    onChange={(e) => setNewDatabase({...newDatabase, databaseName: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Host
                  </label>
                  <input
                    type="text"
                    value={newDatabase.host}
                    onChange={(e) => setNewDatabase({...newDatabase, host: e.target.value})}
                    className="input-field"
                    placeholder="localhost or IP address"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Port
                  </label>
                  <input
                    type="number"
                    value={newDatabase.port}
                    onChange={(e) => setNewDatabase({...newDatabase, port: parseInt(e.target.value)})}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={newDatabase.username}
                    onChange={(e) => setNewDatabase({...newDatabase, username: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={newDatabase.password}
                    onChange={(e) => setNewDatabase({...newDatabase, password: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    value={newDatabase.description}
                    onChange={(e) => setNewDatabase({...newDatabase, description: e.target.value})}
                    className="input-field"
                    placeholder="Optional"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary disabled:opacity-50"
                >
                  {isLoading ? 'Adding...' : 'Add Database'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddDatabase(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Databases List */}
        <div className="card mb-6">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-secondary-800 flex items-center gap-2">
              <Database className="w-5 h-5 text-primary-600" />
              Your Databases
            </h2>
          </div>
          <div className="p-6">
            {databases.length === 0 ? (
              <p className="text-secondary-500 text-center py-8">
                No databases configured. Add your first database to get started.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {databases.map((db) => (
                  <button
                    key={db.id}
                    onClick={() => {
                      setSelectedDatabase(db);
                      setSelectedTable(null);
                      setTableSchema(null);
                    }}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                      selectedDatabase?.id === db.id
                        ? 'border-primary-500 bg-primary-50 shadow-md'
                        : 'border-secondary-200 hover:border-primary-400 hover:shadow'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <Database className="w-6 h-6 text-primary-600" />
                      {selectedDatabase?.id === db.id && (
                        <Check className="w-5 h-5 text-primary-600" />
                      )}
                    </div>
                    <h3 className="font-semibold text-secondary-800 mt-2">{db.database_name}</h3>
                    <p className="text-sm text-secondary-500 mt-1">{db.host}:{db.port}</p>
                    {db.description && (
                      <p className="text-xs text-secondary-400 mt-2">{db.description}</p>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tables Section */}
        {selectedDatabase && (
          <div className="card mb-6">
            <div className="card-header flex justify-between items-center">
              <h2 className="text-lg font-semibold text-secondary-800 flex items-center gap-2">
                <Table className="w-5 h-5 text-primary-600" />
                Tables in {selectedDatabase.database_name}
              </h2>
              <button
                onClick={handleIndexDatabase}
                disabled={isIndexing}
                className="btn-primary text-sm flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isIndexing ? 'animate-spin' : ''}`} />
                {isIndexing ? 'Indexing...' : 'Get Tables'}
              </button>
            </div>
            <div className="p-6">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <RefreshCw className="w-8 h-8 animate-spin text-primary-600" />
                </div>
              ) : tables.length === 0 ? (
                <p className="text-secondary-500 text-center py-8">
                  Click "Get Tables" to fetch and index tables from this database
                </p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {tables.map((table) => (
                    <button
                      key={table}
                      onClick={() => setSelectedTable(table)}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                        selectedTable === table
                          ? 'border-primary-500 bg-primary-50 shadow-md'
                          : 'border-secondary-200 hover:border-primary-400 hover:shadow'
                      }`}
                    >
                      <Table className="w-5 h-5 text-primary-600 mb-2" />
                      <div className="font-medium text-secondary-800 truncate text-sm">
                        {table}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Table Schema */}
        {tableSchema && (
          <div className="card">
            <div className="card-header flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-secondary-800">
                  {tableSchema.table_name}
                </h2>
                {!editingTable && tableSchema.table_description && (
                  <p className="text-sm text-secondary-600 mt-1">{tableSchema.table_description}</p>
                )}
              </div>
              <button
                onClick={() => setEditingTable(!editingTable)}
                className="btn-secondary text-sm flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                {editingTable ? 'Cancel' : 'Edit Description'}
              </button>
            </div>

            {editingTable && (
              <div className="px-6 pt-4">
                <TableDescriptionEditor
                  initialDescription={tableSchema.table_description || ''}
                  onSave={handleUpdateTableDescription}
                  onCancel={() => setEditingTable(false)}
                />
              </div>
            )}

            <div className="p-6">
              <h3 className="font-semibold text-secondary-800 mb-4">Columns</h3>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Column Name</th>
                      <th>Data Type</th>
                      <th>Nullable</th>
                      <th>Description</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableSchema.columns?.filter(col => col.column_name).map((column) => (
                      <tr key={column.column_name}>
                        <td className="font-medium">{column.column_name}</td>
                        <td>{column.data_type}</td>
                        <td>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            column.is_nullable
                              ? 'bg-accent-100 text-accent-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {column.is_nullable ? 'YES' : 'NO'}
                          </span>
                        </td>
                        <td>
                          {editingColumn === column.column_name ? (
                            <ColumnDescriptionEditor
                              initialDescription={column.column_description || ''}
                              onSave={(desc) => handleUpdateColumnDescription(column.column_name, desc)}
                              onCancel={() => setEditingColumn(null)}
                            />
                          ) : (
                            <span className="text-secondary-600">
                              {column.column_description || '-'}
                            </span>
                          )}
                        </td>
                        <td>
                          <button
                            onClick={() => setEditingColumn(
                              editingColumn === column.column_name ? null : column.column_name
                            )}
                            className="text-primary-600 hover:text-primary-700"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TableDescriptionEditor({ initialDescription, onSave, onCancel }) {
  const [description, setDescription] = useState(initialDescription);

  return (
    <div className="flex gap-2 mb-4">
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="input-field flex-1"
        placeholder="Enter table description..."
        autoFocus
      />
      <button
        onClick={() => onSave(description)}
        className="btn-primary px-3"
      >
        <Check className="w-4 h-4" />
      </button>
      <button
        onClick={onCancel}
        className="btn-secondary px-3"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

function ColumnDescriptionEditor({ initialDescription, onSave, onCancel }) {
  const [description, setDescription] = useState(initialDescription);

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="input-field text-sm py-1 px-2"
        placeholder="Enter description..."
        autoFocus
      />
      <button
        onClick={() => onSave(description)}
        className="text-accent-600 hover:text-accent-700"
      >
        <Check className="w-4 h-4" />
      </button>
      <button
        onClick={onCancel}
        className="text-red-600 hover:text-red-700"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
