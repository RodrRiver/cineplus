import Modal from '../ui/Modal';

interface TrailerModalProps {
  videoKey: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function TrailerModal({ videoKey, isOpen, onClose }: TrailerModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Trailer">
      {videoKey && (
        <div className="aspect-video w-full">
          <iframe
            src={`https://www.youtube.com/embed/${videoKey}?autoplay=1`}
            title="Trailer"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full rounded-lg"
          />
        </div>
      )}
    </Modal>
  );
}
