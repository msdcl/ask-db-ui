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
} from 'lucide-react';

export default function UserDashboard() {
  const [databases, setDatabases] = useState([]);
  const [selectedDatabase, setSelectedDatabase] = useState(''); // stores database config ID
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [queryHistory, setQueryHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

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
      toast.error('Failed to load databases');
    }
  };

  const loadQueryHistory = async () => {
    try {
      const response = await queryAPI.getQueryHistory(10, 0);
      setQueryHistory(response.data.data.history);
    } catch (error) {
      console.error('Failed to load query history');
    }
  };

  const handleSubmitQuery = async (e) => {
    e.preventDefault();

    if (!selectedDatabase) {
      toast.error('Please select a database');
      return;
    }

    if (!query.trim()) {
      toast.error('Please enter a query');
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const response = await queryAPI.executeQuery(query, selectedDatabase);
      const data = response.data.data;

      setResult(data);
      toast.success('Query executed successfully!');
      loadQueryHistory();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Query execution failed');
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
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2 flex items-center gap-3">
              <Sparkles className="w-10 h-10" />
              Natural Language Query
            </h1>
            <p className="text-secondary-600">Ask questions in plain English</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="btn-secondary flex items-center gap-2"
            >
              <History className="w-5 h-5" />
              History
            </button>
            <button onClick={handleLogout} className="btn-secondary flex items-center gap-2">
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>

        {showHistory && (
          <div className="card mb-6">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-secondary-800 flex items-center gap-2">
                <History className="w-5 h-5 text-primary-600" />
                Recent Queries
              </h2>
            </div>
            <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
              {queryHistory.length === 0 ? (
                <p className="text-secondary-500 text-center py-8">No query history yet</p>
              ) : (
                queryHistory.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => useHistoryQuery(item)}
                    className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-400 hover:bg-primary-50 cursor-pointer transition-all duration-200"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-medium text-secondary-800">{item.natural_query}</p>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          item.execution_status === 'success'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {item.execution_status}
                      </span>
                    </div>
                    <p className="text-sm text-secondary-600 mb-1">
                      Database: {item.database_name}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-secondary-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(item.created_at).toLocaleString()}
                      </span>
                      {item.execution_time_ms && (
                        <span>{item.execution_time_ms}ms</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        <div className="card mb-6">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-secondary-800 flex items-center gap-2">
              <Database className="w-5 h-5 text-primary-600" />
              Query Configuration
            </h2>
          </div>
          <div className="p-6">
            <form onSubmit={handleSubmitQuery} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Select Database
                </label>
                <div className="relative">
                  <select
                    value={selectedDatabase}
                    onChange={(e) => setSelectedDatabase(e.target.value)}
                    className="input-field appearance-none"
                    required
                  >
                    <option value="">Choose a database...</option>
                    {databases.map((db) => (
                      <option key={db.id} value={db.id}>
                        {db.database_name} ({db.host}:{db.port})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Ask Your Question
                </label>
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="E.g., Show me the top 10 customers by revenue..."
                  className="input-field min-h-32 resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Execute Query
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {result && (
          <>
            <div className="card mb-6">
              <div className="card-header">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-secondary-800 flex items-center gap-2">
                    <Code className="w-5 h-5 text-secondary-600" />
                    Generated SQL
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-secondary-600">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {result.executionTime}ms
                    </span>
                    <span>{result.rowCount} rows</span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto font-mono text-sm">
                  {result.sql}
                </pre>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h2 className="text-lg font-semibold text-secondary-800">Query Results</h2>
                <p className="text-sm text-secondary-600 mt-1">
                  Visualization Type: {result.visualizationType.replace('_', ' ')}
                </p>
              </div>
              <div className="p-6">
                <DataVisualization
                  data={result.result}
                  visualizationType={result.visualizationType}
                />
              </div>
            </div>
          </>
        )}

        {!result && !isLoading && (
          <div className="card">
            <div className="p-12 text-center">
              <Sparkles className="w-16 h-16 text-primary-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-secondary-700 mb-2">
                Ready to Query
              </h3>
              <p className="text-secondary-500">
                Select a database and ask your question in natural language
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
