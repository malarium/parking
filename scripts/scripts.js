"use strict";
window.mobileAndTabletcheck = function () {
    var check = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
};
var spaceToEmpty;
var spaceToOccupy;
var elementToMove;
let content = "";
let parkPlaces = document.querySelectorAll('.parking-place');
let draggables = document.querySelectorAll('.drag');
let closedParkName1 = "";
let closedParkName2 = "";
let scrolledValue = 0;

//Check if the window was scrolled
$(window).scroll(function () {
    scrolledValue = $(this).scrollTop();
});

function blink() {
    let empty = document.querySelectorAll('.empty');
    empty.forEach(elem => {
        elem.classList.add('empty-highlight');
    })
}

function stopBlink() {
    let blinkingElements = document.querySelectorAll('.empty-highlight');
    blinkingElements.forEach(elem => {
        elem.classList.remove('empty-highlight');
    })
}

//Add numbers to every container (sadly CSS counters won't be helpful here)
//When containers are generated dynamically, this should be at the end of a script
function addNumbers() {
    let containers = document.querySelectorAll('.parking-place');
    let nr = 1;
    let spans = document.querySelectorAll('span');
    if (spans) {
        spans.forEach(span => {
            span.remove();
        })
    }
    containers.forEach(container => {
        let el = document.createElement('span');
        if (container.classList.contains('occupied')) {
            el.classList.add('containerNumberInOccupied');
        } else {
            el.classList.add('containerNumber');
        }
        el.classList.add('containerNumber');
        el.textContent = nr;
        nr++;
        container.appendChild(el);
    })
};
addNumbers();

function moveContainer(ev) {
    spaceToEmpty.classList.remove('occupied');
    spaceToEmpty.classList.add('empty');
    spaceToOccupy.classList.remove('empty');
    spaceToOccupy.classList.add('occupied');
    ev.target.appendChild(document.getElementById(content)); //put it inside the target element over which we hold the drop
    addNumbers();
    stopBlink();
}

// Listen to clicks on containers
document.querySelector('main').addEventListener('click', function (ev) {
    let data = ev.path[0].dataset.info;
    let containerNumber = ev.target.id;
    if (data) {
        //create header with container number
        let infoHeader = document.querySelector('.modal-header');
        infoHeader.innerHTML = "";
        let headerText = document.createElement('p');
        infoHeader.textContent = "Container number: " + containerNumber;
        infoHeader.appendChild(headerText);

        //create info in modal body
        let infoBox = document.querySelector('.modal-body');
        infoBox.innerHTML = "";
        let infoText = document.createElement('p');
        infoText.textContent = data;
        infoBox.appendChild(infoText);
    }
})

function closedParks() {
    let collapsedParks = document.querySelectorAll('.collapse');
    closedParkName1 = "";
    closedParkName2 = "";
    collapsedParks.forEach(closed => {
        if (closed.classList.contains('show')) {
        } else {

            if (closedParkName1 === "") {
                closedParkName1 = closed.dataset.park;
            } else {
                closedParkName2 = closed.dataset.park;
            }
        }
    })
    document.querySelector('.bp1').textContent = closedParkName1;
    document.querySelector('.bp2').textContent = closedParkName2;
}


