import React, { useEffect } from 'react';
// import axios from 'axios';
import ReactDOM from "react-dom";
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { detailsOrder, payOrder, deliverOrder } from '../actions/orderActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { ORDER_PAY_RESET, ORDER_DELIVER_RESET, } from '../constants/orderConstants';

const PayPalButton = window.paypal.Buttons.driver("react", { React, ReactDOM });

export default function OrderScreen() {
    // const orderId = props.match.params.id;
    const orderId = useParams().id;
    const orderDetails = useSelector((state) => state.orderDetails);
    const { order, loading, error } = orderDetails;
    const userSignin = useSelector((state) => state.userSignin);
    const { userInfo } = userSignin;
    const orderPay = useSelector(state => state.orderPay)
    const { loading: loadingPay, error: errorPay, success: successPay } = orderPay;
    const orderDeliver = useSelector((state) => state.orderDeliver);
    const { loading: loadingDeliver, error: errorDeliver, success: successDeliver } = orderDeliver;
    const dispatch = useDispatch();
    // const [sdkReady, setSdkReady] = useState(false);

    useEffect(() => {
        // const addPayPalScript = async () => {
        //     const { data } = await axios.get('/api/config/paypal');
        //     console.log("DATA", data);
        //     const script = document.createElement('script');
        //     script.type = 'text/javascript';
        //     script.src = `https://www.paypal.com/sdk/js?client-id=${data}`;
        //     script.async = true;
        //     script.onload = () => {
        //         setSdkReady(true);
        //     };
        //     document.body.appendChild(script);
        // };
        if (!order || successPay || successDeliver || (order && order._id !== orderId)) {
            dispatch({ type: ORDER_PAY_RESET }); //to prevent invite loop
            dispatch({ type: ORDER_DELIVER_RESET });
            dispatch(detailsOrder(orderId));
        } else {
            if (!order.isPaid) {
                if (!window.paypal) {
                    console.log("if", !window.paypal);
                    // addPayPalScript();

                } else {
                    // setSdkReady(true);
                    console.log("else", !window.paypal);
                }
            }
        }
    }, [dispatch, orderId, successPay, successDeliver, order]); // sdkReady puHGDBzxe@66N6(

    // const successPaymentHandler = (paymentResult) => {
    //     // dispatch(payOrder(order, paymentResult));
    // };

    const createOrder = (data, actions) => {
        return actions.order.create({
            purchase_units: [
                {
                    amount: {
                        value: `${order.totalPrice}`,
                    },
                },
            ],
        });
    };
    const onApprove = (data, actions) => {
        return actions.order.capture().then(function (details) {
            console.log("DETAILS::::", details);
            // console.log('Capture result', details, JSON.stringify(details, null, 2))
            const paymentResult = {
                id: details.id,
                status: details.id,
                update_time: details.update_time,
                email_address: details.payer.email_address
            }
            dispatch(payOrder(order, paymentResult));
            alert('Transaction completed by ' + details.payer.name.given_name);
        });
    };
    const deliverHandler = () => {
        dispatch(deliverOrder(order._id));
    };

    return loading ? (
        <LoadingBox></LoadingBox>
    ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
    ) : (
        <div>
            <h1>Order {order._id}</h1>
            <div className="row top">
                <div className="col-2">
                    <ul>
                        <li>
                            <div className="card card-body">
                                <h2>Shipping</h2>
                                <p>
                                    <strong>Name:</strong> {order.shippingAddress.fullName} <br />
                                    <strong>Address: </strong> {order.shippingAddress.address},
                                    {order.shippingAddress.city},{' '}
                                    {order.shippingAddress.postalCode},
                                    {order.shippingAddress.country}
                                </p>
                                {order.isDelivered ? (
                                    <MessageBox variant="success">
                                        Delivered at {order.deliveredAt}
                                    </MessageBox>
                                ) : (
                                    <MessageBox variant="danger">Not Delivered</MessageBox>
                                )}
                            </div>
                        </li>
                        <li>
                            <div className="card card-body">
                                <h2>Payment</h2>
                                <p>
                                    <strong>Method:</strong> {order.paymentMethod}
                                </p>
                                {order.isPaid ? (
                                    <MessageBox variant="success">
                                        Paid at {order.paidAt}
                                    </MessageBox>
                                ) : (
                                    <MessageBox variant="danger">Not Paid</MessageBox>
                                )}
                            </div>
                        </li>
                        <li>
                            <div className="card card-body">
                                <h2>Order Items</h2>
                                <ul>
                                    {order.orderItems.map((item) => (
                                        <li key={item.product}>
                                            <div className="row">
                                                <div>
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="small"
                                                    ></img>
                                                </div>
                                                <div className="min-30">
                                                    <Link to={`/product/${item.product}`}>
                                                        {item.name}
                                                    </Link>
                                                </div>

                                                <div>
                                                    {item.qty} x $ {item.price} = $ {item.qty * item.price}
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </li>
                    </ul>
                </div>
                <div className="col-1">
                    <div className="card card-body">
                        <ul>
                            <li>
                                <h2>Order Summary</h2>
                            </li>
                            <li>
                                <div className="row">
                                    <div>Items</div>
                                    <div>$ {order.itemsPrice.toFixed(2)}</div>
                                </div>
                            </li>
                            <li>
                                <div className="row">
                                    <div>Shipping</div>
                                    <div>$ {order.shippingPrice.toFixed(2)}</div>
                                </div>
                            </li>
                            <li>
                                <div className="row">
                                    <div>Tax</div>
                                    <div>$ {order.taxPrice.toFixed(2)}</div>
                                </div>
                            </li>
                            <li>
                                <div className="row">
                                    <div><strong> Order Total</strong></div>
                                    <div>
                                        <strong>$ {order.totalPrice.toFixed(2)}</strong>
                                    </div>
                                </div>
                            </li>
                            {!order.isPaid && (
                                <li>
                                    {/* {!sdkReady ? (<LoadingBox></LoadingBox>) : (
                                        <PayPalButton
                                            createOrder={(data, actions) => createOrder(data, actions)}
                                            onApprove={(data, actions) => onApprove(data, actions)}
                                        />)
                                    } */}
                                    <>
                                        {errorPay && (
                                            <MessageBox variant="danger">{errorPay}</MessageBox>
                                        )}
                                        {loadingPay && <LoadingBox></LoadingBox>}

                                        <PayPalButton
                                            createOrder={(data, actions) => createOrder(data, actions)}
                                            onApprove={(data, actions) => onApprove(data, actions)}
                                        />
                                    </>
                                </li>)
                            }
                            {/* userInfo.sellerof that product */}
                            {userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                                <li>
                                    {loadingDeliver && <LoadingBox></LoadingBox>}
                                    {errorDeliver && (<MessageBox variant="danger">{errorDeliver}</MessageBox>)}
                                    <button type="button" className="primary block" onClick={deliverHandler}>
                                        Deliver Order
                                    </button>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}


// "id": "108481076N339103G",
// "intent": "CAPTURE",
// "status": "COMPLETED",
// "purchase_units": [
//   {
//     "reference_id": "default",
//     "amount": {
//       "currency_code": "USD",
//       "value": "138.00"
//     },
//     "payee": {
//       "email_address": "sb-inoi4313508922@business.example.com",
//       "merchant_id": "8DC98SJ2D6HG4"
//     },
//     "soft_descriptor": "PAYPAL *TEST STORE",
//     "shipping": {
//       "name": {
//         "full_name": "Samson Odiase"
//       },
//       "address": {
//         "address_line_1": "2, Oristejolomi street, Alegbo",
//         "admin_area_2": "Effurun",
//         "admin_area_1": "DELTA STATE",
//         "postal_code": "330102",
//         "country_code": "NG"
//       }
//     },
//     "payments": {
//       "captures": [
//         {
//           "id": "2NH07497FC938941D",
//           "status": "COMPLETED",
//           "amount": {
//             "currency_code": "USD",
//             "value": "138.00"
//           },
//           "final_capture": true,
//           "seller_protection": {
//             "status": "ELIGIBLE",
//             "dispute_categories": [
//               "ITEM_NOT_RECEIVED",
//               "UNAUTHORIZED_TRANSACTION"
//             ]
//           },
//           "create_time": "2022-04-30T07:56:51Z",
//           "update_time": "2022-04-30T07:56:51Z"
//         }
//       ]
//     }
//   }
// ],
// "payer": {
//   "name": {
//     "given_name": "Samson",
//     "surname": "Odiase"
//   },
//   "email_address": "odiase.samson@gmail.com",
//   "payer_id": "B8ERWQDFHAGJL",
//   "address": {
//     "country_code": "NG"
//   }
// },
// "create_time": "2022-04-30T07:56:31Z",
// "update_time": "2022-04-30T07:56:51Z",
// "links": [
//   {
//     "href": "https://api.sandbox.paypal.com/v2/checkout/orders/108481076N339103G",
//     "rel": "self",
//     "method": "GET"
//   }
// ]
// }