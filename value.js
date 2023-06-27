import { list1length,comp1length } from "./mobile_js/mobilescript.js"
import {list2length,comp2length} from "./mobile_js/mobileSchool.js"
import { list3length, comp3length } from "./mobile_js/mobilePersonal.js"
import { list4length, comp4length } from "./mobile_js/mobileDesign.js"

document.getElementById('tasklist1').innerHTML = 'Task In Process - '+list1length;
document.getElementById('compList1').innerHTML = 'Task Completed - '+comp1length;
document.getElementById('tasklist2').innerHTML = 'Task In Process - '+list2length;
document.getElementById('compList2').innerHTML = 'Task Completed - '+comp2length;
document.getElementById('tasklist3').innerHTML = 'Task In Process - '+list3length;
document.getElementById('compList3').innerHTML = 'Task Completed - '+comp3length;
document.getElementById('tasklist4').innerHTML = 'Task In Process - '+list4length;
document.getElementById('compList4').innerHTML = 'Task Completed - '+comp4length;