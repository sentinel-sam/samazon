import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { signin } from '../actions/userActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

export default function SigninScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useRef(useNavigate());
    const { search } = useLocation();
    const redirect = search ? search.split('=')[1] : '/';
    const userSignin = useSelector((state) => state.userSignin);
    const { userInfo, loading, error } = userSignin;
    const dispatch = useDispatch();

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(signin(email, password));
    };
    useEffect(() => {
        if (userInfo && redirect !== '/') {
            navigation.current("/" + redirect);
        }
        if (userInfo && redirect === '/') {
            navigation.current(redirect);
        }
    }, [userInfo, navigation, redirect])
    console.log("REDIRECTsignin::::", redirect);

    return (
        <div>
            <form className="form" onSubmit={submitHandler}>
                <div> <h1>Sign In</h1> </div>
                {loading && <LoadingBox />}
                {error && <MessageBox variant="danger">{error}</MessageBox>}
                <div>
                    <label htmlFor="email">Email address</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Enter email"
                        required
                        onChange={(e) => setEmail(e.target.value)}
                    ></input>
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Enter password"
                        required
                        onChange={(e) => setPassword(e.target.value)}
                    ></input>
                </div>
                <div>
                    <label />
                    <button className="primary" type="submit">
                        Sign In
                    </button>
                </div>
                <div>
                    <label />
                    <div>
                        New customer? <Link to={`/register?redirect=${redirect}`}>Create your account</Link>
                    </div>
                </div>
            </form>
        </div>
    );
}