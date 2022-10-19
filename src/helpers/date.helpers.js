import dayjs from 'dayjs';

export function formatDate(date) {
    const days = dayjs(Date.now()).diff(date, 'days')

    if(!days) return 'today'

    if(days <= 31) 
        return `${days} ${days > 1 ? 'days' : 'day'} ago`
    
    const months = dayjs(Date.now()).diff(date, 'months')

    if(months <= 12)
        return `more than ${months} months ago`

    const years = dayjs(Date.now()).diff(date, 'years')
    
    return `more than ${years} years ago`
}