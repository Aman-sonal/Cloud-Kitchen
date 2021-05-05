const homeContoller= require('../app/http/controller/homeController')
const authController = require('../app/http/controller/authController');
const cartController= require('../app/http/controller/customers/cartController');
const { fileLoader } = require('ejs');
const guest= require('../app/http/middleware/guest');
// here we are using factory pattern so instead of using // (req, res) => {
//     //     res.render("home");
//     //   } 
// we are using this structure of file.
function initRoutes(app){
app.get("/", homeContoller().index)
app.get('/login' ,guest, authController().login)
app.post('/login' , authController().postLogin)
app.get('/register' ,guest, authController().register);
app.post('/register', authController().postRegister)
app.get('/cart' ,cartController().index);
app.post('/update-cart', cartController().update);
app.post('/logout', authController().logout);

}


module.exports= initRoutes;