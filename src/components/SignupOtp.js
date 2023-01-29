import { useRef, useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import axios from '../api/axios';
const SIGNUP_URL_VERIFY = '/auth/signup/verify';

const SignupOtp = () => {
    const { setAuth } = useAuth();

    const navigate = useNavigate();
    // const location = useLocation();
    // const from = location.state?.from?.pathname || "/";

    const userRef = useRef();
    const errRef = useRef();

    const [otpValue, setOtpValue] = useState('');
    const [errMsg, setErrMsg] = useState('');

    function handleOtpChange(event){

        setOtpValue(event.target.value);
        const regex = /^\d{6}$/;
        if (!regex.test(event.target.value)) {
        setErrMsg('OTP must contain 6 digits');
        } else {
        setErrMsg('');
        }

    }


    useEffect(() => {
        userRef.current.focus();
    }, [])

    // useEffect(() => {
    //     setErrMsg('');
    // }, [otpValue])


    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("otp:", otpValue);
        try {
            const response = await axios.post(SIGNUP_URL_VERIFY,

                JSON.stringify({ 
                    otp: otpValue 
                }),

                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );

            console.log(JSON.stringify(response?.data));
            const accessToken = response?.data?.accessToken;
            const roles = response?.data?.roles;
            const number = response?.data?.userdata?.number;
            console.log("number:",number);
            setAuth({ user:number, roles, accessToken });
            setOtpValue('');
            navigate('/membership', { replace: true });

        } catch (err) {
            if (!err?.response) {
                console.error(err);
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Signup Failed');
            }
            errRef.current.focus();
        }
    }

    return (

        <section>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            <h1>Sign Up</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="otp">OTP:</label>
                <input
                    type="text"
                    ref={userRef}
                    autoComplete="off"
                    id="otp"
                    label="Enter OTP"
                    name="otp"
                    value={otpValue}
                    onChange={handleOtpChange}
                    required
                />
                <button>Sign In</button>
            </form>
            <p>
                Have an Account?<br />
                <span className="line">
                    <Link to="/login">Login</Link>
                </span>
            </p>
        </section>

    )
}

export default SignupOtp
