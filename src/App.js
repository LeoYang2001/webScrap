import { useState } from 'react';
import './App.css';
import Header from './components/Header';
import WebScrap from './components/WebScrap';
import CodeMirror from "@uiw/react-codemirror";
import DataTable from './components/DataTable';



function App() {

 const [htmlContent, setHtmlContent] = useState('')

 const [isFilter, setIsFilter] = useState(false)
 const [isDepthLevel, setIsDepthLevel] = useState(false)

 
  
  return (
    <div className="App border absolute w-full h-full flex flex-col">
          {
            isFilter && (
              <div onClick={()=>{
                setIsFilter(false)
              }} className=' absolute w-full h-full bg-transparent z-20'></div>
            )
          }
           {
            isDepthLevel && (
              <div onClick={()=>{
                setIsDepthLevel(false)
              }} className=' absolute w-full h-full bg-transparent z-20'></div>
            )
          }
          <Header />
          <div className=' flex-1 flex flex-row '>
            <div style={{width: 800}}>
              <WebScrap setIsFilter={setIsFilter} isDepthLevel={isDepthLevel} setIsDepthLevel={setIsDepthLevel} isFilter={isFilter} setHtmlContent={setHtmlContent} />
            </div>
            <div style={{ height:'calc(100vh - 40px)'}} className='flex-1  border overflow-scroll'>
              {
                htmlContent && (
                  <CodeMirror
                  value={htmlContent}
                  height="100%"
                />
                )
              }
            </div>
          </div>
    </div>
  );
}

export default App;
