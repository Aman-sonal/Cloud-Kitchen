const order=require('../../../models/order');
function statusController()
{
    return {
        update(req,res){
            order.updateOne({_id:req.body.orderId}, {status: req.body.status}, (err, data)=>{
                if(err)
                {
                    return  res.redirect('/admin/orders');        
                }
                //Emit Event
                const EventEmitter= req.app.get('eventEmitter');     
                EventEmitter.emit('orderUpdated',{id:req.body.orderId, status:req.body.status});
                
                return res.redirect('/admin/orders');
            })
        }
    }
}
module.exports= statusController;