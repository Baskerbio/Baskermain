import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, BarChart3, Users } from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { atprotocol } from '@/lib/atprotocol';

interface PollWidgetProps {
  config: {
    question: string;
    options: Array<{
      id: string;
      text: string;
      votes: number;
    }>;
    allowMultiple: boolean;
    expiresAt?: string;
    isActive: boolean;
    totalVotes: number;
  };
  isEditMode?: boolean;
}

export function PollWidget({ config, isEditMode = false }: PollWidgetProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const { data: pollsData, refetch } = useQuery({
    queryKey: ['polls'],
    queryFn: () => atprotocol.getPolls(),
  });

  const voteMutation = useMutation({
    mutationFn: async (optionIds: string[]) => {
      if (!pollsData?.polls) return;
      
      const updatedPolls = pollsData.polls.map((poll: any) => {
        if (poll.id === config.id) {
          const updatedOptions = poll.options.map((option: any) => {
            if (optionIds.includes(option.id)) {
              return { ...option, votes: option.votes + 1 };
            }
            return option;
          });
          
          return {
            ...poll,
            options: updatedOptions,
            totalVotes: poll.totalVotes + optionIds.length,
            updatedAt: new Date().toISOString(),
          };
        }
        return poll;
      });

      await atprotocol.savePolls(updatedPolls);
      return updatedPolls;
    },
    onSuccess: () => {
      setHasVoted(true);
      setShowResults(true);
      refetch();
    },
  });

  const handleOptionClick = (optionId: string) => {
    if (hasVoted || !config.isActive) return;

    if (config.allowMultiple) {
      setSelectedOptions(prev => 
        prev.includes(optionId) 
          ? prev.filter(id => id !== optionId)
          : [...prev, optionId]
      );
    } else {
      setSelectedOptions([optionId]);
    }
  };

  const handleVote = () => {
    if (selectedOptions.length === 0) return;
    voteMutation.mutate(selectedOptions);
  };

  const isExpired = config.expiresAt && new Date(config.expiresAt) < new Date();

  if (isEditMode) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Poll Widget
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Configure your poll in the widget editor
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!config.isActive || isExpired) {
    return (
      <Card className="w-full">
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">
            {isExpired ? 'This poll has expired' : 'This poll is not active'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">{config.question}</CardTitle>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {config.totalVotes} votes
          </div>
          {config.allowMultiple && (
            <span>Multiple choice</span>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!hasVoted && !showResults ? (
          <>
            <div className="space-y-2">
              {config.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleOptionClick(option.id)}
                  className={`w-full p-3 text-left rounded-lg border transition-colors ${
                    selectedOptions.includes(option.id)
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {config.allowMultiple ? (
                      <div className={`w-4 h-4 rounded border-2 ${
                        selectedOptions.includes(option.id)
                          ? 'border-primary bg-primary'
                          : 'border-muted-foreground'
                      }`}>
                        {selectedOptions.includes(option.id) && (
                          <CheckCircle className="w-3 h-3 text-white" />
                        )}
                      </div>
                    ) : (
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        selectedOptions.includes(option.id)
                          ? 'border-primary bg-primary'
                          : 'border-muted-foreground'
                      }`} />
                    )}
                    <span>{option.text}</span>
                  </div>
                </button>
              ))}
            </div>
            <Button 
              onClick={handleVote}
              disabled={selectedOptions.length === 0 || voteMutation.isPending}
              className="w-full"
            >
              {voteMutation.isPending ? 'Voting...' : 'Vote'}
            </Button>
          </>
        ) : (
          <div className="space-y-3">
            {config.options.map((option) => {
              const percentage = config.totalVotes > 0 
                ? (option.votes / config.totalVotes) * 100 
                : 0;
              
              return (
                <div key={option.id} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{option.text}</span>
                    <span className="text-muted-foreground">
                      {option.votes} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
            <div className="pt-2 text-center">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowResults(!showResults)}
              >
                {showResults ? 'Hide Results' : 'Show Results'}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
