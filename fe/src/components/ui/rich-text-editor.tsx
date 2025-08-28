"use client"

import { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import Froala to avoid SSR issues
const FroalaEditor = dynamic(() => import('react-froala-wysiwyg'), { 
  ssr: false,
  loading: () => <div className="h-96 border rounded-md animate-pulse bg-gray-100" />
})

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  placeholder?: string
  height?: number
}

export function RichTextEditor({ 
  value, 
  onChange, 
  disabled = false, 
  placeholder = "Tulis konten artikel di sini...",
  height = 400 
}: RichTextEditorProps) {
  const editorRef = useRef<any>(null)

  // Import Froala CSS
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Import Froala CSS
      import('froala-editor/css/froala_style.min.css')
      import('froala-editor/css/froala_editor.min.css')
      
      // Import Froala plugins
      import('froala-editor/js/plugins.pkgd.min.js')
    }
  }, [])

  const froalaConfig = {
    placeholderText: placeholder,
    height: height,
    attribution: false,
    key: 'ZUF3hAB3A1G1D1F2F2A1A2kKYc1I1==', // Free license key
    
    // Toolbar configuration
    toolbarButtons: {
      'moreText': {
        'buttons': ['bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'fontSize', 'textColor', 'backgroundColor', 'inlineClass', 'inlineStyle', 'clearFormatting']
      },
      'moreParagraph': {
        'buttons': ['alignLeft', 'alignCenter', 'formatOLSimple', 'alignRight', 'alignJustify', 'formatOL', 'formatUL', 'paragraphFormat', 'paragraphStyle', 'lineHeight', 'outdent', 'indent', 'quote']
      },
      'moreRich': {
        'buttons': ['insertLink', 'insertImage', 'insertVideo', 'insertTable', 'emoticons', 'fontAwesome', 'specialCharacters', 'embedly', 'insertFile', 'insertHR']
      },
      'moreMisc': {
        'buttons': ['undo', 'redo', 'fullscreen', 'print', 'getPDF', 'spellChecker', 'selectAll', 'html', 'help']
      }
    },
    
    // Quick insert buttons
    quickInsertButtons: ['image', 'table', 'ul', 'ol', 'hr'],
    
    // Image settings
    imageUpload: false,
    imageInsertButtons: ['imageByURL'],
    
    // Link settings
    linkAutoPrefix: 'https://',
    linkInsertButtons: ['linkBack'],
    
    // Paste settings
    pastePlain: false,
    
    // Theme
    theme: 'royal',
    
    // Language
    language: 'id',
    
    // Events
    events: {
      'contentChanged': function() {
        if (onChange) {
          onChange(this.html.get())
        }
      }
    }
  }

  return (
    <div className="w-full froala-editor-wrapper">
      <FroalaEditor
        tag="textarea"
        config={froalaConfig}
        model={value}
        onModelChange={onChange}
      />
      
      <style jsx global>{`
        .froala-editor-wrapper .fr-toolbar {
          border-top-left-radius: 6px;
          border-top-right-radius: 6px;
        }
        .froala-editor-wrapper .fr-element {
          border-bottom-left-radius: 6px;
          border-bottom-right-radius: 6px;
          min-height: ${height}px;
        }
        .froala-editor-wrapper .fr-box {
          border-radius: 6px;
          border: 1px solid #e2e8f0;
        }
        .froala-editor-wrapper .fr-box:focus-within {
          border-color: #3b82f6;
          box-shadow: 0 0 0 1px #3b82f6;
        }
      `}</style>
    </div>
  )
}