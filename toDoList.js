
// Data controller
var dataController = (function() {

    var List = function(id, todo, date) {
        this.id = id;
        this.todo = todo;
        this.date = date;
        this.status = 'active';
    };

    // to-do list
    var data = [];
    // var data = {
    //     '2018': {
    //         '10': {
    //             '28': [
    //                 {
    //                     id: 1,
    //                     todo: 123
    //                 }
    //             ]
    //         }
    //     }
    // };

    // value will be assigned if clients click a specific date.
    var selectedTime = '';

    // Status showing lists checked as completed or not
    var checkStatus = 'off';


    return {
        addList: function(toDo) {
            var ID, newItem;

            // 1. Create a new id
            if(data.length === 0) {
                ID = 0
            } else {
                ID = data[data.length - 1].id + 1;
            }

            // 2. Create a new list
            newItem = new List(ID, toDo, selectedTime)

            // 3. Save the new list
            data.push(newItem);

            // 4. Return new item
            return newItem;

        },

        deleteList: function(ID) {
            data.forEach(function(cur, index) {
                if(cur.id === ID) {
                    data.splice(index, 1);
                }
            })
        },

        reviseList: function(ID, text) {
            data.forEach(function(cur) {
                if(cur.id === ID) {
                    cur.todo = text;
                }
            })
        },

        addSelectTime: function(month, date, year) {
            if(date < 10) {date = '0' + date};
            selectedTime = month + ' ' + date + ' ' + year;
        },

        filterDates: function() {
            if(selectedTime === '') {
                return data;
            } else {
                var newArr = [];
                data.forEach(function(cur) {
                    if(cur.date === selectedTime) {
                        newArr.push(cur);
                    }
                });
                return newArr;
            }
        },

        filterStatusList: function(status) {
            var newArr;

            newArr = dataController.filterDates();    
            // if(selectedTime !== '') {
            //     newArr = data.filter(function(cur) {
            //         return cur.date === selectedTime;
            //     })
            // } else {
            //     newArr = data;
            // }

            if(status === 'all') {
                return newArr;
            } else {
                return newArr.filter(function(cur) {
                    return cur.status === status;
            })}

        },

        clearSelectedTime: function() {
            selectedTime = '';
        },

        clearCompleted: function() {
            
            data = data.filter(function(cur) {
                if(cur.status !== 'completed') {
                    return cur;
                }
            });
        },

        getActiveList: function() {
            return data.filter(function(obj) {
                return obj.status === 'active';
            })
        },

        addCheckStatus: function(id) {
            var target;

            data.forEach(function(cur) {
                if(cur.id === parseInt(id)) {
                    return target = cur;
                    // 하나라도 조건 맞으면 loop 멈추는 방법 있는지 궁금
                }
            })
            target.status === 'active'? target.status = 'completed' : target.status = 'active';
        },

        resetStatus: function() {
            data.forEach(function(cur) {
                cur.status = 'active';
            })
        },

        changeCheckStatus: function() {
            checkStatus === 'off' ? checkStatus = 'on' : checkStatus = 'off';
        },

        getData: function() {
            return {
                data: data,
                selectedTime: selectedTime,
                checkStatus: checkStatus
            }
        },

        getDateLists: function() {
            
            return data.reduce(function(acc, cur) {
                if(acc.indexOf(cur.date) < 0) { acc.push(cur.date);}
                return acc;
            }, []);

        },

        testing: function() {
            return {
                data: data,
                time: selectedTime,
            }
        }
    }

})();


