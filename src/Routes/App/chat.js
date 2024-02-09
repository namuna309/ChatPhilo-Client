// CSS
import '../../CSS/chat/chat.css'

// Library
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from '@tanstack/react-query';

// Component
import Sidebar from '../../Component/chat/Sidebar';
import ChatRoom from '../../Component/chat/ChatRoom';

// API
import { checkLoginStatus, postMessage, createMessage, retrieveMessages, logoutClick, requestCounselor, deleteThread } from '../../API/chat/api';

function Chat() {
    // states
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [dialog, setDialog] = useState([]);
    const [username, setUsername] = useState();
    const [logoutDsp, setLogout] = useState('logout-hide');
    const [counselors] = useState(['Schopenhauer', 'Adler', '공자']);
    const counselorsDict = {Schopenhauer: 'schopenhauer', Adler: 'adler', 공자: 'confucius'};
    const [curCounselor, setCurCounselor] = useState();
    const [activeButtons, setActiveButtons] = useState([false, false, false]);
    const [threadId, setThreadId] = useState();
    const chatBoxRef = useRef(null);
    const [dialogLoading, setDialogLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [width, setWidth] = useState(window.innerWidth);
    const [isMobile, setIsMobile] = useState(false);

    // 로그인 상태를 확인하는 쿼리, 매분마다 재요청
    const { data, isError } = useQuery({
        queryKey: ['loginStatus'],
        queryFn: checkLoginStatus,
        refetchInterval: 60000,  // 1분마다 로그인 상태 확인
    });
    // 메시지 전송을 위한 뮤테이션
    const { mutate, isPending } = useMutation({
        mutationFn: () => postMessage(threadId, curCounselor),
        onSuccess: (reply) => setDialog(prev => [...prev, reply]),
        onError: (error) => console.error('Error posting message:', error),
    });

    // 로그인 상태 확인에 대한 useEffect
    useEffect(() => {
        if (isError) {
            navigate('../');
        } else if (data) {
            setUsername(data.username);
        }
    }, [data, isError])

    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [dialog]);

    useEffect(() => {
        window.addEventListener("resize", handleResize);
        return () => {
            // cleanup
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        if (width > 899) setIsMobile(false);
        else setIsMobile(true);
    }, [width])


    // 상담사 클릭 처리 함수
    const counslerClick = async (index) => {
        setActiveButtons(activeButtons.map((_, i) => i === index));
        setCurCounselor(counselorsDict[counselors[index]])
        setDialogLoading(true);
        return await requestCounselor(counselors, index)
    };

    // 메시지 전송 처리 함수
    const sendMessage = async () => {
        if (threadId && message) {

            let createdMsg = await createMessage(threadId, message)
            setDialog(prev => [...prev, createdMsg])

            setMessage(null);
            document.getElementsByTagName('Input')[0].value = null;
            
            mutate(threadId, curCounselor);
        }
    };

    // 상담사 클릭 핸들러
    const handleCounselorClick = async (e, index) => {
        if (e.target != document.querySelectorAll('.counselor-delete-box')[index]) {
            let counselorData = await counslerClick(index);
            setThreadId(counselorData.thread_id);
            let thread_id = counselorData.thread_id;
            let dialogs = await retrieveMessages(thread_id);
            setDialogLoading(false);
            setDialog(dialogs)
        }
        
    };

    // 계정 버튼 클릭 핸들러
    const handleAccountClick = (e) => {
        logoutDsp == 'logout-hide' ? setLogout('logout-show') : setLogout('logout-hide');
    }

    // 메시지 입력 변경 핸들러
    const handleMessageChange = (e) => {
        setMessage(e.target.value);
    };

    // 메시지 전송 핸들러 (엔터 키 누를 때)
    const handleMessageSend = (e) => {
        if (e.key === 'Enter' || document.querySelector('.chat-textarea-box').contains(e.target)) {
            sendMessage();
        }
    };

    const handleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    }

    const handleResize = () => {
        setWidth(window.innerWidth);
    };
 
    const handleThreadDelete = async (e, index) => {
        if (document.querySelectorAll('.counselor-delete-box')[index].contains(e.target)) {
            alert('정말 삭제하시겠습니까?')
            let new_thread = await deleteThread(threadId);
            console.log(new_thread);
            setThreadId(new_thread.id);
            setDialog([]);
        }
    }

    const handleSidebarCloseBtn = (e) => {
        if (document.querySelector('.sidebar-close-btn').contains(e.target)) {
            setIsSidebarOpen(false);
        }
    }

    // 채팅 컴포넌트 UI 렌더링
    return (
        <div className="chat-container">
            <Sidebar isMobile={isMobile} isSidebarOpen={isSidebarOpen} handleSidebarCloseBtn={handleSidebarCloseBtn} counselors={counselors} activeButtons={activeButtons} onCounselorClick={handleCounselorClick} handleThreadDelete={handleThreadDelete} username={username} logoutDsp={logoutDsp} onLogoutClick={logoutClick} onAccountClick={handleAccountClick} />
            <ChatRoom handleSidebar={handleSidebar} curCounselor={curCounselor} dialog={dialog} isPending={isPending} chatBoxRef={chatBoxRef} onMessageChange={handleMessageChange} onMessageSend={handleMessageSend} dialogLoading={dialogLoading}/>
        </div >
    )
}

export default Chat;