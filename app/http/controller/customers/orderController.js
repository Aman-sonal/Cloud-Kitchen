const Order= require('../../../models/order');
const moment= require('moment');
const stripe= require('stripe')(process.env.STRIPE_PRIVATE_KEY);
function orderController(){
    return {
        postOrders(req, res){
            const {phone, address, stripeToken, paymentType}= req.body;
            if(!phone || !address){
                // req.flash('error',' All Fields are necessary');
                // return res.redirect('/cart');
                return res.setStatus(422).json({message: 'All Fields are required'});
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
                    // req.flash('Success', 'Order Placed Succesfully');


                    //Stripe Payment
                    if(paymentType== 'card')
                    {
                        stripe.charges.create({
                            amount: req.session.cart.totalPrice  * 100,
                            source: stripeToken,
                            currency: 'inr',
                            description: `Pizza order: ${placedOrder._id}`
                        }).then(() =>{
                            placedOrder.paymentStatus=true;
                            placedOrder.save().then((ord) =>{
                                //Emit
                                const eventEmitter = req.app.get('eventEmitter');
                                console.log(placedOrder);
                                eventEmitter.emit('order Placed', ord);
                                return res.json({message: 'Payment successfull, Order placed successfully'});
                            }). catch((err) => {
                                console.log(err, "Failed to save");
                            })
                        }).catch((err) =>{
                            return res.json({message: 'Order Placed but Payment Failed due to Some Reasons. Pay at delivery Time '});
                        })
                    }
                    else
                    {
                         delete req.session.cart;
                        return res.json({message: 'Order has been placed Successfully'});
                    } 
                    delete req.session.cart;


                    // return res.redirect('customer/orders');
                })
            })
            .catch((err) =>{
                // req.flash('error', "Something went wrong");
// /                // return res.redirect('/cart');
                 return res.setStatus(500).json({message: 'Order Placed but Payment Failed due to Some Reasons. Pay at delivery Time '});
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