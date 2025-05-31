
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApp } from '@/contexts/AppContext';
import { toast } from '@/hooks/use-toast';

interface AddMileageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddMileageDialog: React.FC<AddMileageDialogProps> = ({ open, onOpenChange }) => {
  const { addMileageEntry } = useApp();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    startMileage: '',
    endMileage: '',
    purpose: 'business' as 'business' | 'personal',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.startMileage || !formData.endMileage) {
      toast({
        title: "Missing Information",
        description: "Please fill in start and end mileage.",
        variant: "destructive",
      });
      return;
    }

    const start = parseFloat(formData.startMileage);
    const end = parseFloat(formData.endMileage);

    if (end <= start) {
      toast({
        title: "Invalid Mileage",
        description: "End mileage must be greater than start mileage.",
        variant: "destructive",
      });
      return;
    }

    addMileageEntry({
      date: formData.date,
      startMileage: start,
      endMileage: end,
      purpose: formData.purpose,
      description: formData.description || undefined,
    });

    const miles = end - start;
    toast({
      title: "Mileage Logged",
      description: `${miles.toFixed(1)} ${formData.purpose} miles recorded.`,
    });

    setFormData({
      date: new Date().toISOString().split('T')[0],
      startMileage: '',
      endMileage: '',
      purpose: 'business',
      description: '',
    });
    
    onOpenChange(false);
  };

  const calculateMiles = () => {
    if (formData.startMileage && formData.endMileage) {
      const miles = parseFloat(formData.endMileage) - parseFloat(formData.startMileage);
      return miles > 0 ? miles.toFixed(1) : '0';
    }
    return '0';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Log Mileage</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startMileage">Start Mileage</Label>
              <Input
                id="startMileage"
                type="number"
                step="0.1"
                placeholder="0.0"
                value={formData.startMileage}
                onChange={(e) => setFormData({ ...formData, startMileage: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="endMileage">End Mileage</Label>
              <Input
                id="endMileage"
                type="number"
                step="0.1"
                placeholder="0.0"
                value={formData.endMileage}
                onChange={(e) => setFormData({ ...formData, endMileage: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="p-3 bg-muted rounded-lg">
            <div className="text-sm text-muted-foreground">Total Miles</div>
            <div className="text-2xl font-bold">{calculateMiles()}</div>
          </div>

          <div>
            <Label htmlFor="purpose">Purpose</Label>
            <Select value={formData.purpose} onValueChange={(value) => setFormData({ ...formData, purpose: value as 'business' | 'personal' })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="personal">Personal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Trip purpose, route details..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Log Mileage
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMileageDialog;
