import { motion } from 'framer-motion';
import {
  Phone,
  Clock,
  Calendar,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Zap,
} from 'lucide-react';

interface Member {
  id: number;
  name: string;
  phone: string;
  assignedHours: number;
  leaveHours: number;
  status: 'Active' | 'Red Flag';
}

interface MemberCardProps {
  member: Member;
  onDelete: (id: number) => void;
}

const MemberCard = ({ member, onDelete }: MemberCardProps) => {
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9,
    },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      x: -100,
      transition: {
        duration: 0.3,
      },
    },
  };

  const handleDelete = () => {
    onDelete(member.id);
  };

  const getStatusColor = (status: string) => {
    return status === 'Active'
      ? 'bg-green-500/20 text-green-400 border-green-500/30'
      : 'bg-red-500/20 text-red-400 border-red-500/30';
  };

  const getStatusIcon = (status: string) => {
    return status === 'Active' ? (
      <CheckCircle className="h-4 w-4" />
    ) : (
      <AlertTriangle className="h-4 w-4" />
    );
  };

  const progressPercentage = Math.min(
    (member.assignedHours / 40) * 100,
    100
  );

  const getProgressColor = () => {
    if (member.assignedHours >= 40)
      return 'from-green-500 to-emerald-400';
    if (member.assignedHours >= 30)
      return 'from-yellow-500 to-amber-400';
    return 'from-red-500 to-rose-400';
  };

  return (
    <motion.div
      className="bg-card/90 backdrop-blur-sm rounded-2xl golden-border overflow-hidden group hover:bg-card transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10"
      variants={cardVariants}
      whileHover={{
        y: -8,
        scale: 1.02,
        transition: { duration: 0.2 },
      }}
      whileTap={{ scale: 0.98 }}
      layout
    >
      {/* Header */}
      <div className="relative p-6 pb-4">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/50 via-accent/50 to-primary/50" />

        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground mb-2 flex items-center gap-2">
              <Zap className="h-5 w-5 text-accent" />
              {member.name}
            </h3>
            <div className="flex items-center text-muted-foreground text-sm">
              <Phone className="h-4 w-4 mr-2 text-accent" />
              {member.phone}
            </div>
          </div>

          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border backdrop-blur-sm ${getStatusColor(
              member.status
            )}`}
          >
            {getStatusIcon(member.status)}
            {member.status}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-primary/5 rounded-xl border border-primary/20">
            <div className="flex items-center text-foreground">
              <Clock className="h-5 w-5 mr-3 text-primary" />
              <span className="font-medium">Assigned Hours</span>
            </div>
            <span className="font-bold text-2xl text-primary">
              {member.assignedHours}h
            </span>
          </div>

          <div className="flex items-center justify-between p-4 bg-accent/5 rounded-xl border border-accent/20">
            <div className="flex items-center text-foreground">
              <Calendar className="h-5 w-5 mr-3 text-accent" />
              <span className="font-medium">Leave Hours</span>
            </div>
            <span
              className={`font-bold text-2xl ${
                member.leaveHours > 0
                  ? 'text-red-400'
                  : 'text-muted-foreground'
              }`}
            >
              {member.leaveHours}h
            </span>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-muted-foreground">
              Weekly Progress
            </span>
            <span className="text-sm font-bold text-accent">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <div className="relative w-full bg-muted/30 rounded-full h-3 overflow-hidden">
            <motion.div
              className={`h-full bg-gradient-to-r ${getProgressColor()} rounded-full relative`}
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1.5, delay: 0.5 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
            </motion.div>
          </div>
        </div>
      </div>

      <div className="px-6 py-4 bg-muted/10 border-t border-border/50">
        <motion.button
          onClick={handleDelete}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/30 hover:border-red-500/50 rounded-xl font-semibold text-sm transition-all duration-200 backdrop-blur-sm"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Trash2 className="h-4 w-4" />
          Remove Member
        </motion.button>
      </div>
    </motion.div>
  );
};

export default MemberCard;
