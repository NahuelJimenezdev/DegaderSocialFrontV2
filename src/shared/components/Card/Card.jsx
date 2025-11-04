import CardHeader from './CardHeader'
import CardBody from './CardBody'

const Card = ({
  title,
  subtitle,
  thumbnail,
  icon,
  iconBody,
  color,
  overlayText,
  timeAgo,
  onClick,
  variant = 'default',
  children
}) => {
  return (
    <div
      onClick={onClick}
      className="flex flex-col bg-white dark:bg-[#1F2937] rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer"
    >
      <CardHeader
        thumbnail={thumbnail}
        color={color}
        icon={icon}
        overlayText={overlayText}
        timeAgo={timeAgo}
      />
      <CardBody title={title} subtitle={subtitle} icon={iconBody}>
        {children}
      </CardBody>
    </div>
  )
}

export default Card
