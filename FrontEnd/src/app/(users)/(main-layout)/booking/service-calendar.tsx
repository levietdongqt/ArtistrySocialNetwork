'use client'
import React, {useState} from 'react';

export interface Booking {
    start: Date;
    end: Date;
    customerID: number;
}

interface BookingCalendarProps {
    bookings: Booking[];
}
interface HeaderProps {
    onFilterChange: (filter: 'hour' | 'day' | 'month') => void;
}

const Header: React.FC<HeaderProps> = ({ onFilterChange }) => {
    const [currentFilter, setCurrentFilter] = useState<'hour' | 'day' | 'month'>('month');

    const handleFilterChange = (filter: 'hour' | 'day' | 'month') => {
        setCurrentFilter(filter);
        onFilterChange(filter);
    };

    return (
        <header className="p-4  text-white flex justify-between items-center">

            <div>
                <button className={`p-1 m-1 ${currentFilter === 'hour' ? 'rounded bg-white  text-blue-500 font-bold' : 'text-light-primary dark:text-dark-primary font-bold'}`}
                        onClick={() => handleFilterChange('hour')}>Hour</button>
                <button className={`p-1 m-1 ${currentFilter === 'day' ? 'rounded bg-white text-blue-500 font-bold' : 'text-light-primary dark:text-dark-primary font-bold'}`}
                        onClick={() => handleFilterChange('day')}>Day</button>
                <button className={`p-1 m-1 ${currentFilter === 'month' ? 'rounded bg-white text-blue-500 font-bold' : 'text-light-primary dark:text-dark-primary font-bold'}`}
                        onClick={() => handleFilterChange('month')}>Month</button>
            </div>
        </header>
    );
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({ bookings }) => {
    const colors: { [key: string]: string } = {
        blue: 'bg-blue-500',
        green: 'bg-green-500',
        purple: 'bg-purple-500',
        yellow: 'bg-yellow-500',
        red: 'bg-red-500',
        pink: 'bg-pink-500',
        orange: 'bg-orange-500',
        cyan: 'bg-cyan-500',
        magenta: 'bg-magenta-500',
        teal: 'bg-teal-500',
        coral: 'bg-coral-500',
    };

    const colorKeys = Object.keys(colors);
    const handleFilterChange = (filter: 'hour' | 'day' | 'month') => {
        // Tại đây bạn có thể xử lý việc thay đổi bộ lọc
    };
    return (
        <>
            <Header onFilterChange={handleFilterChange} />
            <div className="grid grid-cols-6 gap-4">
                {Array.from({length: 24}).map((_, hour) => {
                    const booking = bookings.find((booking) => {
                        const startHour = new Date(booking.start).getHours();
                        const endHour = new Date(booking.end).getHours();
                        return hour >= startHour && hour <= endHour;
                    });

                    const gridRowStart = Math.floor(hour / 6) + 1;
                    const gridColumnStart = hour % 6 + 1;
                    const colorClass = booking ? colors[colorKeys[booking.customerID % colorKeys.length]] : 'bg-gray-200';

                    return (
                        <div
                            key={hour}
                            style={{gridRowStart, gridColumnStart}}
                            className={` rounded flex items-center justify-center h-12 w-12 ${colorClass}`}
                        >
                            <span className="text-black text-sx">{`${hour}:00`}</span>
                        </div>
                    );
                })}
            </div>
        </>
    );
    };

    export default BookingCalendar;