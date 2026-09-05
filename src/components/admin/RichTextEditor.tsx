import { useRef, useEffect, useState } from 'react';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export const RichTextEditor = ({ content, onChange, placeholder }: RichTextEditorProps) => {
  const editorRef = useRef<any>(null);
  const [editorContent, setEditorContent] = useState(content || '');
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize editor content only once
  useEffect(() => {
    if (!isInitialized && content) {
      setEditorContent(content);
      setIsInitialized(true);
    }
  }, [content, isInitialized]);

  // Update editor content when prop changes (but only if editor is initialized)
  useEffect(() => {
    if (isInitialized && editorRef.current && content !== editorContent) {
      // Only update if content is different and editor exists
      const currentContent = editorRef.current.getContents(true);
      if (currentContent !== content) {
        setEditorContent(content || '');
        editorRef.current.setContents(content || '');
      }
    }
  }, [content, isInitialized]);

  // Toolbar configuration - minimal dan stabil
  const toolbarOptions = [
    ['undo', 'redo'],
    ['bold', 'underline', 'italic', 'strike'],
    ['fontColor', 'hiliteColor'],
    ['removeFormat'],
    ['outdent', 'indent'],
    ['align', 'list'],
    ['table', 'link', 'image'],
    ['fullScreen', 'codeView'],
  ];

  // Handle onChange dengan error handling
  const handleChange = (newContent: string) => {
    try {
      setEditorContent(newContent);
      onChange(newContent);
    } catch (error) {
      console.error('Error in RichTextEditor onChange:', error);
    }
  };

  return (
    <div className="w-full">
      <SunEditor
        setContents={editorContent}
        onChange={handleChange}
        setOptions={{
          height: '500px',
          buttonList: toolbarOptions,
          placeholder: placeholder || 'Tulis konten di sini...',
          formats: ['p', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
        }}
        getSunEditorInstance={(instance) => {
          if (instance) {
            editorRef.current = instance;
            if (!isInitialized && content) {
              setEditorContent(content);
              setIsInitialized(true);
            }
          }
        }}
      />
    </div>
  );
};
