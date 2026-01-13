interface KnowledgeManagerProps {
  onClose: () => void;
  onUpdate?: () => Promise<void>;
}

export default function KnowledgeManager({ onClose, onUpdate }: KnowledgeManagerProps) {
  return <div>Knowledge Manager</div>;
}
