// AT Protocol Lexicon definitions for BaskerBio
// These define the schema for our custom record types

export const BASKER_LEXICONS = {
  'app.linkbio.links': {
    lexicon: 1,
    id: 'app.linkbio.links',
    type: 'record',
    description: 'BaskerBio links collection',
    record: {
      type: 'object',
      required: ['links'],
      properties: {
        links: {
          type: 'array',
          items: {
            type: 'object',
            required: ['id', 'title', 'url'],
            properties: {
              id: { type: 'string' },
              title: { type: 'string' },
              url: { type: 'string' },
              description: { type: 'string' },
              icon: { type: 'string' },
              group: { type: 'string' },
              order: { type: 'number' },
              enabled: { type: 'boolean' },
              // Scheduling options
              isScheduled: { type: 'boolean' },
              scheduledStart: { type: 'string' },
              scheduledEnd: { type: 'string' },
              // Customization options
              backgroundColor: { type: 'string' },
              textColor: { type: 'string' },
              fontFamily: { type: 'string' },
              fontWeight: { type: 'string' },
              containerShape: { type: 'string' },
              autoTextColor: { type: 'boolean' },
              iconColor: { type: 'string' },
              iconBorderWidth: { type: 'number' },
              iconBorderColor: { type: 'string' },
              iconBorderShape: { type: 'string' },
              borderColor: { type: 'string' },
              borderWidth: { type: 'number' },
              borderStyle: { type: 'string' },
              pattern: { type: 'string' },
              patternColor: { type: 'string' },
              pixelTransition: { type: 'boolean' },
              pixelTransitionText: { type: 'string' },
              pixelTransitionColor: { type: 'string' },
              pixelTransitionGridSize: { type: 'number' },
              pixelTransitionDuration: { type: 'number' },
              createdAt: { type: 'string' },
              updatedAt: { type: 'string' }
            }
          }
        },
        createdAt: { type: 'string' },
        updatedAt: { type: 'string' }
      }
    }
  },
  
  'app.linkbio.notes': {
    lexicon: 1,
    id: 'app.linkbio.notes',
    type: 'record',
    description: 'BaskerBio notes collection',
    record: {
      type: 'object',
      required: ['notes'],
      properties: {
        notes: {
          type: 'array',
          items: {
            type: 'object',
            required: ['id', 'content'],
            properties: {
              id: { type: 'string' },
              content: { type: 'string' },
              createdAt: { type: 'string' },
              updatedAt: { type: 'string' }
            }
          }
        },
        createdAt: { type: 'string' },
        updatedAt: { type: 'string' }
      }
    }
  },

  'app.linkbio.stories': {
    lexicon: 1,
    id: 'app.linkbio.stories',
    type: 'record',
    description: 'BaskerBio stories collection',
    record: {
      type: 'object',
      required: ['stories'],
      properties: {
        stories: {
          type: 'array',
          items: {
            type: 'object',
            required: ['id', 'content'],
            properties: {
              id: { type: 'string' },
              content: { type: 'string' },
              expiresAt: { type: 'string' },
              createdAt: { type: 'string' },
              updatedAt: { type: 'string' }
            }
          }
        },
        createdAt: { type: 'string' },
        updatedAt: { type: 'string' }
      }
    }
  },

  'app.linkbio.settings': {
    lexicon: 1,
    id: 'app.linkbio.settings',
    type: 'record',
    description: 'BaskerBio settings collection',
    record: {
      type: 'object',
      properties: {
        settings: {
          type: 'object',
          properties: {
            theme: { type: 'string' },
            layout: { type: 'string' },
            customCSS: { type: 'string' },
            customDomain: { type: 'string' }
          }
        },
        createdAt: { type: 'string' },
        updatedAt: { type: 'string' }
      }
    }
  },

  'app.linkbio.widgets': {
    lexicon: 1,
    id: 'app.linkbio.widgets',
    type: 'record',
    description: 'BaskerBio widgets collection',
    record: {
      type: 'object',
      required: ['widgets'],
      properties: {
        widgets: {
          type: 'array',
          items: {
            type: 'object',
            required: ['id', 'type'],
            properties: {
              id: { type: 'string' },
              type: { type: 'string' },
              config: { type: 'object' },
              order: { type: 'number' },
              createdAt: { type: 'string' },
              updatedAt: { type: 'string' }
            }
          }
        },
        createdAt: { type: 'string' },
        updatedAt: { type: 'string' }
      }
    }
  }
};

// Helper function to validate record against lexicon
export function validateRecord(lexiconId: string, record: any): boolean {
  const lexicon = BASKER_LEXICONS[lexiconId as keyof typeof BASKER_LEXICONS];
  if (!lexicon) return false;
  
  // Basic validation - in a real implementation, you'd use a proper JSON schema validator
  return record && typeof record === 'object';
}
