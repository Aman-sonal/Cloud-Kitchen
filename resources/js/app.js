import axios from "axios";
import moment from "moment";
import Noty from "noty";
import { initAdmin } from "./admin";
import { initStripe } from "./stripe";
let addToCart = document.querySelectorAll(".add-to-cart");
let cartCounter = document.querySelector(".cart-counter");
function updateCart(pizza) {
  axios
    .post("/update-cart", pizza)
    .then((res) => {
      cartCounter.innerText = res.data.totalQty;
      // new Noty({
      //     text : 'NOTY - animating with Mo.js!',
      //     animation: {
      //         open: function (promise) {
      //             var n = this;
      //             var Timeline = new mojs.Timeline();
      //             var body = new mojs.Html({
      //                 el        : n.barDom,
      //                 x         : {500: 0, delay: 0, duration: 500, easing: 'elastic.out'},
      //                 isForce3d : true,
      //                 onComplete: function () {
      //                     promise(function(resolve) {
      //                         resolve();
      //                     })
      //                 }
      //             });

      //             var parent = new mojs.Shape({
      //                 parent: n.barDom,
      //                 width      : 200,
      //                 height     : n.barDom.getBoundingClientRect().height,
      //                 radius     : 0,
      //                 x          : {[150]: -150},
      //                 duration   : 1.2 * 500,
      //                 isShowStart: true
      //             });

      //             n.barDom.style['overflow'] = 'visible';
      //             parent.el.style['overflow'] = 'hidden';

      //             var burst = new mojs.Burst({
      //                 parent  : parent.el,
      //                 count   : 10,
      //                 top     : n.barDom.getBoundingClientRect().height + 75,
      //                 degree  : 90,
      //                 radius  : 75,
      //                 angle   : {[-90]: 40},
      //                 children: {
      //                     fill     : '#EBD761',
      //                     delay    : 'stagger(500, -50)',
      //                     radius   : 'rand(8, 25)',
      //                     direction: -1,
      //                     isSwirl  : true
      //                 }
      //             });

      //             var fadeBurst = new mojs.Burst({
      //                 parent  : parent.el,
      //                 count   : 2,
      //                 degree  : 0,
      //                 angle   : 75,
      //                 radius  : {0: 100},
      //                 top     : '90%',
      //                 children: {
      //                     fill     : '#EBD761',
      //                     pathScale: [.65, 1],
      //                     radius   : 'rand(12, 15)',
      //                     direction: [-1, 1],
      //                     delay    : .8 * 500,
      //                     isSwirl  : true
      //                 }
      //             });

      //             Timeline.add(body, burst, fadeBurst, parent);
      //             Timeline.play();
      //         },
      //         close: function (promise) {
      //             var n = this;
      //             new mojs.Html({
      //                 el        : n.barDom,
      //                 x         : {0: 500, delay: 10, duration: 500, easing: 'cubic.out'},
      //                 skewY     : {0: 10, delay: 10, duration: 500, easing: 'cubic.out'},
      //                 isForce3d : true,
      //                 onComplete: function () {
      //                     promise(function(resolve) {
      //                         resolve();
      //                     })
      //                 }
      //             }).play();
      //         }
      //     }
      // }).show();
    })
    .catch((err) => console.log(err));
}

addToCart.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    let pizza = JSON.parse(btn.dataset.piz);
    updateCart(pizza);
    // console.log(pizza);
  });
});

//Remove alery message after X sec
const alertMsg = document.querySelector("#success-alert");
if (alertMsg) {
  setTimeout(() => {
    alertMsg.remove();
  }, 2000);
}

//change Order Status
let status = document.querySelectorAll(".status_line");
let Order = document.querySelector("#hiddenInput")
  ? document.querySelector("#hiddenInput").value
  : null;
Order = JSON.parse(Order);
console.log(Order, "sdcdscds");
let time = document.createElement("small");
function updateStatus(Order) {
  status.forEach((status) => {
    status.classList.remove("step-completed");
    status.classList.remove("current");
  });
  let stepCompleted = true;
  status.forEach((sta) => {
    let dataProp = sta.dataset.status;
    if (stepCompleted) {
      sta.classList.add("step-completed");
    }
    if (dataProp === Order.status) {
      stepCompleted = false;
      time.innerText = moment(Order.updatedAt).format("hh:mm A");
      sta.appendChild(time);
      if (sta.nextElementSibling)
        sta.nextElementSibling.classList.add("current");
    }
  });
}

updateStatus(Order);

initStripe();

//Socket.io

let socket = io();

if (Order) {
  socket.emit("join", `Order_${Order._id}`);
}

let AdminArea = window.location.pathname;
// console.log(AdminArea);
if (AdminArea.includes("admin")) {
  initAdmin(socket);
  socket.emit("join", "updateAdmin");
}

socket.on("orderUpdated", (data) => {
  const updatedOrder = { ...Order };
  updatedOrder.updatedAt = moment().format();
  updatedOrder.status = data.status;
  updateStatus(updatedOrder);
});
