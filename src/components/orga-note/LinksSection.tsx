// src/components/orga-note/LinksSection.tsx
'use client';
import React, { useState, useEffect, useCallback } from 'react';
import type { LinkItem } from '@/types/note';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlusCircle, Trash2, Link as LinkIcon, Edit3 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";

interface LinksSectionProps {
  links: LinkItem[];
  onSaveLink: (name: string, url: string, id?: string) => void;
  onDeleteLink: (linkId: string) => void;
}

const LinksSection: React.FC<LinksSectionProps> = ({ links, onSaveLink, onDeleteLink }) => {
  const [isClient, setIsClient] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null);
  
  const [newLinkName, setNewLinkName] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');

  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
  }, []);


  const resetForm = () => {
    setNewLinkName('');
    setNewLinkUrl('');
    setEditingLink(null);
  }

  const handleInternalSaveLink = useCallback(() => {
    if (!newLinkName.trim() || !newLinkUrl.trim()) {
      toast({ title: "Error", description: "Link name and URL cannot be empty.", variant: "destructive" });
      return;
    }
    try {
      new URL(newLinkUrl);
    } catch (_) {
      toast({ title: "Error", description: "Invalid URL format.", variant: "destructive" });
      return;
    }

    onSaveLink(newLinkName.trim(), newLinkUrl.trim(), editingLink?.id);
    
    toast({ 
      title: editingLink ? "Link Updated" : "Link Added", 
      description: `"${newLinkName.trim()}" has been ${editingLink ? 'updated' : 'added'}.` 
    });
    
    resetForm();
    setShowAddDialog(false);
  }, [newLinkName, newLinkUrl, editingLink, onSaveLink, toast]);

  const handleInternalDeleteLink = useCallback((linkId: string) => {
    if (!confirm("Are you sure you want to delete this link?")) return;
    onDeleteLink(linkId);
    toast({ title: "Link Deleted", description: "The link has been deleted." });
  }, [onDeleteLink, toast]);

  const handleEditLink = (link: LinkItem) => {
    setEditingLink(link);
    setNewLinkName(link.name);
    setNewLinkUrl(link.url);
    setShowAddDialog(true);
  };
  
  const openDialog = () => {
    resetForm();
    setShowAddDialog(true);
  }

  if (!isClient) {
    return (
      <div className="bg-transparent p-2.5 flex justify-around items-center h-48">
        Loading links...
      </div>
    );
  }

  return (
    <div className="bg-transparent p-2.5 flex flex-col h-48">
      <div className="flex items-center gap-4 mb-1">
        <Dialog open={showAddDialog} onOpenChange={(isOpen) => {setShowAddDialog(isOpen); if(!isOpen) resetForm();}}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" onClick={openDialog} className="text-accent hover:bg-accent/10">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Link
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-card text-card-foreground border-border">
            <DialogHeader>
              <DialogTitle>{editingLink ? 'Edit Link' : 'Add New Link'}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="link-name" className="text-right">Name</Label>
                <Input id="link-name" value={newLinkName} onChange={(e) => setNewLinkName(e.target.value)} className="col-span-3 bg-input text-foreground" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="link-url" className="text-right">URL</Label>
                <Input id="link-url" type="url" placeholder="https://example.com" value={newLinkUrl} onChange={(e) => setNewLinkUrl(e.target.value)} className="col-span-3 bg-input text-foreground" />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
              <Button type="button" onClick={handleInternalSaveLink} className="bg-primary text-primary-foreground hover:bg-primary/90">{editingLink ? 'Save Changes' : 'Add Link'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <h3 className="text-lg font-semibold text-primary">Quick Links</h3>
      </div>
      <ScrollArea className="flex-grow bg-card p-2 rounded-md border border-border">
        {links.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No links saved yet. Click "Add Link" to get started.</p>
        ) : (
          <div className="grid grid-cols-2 gap-1"> 
            {links.map(link => (
              <div key={link.id} className="p-1 rounded-md bg-transparent flex items-center justify-between hover:bg-secondary/30 transition-colors group">
                <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-primary hover:underline truncate flex-grow py-1">
                  <LinkIcon className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate text-sm" title={link.name}>{link.name}</span>
                </a>
                <div className='flex shrink-0'>
                  <Button variant="ghost" size="icon" onClick={() => handleEditLink(link)} className="h-6 w-6 text-muted-foreground hover:text-primary group-hover:opacity-100 md:opacity-0 transition-opacity">
                    <Edit3 className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleInternalDeleteLink(link.id)} className="h-6 w-6 text-muted-foreground hover:text-destructive group-hover:opacity-100 md:opacity-0 transition-opacity">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default LinksSection;
