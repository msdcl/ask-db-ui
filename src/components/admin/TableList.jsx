import PropTypes from 'prop-types';
import { Table, RefreshCw, Layers } from 'lucide-react';

export default function TableList({
  tables,
  selectedTable,
  onSelect,
  isLoading,
  isIndexing,
  onIndex,
  databaseName,
}) {
  return (
    <div className="card">
      <div className="card-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="section-title">
          <Table className="section-title-icon" />
          <span className="truncate">Tables in {databaseName}</span>
        </h2>
        <button
          onClick={onIndex}
          disabled={isIndexing}
          className="btn-primary btn-sm flex-shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${isIndexing ? 'animate-spin' : ''}`} />
          {isIndexing ? 'Indexing...' : 'Refresh Tables'}
        </button>
      </div>
      <div className="card-body">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="loading-spinner w-10 h-10 mb-4" />
            <p className="text-sm text-secondary-500">Loading tables...</p>
          </div>
        ) : tables.length === 0 ? (
          <div className="empty-state py-10">
            <Layers className="empty-state-icon w-12 h-12" />
            <p className="empty-state-title text-base">No tables indexed</p>
            <p className="empty-state-description text-sm">
              Click &quot;Refresh Tables&quot; to fetch tables from this database
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {tables.map((table, index) => {
              const isSelected = selectedTable === table;
              return (
                <button
                  key={table}
                  onClick={() => onSelect(table)}
                  className={`p-3 sm:p-4 rounded-xl border-2 text-left transition-all duration-200 group animate-fade-in ${
                    isSelected
                      ? 'border-primary-400 bg-primary-50/70 shadow-soft-md'
                      : 'border-secondary-100 bg-white/50 hover:border-primary-300 hover:bg-primary-50/30 hover:shadow-soft'
                  }`}
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <Table
                    className={`w-5 h-5 mb-2 transition-colors ${
                      isSelected
                        ? 'text-primary-600'
                        : 'text-secondary-400 group-hover:text-primary-500'
                    }`}
                  />
                  <p
                    className={`font-medium text-sm truncate transition-colors ${
                      isSelected
                        ? 'text-primary-700'
                        : 'text-secondary-700 group-hover:text-primary-700'
                    }`}
                  >
                    {table}
                  </p>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

TableList.propTypes = {
  tables: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedTable: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  isIndexing: PropTypes.bool,
  onIndex: PropTypes.func.isRequired,
  databaseName: PropTypes.string.isRequired,
};

TableList.defaultProps = {
  selectedTable: null,
  isLoading: false,
  isIndexing: false,
};
