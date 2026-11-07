import { ImagePlus, LoaderCircle, Trash2 } from 'lucide-react';
import { useId, useRef, useState } from 'react';
import { ACCEPTED_IMAGE_TYPES, readImageFile } from '../utils/imageFile';

export function ImageUpload({ value, onChange, label = 'Fotografia e historisë' }) {
  const inputId = useId();
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (file) => {
    if (!file) return;
    setError('');
    setIsReading(true);
    try {
      onChange(await readImageFile(file));
    } catch (readError) {
      setError(readError.message);
    } finally {
      setIsReading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    handleFile(event.dataTransfer.files?.[0]);
  };

  return (
    <div>
      <p className="text-sm font-semibold text-charcoal/85">
        {label} <span className="font-normal text-charcoal/60">(opsionale)</span>
      </p>

      {value ? (
        <div className="relative mt-1.5 overflow-hidden border border-charcoal/20">
          <img src={value} alt="Parapamja e fotografisë së ngarkuar" className="aspect-[16/9] w-full object-cover" />
          <div className="absolute right-3 bottom-3 flex gap-2">
            <label
              htmlFor={inputId}
              className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-full bg-cream px-4 text-sm font-semibold text-charcoal shadow-lg hover:bg-white"
            >
              <ImagePlus aria-hidden="true" className="size-4" />
              Ndrysho
            </label>
            <button
              type="button"
              onClick={() => onChange('')}
              className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-full bg-burgundy px-4 text-sm font-semibold text-cream shadow-lg hover:bg-burgundy/90"
            >
              <Trash2 aria-hidden="true" className="size-4" />
              Hiqe
            </button>
          </div>
        </div>
      ) : (
        <label
          htmlFor={inputId}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`mt-1.5 flex min-h-44 cursor-pointer flex-col items-center justify-center gap-2 border-2 border-dashed px-6 py-8 text-center transition-colors ${
            isDragging ? 'border-burgundy bg-burgundy/5' : 'border-charcoal/25 bg-white hover:border-charcoal/50'
          }`}
        >
          {isReading ? (
            <LoaderCircle aria-hidden="true" className="size-8 animate-spin text-burgundy" />
          ) : (
            <ImagePlus aria-hidden="true" className="size-8 text-terracotta" strokeWidth={1.5} />
          )}
          <span className="font-semibold">{isReading ? 'Po përgatitet fotografia…' : 'Zvarrit fotografinë këtu ose kliko për ta zgjedhur'}</span>
          <span className="text-sm text-charcoal/60">JPG, PNG ose WEBP, deri në 8 MB. Mos përfshi dokumente konfidenciale.</span>
        </label>
      )}

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES}
        onChange={(event) => handleFile(event.target.files?.[0])}
        className="sr-only"
      />
      {error && (
        <p role="alert" className="mt-1.5 text-sm font-semibold text-burgundy">
          {error}
        </p>
      )}
    </div>
  );
}
