import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { databaseAPI, queryAPI } from '../services/api';
import toast from 'react-hot-toast';
import DataVisualization from '../components/DataVisualization';
import {
  Database,
  Send,
  LogOut,
  Sparkles,
  Clock,
  Code,
  ChevronDown,
  History,
  Zap,
  BarChart3,
  MessageSquare,
  X,
} from 'lucide-react';
import {
  DEFAULT_QUERY_HISTORY_LIMIT,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from '../config/constants';
import { validateQueryForm, getFirstError } from '../utils/validation';

export default function UserDashboard() {
  const [databases, setDatabases] = useState([]);
  const [selectedDatabase, setSelectedDatabase] = useState('');
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [queryHistory, setQueryHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const { logout, user } = useAuthStore();

  useEffect(() => {
    loadDatabases();
    loadQueryHistory();
  }, []);

  const loadDatabases = async () => {
    try {
      const response = await databaseAPI.getDatabases();
      setDatabases(response.data.data);
    } catch (error) {
      const message = error.response?.data?.error || ERROR_MESSAGES.API.FETCH_DATABASES;
      toast.error(message);
    }
  };

  const loadQueryHistory = async () => {
    try {
      const response = await queryAPI.getQueryHistory(DEFAULT_QUERY_HISTORY_LIMIT, 0);
      setQueryHistory(response.data.data.history || []);
    } catch (error) {
      console.error('Failed to load query history:', error.message);
    }
  };

  const handleSubmitQuery = async (e) => {
    e.preventDefault();

    const validation = validateQueryForm({
      databaseId: selectedDatabase,
      query: query,
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      toast.error(getFirstError(validation.errors));
      return;
    }

    setErrors({});
    setIsLoading(true);
    setResult(null);

    try {
      const response = await queryAPI.executeQuery(query, selectedDatabase);
      const data = response.data.data;

      setResult(data);
      toast.success(SUCCESS_MESSAGES.QUERY_EXECUTED);
      loadQueryHistory();
    } catch (error) {
      const message = error.response?.data?.error || ERROR_MESSAGES.API.EXECUTE_QUERY;
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const useHistoryQuery = (historyItem) => {
    setQuery(historyItem.natural_query);
    setSelectedDatabase(historyItem.database_config_id.toString());
    setShowHistory(false);
    setErrors({});
  };

  const handleDatabaseChange = (value) => {
    setSelectedDatabase(value);
    if (errors.databaseId) {
      setErrors({ ...errors, databaseId: null });
    }
  };

  const handleQueryChange = (value) => {
    setQuery(value);
    if (errors.query) {
      setErrors({ ...errors, query: null });
    }
  };

  const selectedDb = databases.find((db) => db.id.toString() === selectedDatabase);

  return (
    <div className="page-container relative">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="blob-gradient blob-primary w-[600px] h-[600px] -top-64 -right-64 opacity-20" />
        <div className="blob-gradient blob-accent w-[500px] h-[500px] top-1/2 -left-64 animation-delay-2000 opacity-15" />
        <div className="blob-gradient blob-sky w-[400px] h-[400px] bottom-0 right-1/4 animation-delay-1000 opacity-20" />
      </div>

      <div className="page-content">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center shadow-soft">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" />
              </div>
              <div>
                <h1 className="page-title text-xl sm:text-2xl lg:text-3xl">Query Assistant</h1>
                <p className="page-subtitle text-xs sm:text-sm">Ask questions in plain English</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className={`btn-secondary btn-sm ${showHistory ? 'bg-primary-50 border-primary-300 text-primary-700' : ''}`}
            >
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">History</span>
            </button>
            <button onClick={handleLogout} className="btn-secondary btn-sm">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* History Panel - Slide in from right on mobile */}
        {showHistory && (
          <div className="card mb-6 animate-fade-in-up">
            <div className="card-header flex items-center justify-between">
              <h2 className="section-title">
                <History className="section-title-icon" />
                Recent Queries
              </h2>
              <button
                onClick={() => setShowHistory(false)}
                className="btn-ghost p-1.5 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 sm:p-5 space-y-3 max-h-80 overflow-y-auto scrollbar-thin">
              {queryHistory.length === 0 ? (
                <div className="empty-state py-8">
                  <MessageSquare className="empty-state-icon w-12 h-12" />
                  <p className="empty-state-title text-base">No queries yet</p>
                  <p className="empty-state-description text-sm">Your query history will appear here</p>
                </div>
              ) : (
                queryHistory.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => useHistoryQuery(item)}
                    className="w-full p-4 rounded-xl border-2 border-secondary-100 bg-white/50 hover:border-primary-300 hover:bg-primary-50/50 text-left transition-all duration-200 group animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <p className="font-medium text-secondary-800 text-sm line-clamp-2 group-hover:text-primary-700 transition-colors">
                        {item.natural_query}
                      </p>
                      <span
                        className={`badge flex-shrink-0 ${
                          item.execution_status === 'success' ? 'badge-success' : 'badge-error'
                        }`}
                      >
                        {item.execution_status}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-secondary-500">
                      <span className="flex items-center gap-1">
                        <Database className="w-3 h-3" />
                        {item.database_name}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                      {item.execution_time_ms && (
                        <span className="flex items-center gap-1">
                          <Zap className="w-3 h-3" />
                          {item.execution_time_ms}ms
                        </span>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        {/* Query Form Card */}
        <div className="card mb-6 animate-fade-in-up animation-delay-100">
          <div className="card-header">
            <h2 className="section-title">
              <Database className="section-title-icon" />
              New Query
            </h2>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmitQuery} className="space-y-5">
              {/* Database Selection */}
              <div className="space-y-2">
                <label className="input-label">Select Database</label>
                <div className="relative">
                  <select
                    value={selectedDatabase}
                    onChange={(e) => handleDatabaseChange(e.target.value)}
                    className={`select-field ${errors.databaseId ? 'input-field-error' : ''}`}
                  >
                    <option value="">Choose a database...</option>
                    {databases.map((db) => (
                      <option key={db.id} value={db.id}>
                        {db.database_name} ({db.host})
                      </option>
                    ))}
                  </select>
                </div>
                {errors.databaseId && <p className="input-error">{errors.databaseId}</p>}
                {selectedDb && (
                  <p className="text-xs text-secondary-500 flex items-center gap-1 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-400" />
                    Connected to {selectedDb.host}:{selectedDb.port}
                  </p>
                )}
              </div>

              {/* Query Input */}
              <div className="space-y-2">
                <label className="input-label">Your Question</label>
                <textarea
                  value={query}
                  onChange={(e) => handleQueryChange(e.target.value)}
                  placeholder="E.g., Show me the top 10 customers by revenue last month..."
                  className={`textarea-field min-h-[100px] sm:min-h-[120px] ${
                    errors.query ? 'input-field-error' : ''
                  }`}
                />
                {errors.query && <p className="input-error">{errors.query}</p>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary group"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="loading-spinner w-5 h-5" />
                    <span>Processing your query...</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Send className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                    <span>Execute Query</span>
                  </span>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <div className="space-y-6 animate-fade-in-up">
            {/* Generated SQL */}
            <div className="card">
              <div className="card-header">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <h2 className="section-title">
                    <Code className="section-title-icon" />
                    Generated SQL
                  </h2>
                  <div className="flex items-center gap-3 text-xs sm:text-sm text-secondary-500">
                    <span className="badge badge-info">
                      <Clock className="w-3 h-3" />
                      {result.executionTime}ms
                    </span>
                    <span className="badge badge-neutral">
                      <BarChart3 className="w-3 h-3" />
                      {result.rowCount} rows
                    </span>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <pre className="code-block text-xs sm:text-sm overflow-x-auto">
                  {result.sql}
                </pre>
              </div>
            </div>

            {/* Visualization */}
            <div className="card">
              <div className="card-header">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <h2 className="section-title">
                    <BarChart3 className="section-title-icon" />
                    Results
                  </h2>
                  <span className="badge badge-primary">
                    {result.visualizationType.replace('_', ' ')}
                  </span>
                </div>
              </div>
              <div className="card-body">
                <DataVisualization
                  data={result.result}
                  visualizationType={result.visualizationType}
                />
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!result && !isLoading && (
          <div className="card animate-fade-in-up animation-delay-200">
            <div className="empty-state py-12 sm:py-16">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-primary-100 to-accent-100 rounded-2xl flex items-center justify-center mb-6 shadow-soft-lg">
                <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 text-primary-500" />
              </div>
              <h3 className="empty-state-title">Ready to Query</h3>
              <p className="empty-state-description">
                Select a database and ask your question in natural language.
                <br className="hidden sm:block" />
                I&apos;ll convert it to SQL and show you the results.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
