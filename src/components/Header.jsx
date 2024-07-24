import React from 'react'

const Header = () => {
  return (
    <div
        className=' w-full  h-10 flex items-center justify-start px-10 '
        style={{
            borderBottomWidth:1,
            backgroundColor:'#eeeeee80',
            borderColor:'#ccc'
            
        }}
    >
        <span className=' text-gray-600 font-semibold'>Web Scrape Tool</span>
    </div>

  )
}

export default Header