if (!mobileAndTabletcheck()) {
    // Add desktop functionality
    console.log('desktop');
    parkPlaces.forEach(place => {
        place.addEventListener('drop', function (ev) {
            ev.preventDefault(); //do not open as link
            spaceToOccupy = ev.target;
            if (spaceToOccupy.parentNode.classList.contains('occupied')) {
                stopBlink();
                return;
            } else {
                let toEmpty = spaceToEmpty.querySelector(".containerNumber").textContent;
                let toOccupy = spaceToOccupy.querySelector(".containerNumber").textContent;
                if (confirm(`Do you want to move container from position ${toEmpty} to position ${toOccupy}?`)) {
                    moveContainer(ev);
                } else {
                    stopBlink();
                    return;
                }
            }
        });
        place.addEventListener('dragover', function (ev) {
            ev.preventDefault();
        });
    })
    draggables.forEach(draggie => {
        draggie.addEventListener('drag', function (ev) {
            spaceToEmpty = ev.target.parentNode;
            content = ev.target.id;
            blink();
        })
    })
} else {
    //Add mobile functionality
    console.log('Mobile!');
    $('.collapse').collapse('hide');
    document.querySelector('#parking1').addEventListener('click', function () {
        $('.parkCollapse1').collapse('toggle');
        $('.parkCollapse2').collapse('hide');
        $('.parkCollapse3').collapse('hide');
        closedParks();
    });
    document.querySelector('#parking2').addEventListener('click', function () {
        $('.parkCollapse2').collapse('toggle');
        $('.parkCollapse1').collapse('hide');
        $('.parkCollapse3').collapse('hide');
        closedParks();
    });
    document.querySelector('#parking3').addEventListener('click', function () {
        $('.parkCollapse3').collapse('toggle');
        $('.parkCollapse1').collapse('hide');
        $('.parkCollapse2').collapse('hide');
        closedParks();
    });

    // Make elements draggable
    $('.drag').draggable();
    //TuchPunch ends

    draggables.forEach(draggie => {
        draggie.addEventListener('touchmove', function (ev) {
            spaceToEmpty = ev.target.parentNode;
            content = ev.target.id;
            //HACK: it must be removed to avoid errors in display. If works fine with moving objects but fails sometimes with drag'n'drop
            document.getElementById(content).removeAttribute('style');
            blink();
            closedParks();
            document.querySelector('.bottom-bar').classList.add('bottom-bar-show');
            //find which parkings are toggled and attach their named to the bottom bar

        })
        draggie.addEventListener('touchend', function (ev) {
            let X = ev.changedTouches[0].pageX;
            let Y = 0;
            //Adjusy coordinates when scrolled
            (scrolledValue !== 0) ? Y = ev.changedTouches[0].pageY - scrolledValue : Y = ev.changedTouches[0].pageY;
            var target = document.elementFromPoint(X, Y);
            if (target.classList.contains('empty')) {
                let targetNumber = target.querySelector('.containerNumber').textContent;
                if (confirm(`Do you want to move this container to place ${targetNumber}?`)) {
                    document.querySelector('.bottom-bar').classList.remove('bottom-bar-show');
                    let movedFrom = ev.target.parentNode;
                    movedFrom.classList.remove('occupied');
                    movedFrom.classList.add('empty');
                    target.classList.remove('empty');
                    target.classList.add('occupied');
                    target.appendChild(document.getElementById(content));
                    addNumbers();
                    stopBlink();
                } else {
                    stopBlink();
                    document.querySelector('.bottom-bar').classList.remove('bottom-bar-show');
                }

            } else if (target.classList.contains('bottom-info')) {
                elementToMove = document.getElementById(content);
                let movedFrom = ev.target.parentNode;
                movedFrom.classList.remove('occupied');
                movedFrom.classList.add('empty');
                movedFrom.querySelector('.drag').remove();
                addNumbers();
                stopBlink();

                //Open desired parking and collapse all the others
                $('.collapse').collapse('hide');
                let collapsedParks = document.querySelectorAll('.collapse');
                collapsedParks.forEach(park => {
                    if (target.textContent === park.dataset.park) {
                        $(park).collapse('toggle');
                        blink();
                        //remove bottom nav
                        document.querySelector('.bottom-bar').classList.remove('bottom-bar-show');

                        //Add event listeners to all parking places with 'empty' class
                        parkPlaces.forEach(place => {
                            // Remove existing event Listebers so that they do not pile up
                            if (place.dataset.listen === "true") {
                                try {
                                    place.removeEventListener('click', _handler, true);
                                } catch(err){return;}
                                place.dataset.listen = "false";
                            }
                            if (place.classList.contains('empty')) {
                                place.dataset.listen = "true";
                                place.addEventListener('click', function _handler(e) {
                                    let targetNumber = e.target.querySelector('.containerNumber').textContent;
                                    if (confirm(`Do you want to move this container to place ${targetNumber}?`)) {
                                            e.target.appendChild(elementToMove);
                                            e.target.classList.remove('empty');
                                            e.target.classList.add('occupied');
                                            stopBlink();
                                            addNumbers();
                                    } else {
                                        stopBlink();
                                        return;
                                    }
                                }, true)
                            }
                        })
                    }
                })

            } else {
                document.querySelector('.bottom-bar').classList.remove('bottom-bar-show');
                stopBlink();
                return;
            }
        })
    })
}
var listenersCount = 0;