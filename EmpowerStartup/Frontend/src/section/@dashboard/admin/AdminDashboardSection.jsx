import React, { useCallback, useEffect, useState } from 'react';
import { RecentStartups, StartupProgessGraph, SummarySection } from './components';
import { Post } from 'src/actions/API/apiActions';
import { Post_GetAllStartupSalesReport_URL, Post_GetAllStartupsWithoutPagination_URL, Post_GetSummaryDashboard_URL } from 'src/constants/apiURLs';

// const summary = [
//     {
//         title: 'Donation',
//         value: 'Rs: 100k',
//         rate: '16%',
//         direction: 'up'
//     },
//     {
//         title: 'Startups',
//         value: '50',
//         rate: '16%',
//         direction: 'down'
//     },
//     {
//         title: 'Suppliers',
//         value: '30',
//         rate: '18%',
//         direction: 'up'
//     },
//     {
//         title: 'Auditors',
//         value: '10',
//         rate: '26%',
//         direction: 'up'
//     },

// ]

// const recentStartups = [
//     {
//         title: 'StartUp 1',
//         description: 'This startup was introduces by john deo'
//     },
//     {
//         title: 'StartUp 2',
//         description: 'This startup was introduces by john deo'
//     },
//     {
//         title: 'StartUp 3',
//         description: 'This startup was introduces by john deo'
//     },
//     {
//         title: 'StartUp 4',
//         description: 'This startup was introduces by john deo'
//     },
// ]
function AdminDashboardSection(props) {
    const [recentStartups, setRecentStartups] = useState([])
    const [summary, setsummary] = useState([])
    const [salesSummary, setSalesSummary] = useState([])

    const getSummaryDashBaord = useCallback(() => {
        try {
            Post(
                {},
                Post_GetSummaryDashboard_URL,
                resp => {
                    console.log("hgsdfdsfdsfds", resp?.data?.summary)
                    setsummary(resp?.data?.summary)
                },
                error => {

                }
            )
        } catch (error) {

        }
    }, [])
    const getStartupsWithoutPagination = useCallback(() => {
        try {
            Post(
                { role: "Admin" },
                Post_GetAllStartupsWithoutPagination_URL,
                resp => {
                    console.log("hgsdfdsfdsfds", resp?.data?.startups)
                    setRecentStartups(resp?.data?.startups)
                },
                error => {

                }
            )
        } catch (error) {

        }
    }, [])
    const getAllStartupSalesReport = useCallback(() => {
        try {
            Post(
                { role: "Admin" },
                Post_GetAllStartupSalesReport_URL,
                resp => {
                    console.log("hgsdfdsfdsfds", resp?.data?.salesSummary)
                    setSalesSummary(resp?.data?.salesSummary)
                },
                error => {

                }
            )
        } catch (error) {

        }
    }, [])
    useEffect(() => {
        getStartupsWithoutPagination()
        getSummaryDashBaord()
        getAllStartupSalesReport()
    }, [getStartupsWithoutPagination, getSummaryDashBaord,getAllStartupSalesReport])

    return (
        <div>
            <SummarySection summary={summary} />
            <RecentStartups recentStartups={recentStartups} />
            <StartupProgessGraph salesSummary={salesSummary} />
        </div>
    );
}

export default AdminDashboardSection;