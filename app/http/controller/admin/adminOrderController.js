const Order = require("../../../models/order");
const order = require("../../../models/order");
function adminController() {
  return {
    getOrder(req, res) {
      Order
        .find({ status: { $ne: "completed" } }, null, {
          sort: { createdAt: -1 },
        })
        .populate("customerId", "-password")
        .exec((err, orders) => {
          if (req.xhr) {
            return res.json(orders);
          } else {
            console.log('render');
            return res.render("admin/adminOrder");
          }
        });
    },
  };
}
module.exports = adminController;
