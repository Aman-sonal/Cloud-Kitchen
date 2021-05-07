// import moment from 'moment';
let addToCart = document.querySelectorAll(".add-to-cart");
let cartCounter = document.querySelector(".cart-counter");
const orderTableBody = document.querySelector("#orderTableBody");
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
// module.exports= updateCart;

initAdmin();

function initAdmin() {
  let orders = [];
  let markup
  axios
    .get("/admin/orders", {
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
    })
    .then((res) => {
        console.log(res);
      orders = res.data;
      markup = generateMarkup(orders);
      orderTableBody.innerHTML = markup;
    })
    .catch((err) => {
      console.error(err);
    });

    function renderItems(items) {
        let parsedItems = Object.values(items)
        return parsedItems.map((menuItem) => {
            return `
                <p>${ menuItem.item.name } - ${ menuItem.qty } pcs </p>
            `
        }).join('')
      } 

  function generateMarkup(orders) {
    return orders
      .map((order) => {
        return `
                <tr>
                <td class="border px-4 py-2 text-green-900">
                    <p>${order._id}</p>
                    <div>${renderItems(order.items)}</div>
                </td>
                <td class="border px-4 py-2">${order.customerId.name}</td>
                <td class="border px-4 py-2">${order.address}</td>
                <td class="border px-4 py-2">
                    <div class="inline-block relative w-64">
                        <form action="/admin/order/status" method="POST">
                            <input type="hidden" name="orderId" value="${
                              order._id
                            }">
                            <select name="status" onchange="this.form.submit()"
                                class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                                <option value="order_placed"
                                    ${
                                      order.status === "order_placed"
                                        ? "selected"
                                        : ""
                                    }>
                                    Placed</option>
                                <option value="confirmed" ${
                                  order.status === "confirmed" ? "selected" : ""
                                }>
                                    Confirmed</option>
                                <option value="prepared" ${
                                  order.status === "prepared" ? "selected" : ""
                                }>
                                    Prepared</option>
                                <option value="delivered" ${
                                  order.status === "delivered" ? "selected" : ""
                                }>
                                    Delivered
                                </option>
                                <option value="completed" ${
                                  order.status === "completed" ? "selected" : ""
                                }>
                                    Completed
                                </option>
                            </select>
                        </form>
                        <div
                            class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20">
                                <path
                                    d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </div>
                    </div>
                </td>
                <td class="border px-4 py-2">
                    ${moment(order.createdAt).format("hh:mm A")}
                </td>
                <td class="border px-4 py-2">
                    ${order.paymentStatus ? "paid" : "Not paid"}
                </td>
            </tr>
        `;
      }).join("");
  }
}
