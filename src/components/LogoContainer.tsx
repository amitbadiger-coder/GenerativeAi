import { Link } from "react-router-dom"


const LogoContainer = () => {
  return (
    <Link to={"/"}>
    <img 
        src="/assets/svg/logo4.jfif" 
        alt="logo" 
        className="w-10 h-10 max-w-10 max-h-10 object-contain rounded-full"
    />
</Link>
  )
}

export default LogoContainer