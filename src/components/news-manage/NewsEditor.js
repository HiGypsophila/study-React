import React, { useEffect, useState } from 'react'
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from 'draftjs-to-html';
import { EditorState, convertToRaw, ContentState } from 'draft-js'
import htmlToDraft from 'html-to-draftjs'
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
export default function NewsEditor(props) {
  const [editorState,seteditorState]=useState("")
  //接受父组件传来的富文本框的内容
  useEffect(()=>{
    // console.log(props.content)
    const html = props.content
    if(html===undefined) return
    const contentBlock = htmlToDraft(html);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      const editorState = EditorState.createWithContent(contentState);
     seteditorState(editorState)
    }



  },[props.content])
  return (
    <div>
      <Editor
          editorState={editorState}
          toolbarClassName="aaaa"
          wrapperClassName="bbbb"
          editorClassName="cccc"
          onEditorStateChange={(editorState)=>{seteditorState(editorState)}}
          onBlur={()=>{
            // console.log(draftToHtml(convertToRaw(editorState.getCurrentContent())))
             props.getContent(draftToHtml(convertToRaw(editorState.getCurrentContent())))

          }}
/>
    </div>
  )
}
