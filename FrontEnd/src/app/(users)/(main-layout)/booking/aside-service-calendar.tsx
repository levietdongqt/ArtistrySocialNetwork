'use client'
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Loading } from '@components/ui/loading';
import { Error } from '@components/ui/error';
import Slider from "react-slick";
import Image from 'next/image';
import React from "react";
import BookingCalendar from "./service-calendar";
import {variants} from "../../_components/aside/aside-trends";

export function ServiceCalendar(): JSX.Element {


    const adminData = null;
    const suggestionsLoading = false;
    const adminLoading = false;
    const bookings = [
        {
            start: new Date(2024, 2, 19, 15, 0), // Tháng 3, 19, 2024, at 3:00 PM
            end: new Date(2024, 2, 19, 17, 0), // Tháng 3, 19, 2024, at 5:00 PM
            customerID: 77,
        },
        {
            start: new Date(2024, 2, 19, 9, 0), // Tháng 3, 19, 2024, at 9:00 AM
            end: new Date(2024, 2, 19, 10, 0), // Tháng 3, 19, 2024, at 10:00 AM
            customerID: 1,
        },
        {
            start: new Date(2024, 2, 20, 11, 0), // Tháng 3, 20, 2024, at 11:00 AM
            end: new Date(2024, 2, 20, 14, 0), // Tháng 3, 20, 2024, at 2:00 PM
            customerID: 2,
        },
        {
            start: new Date(2024, 2, 20, 19, 0), // Tháng 3, 20, 2024, at 11:00 AM
            end: new Date(2024, 2, 20, 21, 0), // Tháng 3, 20, 2024, at 2:00 PM
            customerID: 88,
        },
    ];


    return (
        <section className='hover-animation rounded-2xl bg-main-sidebar-background  '>
            {adminLoading || suggestionsLoading ? (
                <Loading className='flex h-52 items-center justify-center p-4'/>
            ) : /*suggestionsData ?*/ (
                <>
                    <div className="flex items-center justify-center max maxHeight: '800px' ">
                        <h2 className='pt-1 inner:px-4 inner:py-3 text-xl font-bold text-center'>BOOKING CALENDAR</h2>
                    </div>
                    <div className='custom-scrollbar' style={{overflowY: 'auto', maxHeight: '800px'}}>
                        <motion.div className='inner:px-4 inner:py-3' {...variants}>
                            <BookingCalendar bookings={bookings} />
                        </motion.div>
                    </div>
                </>
            ) /*: (
        <Error />
      )*/}
        </section>
    );

};