import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { atprotocol } from '@/lib/atprotocol';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Eye, Calendar, Tag, BookOpen } from 'lucide-react';

const blogPostFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().optional(),
  tags: z.string().optional(),
  isPublished: z.boolean().default(false),
  featuredImage: z.string().optional(),
});

type BlogPostFormData = z.infer<typeof blogPostFormSchema>;

export function BlogManager() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const { toast } = useToast();

  const { data: blogData, refetch } = useQuery({
    queryKey: ['blogPosts'],
    queryFn: () => atprotocol.getBlogPosts(),
  });

  const saveMutation = useMutation({
    mutationFn: async (data: BlogPostFormData) => {
      const posts = blogData?.posts || [];
      const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const tags = data.tags ? data.tags.split(',').map(tag => tag.trim()) : [];
      
      const postData = {
        id: editingPost?.id || `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: data.title,
        content: data.content,
        excerpt: data.excerpt || data.content.substring(0, 150) + '...',
        slug,
        tags,
        isPublished: data.isPublished,
        publishedAt: data.isPublished && !editingPost?.publishedAt ? new Date().toISOString() : editingPost?.publishedAt,
        views: editingPost?.views || 0,
        featuredImage: data.featuredImage,
        createdAt: editingPost?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      let updatedPosts;
      if (editingPost) {
        updatedPosts = posts.map(post => post.id === editingPost.id ? postData : post);
      } else {
        updatedPosts = [...posts, postData];
      }

      await atprotocol.saveBlogPosts(updatedPosts);
      return updatedPosts;
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: editingPost ? 'Blog post updated successfully' : 'Blog post created successfully',
      });
      setIsOpen(false);
      setEditingPost(null);
      refetch();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save blog post',
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (postId: string) => {
      const posts = blogData?.posts || [];
      const updatedPosts = posts.filter(post => post.id !== postId);
      await atprotocol.saveBlogPosts(updatedPosts);
      return updatedPosts;
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Blog post deleted successfully',
      });
      refetch();
    },
  });

  const form = useForm<BlogPostFormData>({
    resolver: zodResolver(blogPostFormSchema),
    defaultValues: {
      title: '',
      content: '',
      excerpt: '',
      tags: '',
      isPublished: false,
      featuredImage: '',
    },
  });

  const handleEdit = (post: any) => {
    setEditingPost(post);
    form.reset({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt || '',
      tags: post.tags?.join(', ') || '',
      isPublished: post.isPublished,
      featuredImage: post.featuredImage || '',
    });
    setIsOpen(true);
  };

  const handleNew = () => {
    setEditingPost(null);
    form.reset({
      title: '',
      content: '',
      excerpt: '',
      tags: '',
      isPublished: false,
      featuredImage: '',
    });
    setIsOpen(true);
  };

  const onSubmit = (data: BlogPostFormData) => {
    saveMutation.mutate(data);
  };

  const posts = blogData?.posts || [];
  const publishedPosts = posts.filter(post => post.isPublished);
  const draftPosts = posts.filter(post => !post.isPublished);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <BookOpen className="w-6 h-6" />
          Blog Posts
        </h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleNew}>
              <Plus className="w-4 h-4 mr-2" />
              New Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPost ? 'Edit Blog Post' : 'Create New Blog Post'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    {...form.register('title')}
                    placeholder="Enter blog post title"
                  />
                  {form.formState.errors.title && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.title.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="featuredImage">Featured Image URL</Label>
                  <Input
                    id="featuredImage"
                    {...form.register('featuredImage')}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  {...form.register('excerpt')}
                  placeholder="Brief description of the post (optional)"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  {...form.register('content')}
                  placeholder="Write your blog post content here..."
                  rows={10}
                />
                {form.formState.errors.content && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.content.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  {...form.register('tags')}
                  placeholder="tag1, tag2, tag3"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Separate tags with commas
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isPublished"
                  checked={form.watch('isPublished')}
                  onCheckedChange={(checked) => form.setValue('isPublished', checked)}
                />
                <Label htmlFor="isPublished">Publish immediately</Label>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={saveMutation.isPending}>
                  {saveMutation.isPending ? 'Saving...' : editingPost ? 'Update Post' : 'Create Post'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {publishedPosts.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Published Posts</h3>
            <div className="grid gap-4">
              {publishedPosts.map((post) => (
                <Card key={post.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg">{post.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {post.views} views
                          </div>
                          {post.tags && post.tags.length > 0 && (
                            <div className="flex items-center gap-1">
                              <Tag className="w-4 h-4" />
                              {post.tags.slice(0, 3).join(', ')}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(post)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteMutation.mutate(post.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {draftPosts.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Draft Posts</h3>
            <div className="grid gap-4">
              {draftPosts.map((post) => (
                <Card key={post.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg">{post.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary">Draft</Badge>
                          <span className="text-sm text-muted-foreground">
                            Last updated: {new Date(post.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(post)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteMutation.mutate(post.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {posts.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No blog posts yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first blog post to get started
              </p>
              <Button onClick={handleNew}>
                <Plus className="w-4 h-4 mr-2" />
                Create First Post
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
