import React, { useContext } from 'react';

import { Link, useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

const Test = () => {


    //user Info after Login
    // stored the token in localStorage or state
    const token = localStorage.getItem('token');

    fetch('http://localhost:8000/api/user-info', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log('UserInfo:', data.username);
            // Display the username in the navbar
            const usernameElement = document.getElementById('username');
            if (usernameElement) {
                usernameElement.textContent = data.username;
            }
        })
        .catch(error => {
            console.error('Error fetching user info:', error);
        });


    const navigate = useNavigate();





    // export
    const handleExport = async (format) => {
        try {
            const response = await fetch(`http://localhost:8000/api/export/${format}`);
            if (!response.ok) throw new Error('Network response was not ok');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `riders.${format}`;
            link.click();
        } catch (error) {
            console.error('Error exporting data:', error);
        }
    };

    return (
        <div>
            <nav className="flex items-center justify-between flex-wrap p-4 bg-[#f3f4f6] px-16">
                <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
                    <div className="text-base lg:flex-grow">
                        <div className="dropdown">
                            <a href="#responsive-header" className="mt-4 outline-none inline-flex justify-center items-center lg:mt-0 text-gray-700 hover:text-red-500 mr-5">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M21.2 15c.7-1.2 1-2.5.7-3.9-.6-2-2.4-3.5-4.4-3.5h-1.2c-.7-3-3.2-5.2-6.2-5.6-3-.3-5.9 1.3-7.3 4-1.2 2.5-1 6.5.5 8.8m8.7-1.6V21" /><path d="M16 16l-4-4-4 4" /></svg>
                                Import
                            </a>
                            {/* <div className="dropdown-content">
                                <NavLink to={isAuth ? "/create" : "/login"}>Filling the Form</NavLink>
                                <NavLink to={isAuth ? "/upload" : "/login"}>Upload the File</NavLink>
                            </div> */}
                        </div>
                        <div className="dropdown">
                            <a href="#responsive-header" className="mt-4 inline-flex justify-center items-center-block lg:mt-0 text-gray-700 hover:text-red-500 mr-5 dropbtn">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                                    <path d="M21.2 15c.7-1.2 1-2.5.7-3.9-.6-2-2.4-3.5-4.4-3.5h-1.2c-.7-3-3.2-5.2-6.2-5.6-3-.3-5.9 1.3-7.3 4-1.2 2.5-1 6.5.5 8.8M12 19.8V12M16 17l-4 4-4-4" />
                                </svg>
                                Export
                            </a>
                            <div className="dropdown-content">
                                <button type="button" className="relative inline-flex items-center w-full px-4 py-2 text-sm font-medium border-b border-gray-200 rounded-t-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white">
                                    <img src="https://demo.morescreens.eu/StandardPlayer/img/icons/pdf.png" className="w-7 h-7 mr-4" alt="" />
                                    PDF File
                                </button>
                                <button type="button" className="relative inline-flex items-center w-full px-4 py-2 text-sm font-medium border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white">
                                    <img src="https://demo.morescreens.eu/StandardPlayer/img/icons/xls-file.png" className="w-7 h-7 mr-4" alt="" />
                                    Excel File
                                </button>
                                <button
                                    type="button"
                                    className="relative inline-flex items-center w-full px-4 py-2 text-sm font-medium border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white"
                                    onClick={() => handleExport('json')}>
                                    <img src="https://demo.morescreens.eu/StandardPlayer/img/icons/json-file.png" className="w-7 h-7 mr-4" alt="" />
                                    JSON File
                                </button>
                                <button
                                    type="button"
                                    className="relative inline-flex items-center w-full px-4 py-2 text-sm font-medium rounded-b-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white"
                                    onClick={() => handleExport('csv')}>
                                    <img src="https://demo.morescreens.eu/StandardPlayer/img/icons/csv-file.png" className="w-7 h-7 mr-4" alt="" />
                                    CSV File
                                </button>
                            </div>
                        </div>

                        <div className="dropdown">
                            <a href="#responsive-header" className="mt-4 inline-flex justify-center items-center-block lg:mt-0 text-gray-700 hover:text-red-500">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                                Get API
                            </a>
                            {/* <div className="dropdown-content">
                                <a href="#">Filter Option 1</a>
                                <a href="#">Filter Option 2</a>
                            </div> */}
                        </div>
                    </div>

                    <form>
                        <label className="text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                        <div className="relative mr-4 w-80 text-teal-200">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                </svg>
                            </div>
                            <input type="search" id="default-search" className="block w-full p-[0.45rem] ps-10 text-sm text-gray-900 border border-gray-300 rounded bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search with name, team..." required />
                            <button type="submit" className="text-sm text-white bg-gray-500 absolute end-0.5 bottom-0.5 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded px-2 py-1.5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
                        </div>
                    </form>

                    <span id="username" className="mx-5"></span>

                    <div>

                        <button className="toggle-button inline-block text-sm px-4 py-2 leading-none border rounded text-black border-white hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0">
                            Logout
                        </button>

                        <Link to="/login">Login</Link>

                    </div>
                </div>
            </nav>
        </div>
    );
}

export default Test;
