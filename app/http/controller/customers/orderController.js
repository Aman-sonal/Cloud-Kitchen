const Order= require('../../../models/order');
const moment= require('moment');
function orderController(){
    return {
        postOrders(req, res){
            const {phone, address}= req.body;
            if(!phone || !address){
                req.flash('error',' All Fields are necessary');
                return res.redirect('/cart');
            }
            const order= new Order({
                customerId:req.user._id,
                items:req.session.cart.items,
                phone:phone,
                address: address, 
            })
            order.save()
            .then((result) =>{
                Order.populate(result, {path:'customerId'}, (err, placedOrder)=>{
                    req.flash('Success', 'Order Placed Succesfully');
                    //Emit
                    const eventEmitter = req.app.get('eventEmitter');
                    console.log(placedOrder);
                    eventEmitter.emit('orderPlaced', placedOrder); 
                    delete req.session.cart;
                    return res.redirect('customer/orders');
                })
            })
            .catch((err) =>{
                req.flash('error', "Something went wrong");
                return res.redirect('/cart');
            })
        },
        async getOrder(req,res){
             const orders = await Order.find({customerId: req.user._id}, null, {sort:{'createdAt' :-1}});
             res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
             res.render('customers/orders', { orders: orders, moment: moment 
            })
             console.log(orders);
        },
        async showOrder(req, res)
        {
            const order= await Order.findById(req.params.id)
            {
                //Authorize user 
                if(req.user._id.toString() === order.customerId.toString() ){
                    res.render("customers/singleOrder", {order:order})
                }else{
                    res.redirect('/');
                }
            }            
        }
    }
}
module.exports= orderController;