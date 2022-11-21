import '../styles/globals.css'
import Layout from '../components/Layout'
import 'react-toastify/dist/ReactToastify.css';
import {ToastContainer} from 'react-toastify';

function MyApp({ Component, pageProps }) {
  return(
    <div className='dark:bg-slate-900 dark:text-white'>
      <Layout>
        <ToastContainer limit={1}/>
        <Component {...pageProps} />
      </Layout>
    </div>
  ) 
}

export default MyApp
