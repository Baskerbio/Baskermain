import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { SocialLink } from '@shared/schema';
import { SocialIconEditor } from './SocialIconEditor';

interface DraggableSocialIconsProps {
  socialLinks: SocialLink[];
  onReorder: (links: SocialLink[]) => void;
  onUpdate: (updatedLink: SocialLink) => void;
  onRemove: (linkId: string) => void;
  onToggleEnabled: (linkId: string) => void;
}

export function DraggableSocialIcons({ 
  socialLinks, 
  onReorder, 
  onUpdate, 
  onRemove, 
  onToggleEnabled 
}: DraggableSocialIconsProps) {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(socialLinks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order property
    const reorderedLinks = items.map((link, index) => ({
      ...link,
      order: index,
    }));

    onReorder(reorderedLinks);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="social-icons">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-2"
          >
            {socialLinks.map((link, index) => (
              <Draggable key={link.id} draggableId={link.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={`transition-all duration-200 ${
                      snapshot.isDragging ? 'opacity-50 scale-105' : ''
                    }`}
                  >
                    <div
                      {...provided.dragHandleProps}
                      className="cursor-grab active:cursor-grabbing"
                    >
                      <SocialIconEditor
                        link={link}
                        onUpdate={onUpdate}
                        onRemove={onRemove}
                        onToggleEnabled={onToggleEnabled}
                      />
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
