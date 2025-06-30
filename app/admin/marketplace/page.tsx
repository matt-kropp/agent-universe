'use client';
import { useState } from 'react';

export default function MarketplacePage() {
  const [file, setFile] = useState<File | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  }

  function handleUpload() {
    if (!file) return;
    alert(`Uploaded ${file.name}`);
    setFile(null);
  }

  return (
    <div className="max-w-xl mx-auto flex flex-col gap-4">
      <h2 className="text-xl font-semibold">Add Agent</h2>
      <input type="file" onChange={handleChange} />
      <button
        onClick={handleUpload}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Upload
      </button>
    </div>
  );
}
