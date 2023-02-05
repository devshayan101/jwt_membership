import { useRef, useState, useEffect } from 'react';
// import useAuth from '../hooks/useAuth';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FormControl, Select } from '@mui/material';

import axios from '../api/axios';
const LOGIN_URL = '/auth/login';

const Login = () => {
    // const { setAuth } = useAuth();

    const navigate = useNavigate();
    // const location = useLocation();
    // const from = location.state?.from?.pathname || "/";

    const userRef = useRef();
    const errRef = useRef();

    const [selectedOption, setSelectedOption] = useState(91);
    const [numberValue, setNumberValue] = useState('');
    const [errMsg, setErrMsg] = useState('');

    function handleNumberChange(event){

        setNumberValue(event.target.value);
        const regex = /^\d{10}$/;
        if (!regex.test(event.target.value)) {
        setErrMsg('Phone must contain 10 digits');
        } else {
        setErrMsg('');
        }

    }

    useEffect(() => {
        userRef.current.focus();
    }, [])

    // useEffect(() => {
    //     setErrMsg('');
    // }, [user, pwd])

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("code:",selectedOption, "number:", numberValue);
        try {
            const response = await axios.post(LOGIN_URL,

                JSON.stringify({ 
                    code: selectedOption, 
                    number: numberValue 
                }),

                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );

            console.log(JSON.stringify(response?.data));
            console.log(JSON.stringify("onlyResponse:",response));
            setNumberValue('');
            navigate('/login/otp', { replace: true });
            
            
        } catch (err) {
            if (!err?.response) {
                
            //check error codes

                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
            }
            errRef.current.focus();
        }
    }


    return (

        <section>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            <h1>Sign In</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="number">Phone number:</label>
                <input
                    type="text"
                    id="number"
                    ref={userRef}
                    autoComplete="on"
                    onChange={handleNumberChange}
                    value={numberValue}
                    required
                />

                <FormControl>
                    <Select
                    native
                    name="code"
                    value={selectedOption}
                    onChange={event => setSelectedOption(event.target.value)}
                    inputProps={{
                        id: 'options',
                    }}
                    >
                        <option value={91} default>India</option>
                        <option value={61}>Australia</option>
                        <option value={994}>Azerbaijan</option>
                        <option value={880}>Bangladesh</option>
                        <option value={973}>Bahrain</option>
                        <option value={357}>Cyprus</option>
                        <option value={86}>China</option>
                        <option value={20}>Egypt</option>
                        <option value={49}>Germany</option>
                        <option value={962}>Jordan</option>
                        <option value={965}>Kuwait</option>
                        <option value={230}>Mauritius</option>
                        <option value={977}>Nepal</option>
                        <option value={968}>Oman</option>
                        <option value={27}>South Africa</option>                        	
                        <option value={65}>Singapore</option>
                        <option value={41}>Switzerland</option>
                        <option value={66}>Thailand</option>
                        <option value={90}>Turkey</option>
                        <option value={993}>Turkmenistan</option>
                        <option value={971}>United Arab Emirates</option>
                        <option value={44}>United Kingdom</option>
                        <option value={1}>United States</option>
                    </Select>
                </FormControl>

                <button>Sign In</button>
            </form>
            <p>
                Need an Account?<br />
                <span className="line">
                    <Link to="/">Sign Up</Link>
                </span>
            </p>
        </section>

    )
}

export default Login
