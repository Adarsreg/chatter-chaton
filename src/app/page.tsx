import { FC } from 'react'
import Button from './components/ui/Button'
interface pageProps {

}
//children refers to the content inside the button
const page: FC<pageProps> = ({ }) => {
  return <Button >click here</Button>
}


export default page