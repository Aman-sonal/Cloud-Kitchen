import {placeOrder} from './apiServ';
import {loadStripe} from '@stripe/stripe-js';
export async function initStripe()
{   const stripe = await loadStripe('pk_test_51IzSnmSCgNxr33OWcBqLm5zg4OEXlvzg7KNheBnZGjBvyjuD3lnlMxhkvFkMPMFcRmER4mOjTQxOVNEmojUBsf3G00TQedKmKC');
    let card=null;
    function mountWidget()
    {
        const element= stripe.elements();
        let style = {
                    base: {
                    color: '#32325d',
                    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                    fontSmoothing: 'antialiased',
                    fontSize: '16px',
                    '::placeholder': {
                        color: '#aab7c4'
                    }
                    },
                    invalid: {
                    color: '#fa755a',
                    iconColor: '#fa755a'
                    }
                };
                card=element.create('card', {style: {style}, hidePostalCode:true});
                card.mount('#card-element');
    }

    const paymentType= document.querySelector('#paymentType');
    if(!paymentType)
    {
        return ;
    }
    paymentType.addEventListener('change', (e) =>{
        console.log(e.target.value);
        if(e.target.value== 'card')
        {
            mountWidget();
        }
        else{
            //
            card.destroy();
        }
    })

    //Ajax Call
const paymentForm = document.querySelector("#payment-form");
if (paymentForm) {
  paymentForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let formData = new FormData(paymentForm);
    let formObject = {};
    for (let [key, value] of formData.entries()) {
      formObject[key] = value;
    }
    if(!card){
        placeOrder(formObject);
        return;
    }
    //Sending request to striper server verify Card
       stripe.createToken(card).then((res) =>{
            //res contains Required Tokens
            console.log(res);
            formObject.stripeToken= res.token.id; 
            placeOrder(formObject);
       }). catch((err) =>{
           console.error(err);
       }) 
    // console.log(key);
  });
}

}