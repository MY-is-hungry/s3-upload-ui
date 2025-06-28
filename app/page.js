'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [files, setFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const fetchFiles = async () => {
    const res = await fetch('/api/list-objects');
    const data = await res.json();
    setFiles(data.files || []);
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      alert("ファイルを選択してください");
      return;
    }

    for (const file of selectedFiles) {
      const res = await fetch(`/api/upload-url?filename=${file.name}&type=${file.type}`);
      const { url } = await res.json();

      await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });
    }

    alert('アップロード完了');
    setSelectedFiles([]);
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

  const groupByFolder = (files) => {
    const folders = {};
    files.forEach((file) => {
      const parts = file.key.split('/');
      const folder = parts.length > 1 ? parts[0] : 'ルート';
      if (!folders[folder]) folders[folder] = [];
      folders[folder].push(file);
    });
    return folders;
  };

  const grouped = groupByFolder(files);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">📁 S3 File Browser</h1>

      <div className="mb-6">
        <input
          type="file"
          multiple
          onChange={(e) => setSelectedFiles(Array.from(e.target.files))}
          className="mb-2 block"
        />
        <button
          onClick={handleUpload}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          アップロード
        </button>
      </div>

      {Object.entries(grouped).map(([folder, files]) => (
        <div key={folder} className="mb-8">
          <h2 className="text-lg font-bold border-b mb-2">{folder}/</h2>
          <ul className="space-y-2">
            {files.map((file) => (
              <li key={file.key} className="flex justify-between items-center border p-3 rounded">
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
                  className="ml-4 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                >
                  削除
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
