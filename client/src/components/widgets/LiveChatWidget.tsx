import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, User, Bot } from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { atprotocol } from '@/lib/atprotocol';
import { useAuth } from '@/contexts/AuthContext';

interface LiveChatWidgetProps {
  config: {
    title: string;
    isActive: boolean;
    maxMessages: number;
    allowAnonymous: boolean;
  };
  isEditMode?: boolean;
}

export function LiveChatWidget({ config, isEditMode = false }: LiveChatWidgetProps) {
  const [newMessage, setNewMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [visitorName, setVisitorName] = useState('');
  const [showNameInput, setShowNameInput] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const { data: chatData, refetch } = useQuery({
    queryKey: ['chatMessages'],
    queryFn: () => atprotocol.getChatMessages(),
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      if (!chatData?.messages) return;
      
      const newChatMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        content: message,
        senderDid: user?.did || 'anonymous',
        senderHandle: user?.handle || visitorName || 'Anonymous',
        senderAvatar: user?.avatar || '',
        isFromOwner: !!user?.did,
        createdAt: new Date().toISOString(),
      };

      const updatedMessages = [...chatData.messages, newChatMessage];
      
      // Keep only the last maxMessages messages
      const limitedMessages = updatedMessages.slice(-(config.maxMessages || 50));
      
      await atprotocol.saveChatMessages(limitedMessages);
      return limitedMessages;
    },
    onSuccess: () => {
      setNewMessage('');
      refetch();
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatData?.messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !config.isActive) return;
    
    if (!user && !visitorName && config.allowAnonymous) {
      setVisitorName('Anonymous');
    }
    
    sendMessageMutation.mutate(newMessage);
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (visitorName.trim()) {
      setShowNameInput(false);
    }
  };

  if (isEditMode) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Live Chat Widget
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Configure your live chat in the widget editor
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!config.isActive) {
    return (
      <Card className="w-full">
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Live chat is currently offline</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader 
        className="cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            {config.title || 'Live Chat'}
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-muted-foreground">Online</span>
          </div>
        </CardTitle>
      </CardHeader>
      
      {isOpen && (
        <CardContent className="p-0">
          <div className="h-80 flex flex-col">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-3">
                {chatData?.messages?.map((message: any) => (
                  <div
                    key={message.id}
                    className={`flex gap-2 ${
                      message.isFromOwner ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={message.senderAvatar} />
                      <AvatarFallback>
                        {message.isFromOwner ? (
                          <Bot className="w-4 h-4" />
                        ) : (
                          <User className="w-4 h-4" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.isFromOwner
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <div className="text-sm font-medium mb-1">
                        {message.senderHandle}
                      </div>
                      <div className="text-sm">{message.content}</div>
                      <div className="text-xs opacity-70 mt-1">
                        {new Date(message.createdAt).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            
            <div className="border-t p-4">
              {showNameInput && !user && config.allowAnonymous ? (
                <form onSubmit={handleNameSubmit} className="space-y-2">
                  <Input
                    placeholder="Enter your name to start chatting"
                    value={visitorName}
                    onChange={(e) => setVisitorName(e.target.value)}
                    required
                  />
                  <Button type="submit" size="sm" className="w-full">
                    Start Chatting
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    disabled={sendMessageMutation.isPending}
                  />
                  <Button 
                    type="submit" 
                    size="sm"
                    disabled={!newMessage.trim() || sendMessageMutation.isPending}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              )}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
