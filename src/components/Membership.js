import { useRef, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const MEMBERS_AMOUNT_SET = '/screens/membership-amount-set';

const Membership = () => {
    // const { setAuth } = useAuth();
    const axiosPrivate = useAxiosPrivate();


    const navigate = useNavigate();
    // const location = useLocation();
    // const from = location.state?.from?.pathname || "/";

    const userRef = useRef();
    const errRef = useRef();

    const [amountValue, setAmountValue] = useState('');
    const [errMsg, setErrMsg] = useState('');

    function handleAmountChange(event){

        setAmountValue(event.target.value);
        const regex = new RegExp('^[0-9]{3,5}$'); //this is inbuilt function

        if (!regex.test(event.target.value)) {
        setErrMsg('Enter amount above Rs.100');
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
        console.log("amount:", amountValue);
        try {
            const response = await axiosPrivate.post(MEMBERS_AMOUNT_SET,

                JSON.stringify({ 
                    amount: amountValue 
                }),

                {
                    headers: { 'Content-Type': 'application/json',
                                // 'Authorization': `Bearer ${auth?.accessToken}` 
                            },
                    withCredentials: true
                }
            );

            console.log(JSON.stringify(response?.data));
            
            setAmountValue('');
            navigate('/shukran', { replace: true });

        } catch (err) {
            if (!err?.response) {
                console.error(err);
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
                <label htmlFor="amount">Set Amount:</label>
                <input
                    type="text"
                    ref={userRef}
                    autoComplete="off"
                    id="amount"
                    label="Set Amount"
                    name="amount"
                    value={amountValue}
                    onChange={handleAmountChange}
                    required
                />
                <button>Submit</button>
            </form>
            
        </section>

    )
}

export default Membership
