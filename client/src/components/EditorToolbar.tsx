import React from "react";
import { useEditor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Heading2,
  Quote,
  Code,
  Undo,
  Redo,
  Plus,
  Minus,
} from "lucide-react";
import TextAlign from "@tiptap/extension-text-align";


interface ToolbarProps {
  editor: ReturnType<typeof useEditor>;
}

const EditorToolbar: React.FC<ToolbarProps> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="editor-toolbar flex flex-wrap space-x-4 p-2 bg-gray-100 border border-gray-300 rounded-lg shadow-md">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded-md transition-colors duration-200 ${
          editor.isActive("bold")
            ? "bg-blue-500 text-white"
            : "text-gray-700 hover:bg-gray-200"
        }`}
        aria-label="Bold"
      >
        <Bold size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded-md transition-colors duration-200 ${
          editor.isActive("italic")
            ? "bg-blue-500 text-white"
            : "text-gray-700 hover:bg-gray-200"
        }`}
        aria-label="Italic"
      >
        <Italic size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`p-2 rounded-md transition-colors duration-200 ${
          editor.isActive("underline")
            ? "bg-blue-500 text-white"
            : "text-gray-700 hover:bg-gray-200"
        }`}
        aria-label="Underline"
      >
        <Underline size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded-md transition-colors duration-200 ${
          editor.isActive("bulletList")
            ? "bg-blue-500 text-white"
            : "text-gray-700 hover:bg-gray-200"
        }`}
        aria-label="Bullet List"
      >
        <List size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded-md transition-colors duration-200 ${
          editor.isActive("orderedList")
            ? "bg-blue-500 text-white"
            : "text-gray-700 hover:bg-gray-200"
        }`}
        aria-label="Ordered List"
      >
        <ListOrdered size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={
          editor.isActive("heading", { level: 2 })
            ? "bg-sky-700 text-white p-2 rounded-lg"
            : "text-sky-400"
        }
      >
        <Heading2 className="w-5 h-5" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-2 rounded-md transition-colors duration-200 ${
          editor.isActive("blockquote")
            ? "bg-blue-500 text-white"
            : "text-gray-700 hover:bg-gray-200"
        }`}
        aria-label="Blockquote"
      >
        <Quote size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={`p-2 rounded-md transition-colors duration-200 ${
          editor.isActive("code")
            ? "bg-blue-500 text-white"
            : "text-gray-700 hover:bg-gray-200"
        }`}
        aria-label="Code"
      >
        <Code size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className={`p-2 rounded-md transition-colors duration-200 ${
          editor.isActive({ textAlign: "left" })
            ? "bg-blue-500 text-white"
            : "text-gray-700 hover:bg-gray-200"
        }`}
        aria-label="Align Left"
      >
        Left
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={`p-2 rounded-md transition-colors duration-200 ${
          editor.isActive({ textAlign: "center" })
            ? "bg-blue-500 text-white"
            : "text-gray-700 hover:bg-gray-200"
        }`}
        aria-label="Align Center"
      >
        Center
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className={`p-2 rounded-md transition-colors duration-200 ${
          editor.isActive({ textAlign: "right" })
            ? "bg-blue-500 text-white"
            : "text-gray-700 hover:bg-gray-200"
        }`}
        aria-label="Align Right"
      >
        Right
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        className={`p-2 rounded-md transition-colors duration-200 ${
          editor.isActive({ textAlign: "justify" })
            ? "bg-blue-500 text-white"
            : "text-gray-700 hover:bg-gray-200"
        }`}
        aria-label="Align Justify"
      >
        Justify
      </button>
     {/*  <button
        onClick={() => editor.chain().focus().indent().run()} // Use `indent` directly
        className={`p-2 rounded-md transition-colors duration-200 ${
          editor.isActive("indent")
            ? "bg-blue-500 text-white"
            : "text-gray-700 hover:bg-gray-200"
        }`}
        aria-label="Indent"
      >
        <Plus size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().outdent().run()}
        className={`p-2 rounded-md transition-colors duration-200 ${
          editor.isActive("indent")
            ? "bg-blue-500 text-white"
            : "text-gray-700 hover:bg-gray-200"
        }`}
        aria-label="Outdent"
      >
        <Minus size={16} />
      </button> */}
      <button
        onClick={() => editor.chain().focus().undo().run()}
        className={`p-2 rounded-md transition-colors duration-200 text-gray-700 hover:bg-gray-200`}
        aria-label="Undo"
      >
        <Undo size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        className={`p-2 rounded-md transition-colors duration-200 text-gray-700 hover:bg-gray-200`}
        aria-label="Redo"
      >
        <Redo size={16} />
      </button>
    </div>
  );
};

export default EditorToolbar;
