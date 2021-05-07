const homeContoller= require('../app/http/controller/homeController')
const authController = require('../app/http/controller/authController');
const cartController= require('../app/http/controller/customers/cartController');
const orderController= require('../app/http/controller/customers/orderController');
const { fileLoader } = require('ejs');
const adminController= require('../app/http/controller/admin/adminOrderController');
// here we are using factory pattern so instead of using // (req, res) => {
    //     //     res.render("home");
    //     //   } 
    // we are using this structure of file.


    // MiddleWares
    const guest= require('../app/http/middleware/guest');
    const auth= require('../app/http/middleware/auth');
    const admin= require('../app/http/middleware/admin');

function initRoutes(app){
app.get("/", homeContoller().index)
app.get('/login' ,guest, authController().login)
app.post('/login' , authController().postLogin)
app.get('/register' ,guest, authController().register);
app.post('/register', authController().postRegister)
app.get('/cart' ,cartController().index);
app.post('/update-cart', cartController().update);
app.post('/logout', authController().logout);

///customer routes
app.post('/orders',auth, orderController().postOrders);
app.get('/customer/orders',auth,  orderController().getOrder);

//admin routes
app.get('/admin/orders',admin, adminController().getOrder);

}


module.exports= initRoutes;