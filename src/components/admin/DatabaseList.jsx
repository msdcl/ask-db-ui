import PropTypes from 'prop-types';
import { Database, Check, Server } from 'lucide-react';

export default function DatabaseList({ databases, selectedDatabase, onSelect }) {
  if (databases.length === 0) {
    return (
      <div className="empty-state py-8">
        <Server className="empty-state-icon w-12 h-12" />
        <p className="empty-state-title text-base">No databases yet</p>
        <p className="empty-state-description text-sm">
          Add your first database to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {databases.map((db, index) => {
        const isSelected = selectedDatabase?.id === db.id;
        return (
          <button
            key={db.id}
            onClick={() => onSelect(db)}
            className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 group animate-fade-in ${
              isSelected
                ? 'border-primary-400 bg-primary-50/70 shadow-soft-md'
                : 'border-secondary-100 bg-white/50 hover:border-primary-300 hover:bg-primary-50/30 hover:shadow-soft'
            }`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-primary-200 text-primary-700'
                      : 'bg-secondary-100 text-secondary-500 group-hover:bg-primary-100 group-hover:text-primary-600'
                  }`}
                >
                  <Database className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3
                    className={`font-semibold truncate transition-colors ${
                      isSelected ? 'text-primary-700' : 'text-secondary-800 group-hover:text-primary-700'
                    }`}
                  >
                    {db.database_name}
                  </h3>
                  <p className="text-xs text-secondary-500 mt-0.5">
                    {db.host}:{db.port}
                  </p>
                  {db.description && (
                    <p className="text-xs text-secondary-400 mt-1 line-clamp-1">{db.description}</p>
                  )}
                </div>
              </div>
              {isSelected && (
                <div className="w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

DatabaseList.propTypes = {
  databases: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      database_name: PropTypes.string.isRequired,
      host: PropTypes.string.isRequired,
      port: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      description: PropTypes.string,
    })
  ).isRequired,
  selectedDatabase: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  onSelect: PropTypes.func.isRequired,
};

DatabaseList.defaultProps = {
  selectedDatabase: null,
};
