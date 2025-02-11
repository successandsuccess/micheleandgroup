'use client'
import { ReactNode } from 'react';
import Header from '../Header';

interface MyProps {
   children?: ReactNode;
}

const CardLayout: React.FC<MyProps> = ({children}) => {
    return(
        <div className='p-5 rounded-2xl shadow-md border-[1px]'>
            {children}
        </div>
    )
 }

export default CardLayout;