// User interface controller
var UIcontroller = (function() {

    return {
        getInputData: function() {
            return document.getElementById('new-todo').value;
        },

        displayItem: function(obj) {
            var html, newHtml

            html = '<li class="item" id="%id%"><div class="textarea"><span class="text">%toDo%</span></div><input type="text" class="edit-input inactive"><svg class="list-icon cross"><use xlink:href="/css/img/sprite.svg#icon-cross"></use></svg><svg class="list-icon check inactive"><use xlink:href="/css/img/sprite.svg#icon-check"></use></svg><svg class="list-icon edit"><use xlink:href="/css/img/sprite.svg#icon-edit"></use></svg></li>'

            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%toDo%', obj.todo);

            document.querySelector('.items').insertAdjacentHTML('afterbegin', newHtml);
        },

        deleteItem: function(id) {
            
            var el = document.getElementById(id);
            // el.remove();
            el.parentNode.removeChild(el);
            
        },

        setTextToInputBtn : function(id, text) {
            document.getElementById(id).childNodes[1].value = text;
        },

        displayListParts: function(id) {  

            document.getElementById(id).childNodes.forEach(function(cur) {
                cur.classList.toggle('inactive');
            })

            document.getElementById(id).childNodes[1].focus();
        },

        displayTimeLabel: function(time) {
            document.querySelector('.time-label').classList.remove('inactive');
            document.querySelector('.time-label-x').classList.remove('inactive');
            document.querySelector('.time-label').innerText = time;
        },

        hideTimeLabel: function() {
            document.querySelector('.time-label').classList.add('inactive');
            document.querySelector('.time-label-x').classList.add('inactive');
        },

        getRevisedText: function(e) {
            return e.target.parentNode.childNodes[1].value
        },

        displayRevised: function(event, text) {
            event.target.parentNode.childNodes[0].childNodes[0].textContent = text;
        },

        displayLineThrough: function(id) {
            document.getElementById(id).firstChild.classList.toggle('checked');
        },

        showActiveNumber: function(num) {
            document.querySelector('.item-status span').textContent = num;
        },

        clearInputHolder: function() {
            document.getElementById('new-todo').value = '';
        },

        clearLists: function() {
            document.querySelector('.items').textContent = '';
        },

        clearCompletedList: function() {
            var fields = document.querySelectorAll('.textarea');
            fields.forEach(function(cur) {
                if(cur.classList[1] === 'checked') {
                    var el = cur.parentNode;
                    el.parentNode.removeChild(el);
                };
            })
        }
    }

})();

// calUIcontroller = {};

