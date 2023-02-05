import { useRef, useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAxiosPrivate from "../hooks/useAxiosPrivate";

// import axios from '../api/axios';
const SIGNUP_URL_VERIFY = '/auth/signup/verify';

const SignupOtp = () => {
    const { setAuth } = useAuth();
    const axiosPrivate = useAxiosPrivate();

    const navigate = useNavigate();
    // const location = useLocation();
    // const from = location.state?.from?.pathname || "/";

    const userRef = useRef();
    const errRef = useRef();

    const [otpValue, setOtpValue] = useState('');
    const [errMsg, setErrMsg] = useState('');

    const [isDisabled, setIsDisabled] = useState(false);


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
            setIsDisabled(true);

            const response = await axiosPrivate.post(SIGNUP_URL_VERIFY,

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
            setIsDisabled(false);

            if (!err?.response) {
                console.error(err);
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Invalid OTP');
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
            <form onSubmit={handleSubmit} disabled={isDisabled}>
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
                <button disabled={isDisabled}>Sign Up</button>
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