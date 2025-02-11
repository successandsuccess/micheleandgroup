'use client'
import { ReactNode } from 'react';
import Header from '../Header';

interface MyProps {
   children?: ReactNode;
}

const HomeSectionLayout: React.FC<MyProps> = ({children}) => {
    return(
        <div className='layout-width'>
            {children}
        </div>
    )
 }

export default HomeSectionLayout;