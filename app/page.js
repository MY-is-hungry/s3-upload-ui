'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);

  const fetchFiles = async () => {
    const res = await fetch('/api/list-objects');
    const data = await res.json();
    setFiles(data.files);
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleUpload = async () => {
    if (!file) return alert("ファイルを選択してください");

    const res = await fetch(`/api/upload-url?filename=${file.name}&type=${file.type}`);
    const { url } = await res.json();

    await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': file.type },
      body: file,
    });

    alert('アップロード完了');
    setFile(null);
    fetchFiles();
  };

  const handleDelete = async (key) => {
    if (!confirm(`"${key}" を削除しますか？`)) return;

    await fetch('/api/delete-object', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key }),
    });

    fetchFiles();
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">S3 File Browser</h1>

      <div className="mb-4">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="mb-2"
        />
        <button
          onClick={handleUpload}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          アップロード
        </button>
      </div>

      <ul className="space-y-3">
        {files.map((file) => (
          <li key={file.key} className="border p-3 rounded flex justify-between items-center">
            <div>
              <div className="font-mono">{file.key}</div>
              <div className="text-sm text-gray-500">
                {Math.round(file.size / 1024)} KB - {new Date(file.lastModified).toLocaleString()}
              </div>
              <a
                href={`/api/download-url?key=${encodeURIComponent(file.key)}`}
                target="_blank"
                className="text-blue-500 underline text-sm"
              >
                ダウンロード
              </a>
            </div>
            <button
              onClick={() => handleDelete(file.key)}
              className="ml-4 bg-red-600 text-white px-2 py-1 rounded text-sm"
            >
              削除
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
