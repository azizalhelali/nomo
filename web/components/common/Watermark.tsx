'use client';

export default function Watermark() {
  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
      <div className="opacity-10 dark:opacity-20">
        <img
          src="/nomo-logo.png"
          alt="watermark"
          className="w-96 h-96 object-contain"
        />
      </div>
    </div>
  );
}
