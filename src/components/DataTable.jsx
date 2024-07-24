import React, { useState } from 'react'

const DataTable = ({childLinks, exportToExcel}) => {


  return (
    <div className=' flex flex-col  flex-1'>
        {/* <header className=' px-4 py-2 rounded-md w-full border shadow-sm items-start flex flex-col'>
            <span className=' font-semibold  text-black'>Keyword</span>
            <input 
                className=' w-full border p-2 rounded-md text-sm mt-2'
                placeholder={`Type the link you're looking for...`}
            />
        </header> */}
        <section  style={{
            maxHeight:700
        }} className='relative  flex-1 mt-10 px-4 py-2 rounded-md w-full border shadow-sm justify-start flex flex-col overflow-scroll '>
            <div className='  flex flex-row justify-between items-center w-full '>
                <span className=' font-semibold'>
                    Link URL
                </span>
                <span onClick={()=>{
                    exportToExcel(childLinks,'result')
                }}  className=' font-semibold cursor-pointer'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#666" class="bi bi-box-arrow-up-right" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5"/>
                    <path fill-rule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0z"/>
                    </svg>
                </span>
            </div>
            <div className=' flex-col flex '>
            {
                childLinks?.length > 0 ? (
                        childLinks.map((linkItem)=>(
                            <div
                                className=' mt-1'
                            >
                                <span>{linkItem}</span>
                            </div>
                        ))
                ):(
                    <span>
                        Scrape a web
                    </span>
                )
            }
            {/* <div className=' absolute bottom-2 right-2'>
                demo
            </div> */}
            </div>
        </section>
        </div>
  )
}

export default DataTable