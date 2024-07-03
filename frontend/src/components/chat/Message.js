import { React } from "react"

const Message = ({isUser, avatar, children }) => {
  let classList = ['chat']

  if (isUser)
    classList.push('user')

  if (!avatar)
    classList.push('no-avatar')

  return (
    <div className={classList.join(' ')}>
        {children}
    </div>
  )
}

export default Message;
