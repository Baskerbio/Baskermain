import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, Globe, Lock } from 'lucide-react';
import { useNotes, useSaveNotes } from '../hooks/use-atprotocol';
import { useToast } from '@/hooks/use-toast';
import { Note } from '@shared/schema';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { formatDistanceToNow } from 'date-fns';

const noteFormSchema = z.object({
  content: z.string().min(1, 'Content is required').max(500, 'Content too long'),
  isPublic: z.boolean(),
});

interface NotesProps {
  isEditMode: boolean;
}

export function Notes({ isEditMode }: NotesProps) {
  const { data: notes = [] } = useNotes();
  const { mutate: saveNotes } = useSaveNotes();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const form = useForm<z.infer<typeof noteFormSchema>>({
    resolver: zodResolver(noteFormSchema),
    defaultValues: {
      content: '',
      isPublic: true, // Default to public notes
    },
  });

  const onSubmit = (values: z.infer<typeof noteFormSchema>) => {
    let updatedNotes: Note[];

    if (editingNote) {
      // Update existing note
      updatedNotes = notes.map(note => 
        note.id === editingNote.id 
          ? { 
              ...note, 
              ...values, 
              updatedAt: new Date().toISOString() 
            }
          : note
      );
    } else {
      // Create new note
      const newNote: Note = {
        id: Date.now().toString(),
        content: values.content,
        isPublic: values.isPublic,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      updatedNotes = [...notes, newNote];
    }

    saveNotes(updatedNotes, {
      onSuccess: () => {
        toast({
          title: editingNote ? 'Note updated!' : 'Note added!',
          description: values.isPublic ? 'This note is public' : 'This note is private',
        });
        setIsDialogOpen(false);
        setEditingNote(null);
        form.reset();
      },
      onError: () => {
        toast({
          title: 'Error',
          description: 'Failed to save note',
          variant: 'destructive',
        });
      },
    });
  };

  const deleteNote = (noteId: string) => {
    const updatedNotes = notes.filter(note => note.id !== noteId);
    
    saveNotes(updatedNotes, {
      onSuccess: () => {
        toast({
          title: 'Note deleted',
          description: 'The note has been removed',
        });
      },
      onError: () => {
        toast({
          title: 'Error',
          description: 'Failed to delete note',
          variant: 'destructive',
        });
      },
    });
  };

  const startEdit = (note: Note) => {
    setEditingNote(note);
    form.setValue('content', note.content);
    form.setValue('isPublic', note.isPublic);
    setIsDialogOpen(true);
  };

  if (notes.length === 0 && !isEditMode) {
    return null;
  }

  return (
    <div className="mb-8 fade-in" data-testid="notes-section">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Quick Notes</h3>
        {isEditMode && (
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              setEditingNote(null);
              form.reset();
            }
          }}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                className="bg-secondary hover:bg-secondary/80 text-secondary-foreground"
                data-testid="button-add-note"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Note
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingNote ? 'Edit Note' : 'Add Note'}</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="What's on your mind?"
                            className="min-h-[100px]"
                            data-testid="textarea-note-content"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="isPublic"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Public Note</FormLabel>
                          <div className="text-sm text-muted-foreground">
                            Make this note visible to others
                          </div>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            data-testid="switch-note-public"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-2">
                    <Button type="submit" data-testid="button-save-note">
                      {editingNote ? 'Update Note' : 'Add Note'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                      data-testid="button-cancel-note"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      {notes.length > 0 && (
        <div className="space-y-3">
          {notes.map((note) => (
            <Card key={note.id} className="card-hover group" data-testid={`note-${note.id}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${note.isPublic ? 'bg-accent' : 'bg-muted'}`} />
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      {note.isPublic ? (
                        <>
                          <Globe className="w-3 h-3" />
                          Public
                        </>
                      ) : (
                        <>
                          <Lock className="w-3 h-3" />
                          Private
                        </>
                      )}
                    </span>
                  </div>
                  {isEditMode && (
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="glass"
                        className="h-6 w-6 p-0 hover:scale-105 transition-all duration-200"
                        onClick={() => startEdit(note)}
                        data-testid={`button-edit-note-${note.id}`}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="glass"
                        className="h-6 w-6 p-0 text-destructive hover:text-destructive/80 hover:scale-105 transition-all duration-200"
                        onClick={() => deleteNote(note.id)}
                        data-testid={`button-delete-note-${note.id}`}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>
                <p className="text-foreground text-sm leading-relaxed mb-2" data-testid={`text-note-content-${note.id}`}>
                  {note.content}
                </p>
                <p className="text-xs text-muted-foreground" data-testid={`text-note-time-${note.id}`}>
                  {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
