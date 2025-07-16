
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: 'primary' | 'success' | 'warning' | 'danger' | 'muted';
}

const StatsCard = ({ title, value, icon: Icon, color }: StatsCardProps) => {
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.9
    },
    show: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const getColorClasses = (color: string) => {
    const colors = {
      primary: {
        bg: 'bg-primary/20',
        text: 'text-primary',
        icon: 'text-primary',
        glow: 'shadow-primary/20'
      },
      success: {
        bg: 'bg-green-500/20',
        text: 'text-green-400',
        icon: 'text-green-400',
        glow: 'shadow-green-500/20'
      },
      warning: {
        bg: 'bg-yellow-500/20',
        text: 'text-yellow-400',
        icon: 'text-yellow-400',
        glow: 'shadow-yellow-500/20'
      },
      danger: {
        bg: 'bg-red-500/20',
        text: 'text-red-400',
        icon: 'text-red-400',
        glow: 'shadow-red-500/20'
      },
      muted: {
        bg: 'bg-muted/30',
        text: 'text-muted-foreground',
        icon: 'text-muted-foreground',
        glow: 'shadow-muted/20'
      }
    };
    return colors[color as keyof typeof colors];
  };

  const colorClasses = getColorClasses(color);

  return (
    <motion.div
      className={`bg-card/80 backdrop-blur-sm rounded-2xl golden-border p-8 transition-all duration-300 hover:bg-card/90 ${colorClasses.glow} hover:shadow-2xl`}
      variants={cardVariants}
      whileHover={{ 
        y: -8,
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            {title}
          </p>
          <motion.p 
            className={`text-4xl font-bold ${colorClasses.text}`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {value}
          </motion.p>
        </div>
        <div className={`p-4 rounded-xl ${colorClasses.bg}`}>
          <Icon className={`h-8 w-8 ${colorClasses.icon}`} />
        </div>
      </div>
      
      {/* Infographic decoration */}
      <div className="mt-6 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent rounded-full" />
    </motion.div>
  );
};

export default StatsCard;
