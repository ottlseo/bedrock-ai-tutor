import { React } from "react"

const Avatar = ({src}) => {
  return (
     <div className='avatar'>
        <img src={src} alt="profile" draggable="false" />
     </div>
  )
};

export default Avatar;
