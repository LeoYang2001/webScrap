import React from 'react'
import cheerio from 'cheerio';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useState} from 'react'
import DataTable from './DataTable';


const WebScrap = ({setHtmlContent, setIsFilter, isFilter, isDepthLevel, setIsDepthLevel}) => {

const [childLinks, setChildLinks] = useState([])

const [scrapeLink, setScrapeLink] = useState('')
const [baseUrl, setBaseUrl] = useState("")
const [depthLevel, setDepthLevel] = useState(1)
const [isScraping, setIsScraping] = useState(false)
// mode: url, baseUrl 
const [filterMode, setFilterMode] = useState('url')


 const handleScrapeAllLinks = async ()=>{
  // reset scraped links 
  setChildLinks([])
  setIsScraping(true)
   await scrapeLinks(scrapeLink, depthLevel)
  setIsScraping(false)

 }

 const getHtmlContent = async (url)=>{
  try {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const result =  await response.text();
    return result

} catch (error) {
    console.error("Error fetching HTML:", error);
    return null;
}
}

const getLinksFromUl = async (htmlContent) => {
  const $ = cheerio.load(htmlContent);
  const links = [];

//   $('ul').find('a').each(function () {
//     links.push($(this).attr('href'));
//   });
  $('ul').find('a').each(function () {
    links.push($(this).attr('href'));
  });

  return links

}

const scrapeLinks = async (url, depth) => {
  if(depth === 0) return []

  try {
    const htmlContent = await getHtmlContent(url)
    if(depth === depthLevel)
    {
    setHtmlContent(htmlContent)
    }
    if (!htmlContent) {
            return [];
        }
        
        const links = await getLinksFromUl(htmlContent);
    const fullLinks = links.map(link => baseUrl + link);

    let allLinks = [...fullLinks]
    for (const link of fullLinks) {
      const childLinks = await scrapeLinks(link, depth - 1);
      allLinks = [...allLinks, ...childLinks];
      if(depth == 1)
      {
        setChildLinks(prevLinks => [...prevLinks, link])
      }
    } 
    return allLinks
  } catch (error) {
    
  }
}


const exportToExcel = (dataArray, fileName) => {
  const dataRows = dataArray.map(link => [link]); // Convert each link into a separate array element

  const ws = XLSX.utils.aoa_to_sheet(dataRows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Links');

  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

  const buffer = new ArrayBuffer(wbout.length);
  const view = new Uint8Array(buffer);
  for (let i = 0; i < wbout.length; i++) {
    view[i] = wbout.charCodeAt(i) & 0xff;
  }

  saveAs(
    new Blob([buffer], { type: 'application/octet-stream' }),
    `${fileName}.xlsx`
  );
};

const handleScrapeLinkBtn = ()=>{
    if(!scrapeLink)
        return alert('input the url you want to scrape')
    if(!baseUrl)
        return alert('input the baseUrl you want to scrape')
    handleScrapeAllLinks()
}

  return (
      <div className=' flex  h-full w-full flex-col gap-4  p-6  '>
            <div className='  h-10 flex flex-row justify-start rounded-md select-none'>
                <div
                className=' relative  z-40 flex justify-center items-center font-semibold'
               
                >
                    <span
                    onClick={()=>{
                        setIsFilter(true)
                    }}
                     style={{
                        borderTopLeftRadius:6,
                        borderBottomLeftRadius:6,
                        width:100,
                        borderColor: isFilter ? '#719de3':'#ccc',
                        borderWidth: isFilter ? 2 : 1
                    }}
                    className={`filter border   w-full h-full flex justify-between  px-4 items-center  cursor-pointer ${filterMode === 'url' ? 'text-green-700' : 'text-yellow-700'}`}>
                        {
                            filterMode === 'url' ? (
                                'URL'
                            ):(
                                'Base'
                            )
                        }
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16" >
                        <path fill='#aaa' fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"/>
                        </svg>
                    </span>
                    {
                        isFilter && (
                            <div className=' absolute border w-32 left-0 top-12 p-2 rounded-md flex flex-col gap-3  bg-white shadow-lg  text-sm'>
                        <span onClick={()=>{
                            setFilterMode('url')
                        }} className={`filterOpt ${filterMode === 'url' ? 'filterOpt-active' : 'filterOpt-inactive'} text-green-700 text-left`}>URL</span>
                        <span onClick={()=>{
                            setFilterMode('baseUrl')
                        }} className={`filterOpt ${filterMode === 'baseUrl' ? 'filterOpt-active' : 'filterOpt-inactive'} text-yellow-700 text-left`}>BaseURL</span>
                    </div>    
                        )
                    }      
                </div>
                
                {
                    filterMode === 'url' ? (
                        <input
                style={{
                    borderTopRightRadius:6,
                    borderBottomRightRadius:6,
                    borderColor:'#ccc'
                }}
                value={scrapeLink}
                onChange={(e)=>{
                    setScrapeLink(e.target.value)
                }}
                    className=' border h-full  flex-1 px-4'
                    placeholder='Type the URL...'
                />
                    ):(
                        <input
                style={{
                    borderTopRightRadius:6,
                    borderBottomRightRadius:6,
                    borderColor:'#ccc'
                }}
                    className=' border h-full  flex-1 px-4'
                    placeholder='Type the BaseURL...'
                    value={baseUrl}
                    onChange={(e)=>{
                        setBaseUrl(e.target.value)
                    }}
                />
                    )
                }
                 <div
                 style={{
                    width:100,
                }}
                 className=' h-10 ml-2 relative  rounded-md flex flex-row items-center text-white font-semibold'>

                    {
                        isDepthLevel && (
                            <div
                        className=' z-30  rounded-md border top-12 right-0 absolute flex-row flex items-center p-2  bg-white shadow-lg text-black '
                    >
                        <span className='text-sm mr-4'>
                            depth 
                        </span>
                        <input 
                        id='depthLevel'
                        className='border pl-2 w-10'
                        placeholder='input your base url'
                        type='number'
                        maxLength={1}
                        value={depthLevel}
                        onChange={(e)=>{
                        setDepthLevel(e.target.value)
                        }}
                        />
                    </div>
                        )
                    }
                <div
                
                style={{
                    borderTopLeftRadius:6,
                    borderBottomLeftRadius:6,
                }}
                onClick={handleScrapeLinkBtn}
                className='btn p-4  h-full items-center text-sm flex'>
                    Scrape
                </div>
                <div 
                    onClick={()=>{
                        setIsDepthLevel(true)
                    }}
                style={{
                    borderTopRightRadius:6,
                    borderBottomRightRadius:6,
                    borderLeftWidth:1,
                    borderColor:'#00000020',
                }}
                className='btn w-full h-full flex-1 flex  items-center justify-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"/>
                    </svg>
                </div>
            </div>
            </div>
                <DataTable exportToExcel={exportToExcel} childLinks={childLinks} />
      </div>
      
   
  )
}

export default WebScrap

// <div className=' flex flex-row gap-2 justify-center items-center '>
// <div className=' w-40   flex justify-end'>
// <label 
//     htmlFor='scrapeUrl'
//     className=' text-xl font-bold'
// >Scraped URL</label>
// </div>
// <input 
// id='scrapeUrl'
// className='border w-80 pl-2'
// placeholder='input the url you want to scrape'
// value={scrapeLink}
// onChange={(e)=>{
//   setScrapeLink(e.target.value)
// }}
// />
// </div>
// <div className=' flex flex-row gap-2 justify-center items-center'>
// <div className=' w-40  flex justify-end'>
// <label 
// htmlFor='baseUrl'
// className=' text-xl font-bold'
// >Base URL</label>
// </div>
// <input 
// id='baseUrl'
// className='border w-80 pl-2'
// placeholder='input your base url'
// value={baseUrl}
// onChange={(e)=>{
//   setBaseUrl(e.target.value)
// }}
// />
// </div>


// <div className=' flex flex-row gap-2 justify-center items-center'>
// <div className=' w-40  flex justify-end'>
// <label 
// htmlFor='depthLevel'
// className=' text-xl font-bold'
// >Depth Level</label>
// </div>
// <input 
// id='depthLevel'
// className='border pl-2'
// placeholder='input your base url'
// type='number'
// value={depthLevel}
// onChange={(e)=>{
//   setDepthLevel(e.target.value)
// }}
// />
// </div>
// {
// isScraping ? (
// <button
// disabled={true}
// className='border p-2 rounded-md bg-gray-500 text-white  font-semibold'
// onClick={()=>{
// handleScrapeAllLinks()
// }}>
// scraping...
// </button>
// ):(
// <button

// className='border p-2 rounded-md bg-gray-500 text-white  font-semibold'
// onClick={()=>{
// handleScrapeAllLinks()
// }}>
// scrape the link
// </button>
// )
// }

// {
// (childLinks.length > 0 && !isScraping) && (
// <button 
// className='border p-2 rounded-md bg-gray-500 text-white  font-semibold'

// onClick={()=>{
// exportToExcel(childLinks, 'result')
// }}>
// download excel 
// </button>
// )
// }
