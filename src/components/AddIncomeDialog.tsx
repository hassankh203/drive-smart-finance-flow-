import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApp } from '@/contexts/AppContext';
import { PLATFORMS } from '@/types';
import { toast } from '@/hooks/use-toast';

interface AddIncomeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddIncomeDialog: React.FC<AddIncomeDialogProps> = ({ open, onOpenChange }) => {
  const { addIncome } = useApp();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    platform: '',
    notes: '',
    startTime: '',
    endTime: '',
  });
  const [platforms, setPlatforms] = useState([...PLATFORMS]);
  const [showNewPlatform, setShowNewPlatform] = useState(false);
  const [newPlatform, setNewPlatform] = useState('');
  const [showDeletePlatform, setShowDeletePlatform] = useState(false);

  const handleAddNewPlatform = () => {
    if (newPlatform.trim()) {
      setPlatforms(prev => [...prev.filter(p => p !== newPlatform.trim()), newPlatform.trim()]);
      setFormData({ ...formData, platform: newPlatform.trim() });
      setNewPlatform('');
      setShowNewPlatform(false);
      toast({
        title: 'Platform Added',
        description: `"${newPlatform.trim()}" has been added to your platforms.`,
      });
    }
  };

  const handleDeletePlatform = (platformToDelete: string) => {
    setPlatforms(prev => prev.filter(p => p !== platformToDelete));
    if (formData.platform === platformToDelete) {
      setFormData({ ...formData, platform: '' });
    }
    toast({
      title: 'Platform Deleted',
      description: `"${platformToDelete}" has been removed from your platforms.`,
      variant: 'destructive',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.platform) {
      toast({
        title: "Missing Information",
        description: "Please fill in amount and platform.",
        variant: "destructive",
      });
      return;
    }

    addIncome({
      date: formData.date,
      amount: parseFloat(formData.amount),
      platform: formData.platform,
      notes: formData.notes || undefined,
      startTime: formData.startTime || undefined,
      endTime: formData.endTime || undefined,
    });

    toast({
      title: "Income Added",
      description: `$${parseFloat(formData.amount).toFixed(2)} from ${formData.platform} has been recorded.`,
    });

    setFormData({
      date: new Date().toISOString().split('T')[0],
      amount: '',
      platform: '',
      notes: '',
      startTime: '',
      endTime: '',
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Income</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
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
            <div>
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="platform">Platform</Label>
            {showNewPlatform ? (
              <div className="flex gap-2">
                <Input
                  placeholder="Enter new platform"
                  value={newPlatform}
                  onChange={e => setNewPlatform(e.target.value)}
                />
                <Button type="button" onClick={handleAddNewPlatform} size="sm">
                  Add
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowNewPlatform(false)} size="sm">
                  Cancel
                </Button>
              </div>
            ) : showDeletePlatform ? (
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap gap-2">
                  {platforms.map(platform => (
                    <div key={platform} className="flex items-center gap-1 border rounded px-2 py-1 bg-muted">
                      <span>{platform}</span>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        aria-label={`Delete ${platform}`}
                        onClick={() => handleDeletePlatform(platform)}
                      >
                        <span aria-hidden="true">✕</span>
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-2">
                  <Button type="button" variant="default" size="sm" onClick={() => setShowDeletePlatform(false)}>
                    Save
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => setShowDeletePlatform(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex gap-2 items-center">
                <Select value={formData.platform} onValueChange={value => {
                  if (value === 'add_new') {
                    setShowNewPlatform(true);
                  } else if (value === 'delete_mode') {
                    setShowDeletePlatform(true);
                  } else {
                    setFormData({ ...formData, platform: value });
                  }
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {platforms.map(platform => (
                      <SelectItem key={platform} value={platform}>
                        {platform}
                      </SelectItem>
                    ))}
                    <SelectItem value="add_new">+ Add New Platform</SelectItem>
                    <SelectItem value="delete_mode" className="text-destructive">🗑 Delete a Platform</SelectItem>
                  </SelectContent>
                </Select>
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowDeletePlatform(true)} title="Delete a platform">
                  🗑
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Trip details, special notes..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Add Income
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddIncomeDialog;
