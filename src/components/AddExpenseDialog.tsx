import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApp } from '@/contexts/AppContext';
import { toast } from '@/hooks/use-toast';
import { Camera } from 'lucide-react';

interface AddExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddExpenseDialog: React.FC<AddExpenseDialogProps> = ({ open, onOpenChange }) => {
  const { addExpense, categories, addCategory, deleteCategory } = useApp();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    category: '',
    description: '',
    receiptPhoto: '',
  });
  const [newCategory, setNewCategory] = useState('');
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [showDeleteCategory, setShowDeleteCategory] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.category) {
      toast({
        title: "Missing Information",
        description: "Please fill in amount and category.",
        variant: "destructive",
      });
      return;
    }

    addExpense({
      date: formData.date,
      amount: parseFloat(formData.amount),
      category: formData.category,
      description: formData.description || undefined,
      receiptPhoto: formData.receiptPhoto || undefined,
    });

    toast({
      title: "Expense Added",
      description: `$${parseFloat(formData.amount).toFixed(2)} expense for ${formData.category} has been recorded.`,
    });

    setFormData({
      date: new Date().toISOString().split('T')[0],
      amount: '',
      category: '',
      description: '',
      receiptPhoto: '',
    });
    
    onOpenChange(false);
  };

  const handleAddNewCategory = () => {
    if (newCategory.trim()) {
      addCategory(newCategory.trim());
      setFormData({ ...formData, category: newCategory.trim() });
      setNewCategory('');
      setShowNewCategory(false);
      toast({
        title: "Category Added",
        description: `"${newCategory.trim()}" has been added to your categories.`,
      });
    }
  };

  const handleDeleteCategory = (categoryToDelete: string) => {
    deleteCategory(categoryToDelete);
    if (formData.category === categoryToDelete) {
      setFormData({ ...formData, category: '' });
    }
    toast({
      title: "Category Deleted",
      description: `"${categoryToDelete}" has been removed from your categories.`,
      variant: 'destructive',
    });
  };

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData({ ...formData, receiptPhoto: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Expense</DialogTitle>
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
            <Label htmlFor="category">Category</Label>
            {showNewCategory ? (
              <div className="flex gap-2">
                <Input
                  placeholder="Enter new category"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                />
                <Button type="button" onClick={handleAddNewCategory} size="sm">
                  Add
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowNewCategory(false)} size="sm">
                  Cancel
                </Button>
              </div>
            ) : showDeleteCategory ? (
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap gap-2">
                  {categories.map(category => (
                    <div key={category.id} className="flex items-center gap-1 border rounded px-2 py-1 bg-muted">
                      <span>{category.name}</span>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        aria-label={`Delete ${category.name}`}
                        onClick={() => handleDeleteCategory(category.name)}
                      >
                        <span aria-hidden="true">✕</span>
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-2">
                  <Button type="button" variant="default" size="sm" onClick={() => setShowDeleteCategory(false)}>
                    Save
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => setShowDeleteCategory(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex gap-2 items-center">
                <Select value={formData.category} onValueChange={value => {
                  if (value === 'add_new') {
                    setShowNewCategory(true);
                  } else if (value === 'delete_mode') {
                    setShowDeleteCategory(true);
                  } else {
                    setFormData({ ...formData, category: value });
                  }
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                    <SelectItem value="add_new">+ Add New Category</SelectItem>
                    <SelectItem value="delete_mode" className="text-destructive">🗑 Delete a Category</SelectItem>
                  </SelectContent>
                </Select>
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowDeleteCategory(true)} title="Delete a category">
                  🗑
                </Button>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Gas station, repair details, etc..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="receipt">Receipt Photo (Optional)</Label>
            <div className="flex items-center gap-3">
              <Input
                id="receipt"
                type="file"
                accept="image/*"
                onChange={handleReceiptUpload}
                className="hidden"
              />
              <Button 
                type="button"
                variant="outline"
                onClick={() => document.getElementById('receipt')?.click()}
                className="flex-1"
              >
                <Camera className="w-4 h-4 mr-2" />
                {formData.receiptPhoto ? 'Receipt Attached' : 'Attach Receipt'}
              </Button>
              {formData.receiptPhoto && (
                <Button 
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setFormData({ ...formData, receiptPhoto: '' })}
                >
                  Remove
                </Button>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Add Expense
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddExpenseDialog;
