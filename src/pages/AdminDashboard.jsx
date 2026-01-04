import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import { Database, Plus, LogOut, Settings, Layers } from 'lucide-react';
import api from '../services/api';
import DatabaseForm from '../components/admin/DatabaseForm';
import DatabaseList from '../components/admin/DatabaseList';
import TableList from '../components/admin/TableList';
import TableSchema from '../components/admin/TableSchema';
import {
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from '../config/constants';

export default function AdminDashboard() {
  const [databases, setDatabases] = useState([]);
  const [selectedDatabase, setSelectedDatabase] = useState(null);
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [tableSchema, setTableSchema] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddDatabase, setShowAddDatabase] = useState(false);
  const [isIndexing, setIsIndexing] = useState(false);
  const [isAddingDatabase, setIsAddingDatabase] = useState(false);

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
      const message = error.response?.data?.error || ERROR_MESSAGES.API.FETCH_DATABASES;
      toast.error(message);
    }
  };

  const fetchTables = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/database-configs/${selectedDatabase.id}/tables`);
      setTables(response.data.data);
    } catch (error) {
      const message = error.response?.data?.error || ERROR_MESSAGES.API.FETCH_TABLES;
      toast.error(message);
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
      const message = error.response?.data?.error || ERROR_MESSAGES.API.FETCH_SCHEMA;
      toast.error(message);
      setTableSchema(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddDatabase = async (formData) => {
    setIsAddingDatabase(true);
    try {
      await api.post('/database-configs', formData);
      toast.success(SUCCESS_MESSAGES.DATABASE_ADDED);
      setShowAddDatabase(false);
      fetchDatabases();
    } catch (error) {
      const message = error.response?.data?.error || ERROR_MESSAGES.API.ADD_DATABASE;
      toast.error(message);
    } finally {
      setIsAddingDatabase(false);
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
      const message = error.response?.data?.error || ERROR_MESSAGES.API.INDEX_DATABASE;
      toast.error(message);
    } finally {
      setIsIndexing(false);
    }
  };

  const handleUpdateTableDescription = async (description) => {
    if (!tableSchema) return;

    try {
      await api.put(`/database-configs/tables/${tableSchema.id}/description`, {
        description,
      });
      toast.success(SUCCESS_MESSAGES.DESCRIPTION_UPDATED);
      fetchTableSchema();
    } catch (error) {
      const message = error.response?.data?.error || ERROR_MESSAGES.API.UPDATE_DESCRIPTION;
      toast.error(message);
    }
  };

  const handleUpdateColumnDescription = async (columnName, description) => {
    if (!tableSchema) return;

    try {
      await api.put(
        `/database-configs/tables/${tableSchema.id}/columns/${columnName}/description`,
        { description }
      );
      toast.success(SUCCESS_MESSAGES.DESCRIPTION_UPDATED);
      fetchTableSchema();
    } catch (error) {
      const message = error.response?.data?.error || ERROR_MESSAGES.API.UPDATE_DESCRIPTION;
      toast.error(message);
    }
  };

  const handleSelectDatabase = (db) => {
    setSelectedDatabase(db);
    setSelectedTable(null);
    setTableSchema(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="page-container relative">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="blob-gradient blob-primary w-[600px] h-[600px] -top-64 -left-64 opacity-20" />
        <div className="blob-gradient blob-accent w-[500px] h-[500px] bottom-0 -right-64 animation-delay-2000 opacity-15" />
        <div className="blob-gradient blob-sky w-[400px] h-[400px] top-1/2 left-1/4 animation-delay-1000 opacity-20" />
      </div>

      <div className="page-content">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center shadow-soft">
                <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" />
              </div>
              <div>
                <h1 className="page-title text-xl sm:text-2xl lg:text-3xl">Admin Dashboard</h1>
                <p className="page-subtitle text-xs sm:text-sm">Manage databases and tables</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setShowAddDatabase(!showAddDatabase)}
              className={`btn-primary btn-sm ${showAddDatabase ? 'from-primary-600 to-primary-700' : ''}`}
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Database</span>
              <span className="sm:hidden">Add</span>
            </button>
            <button onClick={handleLogout} className="btn-secondary btn-sm">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Add Database Form */}
        {showAddDatabase && (
          <div className="animate-fade-in-up mb-6">
            <DatabaseForm
              onSubmit={handleAddDatabase}
              onCancel={() => setShowAddDatabase(false)}
              isLoading={isAddingDatabase}
            />
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Databases Sidebar */}
          <div className="lg:col-span-4 xl:col-span-3">
            <div className="card animate-fade-in-up animation-delay-100">
              <div className="card-header">
                <h2 className="section-title">
                  <Database className="section-title-icon" />
                  Databases
                </h2>
              </div>
              <div className="card-body">
                <DatabaseList
                  databases={databases}
                  selectedDatabase={selectedDatabase}
                  onSelect={handleSelectDatabase}
                />
              </div>
            </div>
          </div>

          {/* Tables and Schema */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-6">
            {selectedDatabase ? (
              <>
                {/* Tables */}
                <div className="animate-fade-in-up animation-delay-200">
                  <TableList
                    tables={tables}
                    selectedTable={selectedTable}
                    onSelect={setSelectedTable}
                    isLoading={isLoading}
                    isIndexing={isIndexing}
                    onIndex={handleIndexDatabase}
                    databaseName={selectedDatabase.database_name}
                  />
                </div>

                {/* Table Schema */}
                {tableSchema && (
                  <div className="animate-fade-in-up animation-delay-300">
                    <TableSchema
                      schema={tableSchema}
                      onUpdateTableDescription={handleUpdateTableDescription}
                      onUpdateColumnDescription={handleUpdateColumnDescription}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="card animate-fade-in-up animation-delay-200">
                <div className="empty-state py-16 sm:py-20">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-primary-100 to-accent-100 rounded-2xl flex items-center justify-center mb-6 shadow-soft-lg">
                    <Layers className="w-10 h-10 sm:w-12 sm:h-12 text-primary-500" />
                  </div>
                  <h3 className="empty-state-title">Select a Database</h3>
                  <p className="empty-state-description">
                    Choose a database from the list to view and manage its tables.
                    <br className="hidden sm:block" />
                    You can add descriptions to help with natural language queries.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
