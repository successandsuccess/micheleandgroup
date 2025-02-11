'use client'
import { ReactNode, useEffect } from 'react';
import Header from '../Header';
import { useRouter } from 'next/router';


interface MyProps {
   children?: ReactNode;
}


const Layout: React.FC<MyProps> = ({children}) => {
    const {asPath} = useRouter();
    return(
        <div className=''>
            <Header />
            <div className='max-[990px]:pt-[0px]' style={asPath !== '/' ? {paddingTop: '80px'} : {}}>
            {children}
            </div>
        </div>
    )
 }

export default Layout;