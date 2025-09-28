import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { useStories, useSaveStories } from '../hooks/use-atprotocol';
import { useToast } from '@/hooks/use-toast';
import { Story, InsertStory } from '@shared/schema';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const storyFormSchema = z.object({
  content: z.string().min(1, 'Content is required').max(500, 'Content too long'),
});

interface StoriesProps {
  isEditMode: boolean;
}

export function Stories({ isEditMode }: StoriesProps) {
  const { data: stories = [] } = useStories();
  const { mutate: saveStories } = useSaveStories();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof storyFormSchema>>({
    resolver: zodResolver(storyFormSchema),
    defaultValues: {
      content: '',
    },
  });

  const onSubmit = (values: z.infer<typeof storyFormSchema>) => {
    const newStory: Story = {
      id: Date.now().toString(),
      content: values.content,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
      createdAt: new Date().toISOString(),
    };

    const updatedStories = [...stories, newStory];
    
    saveStories(updatedStories, {
      onSuccess: () => {
        toast({
          title: 'Story added!',
          description: 'Your story will expire in 24 hours',
        });
        setIsDialogOpen(false);
        form.reset();
      },
      onError: () => {
        toast({
          title: 'Error',
          description: 'Failed to add story',
          variant: 'destructive',
        });
      },
    });
  };

  if (stories.length === 0 && !isEditMode) {
    return null;
  }

  return (
    <div className="mb-8 fade-in" data-testid="stories-section">
      <div className="flex items-center gap-3 mb-4">
        <h3 className="text-lg font-semibold text-foreground">Stories</h3>
        {isEditMode && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                className="bg-accent hover:bg-accent/80 text-accent-foreground w-8 h-8 rounded-full p-0"
                data-testid="button-add-story"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Story</DialogTitle>
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
                            placeholder="What's happening?"
                            className="min-h-[100px]"
                            data-testid="textarea-story-content"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-2">
                    <Button type="submit" data-testid="button-save-story">
                      Add Story
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                      data-testid="button-cancel-story"
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
      
      {stories.length > 0 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {stories.map((story, index) => {
            const timeLeft = new Date(story.expiresAt).getTime() - new Date().getTime();
            const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
            const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            
            return (
              <div key={story.id} className="flex-shrink-0 w-20 group" data-testid={`story-item-${story.id}`}>
                <div className="relative">
                  <div className="bg-gradient-to-br from-primary to-accent p-1 rounded-full">
                    <div className="w-16 h-16 rounded-full bg-card flex items-center justify-center text-xs text-center p-2 cursor-pointer hover:bg-muted transition-colors">
                      <span className="truncate">{story.content.slice(0, 20)}</span>
                    </div>
                  </div>
                  {isEditMode && (
                    <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          const updatedStories = stories.filter(s => s.id !== story.id);
                          saveStories(updatedStories);
                        }}
                        className="w-5 h-5 p-0 rounded-full"
                      >
                        ×
                      </Button>
                    </div>
                  )}
                </div>
                <div className="text-center mt-2">
                  <p className="text-xs text-muted-foreground truncate">
                    Story {index + 1}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {hoursLeft > 0 ? `${hoursLeft}h` : `${minutesLeft}m`} left
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
