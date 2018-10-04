var UIcontroller = (function() {

    var months, currentYear, currentMonth;

    months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    currentYear = -1;
    currentMonth = -1;

    return {

        displayDates: function(curMonth, curYear) {
            var firstDay, numOfDays, date, datePrevMonth, html;

            // 1. Determine 1st day of the month
            firstDay = new Date(curYear, curMonth, 1).getDay();

            // 2. Determine the number of days of the month
            numOfDays = new Date(curYear, curMonth + 1, 0).getDate();

            // 3. Initial Date Value
            date = 1;

            // 4. Set up date of previous month
            datePrevMonth = -(6 - (7 - firstDay));

            // 5. Create HTML string
            html = '<tr>';
            for(var i = 0; i < 42; i++) {

                if( i === firstDay || (date !== 1 && date <= numOfDays)) {
                    html += '<td>' + date + '</td>';
                    date++;
                } else if (i < firstDay) {
                    html += "<td class='pre'>" + new Date(curYear, curMonth, datePrevMonth).getDate() + '</td>'
                    datePrevMonth += 1;
                } else if (i >= numOfDays) {
                    html += "<td class='next'>" + new Date(curYear, curMonth, date).getDate() + '</td>';
                    date += 1;
                }
                
                if(i === 6 || i === 13 || i === 20 || i === 27 || i === 34 || i === 41) {
                    html += '</tr>'
                }
            }
            
            // 6. Insert HTML strings into the DOM
            document.querySelector('.calendar__frame--days').innerHTML = html;

            // 7. Display month and year label
            document.querySelector('.month-year').textContent = months[curMonth] + ' ' + curYear;

            // Update data of month and year
            currentMonth = curMonth;
            currentYear = curYear;
        },

        displayFocus: function() {
            var days = document.querySelectorAll('.calendar__frame--days td');
            for(var i = 0; i < days.length; i++) {
                if(days[i].textContent === new Date().getDay().toString()) {
                    if(days[i].classList.length === 0) {
                        days[i].classList.add('selected')
                    }
                }
            }
        },

        deleteElements: function() {
            document.querySelector('.calendar__frame--days').innerHTML = '';
        },

        getTimeInfo: function() {
            return {
                currentMonth: currentMonth,
                currentYear : currentYear
            }
        }
    }

})();


var calController = (function(UIctrl) {

    var setupEventListener = function() {
        document.getElementById('prev').addEventListener('click', ctrlAddMonth);
        document.getElementById('next').addEventListener('click', ctrlAddMonth);
    };
    
    var ctrlAddMonth = function(e) {
        var year, month, timeInfo;
        
        // 1. delete existing calendar
        UIctrl.deleteElements();

        // 2. get time data
        timeInfo = UIctrl.getTimeInfo();
        year = timeInfo.currentYear;
        month = timeInfo.currentMonth;
        
        // 3. calculate month and year
        if(e.target.id === 'prev') {
            if(month === 0) { month = 11; year -= 1;} 
            else { month -= 1;}
        } else if(e.target.id === 'next') {
            if(month === 11) { month = 0; year += 1;}
            else { month += 1;}
        }
        
        // 4. display calendar
        UIctrl.displayDates(month, year);
            
    };

    return {
        init: function() {
            UIctrl.displayDates(new Date().getMonth(), new Date().getFullYear());
            setupEventListener();
            UIctrl.displayFocus();
        }
    }

})(UIcontroller);

calController.init();