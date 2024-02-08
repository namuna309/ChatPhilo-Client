import { Link } from "react-router-dom";
import toss from '../../Img/support/toss.png'

function Account() {
    return(
        <div className="account-box">
            <div className="start-box">
            <div className="title-box"><span>Start your consultation</span></div>
            <div className="btn-box">
                <Link to='../login'><button type="button" className="btn btn-light acnt-btn"><span>Login</span></button></Link>
                <Link to='../signup'><button type="button" className="btn btn-light acnt-btn"><span>Sign Up</span></button></Link>
            </div>
            <div className="support-box">
                    <div className="title-box"><span>Support</span></div>
                    <div className="support-btn-box">
                        <div className="support-btn buy-me-coffee">
                            <a href="https://www.buymeacoffee.com/chatPhilo" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" /></a>
                        </div>
                        <div className="support-btn-divider"></div>
                        <div className="support-btn toss">
                            <a href="https://toss.me/chatphilo" target="_blank"><img src={toss} alt="Toss 익명 후원" /></a>
                        </div>
                    </div>
            </div>
            </div>
            
        </div>
    )
}

export default Account;