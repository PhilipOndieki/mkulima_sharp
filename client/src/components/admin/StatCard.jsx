import clsx from 'clsx';

/**
 * StatCard Component
 * 
 * Displays a metric with icon and optional trend
 * 
 * @param {Object} props
 * @param {string} props.title - Card title
 * @param {string|number} props.value - Main value to display
 * @param {React.Component} props.icon - Icon component
 * @param {string} props.color - Color theme (primary, blue, amber, red, green)
 * @param {string} props.trend - Optional trend indicator
 * @param {boolean} props.loading - Loading state
 */
const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color = 'primary',
  trend,
  loading = false 
}) => {
  const colorClasses = {
    primary: 'bg-primary-100 text-primary-600',
    blue: 'bg-blue-100 text-blue-600',
    amber: 'bg-amber-100 text-amber-600',
    red: 'bg-red-100 text-red-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
  };

  return (
    <div className="bg-white rounded-xl shadow-card p-6 hover:shadow-card-hover transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
          {loading ? (
            <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
          ) : (
            <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
          )}
          {trend && !loading && (
            <p className="text-sm text-gray-600">{trend}</p>
          )}
        </div>
        {Icon && (
          <div className={clsx('p-3 rounded-lg', colorClasses[color])}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;