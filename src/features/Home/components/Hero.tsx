
import banner from '@/assets/images/Paisaje.webp'


const Hero: React.FC = () => {
  return (
    <img className="w-full h-screen object-cover object-center brightness-60 " src={banner} alt="" />
    /* "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDJ8fHRvdXJpc3R8ZW58MHx8fHwxNjg5NTY1NzA0&ixlib=rb-4.0.3&q=80&w=1080" */
  )
}

export default Hero