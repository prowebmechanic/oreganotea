// src/components/orga-note/LinksSection.tsx
'use client';
import type React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlusCircle, Trash2, Link as LinkIcon, Edit3 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";

interface LinkItem {
  id: string;
  name: string;
  url: string;
}

const LINKS_STORAGE_KEY = 'oreganoteLinks';

const LinksSection: React.FC = () => {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null);
  
  const [newLinkName, setNewLinkName] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');

  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      const storedLinks = localStorage.getItem(LINKS_STORAGE_KEY);
      if (storedLinks) {
        try {
          setLinks(JSON.parse(storedLinks));
        } catch (e) {
          console.error("Failed to parse links from localStorage", e);
          setLinks([]);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (isClient && typeof window !== 'undefined') {
      localStorage.setItem(LINKS_STORAGE_KEY, JSON.stringify(links));
    }
  }, [links, isClient]);

  const resetForm = () => {
    setNewLinkName('');
    setNewLinkUrl('');
    setEditingLink(null);
  }

  const handleSaveLink = useCallback(() => {
    if (!newLinkName.trim() || !newLinkUrl.trim()) {
      toast({ title: "Error", description: "Link name and URL cannot be empty.", variant: "destructive" });
      return;
    }
    try {
      // Basic URL validation
      new URL(newLinkUrl);
    } catch (_) {
      toast({ title: "Error", description: "Invalid URL format.", variant: "destructive" });
      return;
    }

    if (editingLink) {
      setLinks(prevLinks => prevLinks.map(link => 
        link.id === editingLink.id ? { ...link, name: newLinkName.trim(), url: newLinkUrl.trim() } : link
      ));
      toast({ title: "Link Updated", description: `"${newLinkName.trim()}" has been updated.` });
    } else {
      const newLink: LinkItem = {
        id: Date.now().toString(),
        name: newLinkName.trim(),
        url: newLinkUrl.trim(),
      };
      setLinks(prevLinks => [newLink, ...prevLinks]);
      toast({ title: "Link Added", description: `"${newLink.name}" has been added.` });
    }
    resetForm();
    setShowAddDialog(false);
  }, [newLinkName, newLinkUrl, editingLink, toast]);

  const handleDeleteLink = useCallback((linkId: string) => {
    if (!confirm("Are you sure you want to delete this link?")) return;
    setLinks(prevLinks => prevLinks.filter(link => link.id !== linkId));
    toast({ title: "Link Deleted", description: "The link has been deleted." });
  }, [toast]);

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
      <div className="bg-background p-2.5 border-t border-border flex justify-around items-center h-20">
        Loading links...
      </div>
    );
  }

  return (
    <div className="bg-background p-2.5 border-t border-border flex flex-col h-48">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-foreground">Quick Links</h3>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" onClick={openDialog} className="bg-accent text-accent-foreground hover:bg-accent/90">
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
                <Input id="link-name" value={newLinkName} onChange={(e) => setNewLinkName(e.target.value)} className="col-span-3 bg-input border-border text-foreground" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="link-url" className="text-right">URL</Label>
                <Input id="link-url" type="url" placeholder="https://example.com" value={newLinkUrl} onChange={(e) => setNewLinkUrl(e.target.value)} className="col-span-3 bg-input border-border text-foreground" />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
              <Button type="button" onClick={handleSaveLink} className="bg-primary text-primary-foreground hover:bg-primary/90">{editingLink ? 'Save Changes' : 'Add Link'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <ScrollArea className="flex-grow">
        {links.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No links saved yet. Click "Add Link" to get started.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {links.map(link => (
              <div key={link.id} className="p-2 border border-border rounded-md bg-card flex items-center justify-between hover:shadow-md transition-shadow">
                <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline truncate flex-grow">
                  <LinkIcon className="h-4 w-4 shrink-0" />
                  <span className="truncate" title={link.name}>{link.name}</span>
                </a>
                <div className='flex shrink-0'>
                  <Button variant="ghost" size="icon" onClick={() => handleEditLink(link)} className="h-7 w-7 text-muted-foreground hover:text-primary">
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteLink(link.id)} className="h-7 w-7 text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
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
