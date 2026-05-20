"use client";

import React, { useRef, useMemo } from 'react';
import dynamic from 'next/dynamic';

const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

interface JoditEditorWrapperProps {
  content: string;
  setContent: (newContent: string) => void;
}

export default function JoditEditorWrapper({ content, setContent }: JoditEditorWrapperProps) {
  const editor = useRef(null);

  const config = useMemo(() => ({
    readonly: false,
    height: 600,
    placeholder: 'Start typing your article here...',
    uploader: {
      insertImageAsBase64URI: false,
      url: '/api/upload',
      format: 'json',
      method: 'POST',
      prepareData: function (formData: FormData) {
        formData.append('folder', 'articles');
        // Jodit automatically appends the file as 'files[0]' by default.
        // If your API expects 'file', map it before sending:
        const file = formData.get('files[0]');
        if (file) {
          formData.append('file', file);
          formData.delete('files[0]');
        }
        return formData;
      },
      isSuccess: function (resp: any) {
        return !resp.error;
      },
      process: function (resp: any) {
        // Must return an object that Jodit expects for inserting images
        return {
          files: [resp.fileUrl],
          path: resp.fileUrl,
          baseurl: '',
          error: resp.error ? 1 : 0,
          msg: resp.error || 'Success'
        };
      },
      defaultHandlerSuccess: function (data: any) {
        // @ts-ignore
        this.jodit.selection.insertImage(data.files[0], null, 500);
      },
      error: function (e: any) {
        console.error("Jodit upload error:", e);
      }
    },
    // We can enable specific buttons including image
    buttons: [
      'source', '|',
      'bold', 'strikethrough', 'underline', 'italic', '|',
      'ul', 'ol', '|',
      'outdent', 'indent', '|',
      'font', 'fontsize', 'brush', 'paragraph', '|',
      'image', 'video', 'table', 'link', '|',
      'align', 'undo', 'redo', '|',
      'hr', 'eraser', 'copyformat', '|',
      'symbol', 'fullsize', 'print', 'about'
    ]
  }), []);

  return (
    <div className="bg-white text-black min-h-[600px] border border-gray-300 rounded-md overflow-hidden z-10 relative">
      <JoditEditor
        ref={editor}
        value={content}
        config={config}
        onBlur={(newContent) => setContent(newContent)}
        onChange={(newContent) => {}}
      />
    </div>
  );
}
