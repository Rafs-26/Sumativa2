import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'increase' | 'decrease';
  icon: LucideIcon;
  color: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'indigo';
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  change, 
  changeType, 
  icon: Icon, 
  color 
}) => {
  const colorClasses = {
    blue: 'bg-blue-500 text-blue-50',
    green: 'bg-green-500 text-green-50',
    yellow: 'bg-yellow-500 text-yellow-50',
    red: 'bg-red-500 text-red-50',
    purple: 'bg-purple-500 text-purple-50',
    indigo: 'bg-indigo-500 text-indigo-50'
  };

  const changeClasses = {
    increase: 'text-green-600',
    decrease: 'text-red-600'
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {change !== undefined && (
            <div className="flex items-center mt-2">
              <span className={`text-sm font-medium ${changeClasses[changeType || 'increase']}`}>
                {changeType === 'increase' ? '+' : '-'}{Math.abs(change)}%
              </span>
              <span className="text-gray-500 text-sm ml-2">vs mes anterior</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg ${colorClasses[color]} flex items-center justify-center`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;