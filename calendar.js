
var calUIcontroller = (function() {

    var months, currentYear, currentMonth, DOMstrings;
        
    months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    currentYear = -1;
    currentMonth = -1;

    DOMstrings = {
        daysWrapper : '.calendar__frame--days',
        labelMonthYear : '.month-year'
    };

    return {

        displayDates: function(curMonth, curYear) {

            var firstDay, numOfDays, date, dateOfPrevMonth, html, dot;

            // Determine day of 1st of the month
            firstDay = new Date(curYear, curMonth, 1).getDay();
            
            // Determine the number of days of the month
            numOfDays = new Date(curYear, curMonth + 1, 0).getDate();

            // Initial date value
            date = 1;

            // Set up date of previous month and next month
            dateOfPrevMonth = -(6 - (7 - firstDay));

            // Create HTML string
            html = '<tr>'
            dot = '<svg class="icon-dot inactive"><use xlink:href="/css/img/sprite.svg#icon-dot"></use></svg>'

            for( var i = 0 ; i < 42 ; i++) {

                if( i === firstDay || (date !== 1 && date <= numOfDays)) {
                    html += '<td class="cur">' + date  + dot + '</td>';
                    date++;
                } else if (i < firstDay) {
                    html += "<td class='pre'>" + new Date(curYear, curMonth, dateOfPrevMonth).getDate() + dot + '</td>';
                    dateOfPrevMonth += 1;
                } else if (i >= numOfDays) {
                    html += "<td class='next'>" + new Date(curYear, curMonth, date).getDate() + dot + '</td>';
                    date += 1;
                }
                
                if(i === 6 || i === 13 || i === 20 || i === 27 || i === 34 || i === 41) {
                    html += '</tr>'
                }
            }

            // Insert HTML into the DOM
            document.querySelector(DOMstrings.daysWrapper).innerHTML =  html;

            // Display month and year label
            document.querySelector(DOMstrings.labelMonthYear).textContent = months[curMonth] + ' ' + curYear;
            
            // Update data of month and year
            currentMonth = curMonth;
            currentYear = curYear;
        },

        deleteElements: function() {
            document.querySelector(DOMstrings.daysWrapper).innerHTML = '';
        },

        displayFocusedDay: function(monthType, date) {

            var fields = document.querySelectorAll('.calendar__frame--days td');

            fields.forEach(function(cur) {cur.classList.remove('selected')});
            
            fields.forEach(function(cur, idx) {
                if(cur.className === monthType && cur.textContent === date.toString()) {
                    fields[idx].classList.add('selected');
                }
            })
        },

        convertMonthToStr: function(mon) {
            return months[mon];
        },

        displayMarkOnDate: function(dates) {
            
            for(var i = 0; i < dates.length; i++) {
                var month, date, year;
                month = dates[i].split(' ')[0]
                date = dates[i].split(' ')[1]
                year = dates[i].split(' ')[2]
                
                if(month === months[currentMonth].substr(0,3) && year == currentYear.toString()){
                    //
                }
            }
        },

        getTimeInfo: function(el) {
            var selectDate;
            
            el !== undefined ? selectDate = parseInt(el.textContent) : selectDate = '';
            return {
                selectDate: selectDate,
                currentMonth: currentMonth,
                currentYear: currentYear
            }
        },

    }
})()


var calController = (function(UIctrl) {

    var setupEventListener = function() {
        document.getElementById('prev').addEventListener('click', ctrlAddMonth);
        document.getElementById('next').addEventListener('click', ctrlAddMonth);
    };

    var ctrlAddMonth = function() {
        var year, month, timeInfo;
        
        // Delete existing calendar
        UIctrl.deleteElements();
        
        // Get time data
        timeInfo = UIctrl.getTimeInfo();
        year = timeInfo.currentYear;
        month = timeInfo.currentMonth;

        // Calculate month and year
        if(event.target.id === 'prev') {
            if(month === 0) {month = 11; year -= 1} 
            else {month -= 1;}  
        } else if(event.target.id === 'next') {
            if(month === 11) {month = 0; year += 1;} 
            else {month += 1;}
        }

        UIctrl.displayDates(month, year);
    }

    return {
        init: function() {
            UIctrl.displayDates(new Date().getMonth(), new Date().getFullYear());
            UIctrl.displayFocusedDay('cur', new Date().getDate());
            setupEventListener();
        }
    }

})(calUIcontroller)

calController.init();