// Global app controller
var controller = (function(dataCtrl, UIctrl, calUIctrl) {
    
    var septupEventListener = function() {
        document.addEventListener('keypress', function(event) {
            if(event.keyCode === 13) { ctrlAddList();}
        })

        document.querySelector('.items').addEventListener('click', function(event) {
            if(event.target.className === 'text') { 
                ctrlCheckMark(event); 
            } else if (event.target.classList[1] === 'cross') {
                ctrlDeleteList(event);
            }
        });
        document.querySelector('.items').addEventListener('click', ctrlEditList);


        document.querySelector('.calendar__frame--days').addEventListener('click', ctrlInputTime);
        document.querySelector('.time-label-wrapper').addEventListener('click', function(e) {
            
            if(e.target.classList.contains('time-label-x')) {
                showAllList();
                // 자식요소인지도 체크
            }
        });

        document.querySelector('.panel').addEventListener('click', ctrlListStatus);
        document.querySelector('.trash-bin').addEventListener('click', ctrlClearCompleted);

        document.querySelector('.item-status').addEventListener('click', completeAll);

    };

    var ctrlAddList = function() {
        var inputText, newItem, selectDate;

        // 1. Get input text
        inputText = UIctrl.getInputData();

        if(inputText !== '') {

            // 2. Save the data to dataController
            newItem = dataCtrl.addList(inputText);
    
            // 3. Display the new item on the UI
            UIctrl.displayItem(newItem);
    
            // 4. Display the numbe of activelist
            ctrlRemainder();
    
            // 5. Clear input holder
            UIctrl.clearInputHolder();

            // markForCalendar();
        }
    };

    var ctrlDeleteList = function(event) {
        var id;

        // 1. Get id of the list
        id = parseInt(event.target.parentNode.id);

        // 2. Delete the item from dataController
        dataCtrl.deleteList(id);

        // 3. Delete the item from the UI
        UIctrl.deleteItem(id);

        // 4. Display the numbe of activelist
        ctrlRemainder();

    };

    var ctrlCheckMark = function(event) {
        var id;

        id = event.target.parentNode.parentNode.id;

        // 1. Save completed list in the data structure
        dataController.addCheckStatus(id);

        // 2. Display completed list on the UI 
        UIctrl.displayLineThrough(id);

        // 3. Display the numbe of activelist
        ctrlRemainder();
    };

    var ctrlEditList = function(event) {
        var id, value, parent;

        parent = event.target.parentNode;

        // 1. Get id of the list
        id = parseInt(parent.id);
        
        if(event.target.classList[1] === 'edit') {
            
            value = parent.childNodes[0].textContent;

            UIctrl.setTextToInputBtn(id, value);
            
            // 2. Display input field for edit
            UIctrl.displayListParts(id);
            
        }
        
        if(event.target.classList[1] === 'check') {
            
            // 1. get revised data
            var revisedTxt = UIctrl.getRevisedText(event);

            // 2. save the revised on in dataController
            dataCtrl.reviseList(id, revisedTxt);

            // 3. Display the revised in the UI
            UIctrl.displayRevised(event, revisedTxt);

            // 4. Hide input field
            UIctrl.displayListParts(id);

        }

    };

    var ctrlListStatus = function(event) {
        var status, listArr, newArr;

        status = event.target.id;

        if(status === 'all' || status === 'active' || status === 'completed') {

            // 1. filter specific lists
            listArr = dataController.filterStatusList(status);

            // 2. Clear current lists on the UI
            UIctrl.clearLists();

            // 3. display the lists on the UI
            listArr.forEach(function(cur) {
                UIctrl.displayItem(cur);
            });

            // 4. display line-through on completed items
            if((status === 'all' || status === 'completed') && listArr.length !== 0) {
                var newArr = listArr.filter(function(item) {
                    return item.status === 'completed'
                })
                
                newArr.forEach(function(cur) {
                    UIctrl.displayLineThrough(cur.id);
                })                  
            };
        }
    };

    var displayList = function() {

        // 1. filter and get list of specific dates
        var filteredArr = dataController.filterDates();
        
        // 2. Render the lists on the UI
        for(var i = 0; i < filteredArr.length; i++) {
            UIcontroller.displayItem(filteredArr[i]);
        }
    };

    var showAllList = function() {
        
            // 1. Clear selected time from data structure
            dataCtrl.clearSelectedTime();
    
            // 2. Inactivate time-label on the UI
            UIctrl.hideTimeLabel();
    
            // 3. Clear current list fields
            UIctrl.clearLists();
    
            // 4. Display all lists
            displayList();
    
            // 5. Get completed list
            var completedList = dataCtrl.filterStatusList('completed');
    
            // 6. Display line-through of the list
            completedList.forEach(function(cur) {  
                UIctrl.displayLineThrough(cur.id);
            })

    };

    var ctrlClearCompleted = function() {

        // 1. Clear completed lists from the data structure
        dataCtrl.clearCompleted();

        // 2. Clear the lists from the UI
        UIctrl.clearCompletedList();

    };

    var ctrlRemainder = function() {

        // 1. get active list number;
        var activeList = dataCtrl.getActiveList();

        // 2. Display the number on the UI
        UIctrl.showActiveNumber(activeList.length);

    };

    var completeAll = function() {
        var lists, status;

        // 1. reset list status as active
        dataCtrl.resetStatus();

        // 2. get all lists
        lists = dataCtrl.getData().data;
        
        // 3. get data
        status = dataCtrl.getData().checkStatus;

        // 4. Save all lists as completed
        if(status === 'off') {
            for(var i = 0; i < lists.length; i++) {
                dataController.addCheckStatus(lists[i].id);
            };
            dataCtrl.changeCheckStatus();
        } else {
            dataCtrl.changeCheckStatus();
        }

        // 5. Clear fields and display all lists
        showAllList();

        // 6. re-count the number of active items
        ctrlRemainder();

    };

    // var markForCalendar = function() {

    //     var markDates = dataCtrl.getDateLists();
        
    //     calUIctrl.displayMarkOnDate(markDates);

    // };

    var ctrlInputTime = function(event) {
        var curEl, timeObj, date, year, month, selectedTime;

        curEl = event.target;
        
        console.dir(curEl.tagName)
        if(curEl.tagName === 'TD') {
            
            // 1. Get the month, date and year

            timeObj = calUIctrl.getTimeInfo(curEl);
    
            date = timeObj.selectDate;
            year = timeObj.currentYear;
            month = timeObj.currentMonth;
            
            if(curEl.classList[0] === 'pre') {
                month -= 1;
            } else if (curEl.classList[0] === 'next') {
                month += 1;
            };

            month = calUIctrl.convertMonthToStr(month).substr(0,3);

            // 2. Save selected time to dataController
            dataCtrl.addSelectTime(month, date, year);
        
            // 4. Retrieve selected time
            selectedTime = dataCtrl.getData().selectedTime;
            
            // 5. Display on the user interface
            UIctrl.displayTimeLabel(selectedTime);

            // 6. Clear current list fields
            UIctrl.clearLists();

            // 7. Display new list
            displayList();

            // 8. Display selected day
            calUIctrl.displayFocusedDay(curEl.className, date);
            
        }

    }

    return {
        init: function() {
            console.log('Chanwhe Kim : the application has started. :)')
            septupEventListener();
        }
    }
})(dataController, UIcontroller, calUIcontroller);

controller.init();

