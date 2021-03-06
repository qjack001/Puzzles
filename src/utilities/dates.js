/* eslint-disable no-mixed-spaces-and-tabs */
export function writtenDateFrom(date) {
	const dateObj = new Date(date)
	const day = dateObj.getDate()
	const daySuffix = (day == 1) ? 'st'
	                : (day == 2) ? 'nd'
	                : (day == 3) ? 'rd'
	                : 'th'

	const yearString = (dateObj.getFullYear() == new Date().getFullYear()) ? ''
	                 : ', ' + dateObj.getFullYear()

	return dateObj.toLocaleString('default', { month: 'long', day: 'numeric' }) +
		daySuffix + yearString
}