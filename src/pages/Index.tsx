import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Clock, AlertTriangle, CheckCircle, Sparkles, Plus } from 'lucide-react';
import MemberCard from '../components/MemberCard';
import StatsCard from '../components/StatsCard';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useToast } from '../hooks/use-toast';
import { getAllMembers, createMember,deleteMember } from '@/lib/api';

interface Member {
  id: number;
  name: string;
  phone: string;
  assignedHours: number;
  leaveHours: number;
  status: 'Active' | 'Red Flag';
}

const Index = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberPhone, setNewMemberPhone] = useState('');
  const { toast } = useToast();

  const fetchMembers = () => {
    getAllMembers()
      .then(setMembers)
      .catch((error) => {
        toast({
          title: 'Error fetching members',
          description: error.message,
          variant: 'destructive',
        });
      });
  };

  useEffect(() => {
    fetchMembers();
  }, []);

 const handleDeleteMember = async (id: number) => {
  try {
    await deleteMember(id);
    setMembers((prev) => prev.filter((member) => member.id !== id));
    toast({
      title: 'Deleted',
      description: 'Member has been removed.',
    });
  } catch (error: any) {
    toast({
      title: 'Error',
      description: error.message || 'Failed to delete member.',
      variant: 'destructive',
    });
  }
};

  const handleAddMember = async () => {
    if (!newMemberName.trim() || !newMemberPhone.trim()) {
      toast({
        title: 'Error',
        description: 'Please fill in both name and phone number.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await createMember(newMemberName.trim(), newMemberPhone.trim());

      const newMember: Member = {
        id: response.id,
        name: response.name,
        phone: response.phone,
        assignedHours: response.assignedHours ?? 40,
        leaveHours: response.leaveHours ?? 0,
        status: response.status ?? 'Active',
      };

      setMembers((prev) => [...prev, newMember]);
      setNewMemberName('');
      setNewMemberPhone('');
      setIsDialogOpen(false);

      toast({
        title: 'Success',
        description: `${newMember.name} has been added to the team.`,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message ?? 'Failed to add member.',
        variant: 'destructive',
      });
    }
  };

  const totalMembers = members.length;
  const activeMembers = members.filter((m) => m.status === 'Active').length;
  const redFlagMembers = members.filter((m) => m.status === 'Red Flag').length;
  const totalLeaveHours = members.reduce((sum, m) => sum + m.leaveHours, 0);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -50 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <div className="min-h-screen infographic-grid p-4 md:p-8">
      <motion.div
        className="max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Header */}
        <motion.div className="mb-8" variants={headerVariants}>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-primary/20 rounded-xl golden-glow">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
                Smart Shift Assignment
              </h1>
              <p className="text-muted-foreground text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-accent" />
                Manage team schedules and track work assignments
              </p>
            </div>
          </div>
        </motion.div>

        {/* Add Member */}
        <motion.div className="mb-8 flex justify-end" variants={headerVariants}>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground golden-glow">
                <Plus className="h-4 w-4 mr-2" />
                Add Member
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card golden-border">
              <DialogHeader>
                <DialogTitle className="text-foreground">Add New Team Member</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    placeholder="Enter full name"
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-foreground">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    value={newMemberPhone}
                    onChange={(e) => setNewMemberPhone(e.target.value)}
                    placeholder="Enter phone number"
                    className="bg-background border-border"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="border-border hover:bg-accent"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddMember}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Add Member
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
          variants={containerVariants}
        >
          <StatsCard title="Total Members" value={totalMembers} icon={Users} color="primary" />
          <StatsCard title="Active Members" value={activeMembers} icon={CheckCircle} color="success" />
          <StatsCard title="Red Flag Members" value={redFlagMembers} icon={AlertTriangle} color="warning" />
          <StatsCard
            title="Total Leave Hours"
            value={totalLeaveHours}
            icon={Clock}
            color={totalLeaveHours > 0 ? 'danger' : 'muted'}
          />
        </motion.div>

        {/* Member Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
          variants={containerVariants}
        >
          {members.map((member) => (
            <MemberCard key={member.id} member={member} onDelete={handleDeleteMember} />
          ))}
        </motion.div>

        {/* Empty State */}
        {members.length === 0 && (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="p-6 bg-card rounded-2xl golden-border w-20 h-20 mx-auto mb-6 flex items-center justify-center golden-glow">
              <Users className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-semibold text-foreground mb-3">No team members found</h3>
            <p className="text-muted-foreground text-lg">All team members have been removed from the dashboard.</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Index;
