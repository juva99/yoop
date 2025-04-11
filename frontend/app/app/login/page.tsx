import React from 'react';
import { FaGoogle, FaFacebookF } from 'react-icons/fa';

const Login = () => {
    return (
        <div className='mt-20 mx-5 text-right'>
            <h1 className='text-4xl font-bold text-blue-500'>רגע רגע...</h1>
            <h1 className='text-4xl font-bold text-blue-500'>מי אתה בכלל?</h1>
            <p className='text-2xl text-blue-900 font-bold'>נראה שאתה עדיין לא מחובר,</p>
            <p className='text-2xl text-blue-900 font-bold'>אז איך נכניס אותך למגרש?</p>
            <p className='text-gray-800 font-bold mt-2'>התחבר ותוך שנייה אתה בפנים >></p>
            <div className='mt-10'>
                <form className='flex flex-col gap-2'>
                    <label className='text-right'>אימייל</label>
                    <input type="text" placeholder='alex_manager@gmail.com' className='border border-gray-300 p-2 rounded-md text-right' />
                    <label className='text-right'>סיסמא</label>
                    <input type="password" placeholder='••••••••' className='border border-gray-300 p-2 rounded-md text-right' />
                    <button type="submit" className='bg-blue-500 text-white p-2 rounded-md'>התחבר</button>
                </form>
                <div className='flex flex-col items-start gap-2 mt-4'>
                    <h1 className='text-gray-500'>או התחבר עם</h1>
                    <div className='flex gap-4'>
                        <button className='bg-blue-600 text-white p-2 rounded-full flex items-center gap-2'>
                            <FaGoogle />
                        </button>
                        <button className='bg-blue-800 text-white p-2 rounded-full flex items-center gap-2'>
                            <FaFacebookF />
                        </button>
                    </div>
                </div>
                <p className='text-blue-500 mt-4 underline cursor-pointer'>עדיין לא רשום?</p>

            </div>
        </div>
    );
};

export default Login;